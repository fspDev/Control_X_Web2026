import * as React from 'react';
import { Plate, IsoFigure } from '../iso/react/draw';
import type { LegendKey } from '../iso/iso-kit';
import '../iso/iso.css';

/** Tarjeta de la skill anatomy: Fig n, título, indicación y lectura en vivo en las esquinas. */
export const FigureCard: React.FC<{
  fig: string;
  title: string;
  hint: string;
  readout: string;
  label: string;
  width: number;
  height: number;
  keys?: LegendKey[];
  caption?: React.ReactNode;
  children: React.ReactNode;
}> = ({ fig, title, hint, readout, label, width, height, keys, caption, children }) => (
  <div className="iso">
    <Plate fig={fig} title={title} hint={hint} readout={readout} keys={keys} caption={caption}>
      <IsoFigure width={width} height={height} label={label}>
        {children}
      </IsoFigure>
    </Plate>
  </div>
);
