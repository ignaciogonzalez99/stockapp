'use client';

import { useState, useEffect } from 'react';
import { updateProduct, type Product } from '@/app/(dashboard)/insumos/productos/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface EditPriceStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
}

export function EditPriceStockModal({ isOpen, onClose, product }: EditPriceStockModalProps) {
    const [isPending, setIsPending] = useState(false);
    const [checks, setChecks] = useState({
        quantity: false,
        measure: false,
        currency: false,
        costPrice: false,
        sellPrice: false,
    });

    useEffect(() => {
        if (!isOpen) return;
        setChecks({
            quantity: false,
            measure: false,
            currency: false,
            costPrice: false,
            sellPrice: false,
        });
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const toggleCheck = (field: keyof typeof checks) => {
        setChecks((previous) => ({ ...previous, [field]: !previous[field] }));
    };

    const toggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setChecks({
            quantity: checked,
            measure: checked,
            currency: checked,
            costPrice: checked,
            sellPrice: checked,
        });
    };

    async function handleSubmit(formData: FormData) {
        if (!product) return;
        setIsPending(true);
        try {
            await updateProduct(product.id, formData);
            onClose();
        } catch (error) {
            console.error('Failed to update product', error);
            alert('Failed to update product');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title={product.name}
            maxWidthClass="max-w-6xl"
        >
            <form action={handleSubmit} className="bottom-sheet-form space-y-6">
                <div className="flex items-center justify-end gap-2">
                    <input
                        type="checkbox"
                        id="toggle-fields"
                        onChange={toggleAll}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="toggle-fields" className="cursor-pointer text-xs font-medium text-cyan-700">
                        Marque o desmarque los campos a modificar
                    </label>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                    <div>
                        <div className="mb-1 flex items-center gap-1">
                            <label className="block text-xs font-bold text-gray-700">Cantidad</label>
                        </div>
                        <div className="flex">
                            <div className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                                <input
                                    type="checkbox"
                                    checked={checks.quantity}
                                    onChange={() => toggleCheck('quantity')}
                                    className="rounded border-gray-300"
                                />
                            </div>
                            <input
                                type="number"
                                name="quantity"
                                defaultValue={product.quantity}
                                disabled={!checks.quantity}
                                className="block w-full rounded-r-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-1">
                            <label className="block text-xs font-bold text-gray-700">Medida</label>
                        </div>
                        <div className="flex">
                            <div className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                                <input
                                    type="checkbox"
                                    checked={checks.measure}
                                    onChange={() => toggleCheck('measure')}
                                    className="rounded border-gray-300"
                                />
                            </div>
                            <select
                                name="measure"
                                defaultValue={product.measure}
                                disabled={!checks.measure}
                                className="block w-full rounded-r-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Unidades">Unidades</option>
                                <option value="Litros">Litros</option>
                                <option value="Kilos">Kilos</option>
                                <option value="Metros">Metros</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-1">
                            <label className="block text-xs font-bold text-gray-700">Moneda</label>
                        </div>
                        <div className="flex">
                            <div className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                                <input
                                    type="checkbox"
                                    checked={checks.currency}
                                    onChange={() => toggleCheck('currency')}
                                    className="rounded border-gray-300"
                                />
                            </div>
                            <select
                                name="currency"
                                defaultValue={product.currency || '$U'}
                                disabled={!checks.currency}
                                className="block w-full rounded-r-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="$U">$U</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-1">
                            <label className="block text-xs font-bold text-gray-700">Precio costo</label>
                        </div>
                        <div className="flex">
                            <div className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                                <input
                                    type="checkbox"
                                    checked={checks.costPrice}
                                    onChange={() => toggleCheck('costPrice')}
                                    className="rounded border-gray-300"
                                />
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                name="costPrice"
                                defaultValue={product.costPrice || 0}
                                disabled={!checks.costPrice}
                                className="block w-full rounded-r-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-1">
                            <label className="block text-xs font-bold text-gray-700">Precio venta</label>
                        </div>
                        <div className="flex">
                            <div className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                                <input
                                    type="checkbox"
                                    checked={checks.sellPrice}
                                    onChange={() => toggleCheck('sellPrice')}
                                    className="rounded border-gray-300"
                                />
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                name="sellPrice"
                                defaultValue={product.sellPrice || 0}
                                disabled={!checks.sellPrice}
                                className="block w-full rounded-r-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>
                </div>

                <div className="text-xs font-medium text-red-500">
                    * Campos obligatorios
                </div>

                <div className="flex justify-center gap-2 pt-4">
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
