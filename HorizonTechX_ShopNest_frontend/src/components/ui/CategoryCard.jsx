import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { cardHover } from '../../styles/motion';
import { ProgressiveImage } from './ProgressiveImage';


export const CategoryCard = ({
  name,
  tagline,
  itemCount,
  image,
  href = '#',
  className = '',
  onClick,
}) => {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className={`
        group relative flex flex-col justify-end p-6 sm:p-8
        rounded-3xl overflow-hidden min-h-80 sm:min-h-90 aspect-4/5 sm:aspect-4/3 lg:aspect-auto
        border border-neutral-200/60 dark:border-dark-border
        shadow-subtle select-none cursor-pointer bg-neutral-100 dark:bg-dark-surface
        ${className}
      `}
    >
      {/* Background Image with Progressive Blur-Up & Hover Zoom */}
      <ProgressiveImage
        src={image}
        alt={name}
        width={800}
        aspectRatio=""
        className="absolute inset-0 w-full h-full"
        imgClassName="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-108"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/45 to-transparent" />
      <div className="absolute inset-0 bg-neutral-950/15 group-hover:bg-neutral-950/5 transition-colors" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-widest uppercase text-brand-400 font-semibold bg-neutral-950/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            {itemCount} Curated Pieces
          </span>
          <div className="
            w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white
            flex items-center justify-center
            group-hover:bg-brand-500 group-hover:text-white
            transition-all duration-300 transform group-hover:rotate-45
          ">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <h3 className="font-display font-bold text-2xl text-white tracking-tight leading-tight mt-1">
          {name}
        </h3>

        {tagline && (
          <p className="text-xs sm:text-sm text-neutral-300 max-w-sm line-clamp-2 leading-relaxed">
            {tagline}
          </p>
        )}
      </div>
    </motion.a>
  );
};
