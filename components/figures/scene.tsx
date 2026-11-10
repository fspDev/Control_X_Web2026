import * as React from 'react';
import * as k from '../iso/iso-kit';
import { Dots, Line, Solid } from '../iso/react/draw';

/*
 * Escenario compartido por las 4 figuras (hecho con el kit de la skill "anatomy").
 * Cada pieza se guarda con una capa y una profundidad; render() las pinta de atrás
 * hacia adelante (orden del pintor). Las piezas pueden llevar data-stage o data-part
 * para que el componente vivo las mueva sin re-renderizar.
 */

export type Tone = k.Tone;
export type LineTone = k.LineTone;

export interface SolidOpts {
  tone?: Tone;
  crease?: Tone | 'none';
  lit?: boolean;
  halo?: boolean;
  steps?: number;
  bevel?: number;
  inner?: React.ReactNode;
}

export interface Meta {
  stage?: number;
  part?: string;
}

interface Item {
  layer: number;
  depth: number;
  meta?: Meta;
  node: React.ReactNode;
}

export function scene(P: k.Projection) {
  const items: Item[] = [];
  const at = (p: k.Point3) => k.iso(p, P);

  const solid = (paths: k.SolidPaths, o: SolidOpts = {}) => (
    <Solid paths={paths} tone={o.tone ?? 'mid'} crease={o.crease ?? 'faint'} lit={o.lit} halo={o.halo} inner={o.inner} />
  );
  const box = (plan: k.Plan, z: number, h: number, o: SolidOpts = {}) => solid(k.slabOf(plan, z, h, P, o.steps ?? 3, o.bevel ?? 0.5), o);
  const cyl = (cx: number, cy: number, r: number, z: number, h: number, o: SolidOpts = {}) =>
    solid(k.cylinder(cx, cy, r, z, h, P, o.steps ?? 28, o.bevel ?? 0), o);
  const line = (d: string, tone: LineTone = 'lo', free?: boolean) => <Line d={d} tone={tone} free={free} />;
  const seg = (a: k.Point3, b: k.Point3, tone: LineTone = 'lo', free?: boolean) => line(k.segment(a, b, P), tone, free);
  const dots = (pts: k.Point3[], size = 0.5, tone: Tone = 'mid') => <Dots points={k.pointsAt(pts, P)} size={size} tone={tone} />;
  /** Polígono cerrado sobre una cara vertical o inclinada (ventanas, pantallas, ranuras). */
  const outline = (pts: k.Point3[], tone: LineTone = 'lo') => line(k.pathOf(pts.map(at), true), tone);

  /** Agrega una pieza: capa (orden grueso) y un punto para ordenar dentro de la capa. */
  const put = (layer: number, point: k.Point3, node: React.ReactNode, meta?: Meta) => {
    items.push({ layer, depth: k.depthOf(point, P), meta, node });
  };

  /** Pinta las capas [from, to): sirve para intercalar piezas que se mueven entre capas fijas. */
  const render = (from = -Infinity, to = Infinity) =>
    items
      .filter((item) => item.layer >= from && item.layer < to)
      .sort((a, b) => a.layer - b.layer || a.depth - b.depth)
      .map((item, i) => (
        <g key={i} data-stage={item.meta?.stage} data-part={item.meta?.part}>
          {item.node}
        </g>
      ));

  return { P, at, solid, box, cyl, line, seg, dots, outline, put, render, count: () => items.length };
}

/** Ordena puntos del suelo de atrás hacia adelante. */
export const byDepth = <T extends k.Plane>(pts: T[], P: k.Projection, z = 0) =>
  [...pts].sort((a, b) => k.depthOf([a[0], a[1], z], P) - k.depthOf([b[0], b[1], z], P));
