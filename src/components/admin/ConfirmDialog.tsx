'use client';

import { ReactNode, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
  children: (onOpen: () => void) => ReactNode;
}

export default function ConfirmDialog({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {children(() => setIsOpen(true))}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              {isDangerous && (
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Footer */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                  isDangerous ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Loading...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
