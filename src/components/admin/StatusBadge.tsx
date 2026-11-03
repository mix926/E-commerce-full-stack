'use client';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const statusColorMap: Record<string, Record<string, string>> = {
  // Order statuses
  pending: { variant: 'warning', label: 'Pending' },
  processing: { variant: 'info', label: 'Processing' },
  shipped: { variant: 'info', label: 'Shipped' },
  delivered: { variant: 'success', label: 'Delivered' },
  cancelled: { variant: 'error', label: 'Cancelled' },

  // User roles
  admin: { variant: 'info', label: 'Admin' },
  user: { variant: 'default', label: 'User' },

  // Stock statuses
  in_stock: { variant: 'success', label: 'In Stock' },
  low_stock: { variant: 'warning', label: 'Low Stock' },
  out_of_stock: { variant: 'error', label: 'Out of Stock' },
};

const variantClasses: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
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
