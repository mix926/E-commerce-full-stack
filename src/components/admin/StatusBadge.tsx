'use client';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const statusColorMap: Record<string, { variant: string; label: string }> = {
  pending:      { variant: 'warning', label: 'Pending' },
  processing:   { variant: 'info',    label: 'Processing' },
  shipped:      { variant: 'info',    label: 'Shipped' },
  delivered:    { variant: 'success', label: 'Delivered' },
  cancelled:    { variant: 'error',   label: 'Cancelled' },
  admin:        { variant: 'info',    label: 'Admin' },
  user:         { variant: 'default', label: 'User' },
  in_stock:     { variant: 'success', label: 'In Stock' },
  low_stock:    { variant: 'warning', label: 'Low Stock' },
  out_of_stock: { variant: 'error',   label: 'Out of Stock' },
};

const variantClasses: Record<string, string> = {
  default: 'bg-gray-100  dark:bg-gray-700  text-gray-700  dark:text-gray-300  border-gray-200  dark:border-gray-600',
  success: 'bg-green-50  dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  warning: 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  error:   'bg-red-50    dark:bg-red-950/50   text-red-700   dark:text-red-400   border-red-200   dark:border-red-800',
  info:    'bg-blue-50   dark:bg-blue-950/50  text-blue-700  dark:text-blue-400  border-blue-200  dark:border-blue-800',
};

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  const statusInfo = statusColorMap[status.toLowerCase()];
  const finalVariant = variant || statusInfo?.variant || 'default';
  const displayLabel = statusInfo?.label || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${variantClasses[finalVariant]}`}>
      {displayLabel}
    </span>
  );
}
