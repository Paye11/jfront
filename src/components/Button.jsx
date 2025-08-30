import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon: Icon,
  iconPosition = 'left',
  className = '',
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transition-all duration-200 ease-in-out transform
    focus:outline-none focus:ring-4 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98] hover:shadow-lg
  `
    .trim()
    .replace(/\s+/g, ' ');

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 text-white
      hover:from-blue-700 hover:to-blue-800 
      focus:ring-blue-500/50
      disabled:from-blue-300 disabled:to-blue-400
      shadow-blue-200/50
    `
      .trim()
      .replace(/\s+/g, ' '),

    secondary: `
      bg-gradient-to-r from-gray-600 to-gray-700 text-white
      hover:from-gray-700 hover:to-gray-800
      focus:ring-gray-500/50
      disabled:from-gray-300 disabled:to-gray-400
      shadow-gray-200/50
    `
      .trim()
      .replace(/\s+/g, ' '),

    success: `
      bg-gradient-to-r from-green-600 to-green-700 text-white
      hover:from-green-700 hover:to-green-800
      focus:ring-green-500/50
      disabled:from-green-300 disabled:to-green-400
      shadow-green-200/50
    `
      .trim()
      .replace(/\s+/g, ' '),

    danger: `
      bg-gradient-to-r from-red-600 to-red-700 text-white
      hover:from-red-700 hover:to-red-800
      focus:ring-red-500/50
      disabled:from-red-300 disabled:to-red-400
      shadow-red-200/50
    `
      .trim()
      .replace(/\s+/g, ' '),

    outline: `
      bg-white border-2 border-blue-600 text-blue-600
      hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700
      focus:ring-blue-500/50
      disabled:border-blue-300 disabled:text-blue-300 disabled:bg-gray-50
      shadow-blue-100/50
    `
      .trim()
      .replace(/\s+/g, ' '),

    ghost: `
      bg-transparent text-gray-700 hover:bg-gray-100
      focus:ring-gray-500/50
      disabled:text-gray-400 disabled:hover:bg-transparent
      shadow-none hover:shadow-md
    `
      .trim()
      .replace(/\s+/g, ' '),
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const iconSpacing = 'gap-2';

  const combinedClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${widthClass} 
    ${iconSpacing}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  const isDisabled = disabled || loading;

  const renderIcon = () => {
    if (loading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    if (Icon) {
      return <Icon className="w-4 h-4" />;
    }
    return null;
  };

  const renderContent = () => {
    const iconElement = renderIcon();

    if (!iconElement) {
      return children;
    }

    return (
      <>
        {iconPosition === 'left' && iconElement}
        {loading ? 'Loading...' : children}
        {iconPosition === 'right' && !loading && iconElement}
      </>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={combinedClasses}>
      {renderContent()}
    </button>
  );
};

export default Button;
