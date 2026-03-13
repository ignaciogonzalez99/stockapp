'use client';

import { type Cliente } from '@/app/(dashboard)/clientes/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface ClienteInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    cliente?: Cliente;
}

export function ClienteInfoModal({ isOpen, onClose, cliente }: ClienteInfoModalProps) {
    if (!isOpen || !cliente) return null;

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Informacion del cliente"
            maxWidthClass="max-w-xl"
        >
            <div className="bottom-sheet-form space-y-3 text-sm">
                <div>
                    <span className="font-bold text-zinc-300">Nombre:</span>
                    <p className="text-white">{cliente.name}</p>
                </div>
                <div>
                    <span className="font-bold text-zinc-300">Telefono:</span>
                    <p className="text-white">{cliente.phone || <span className="text-pink-500">Sin registro</span>}</p>
                </div>
                <div>
                    <span className="font-bold text-zinc-300">Email:</span>
                    <p className="text-white">{cliente.email || <span className="text-pink-500">Sin registro</span>}</p>
                </div>
                <div>
                    <span className="font-bold text-zinc-300">Direccion:</span>
                    <p className="text-white">{cliente.address || <span className="text-pink-500">Sin registro</span>}</p>
                </div>
                <div>
                    <span className="font-bold text-zinc-300">Tipo de documento:</span>
                    <p className="text-white">{cliente.docType}</p>
                </div>
                <div>
                    <span className="font-bold text-zinc-300">Documento:</span>
                    <p className="text-white">{cliente.docNumber}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={onClose}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cerrar
                </button>
            </div>
        </BottomSheet>
    );
}
