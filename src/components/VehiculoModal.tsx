'use client';

import { useState, useEffect } from 'react';
import { createVehiculo, updateVehiculo, type Vehiculo } from '@/app/(dashboard)/vehiculos/actions';
import { getClientes, type Cliente } from '@/app/(dashboard)/clientes/actions';
import { getVehicleCategories, type VehicleCategory } from '@/app/(dashboard)/vehiculos/categorias/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface VehiculoModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehiculo?: Vehiculo;
}

export function VehiculoModal({ isOpen, onClose, vehiculo }: VehiculoModalProps) {
    const [isPending, setIsPending] = useState(false);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [categories, setCategories] = useState<VehicleCategory[]>([]);
    const [showNewBrand, setShowNewBrand] = useState(false);

    useEffect(() => {
        if (isOpen) {
            getClientes().then(setClientes);
            getVehicleCategories().then(setCategories);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            const clientId = formData.get('clientId');
            if (clientId) {
                const selectedCliente = clientes.find((cliente) => cliente.id === Number(clientId));
                if (selectedCliente) {
                    formData.set('clientName', selectedCliente.name);
                }
            }

            if (vehiculo) {
                await updateVehiculo(vehiculo.id, formData);
            } else {
                await createVehiculo(formData);
            }
            onClose();
        } catch (error) {
            console.error('Failed to save vehiculo', error);
            alert('Failed to save vehiculo');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title={vehiculo ? 'Editar vehiculo' : 'Nuevo vehiculo'}
            maxWidthClass="max-w-5xl"
        >
            <form action={handleSubmit} className="bottom-sheet-form space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">
                            <span className="text-red-500">*</span> Categoria
                        </label>
                        <select
                            name="category"
                            defaultValue={vehiculo?.category}
                            required
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                            <option value="">Seleccione...</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label className="block text-sm font-bold text-zinc-300">
                                <span className="text-red-500">*</span> Marca
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowNewBrand((value) => !value)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                                Nueva marca
                            </button>
                        </div>
                        {showNewBrand ? (
                            <input
                                type="text"
                                name="brand"
                                defaultValue={vehiculo?.brand}
                                required
                                className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        ) : (
                            <select
                                name="brand"
                                defaultValue={vehiculo?.brand}
                                required
                                className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">Seleccione...</option>
                                <option value="Mercedes-Benz">Mercedes-Benz</option>
                                <option value="Volvo">Volvo</option>
                                <option value="Scania">Scania</option>
                                <option value="MAN">MAN</option>
                                <option value="Iveco">Iveco</option>
                            </select>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Modelo</label>
                        <select
                            name="model"
                            defaultValue={vehiculo?.model}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                            <option value="">Seleccione...</option>
                            <option value="OF-1721">OF-1721</option>
                            <option value="FH16">FH16</option>
                            <option value="K380">K380</option>
                        </select>
                        <button
                            type="button"
                            className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                            Nuevo modelo
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Anio</label>
                        <select
                            name="year"
                            defaultValue={vehiculo?.year}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                            <option value="">Seleccione...</option>
                            {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300">Cliente (opcional)</label>
                    <select
                        name="clientId"
                        defaultValue={vehiculo?.clientId || ''}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                        <option value="">Sin cliente asignado</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300">Notas</label>
                    <textarea
                        name="notes"
                        rows={3}
                        defaultValue={vehiculo?.notes}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
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
