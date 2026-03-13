'use client';

import { useEffect, useState } from 'react';
import { createProduct, updateProduct, type Product } from '@/app/(dashboard)/insumos/productos/actions';
import { getProductCategories, type ProductCategory } from '@/app/(dashboard)/insumos/categorias/actions';
import { getProveedores, type Proveedor } from '@/app/(dashboard)/insumos/proveedores/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const [isPending, setIsPending] = useState(false);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);

    useEffect(() => {
        if (!isOpen) return;
        Promise.all([getProductCategories(), getProveedores()]).then(
            ([loadedCategories, loadedProveedores]) => {
                setCategories(loadedCategories);
                setProveedores(loadedProveedores);
            },
        );
    }, [isOpen]);

    if (!isOpen) return null;

    const hasCurrentProvider =
        !!product?.provider && proveedores.some((proveedor) => proveedor.name === product.provider);
    const hasCurrentCategory =
        !!product?.category && categories.some((category) => category.name === product.category);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            if (product) {
                await updateProduct(product.id, formData);
            } else {
                await createProduct(formData);
            }
            onClose();
        } catch (error) {
            console.error('Failed to save product', error);
            alert('Failed to save product');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title={product ? 'Editar producto' : 'Nuevo producto'}
            maxWidthClass="max-w-6xl"
        >
            <form action={handleSubmit} className="bottom-sheet-form space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Codigo *</label>
                        <input type="text" name="sku" defaultValue={product?.sku} required className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Nombre *</label>
                        <input type="text" name="name" defaultValue={product?.name} required className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Cantidad *</label>
                        <input type="number" name="quantity" defaultValue={product?.quantity || 0} required className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Min. stock</label>
                        <input type="number" name="minStock" defaultValue={product?.minStock || 0} className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Medida *</label>
                        <select name="measure" defaultValue={product?.measure} className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500">
                            <option value="Unidades">Unidades</option>
                            <option value="Litros">Litros</option>
                            <option value="Kilos">Kilos</option>
                            <option value="Metros">Metros</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Moneda *</label>
                        <select name="currency" defaultValue={product?.currency} className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500">
                            <option value="$U">$U</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Marca</label>
                        <input type="text" name="brand" defaultValue={product?.brand} className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Modelo</label>
                        <input type="text" name="model" defaultValue={product?.model} className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Precio costo</label>
                        <input type="number" step="0.01" name="costPrice" defaultValue={product?.costPrice} className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Precio venta</label>
                        <input type="number" step="0.01" name="sellPrice" defaultValue={product?.sellPrice} className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Proveedor</label>
                        <select name="provider" defaultValue={product?.provider} className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500">
                            <option value="">Seleccione...</option>
                            {product?.provider && !hasCurrentProvider && (
                                <option value={product.provider}>{product.provider}</option>
                            )}
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.id} value={proveedor.name}>
                                    {proveedor.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Categoria</label>
                        <select name="category" defaultValue={product?.category} className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500">
                            <option value="">-- Nivel superior --</option>
                            {product?.category && !hasCurrentCategory && (
                                <option value={product.category}>{product.category}</option>
                            )}
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300">Descripcion</label>
                    <textarea name="description" rows={3} defaultValue={product?.description} className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        <span className="font-bold">X</span> Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        {isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </BottomSheet>
    );
}
