'use client';

import { BottomSheet } from '@/components/BottomSheet';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, productName }: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Confirmar eliminacion"
            maxWidthClass="max-w-lg"
        >
            <div className="space-y-6">
                <div>
                    <p className="text-slate-700">
                        Esta seguro de que desea eliminar <span className="font-bold">&quot;{productName}&quot;</span>?
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                        Esta accion no se puede deshacer.
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </BottomSheet>
    );
}
