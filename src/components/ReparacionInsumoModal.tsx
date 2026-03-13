'use client';

import { useEffect, useMemo, useState } from 'react';
import { addReparacionInsumo } from '@/app/(dashboard)/reparaciones/actions';
import { getProducts, type Product } from '@/app/(dashboard)/insumos/productos/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface ReparacionInsumoModalProps {
    isOpen: boolean;
    onClose: () => void;
    reparacionId: number;
    extra?: boolean;
    onSuccess: () => void;
}

export function ReparacionInsumoModal({
    isOpen,
    onClose,
    reparacionId,
    extra = false,
    onSuccess,
}: ReparacionInsumoModalProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        getProducts().then((loaded) => {
            const available = loaded.filter((product) => product.quantity > 0);
            setProducts(available);
            setProductId(available[0]?.id ? String(available[0].id) : '');
        });
        setQuantity('1');
        setError(null);
    }, [isOpen]);

    const selectedProduct = useMemo(
        () => products.find((product) => product.id === Number(productId)),
        [productId, products],
    );

    if (!isOpen) return null;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsPending(true);
        setError(null);

        try {
            await addReparacionInsumo(reparacionId, {
                productId: Number(productId),
                quantity: Number(quantity),
                extra,
            });
            onSuccess();
            onClose();
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'No se pudo agregar el insumo.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title={extra ? 'Agregar insumo extra' : 'Agregar insumo'}
            maxWidthClass="max-w-3xl"
        >
            <form onSubmit={handleSubmit} className="bottom-sheet-form space-y-4">
                <div>
                    <label className="block text-sm font-bold text-zinc-300">Producto</label>
                    <select
                        value={productId}
                        onChange={(event) => setProductId(event.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                    >
                        {products.length === 0 && <option value="">Sin stock disponible</option>}
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name} ({product.sku}) - Stock: {product.quantity}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300">Cantidad</label>
                    <input
                        type="number"
                        min={1}
                        max={selectedProduct?.quantity ?? undefined}
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                    />
                    {selectedProduct && (
                        <p className="mt-1 text-xs text-zinc-400">
                            Disponible: {selectedProduct.quantity} {selectedProduct.measure}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="rounded-md border border-red-500/30 bg-red-100 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending || !productId || products.length === 0}
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        {isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </BottomSheet>
    );
}
