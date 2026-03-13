'use client';

import { useState, useEffect } from 'react';
import { getVehiculos, deleteVehiculo, type Vehiculo } from './actions';
import { VehiculoModal } from '@/components/VehiculoModal';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

export default function VehiculosPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | undefined>(undefined);
    const [vehiculoToDelete, setVehiculoToDelete] = useState<Vehiculo | undefined>(undefined);

    useEffect(() => {
        getVehiculos().then(setVehiculos);
    }, [isModalOpen, isDeleteModalOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdownId !== null && !(event.target as Element).closest('.dropdown-menu') && !(event.target as Element).closest('.dropdown-trigger')) {
                setActiveDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdownId]);

    useEffect(() => {
        const handleScroll = () => {
            if (activeDropdownId !== null) {
                setActiveDropdownId(null);
            }
        };
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [activeDropdownId]);

    const handleDropdownClick = (event: React.MouseEvent, vehiculoId: number) => {
        event.stopPropagation();
        if (activeDropdownId === vehiculoId) {
            setActiveDropdownId(null);
        } else {
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 192,
            });
            setActiveDropdownId(vehiculoId);
        }
    };

    const handleDeleteClick = (vehiculo: Vehiculo) => {
        setVehiculoToDelete(vehiculo);
        setIsDeleteModalOpen(true);
        setActiveDropdownId(null);
    };

    const confirmDelete = async () => {
        if (vehiculoToDelete) {
            try {
                await deleteVehiculo(vehiculoToDelete.id);
                const updatedVehiculos = await getVehiculos();
                setVehiculos(updatedVehiculos);
                setIsDeleteModalOpen(false);
                setVehiculoToDelete(undefined);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'No se pudo eliminar el vehiculo.';
                alert(message);
                setIsDeleteModalOpen(false);
                setVehiculoToDelete(undefined);
            }
        }
    };

    const handleEdit = (vehiculo: Vehiculo) => {
        setSelectedVehiculo(vehiculo);
        setIsModalOpen(true);
        setActiveDropdownId(null);
    };

    const handleCreateNew = () => {
        setSelectedVehiculo(undefined);
        setIsModalOpen(true);
    };

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm shrink-0 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-sidebar">Vehículos</span>
                    <span>&gt;</span>
                    <span>Inicio</span>
                    <span>&gt;</span>
                    <span>Vehículos</span>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="w-full rounded bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 md:w-auto"
                >
                    Nuevo vehículo
                </button>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-md bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-4 shrink-0 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Mostrar</span>
                        <select className="rounded border border-gray-300 p-1 text-sm">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <span className="text-sm text-gray-600">registros</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Buscar:</span>
                        <input type="text" className="w-full rounded border border-gray-300 p-1 text-sm md:w-auto" />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <div className="min-w-[800px]">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3">Categoría</th>
                                    <th className="px-6 py-3">Marca</th>
                                    <th className="px-6 py-3">Modelo</th>
                                    <th className="px-6 py-3">Año</th>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehiculos.map((vehiculo) => (
                                    <tr key={vehiculo.id} className="border-b bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{vehiculo.category}</td>
                                        <td className="px-6 py-4">{vehiculo.brand}</td>
                                        <td className="px-6 py-4">{vehiculo.model}</td>
                                        <td className="px-6 py-4">{vehiculo.year}</td>
                                        <td className="px-6 py-4">
                                            {vehiculo.clientName || <span className="text-gray-400">Sin cliente</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => handleDropdownClick(e, vehiculo.id)}
                                                className="dropdown-trigger flex gap-2 text-sidebar hover:bg-gray-100 p-1 rounded"
                                            >
                                                <span className="cursor-pointer text-xl font-bold">•••</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {vehiculos.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center">No hay vehículos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 shrink-0">
                    1-10 de {vehiculos.length} registros
                </div>
            </div>

            {/* Fixed Dropdown Menu */}
            {activeDropdownId !== null && (
                <div
                    className="dropdown-menu fixed z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                >
                    <div className="py-1">
                        <button
                            onClick={() => handleEdit(vehiculos.find(v => v.id === activeDropdownId)!)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <span className="mr-2">✏️</span> Editar
                        </button>
                        <button
                            onClick={() => handleDeleteClick(vehiculos.find(v => v.id === activeDropdownId)!)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            <span className="mr-2">🗑️</span> Eliminar
                        </button>
                    </div>
                </div>
            )}

            <VehiculoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                vehiculo={selectedVehiculo}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                productName={`${vehiculoToDelete?.brand} ${vehiculoToDelete?.model}` || ''}
            />
        </div>
    );
}
