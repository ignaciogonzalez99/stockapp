'use client';

import { useEffect, useState } from 'react';
import { createReparacion, updateReparacion, type Reparacion } from '@/app/(dashboard)/reparaciones/actions';
import { getClientes, type Cliente } from '@/app/(dashboard)/clientes/actions';
import { getVehiculos, type Vehiculo } from '@/app/(dashboard)/vehiculos/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface ReparacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    reparacion?: Reparacion;
}

export function ReparacionModal({ isOpen, onClose, reparacion }: ReparacionModalProps) {
    const [isPending, setIsPending] = useState(false);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [filteredVehiculos, setFilteredVehiculos] = useState<Vehiculo[]>([]);
    const [selectedClienteId, setSelectedClienteId] = useState<string>('');
    const [selectedVehiculoId, setSelectedVehiculoId] = useState<string>('');

    useEffect(() => {
        if (!isOpen) return;

        getClientes().then(setClientes);
        getVehiculos().then(setVehiculos);

        if (reparacion) {
            setSelectedClienteId(reparacion.clienteId ? String(reparacion.clienteId) : '');
            setSelectedVehiculoId(reparacion.vehiculoId ? String(reparacion.vehiculoId) : '');
            return;
        }

        setSelectedClienteId('');
        setSelectedVehiculoId('');
    }, [isOpen, reparacion]);

    useEffect(() => {
        if (!selectedClienteId) {
            setFilteredVehiculos([]);
            setSelectedVehiculoId('');
            return;
        }

        const clienteId = Number(selectedClienteId);
        const filtered = vehiculos.filter((vehiculo) => vehiculo.clientId === clienteId);
        setFilteredVehiculos(filtered);

        if (!filtered.some((vehiculo) => vehiculo.id === Number(selectedVehiculoId))) {
            setSelectedVehiculoId('');
        }
    }, [selectedClienteId, selectedVehiculoId, vehiculos]);

    if (!isOpen) return null;

    const selectedVehiculo =
        filteredVehiculos.find((vehiculo) => vehiculo.id === Number(selectedVehiculoId)) ??
        vehiculos.find((vehiculo) => vehiculo.id === Number(selectedVehiculoId));

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            if (reparacion) {
                await updateReparacion(reparacion.id, formData);
            } else {
                await createReparacion(formData);
            }
            onClose();
        } catch (error) {
            console.error('Failed to save reparacion', error);
            alert('Failed to save reparacion');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title={reparacion ? 'Editar reparacion' : 'Nuevo ingreso'}
            maxWidthClass="max-w-6xl"
        >
            <form action={handleSubmit} className="bottom-sheet-form space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">
                            <span className="text-red-500">*</span> Nombre identificativo
                        </label>
                        <input
                            type="text"
                            name="identificativo"
                            defaultValue={reparacion?.identificativo}
                            required
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-300">
                            <span className="text-red-500">*</span> Prioridad
                        </label>
                        <select
                            name="prioridad"
                            defaultValue={reparacion?.prioridad || 'Normal'}
                            required
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                            <option value="Normal">Normal</option>
                            <option value="Alta">Alta</option>
                            <option value="Urgente">Urgente</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">
                            <span className="text-red-500">*</span> Cliente
                        </label>
                        <select
                            name="clienteId"
                            required
                            value={selectedClienteId}
                            onChange={(event) => setSelectedClienteId(event.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Categoria de vehiculo</label>
                        <input
                            type="text"
                            value={selectedVehiculo?.category || ''}
                            placeholder="Categoria..."
                            disabled
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm disabled:opacity-70"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Vehiculo marca/modelo/anio</label>
                        <select
                            name="vehiculoId"
                            value={selectedVehiculoId}
                            onChange={(event) => setSelectedVehiculoId(event.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                            <option value="">Seleccione...</option>
                            {filteredVehiculos.map((vehiculo) => (
                                <option key={vehiculo.id} value={vehiculo.id}>
                                    {vehiculo.brand} {vehiculo.model} {vehiculo.year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Vehiculo matricula</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Vehiculo chasis</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Kilometraje</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Cod. pintura</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300">
                        <span className="text-red-500">*</span> Descripcion reparacion
                    </label>
                    <textarea
                        name="descripcion"
                        rows={4}
                        defaultValue={reparacion?.descripcion}
                        required
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300">Imagenes reparacion (PNG, JPEG, JPG, GIF)</label>
                    <div className="mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-zinc-700 p-6 hover:border-zinc-500">
                        <div className="text-center">
                            <p className="text-sm text-zinc-400">CLICK AQUI PARA ORDENAR LAS IMAGENES</p>
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
