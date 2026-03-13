'use client';

import { useState, useEffect } from 'react';
import { getProveedores, deleteProveedor, type Proveedor } from './actions';
import { ProveedorModal } from '@/components/ProveedorModal';
import { ProveedorInfoModal } from '@/components/ProveedorInfoModal';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

export default function ProveedoresPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | undefined>(undefined);
    const [proveedorToDelete, setProveedorToDelete] = useState<Proveedor | undefined>(undefined);

    useEffect(() => {
        getProveedores().then(setProveedores);
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

    const handleDropdownClick = (event: React.MouseEvent, proveedorId: number) => {
        event.stopPropagation();
        if (activeDropdownId === proveedorId) {
            setActiveDropdownId(null);
        } else {
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 192,
            });
            setActiveDropdownId(proveedorId);
        }
    };

    const handleDeleteClick = (proveedor: Proveedor) => {
        setProveedorToDelete(proveedor);
        setIsDeleteModalOpen(true);
        setActiveDropdownId(null);
    };

    const confirmDelete = async () => {
        if (proveedorToDelete) {
            try {
                await deleteProveedor(proveedorToDelete.id);
                const updatedProveedores = await getProveedores();
                setProveedores(updatedProveedores);
                setIsDeleteModalOpen(false);
                setProveedorToDelete(undefined);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'No se pudo eliminar el proveedor.';
                alert(message);
                setIsDeleteModalOpen(false);
                setProveedorToDelete(undefined);
            }
        }
    };

    const handleInfo = (proveedor: Proveedor) => {
        setSelectedProveedor(proveedor);
        setIsInfoModalOpen(true);
        setActiveDropdownId(null);
    };

    const handleEdit = (proveedor: Proveedor) => {
        setSelectedProveedor(proveedor);
        setIsModalOpen(true);
        setActiveDropdownId(null);
    };

    const handleCreateNew = () => {
        setSelectedProveedor(undefined);
        setIsModalOpen(true);
    };

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex items-center justify-between rounded-md bg-white p-4 shadow-sm shrink-0">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-sidebar">Proveedores</span>
                    <span>&gt;</span>
                    <span>Inicio</span>
                    <span>&gt;</span>
                    <span>Proveedores</span>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="rounded bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                >
                    + Nuevo proveedor
                </button>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-md bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between shrink-0">
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
                        <input type="text" className="rounded border border-gray-300 p-1 text-sm" />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3">Nombre / Razón social</th>
                                <th className="px-6 py-3">Teléfono</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proveedores.map((proveedor) => (
                                <tr key={proveedor.id} className="border-b bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{proveedor.name}</td>
                                    <td className="px-6 py-4">
                                        {proveedor.phone || <span className="text-pink-500">Sin registro</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={(e) => handleDropdownClick(e, proveedor.id)}
                                            className="dropdown-trigger flex gap-2 text-sidebar hover:bg-gray-100 p-1 rounded"
                                        >
                                            <span className="cursor-pointer text-xl font-bold">•••</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {proveedores.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center">No hay proveedores</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-sm text-gray-600 shrink-0">
                    1-10 de {proveedores.length} registros
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
                            onClick={() => handleInfo(proveedores.find(p => p.id === activeDropdownId)!)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <span className="mr-2">ℹ️</span> + Info
                        </button>
                        <button
                            onClick={() => handleEdit(proveedores.find(p => p.id === activeDropdownId)!)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <span className="mr-2">✏️</span> Editar
                        </button>
                        <button
                            onClick={() => handleDeleteClick(proveedores.find(p => p.id === activeDropdownId)!)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            <span className="mr-2">🗑️</span> Eliminar
                        </button>
                    </div>
                </div>
            )}

            <ProveedorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                proveedor={selectedProveedor}
            />
            <ProveedorInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                proveedor={selectedProveedor}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                productName={proveedorToDelete?.name || ''}
            />
        </div>
    );
}
