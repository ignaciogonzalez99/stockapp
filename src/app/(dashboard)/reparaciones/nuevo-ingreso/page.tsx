'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createReparacion } from '../actions';
import { getClientes, type Cliente } from '../../clientes/actions';
import { getVehiculos, type Vehiculo } from '../../vehiculos/actions';
import { getVehicleCategories, type VehicleCategory } from '../../vehiculos/categorias/actions';

export default function NuevoIngresoPage() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [categories, setCategories] = useState<VehicleCategory[]>([]);
    const [filteredVehiculos, setFilteredVehiculos] = useState<Vehiculo[]>([]);
    const [selectedClienteId, setSelectedClienteId] = useState<string>('');
    const [selectedVehiculoId, setSelectedVehiculoId] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

    useEffect(() => {
        getClientes().then(setClientes);
        getVehiculos().then(setVehiculos);
        getVehicleCategories().then(setCategories);
    }, []);

    useEffect(() => {
        if (selectedClienteId) {
            const filtered = vehiculos.filter(v => v.clientId === parseInt(selectedClienteId));
            setFilteredVehiculos(filtered);
        } else {
            setFilteredVehiculos([]);
        }
        setSelectedVehiculoId('');
        setSelectedCategoryId('');
    }, [selectedClienteId, vehiculos]);

    useEffect(() => {
        if (selectedVehiculoId) {
            const vehiculo = vehiculos.find(v => v.id === parseInt(selectedVehiculoId));
            if (vehiculo) {
                console.log('Vehiculo seleccionado:', vehiculo);
                console.log('Categorias disponibles:', categories);
                const category = categories.find(c => c.name === vehiculo.category);
                if (category) {
                    console.log('Categoria encontrada:', category);
                    setSelectedCategoryId(category.id.toString());
                } else {
                    console.log('No se encontró categoria para:', vehiculo.category);
                    setSelectedCategoryId('');
                }
            }
        } else {
            setSelectedCategoryId('');
        }
    }, [selectedVehiculoId, vehiculos, categories]);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            const clienteId = formData.get('clienteId');
            const vehiculoId = formData.get('vehiculoId');

            if (clienteId) {
                const selectedCliente = clientes.find(c => c.id === parseInt(clienteId as string));
                if (selectedCliente) {
                    formData.set('clienteName', selectedCliente.name);
                }
            }

            if (vehiculoId) {
                const selectedVehiculo = vehiculos.find(v => v.id === parseInt(vehiculoId as string));
                if (selectedVehiculo) {
                    formData.set('vehiculoInfo', `${selectedVehiculo.brand} ${selectedVehiculo.model}`);
                }
            }

            await createReparacion(formData);
            router.push('/reparaciones/lista');
        } catch (error) {
            console.error('Failed to create reparacion', error);
            alert('Failed to create reparacion');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm shrink-0 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-green-600">🔧 Nuevo ingreso</span>
                    <span>&gt;</span>
                    <span>Inicio</span>
                    <span>&gt;</span>
                    <span>Nuevo ingreso</span>
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-md bg-white p-6 shadow-sm">
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre Identificativo */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">
                                <span className="text-red-500">*</span> Nombre Identificativo
                            </label>
                            <input
                                type="text"
                                name="identificativo"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        {/* Prioridad */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">
                                <span className="text-red-500">*</span> Prioridad
                            </label>
                            <select
                                name="prioridad"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="Normal">Normal</option>
                                <option value="Alta">Alta</option>
                                <option value="Urgente">Urgente</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cliente */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">
                                <span className="text-red-500">*</span> Cliente
                            </label>
                            <select
                                name="clienteId"
                                required
                                value={selectedClienteId}
                                onChange={(e) => setSelectedClienteId(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="">Seleccione o ingrese Nuevo cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>{cliente.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Vehículo Categoría */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Vehículo Categoría</label>
                            <select
                                name="categoryId"
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="">Seleccione Categoría...</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Vehículo Marca/Modelo/Año */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Vehículo Marca/Modelo/Año</label>
                            <select
                                name="vehiculoId"
                                value={selectedVehiculoId}
                                onChange={(e) => setSelectedVehiculoId(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="">Seleccione...</option>
                                {filteredVehiculos.map(vehiculo => (
                                    <option key={vehiculo.id} value={vehiculo.id}>
                                        {vehiculo.brand} {vehiculo.model} {vehiculo.year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Vehículo Matrícula */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Vehículo Matrícula</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        {/* Vehículo Chasis */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Vehículo Chasis</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        {/* Kilometraje */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Kilometraje</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cod. Pintura */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Cod. Pintura</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Descripción Reparación */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700">
                            <span className="text-red-500">*</span> Descripción Reparación
                        </label>
                        <textarea
                            name="descripcion"
                            rows={4}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
                        />
                    </div>

                    {/* Imágenes Reparación */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Imágenes Reparación (PNG,JPEG,JPG,GIF)</label>
                        <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">CLICK AQUÍ PARA ORDENAR LAS IMÁGENES</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-red-500 font-medium">
                        * Campos obligatorios
                    </div>

                    <div className="flex justify-center gap-2 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <span className="font-bold">×</span> Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            {isPending ? 'Guardando...' : '💾 Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
