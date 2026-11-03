'use client';

import { ReactNode } from 'react';

interface ActionButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200',
  ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
  md: 'px-4 py-2 text-sm font-medium rounded-xl',
};

export default function ActionButton({
  children,
  variant = 'secondary',
  size = 'sm',
  onClick,
  disabled,
  type = 'button',
  className = '',
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 transition-colors ${sizeClasses[size]} ${variantClasses[variant]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
