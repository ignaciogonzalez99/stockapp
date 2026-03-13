'use client';

import { type Proveedor } from '@/app/(dashboard)/insumos/proveedores/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface ProveedorInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    proveedor?: Proveedor;
}

export function ProveedorInfoModal({ isOpen, onClose, proveedor }: ProveedorInfoModalProps) {
    if (!isOpen || !proveedor) return null;

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Informacion del proveedor"
            maxWidthClass="max-w-xl"
        >
            <div className="bottom-sheet-form space-y-3 text-sm">
                <div>
                    <span className="font-bold text-zinc-300">Nombre:</span>
                    <p className="text-white">{proveedor.name}</p>
                </div>
                <div>
                    <span className="font-bold text-zinc-300">RUT:</span>
                    <p className="text-white">{proveedor.rut || <span className="text-pink-500">Sin registro</span>}</p>
                </div>
                <div>
                    <span className="font-bold text-zinc-300">Direccion:</span>
                    <p className="text-white">{proveedor.address || <span className="text-pink-500">Sin registro</span>}</p>
                </div>
                <div>
                    <span className="font-bold text-zinc-300">Telefono:</span>
                    <p className="text-white">{proveedor.phone || <span className="text-pink-500">Sin registro</span>}</p>
                </div>
                {proveedor.phone2 && (
                    <div>
                        <span className="font-bold text-zinc-300">Telefono 2:</span>
                        <p className="text-white">{proveedor.phone2}</p>
                    </div>
                )}
                <div>
                    <span className="font-bold text-zinc-300">E-mail:</span>
                    <p className="text-white">{proveedor.email || <span className="text-pink-500">Sin registro</span>}</p>
                </div>
                {proveedor.notes && (
                    <div>
                        <span className="font-bold text-zinc-300">Notas:</span>
                        <p className="text-white">{proveedor.notes}</p>
                    </div>
                )}
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
