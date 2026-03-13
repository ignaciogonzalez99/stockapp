'use client';

import { type Product } from '@/app/(dashboard)/insumos/productos/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface ProductInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
}

export function ProductInfoModal({ isOpen, onClose, product }: ProductInfoModalProps) {
    if (!isOpen || !product) return null;

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Informacion del producto"
            maxWidthClass="max-w-xl"
        >
            <div className="bottom-sheet-form space-y-2 text-sm text-zinc-300">
                <p><span className="font-bold text-white">Codigo:</span> {product.sku}</p>
                <p><span className="font-bold text-white">Nombre:</span> {product.name}</p>
                <p>
                    <span className="font-bold text-white">Marca:</span>{' '}
                    <span className={!product.brand ? 'text-pink-500' : ''}>
                        {product.brand || 'Sin registro'}
                    </span>
                </p>
                <p>
                    <span className="font-bold text-white">Modelo:</span>{' '}
                    <span className={!product.model ? 'text-pink-500' : ''}>
                        {product.model || 'Sin registro'}
                    </span>
                </p>
                <p><span className="font-bold text-white">Proveedor:</span> {product.provider || 'Sin registro'}</p>
                <p><span className="font-bold text-white">Precio costo:</span> {product.currency || '$U'} {product.costPrice?.toFixed(2) || '0.00'}</p>
                <p><span className="font-bold text-white">Precio venta:</span> {product.currency || '$U'} {product.sellPrice?.toFixed(2) || '0.00'}</p>
                <p><span className="font-bold text-white">Stock:</span> {product.quantity}</p>
                <p>
                    <span className="font-bold text-white">Descripcion:</span>{' '}
                    <span className={!product.description ? 'text-pink-500' : ''}>
                        {product.description || 'Sin registro'}
                    </span>
                </p>
            </div>

            <div className="mt-6 flex justify-end">
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
