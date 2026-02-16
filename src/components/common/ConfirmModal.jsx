import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', message = 'This action cannot be undone.', confirmText = 'Yes, Delete', cancelText = 'Cancel', loading = false }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-polar-night/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl w-full border border-frozen">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-frost-byte/10 flex items-center justify-center shrink-0">
                        <AlertTriangle size={20} className="text-frost-byte" />
                    </div>
                    <div>
                        <h3 className="font-heading text-lg font-bold text-polar-night">{title}</h3>
                        <p className="text-sm text-text-primary/60 mt-1">{message}</p>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 border border-polar-night/10 rounded-xl text-sm font-semibold text-polar-night bg-white hover:bg-frozen transition-all cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 bg-polar-night text-white rounded-xl text-sm font-semibold hover:bg-frost-byte transition-all cursor-pointer border-none disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
