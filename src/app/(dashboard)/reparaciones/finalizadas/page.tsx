'use client';

import { useState, useEffect } from 'react';
import { getReparacionesByEstado, deleteReparacion, type Reparacion } from '../actions';
import { ReparacionModal } from '@/components/ReparacionModal';

export default function ReparacionesFinalizadasPage() {
    const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReparacion, setSelectedReparacion] = useState<Reparacion | undefined>(undefined);

    const loadReparaciones = async () => {
        const data = await getReparacionesByEstado('Finalizado');
        setReparaciones(data as Reparacion[]);
    };

    useEffect(() => {
        let mounted = true;
        getReparacionesByEstado('Finalizado').then(data => {
            if (mounted) {
                setReparaciones(data as Reparacion[]);
            }
        });
        return () => { mounted = false; };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdownId !== null && !(event.target as Element).closest('.dropdown-menu') && !(event.target as Element).closest('.dropdown-trigger')) {
                setActiveDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdownId]);

    // Update dropdown position on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (activeDropdownId !== null) {
                setActiveDropdownId(null);
            }
        };
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [activeDropdownId]);

    const handleDropdownClick = (event: React.MouseEvent, reparacionId: number) => {
        event.stopPropagation();
        if (activeDropdownId === reparacionId) {
            setActiveDropdownId(null);
        } else {
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 192,
            });
            setActiveDropdownId(reparacionId);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Está seguro de eliminar esta reparación?')) {
            await deleteReparacion(id);
            loadReparaciones();
            setActiveDropdownId(null);
        }
    };

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm shrink-0 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-green-600">🔧 Reparaciones Finalizadas</span>
                    <span>&gt;</span>
                    <span>Inicio</span>
                    <span>&gt;</span>
                    <span>Reparaciones Finalizadas</span>
                </div>
                <button
                    onClick={() => {
                        setSelectedReparacion(undefined);
                        setIsModalOpen(true);
                    }}
                    className="w-full md:w-auto rounded bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 text-center"
                >
                    + Nuevo Ingreso
                </button>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-md bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Mostrar</span>
                        <select className="rounded-md border border-gray-300 px-2 py-1 text-sm">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <span className="text-sm text-gray-700">registros</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Buscar:</span>
                        <input
                            type="text"
                            className="w-full md:w-auto rounded-md border border-gray-300 px-3 py-1 text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <div className="min-w-[800px]">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3">#</th>
                                    <th className="px-6 py-3">Código</th>
                                    <th className="px-6 py-3">Identificativo</th>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Vehículo</th>
                                    <th className="px-6 py-3">Ingreso</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reparaciones.map((reparacion, index) => (
                                    <tr key={reparacion.id} className="border-b bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4">{reparacion.code}</td>
                                        <td className="px-6 py-4">{reparacion.identificativo}</td>
                                        <td className="px-6 py-4">{reparacion.clienteName}</td>
                                        <td className="px-6 py-4">{reparacion.vehiculoInfo}</td>
                                        <td className="px-6 py-4">{reparacion.ingreso}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-green-500 text-white">
                                                Finalizado
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => handleDropdownClick(e, reparacion.id)}
                                                className="dropdown-trigger flex gap-2 text-green-600 hover:bg-gray-100 p-1 rounded"
                                            >
                                                <span className="cursor-pointer text-xl font-bold">•••</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {reparaciones.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center">No hay reparaciones finalizadas</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between shrink-0">
                    <div className="text-sm text-gray-700">
                        1-10 de {reparaciones.length} registros
                    </div>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">&lt;</button>
                        <button className="px-3 py-1 rounded bg-green-600 text-white">1</button>
                        <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">2</button>
                        <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">3</button>
                        <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">&gt;</button>
                    </div>
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
                            onClick={() => setActiveDropdownId(null)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <span className="mr-2">ℹ️</span> Más información
                        </button>
                        <button
                            onClick={() => handleDelete(activeDropdownId)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            <span className="mr-2">🗑️</span> Eliminar
                        </button>
                    </div>
                </div>
            )}

            {/* Reparacion Modal */}
            <ReparacionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedReparacion(undefined);
                    loadReparaciones();
                }}
                reparacion={selectedReparacion}
            />
        </div>
    );
}
