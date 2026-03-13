'use client';

import { useCallback, useEffect, useState } from 'react';
import { deleteReparacion, getReparacionesByEstado, type Reparacion } from '../actions';
import { ReparacionModal } from '@/components/ReparacionModal';
import { EstadoModal } from '@/components/EstadoModal';
import { ReparacionInsumoModal } from '@/components/ReparacionInsumoModal';
import { ReparacionManoObraModal } from '@/components/ReparacionManoObraModal';
import { ReparacionInfoModal } from '@/components/ReparacionInfoModal';

export default function ListaReparacionesPage() {
    const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [selectedReparacion, setSelectedReparacion] = useState<Reparacion | undefined>(undefined);
    const [isEstadoModalOpen, setIsEstadoModalOpen] = useState(false);
    const [selectedReparacionForEstado, setSelectedReparacionForEstado] = useState<Reparacion | undefined>(undefined);
    const [selectedReparacionForRecursos, setSelectedReparacionForRecursos] = useState<Reparacion | undefined>(undefined);
    const [isInsumoModalOpen, setIsInsumoModalOpen] = useState(false);
    const [isInsumoExtraModalOpen, setIsInsumoExtraModalOpen] = useState(false);
    const [isManoObraModalOpen, setIsManoObraModalOpen] = useState(false);

    const loadReparaciones = useCallback(async () => {
        const data = await getReparacionesByEstado('activas');
        setReparaciones(data as Reparacion[]);
    }, []);

    useEffect(() => {
        let mounted = true;
        getReparacionesByEstado('activas').then((data) => {
            if (mounted) setReparaciones(data as Reparacion[]);
        });
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                activeDropdownId !== null &&
                !(event.target as Element).closest('.dropdown-menu') &&
                !(event.target as Element).closest('.dropdown-trigger')
            ) {
                setActiveDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdownId]);

    useEffect(() => {
        const handleScroll = () => {
            if (activeDropdownId !== null) setActiveDropdownId(null);
        };

        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [activeDropdownId]);

    const handleDropdownClick = (event: React.MouseEvent, reparacionId: number) => {
        event.stopPropagation();
        if (activeDropdownId === reparacionId) {
            setActiveDropdownId(null);
            return;
        }

        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.right + window.scrollX - 192,
        });
        setActiveDropdownId(reparacionId);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Estas seguro de eliminar esta reparacion?')) return;
        await deleteReparacion(id);
        await loadReparaciones();
        setActiveDropdownId(null);
    };

    const getEstadoBadge = (estado: string) => {
        const badges = {
            'Sin Iniciar': 'bg-red-500 text-white',
            'En Curso': 'bg-blue-500 text-white',
            Pausado: 'bg-yellow-500 text-white',
            Finalizado: 'bg-green-500 text-white',
        };
        return badges[estado as keyof typeof badges] || 'bg-gray-500 text-white';
    };

    const openInsumoModal = (extra = false) => {
        const reparacion = reparaciones.find((item) => item.id === activeDropdownId);
        setSelectedReparacionForRecursos(reparacion);
        if (extra) {
            setIsInsumoExtraModalOpen(true);
        } else {
            setIsInsumoModalOpen(true);
        }
        setActiveDropdownId(null);
    };

    const openManoObraModal = () => {
        const reparacion = reparaciones.find((item) => item.id === activeDropdownId);
        setSelectedReparacionForRecursos(reparacion);
        setIsManoObraModalOpen(true);
        setActiveDropdownId(null);
    };

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm shrink-0 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-green-600">Lista de reparaciones</span>
                    <span>&gt;</span>
                    <span>Inicio</span>
                    <span>&gt;</span>
                    <span>Lista de reparaciones</span>
                </div>
                <button
                    onClick={() => {
                        setSelectedReparacion(undefined);
                        setIsModalOpen(true);
                    }}
                    className="w-full md:w-auto rounded bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 text-center"
                >
                    + Nuevo ingreso
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
                        <input type="text" className="w-full md:w-auto rounded-md border border-gray-300 px-3 py-1 text-sm" />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <div className="min-w-[800px]">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3">#</th>
                                    <th className="px-6 py-3">Codigo</th>
                                    <th className="px-6 py-3">Identificativo</th>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Vehiculo</th>
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
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getEstadoBadge(reparacion.estado)}`}>
                                                {reparacion.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => handleDropdownClick(e, reparacion.id)}
                                                className="dropdown-trigger flex gap-2 text-green-600 hover:bg-gray-100 p-1 rounded"
                                            >
                                                <span className="cursor-pointer text-xl font-bold">...</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {reparaciones.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center">No hay reparaciones activas</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-700">1-10 de {reparaciones.length} registros</div>
            </div>

            {activeDropdownId !== null && (
                <div
                    className="dropdown-menu fixed z-50 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                >
                    <div className="py-1">
                        <button
                            onClick={() => {
                                const reparacion = reparaciones.find((item) => item.id === activeDropdownId);
                                setSelectedReparacion(reparacion);
                                setIsInfoModalOpen(true);
                                setActiveDropdownId(null);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Mas informacion
                        </button>

                        <button
                            onClick={() => openInsumoModal(false)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Agregar insumos
                        </button>

                        <button
                            onClick={() => openInsumoModal(true)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Agregar insumo extra
                        </button>

                        <button
                            onClick={openManoObraModal}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Agregar mano de obra
                        </button>

                        <button
                            onClick={() => {
                                const reparacion = reparaciones.find((item) => item.id === activeDropdownId);
                                setSelectedReparacionForEstado(reparacion);
                                setIsEstadoModalOpen(true);
                                setActiveDropdownId(null);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Cambiar estado
                        </button>

                        <button
                            onClick={() => {
                                const reparacion = reparaciones.find((item) => item.id === activeDropdownId);
                                setSelectedReparacion(reparacion);
                                setIsModalOpen(true);
                                setActiveDropdownId(null);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Editar
                        </button>

                        <button
                            onClick={() => handleDelete(activeDropdownId)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            )}

            <ReparacionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedReparacion(undefined);
                    loadReparaciones();
                }}
                reparacion={selectedReparacion}
            />

            <ReparacionInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => {
                    setIsInfoModalOpen(false);
                    setSelectedReparacion(undefined);
                }}
                reparacion={selectedReparacion}
            />

            {isEstadoModalOpen && selectedReparacionForEstado && (
                <EstadoModal
                    isOpen={isEstadoModalOpen}
                    onClose={() => {
                        setIsEstadoModalOpen(false);
                        setSelectedReparacionForEstado(undefined);
                    }}
                    reparacionId={selectedReparacionForEstado.id}
                    currentEstado={selectedReparacionForEstado.estado}
                    onSuccess={loadReparaciones}
                />
            )}

            {selectedReparacionForRecursos && (
                <ReparacionInsumoModal
                    isOpen={isInsumoModalOpen}
                    onClose={() => setIsInsumoModalOpen(false)}
                    reparacionId={selectedReparacionForRecursos.id}
                    onSuccess={loadReparaciones}
                />
            )}

            {selectedReparacionForRecursos && (
                <ReparacionInsumoModal
                    isOpen={isInsumoExtraModalOpen}
                    onClose={() => setIsInsumoExtraModalOpen(false)}
                    reparacionId={selectedReparacionForRecursos.id}
                    extra
                    onSuccess={loadReparaciones}
                />
            )}

            {selectedReparacionForRecursos && (
                <ReparacionManoObraModal
                    isOpen={isManoObraModalOpen}
                    onClose={() => setIsManoObraModalOpen(false)}
                    reparacionId={selectedReparacionForRecursos.id}
                    onSuccess={loadReparaciones}
                />
            )}
        </div>
    );
}
