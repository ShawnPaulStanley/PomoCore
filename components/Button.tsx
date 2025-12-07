import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  active = false,
  ...props 
}) => {
  const baseStyles = "rounded-2xl transition-all duration-300 font-hand transform hover:scale-105 active:scale-95 focus:outline-none flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-pastel-peach hover:bg-orange-200 text-pastel-text shadow-md border-2 border-transparent hover:border-orange-300",
    secondary: "bg-pastel-mint hover:bg-teal-200 text-pastel-text shadow-sm",
    ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-pastel-text dark:text-pastel-darkText",
    icon: "p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-2 text-lg",
    lg: "px-8 py-3 text-xl"
  };

  const activeStyle = active ? "ring-2 ring-pastel-lavender ring-offset-2 dark:ring-offset-gray-900 bg-orange-200" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${activeStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};