'use client';

import { useState, useEffect } from 'react';
import { getClientes, deleteCliente, type Cliente } from './actions';
import { ClienteModal } from '@/components/ClienteModal';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

export default function ClientesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>(undefined);
    const [clienteToDelete, setClienteToDelete] = useState<Cliente | undefined>(undefined);

    useEffect(() => {
        getClientes().then(setClientes);
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

    const handleDropdownClick = (event: React.MouseEvent, clienteId: number) => {
        event.stopPropagation();
        if (activeDropdownId === clienteId) {
            setActiveDropdownId(null);
        } else {
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 192,
            });
            setActiveDropdownId(clienteId);
        }
    };

    const handleDeleteClick = (cliente: Cliente) => {
        setClienteToDelete(cliente);
        setIsDeleteModalOpen(true);
        setActiveDropdownId(null);
    };

    const confirmDelete = async () => {
        if (clienteToDelete) {
            await deleteCliente(clienteToDelete.id);
            const updatedClientes = await getClientes();
            setClientes(updatedClientes);
            setIsDeleteModalOpen(false);
            setClienteToDelete(undefined);
        }
    };

    const handleEdit = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setIsModalOpen(true);
        setActiveDropdownId(null);
    };

    const handleCreateNew = () => {
        setSelectedCliente(undefined);
        setIsModalOpen(true);
    };

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm shrink-0 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-sidebar">Mis clientes</span>
                    <span>&gt;</span>
                    <span>Inicio</span>
                    <span>&gt;</span>
                    <span>Mis clientes</span>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="w-full rounded bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 md:w-auto"
                >
                    + Nuevo cliente
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
                                    <th className="px-6 py-3">Nombre</th>
                                    <th className="px-6 py-3">Teléfono</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Dirección</th>
                                    <th className="px-6 py-3">Documento</th>
                                    <th className="px-6 py-3">Tipo</th>
                                    <th className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((cliente) => (
                                    <tr key={cliente.id} className="border-b bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{cliente.name}</td>
                                        <td className="px-6 py-4">{cliente.phone}</td>
                                        <td className="px-6 py-4">
                                            {cliente.email || <span className="text-pink-500">Sin registro</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {cliente.address || <span className="text-pink-500">Sin registro</span>}
                                        </td>
                                        <td className="px-6 py-4">{cliente.docNumber}</td>
                                        <td className="px-6 py-4">{cliente.docType}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => handleDropdownClick(e, cliente.id)}
                                                className="dropdown-trigger flex gap-2 text-sidebar hover:bg-gray-100 p-1 rounded"
                                            >
                                                <span className="cursor-pointer text-xl font-bold">•••</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {clientes.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center">No hay clientes</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 shrink-0">
                    1-10 de {clientes.length} registros
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
                            onClick={() => handleEdit(clientes.find(c => c.id === activeDropdownId)!)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <span className="mr-2">✏️</span> Editar
                        </button>
                        <button
                            onClick={() => handleDeleteClick(clientes.find(c => c.id === activeDropdownId)!)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            <span className="mr-2">🗑️</span> Eliminar
                        </button>
                    </div>
                </div>
            )}

            <ClienteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cliente={selectedCliente}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                productName={clienteToDelete?.name || ''}
            />
        </div>
    );
}
