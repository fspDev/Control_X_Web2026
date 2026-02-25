import React from 'react';

interface SectionTitleProps {
  subtitle: string;
  title: string;
  dark?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ subtitle, title, dark = false }) => {
  return (
    <div className="mb-16 md:mb-24 text-left">
      <div className="flex items-center gap-3 mb-4">
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <path d="M20 10L0 20V0L20 10Z" fill="#FF0000"/>
        </svg>
        <span className="block text-brand-orange font-bold uppercase tracking-widest text-sm">
          {subtitle}
        </span>
      </div>
      <h2 className={`text-4xl md:text-6xl font-extrabold tracking-tighter transition-colors duration-300 ${dark ? 'text-white' : 'text-brand-dark dark:text-white'}`}>
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;
