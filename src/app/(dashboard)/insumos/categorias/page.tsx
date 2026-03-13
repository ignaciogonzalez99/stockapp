'use client';

import { useState, useEffect } from 'react';
import { getProductCategories, createProductCategory, updateProductCategory, deleteProductCategory, type ProductCategory } from './actions';
import { CategoryModal } from '@/components/CategoryModal';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

export default function ProductCategoriasPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | undefined>(undefined);
    const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | undefined>(undefined);

    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        getProductCategories().then(setCategories);
    }, [isModalOpen, isDeleteModalOpen]);

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

    const handleDropdownClick = (event: React.MouseEvent, categoryId: number) => {
        event.stopPropagation();
        if (activeDropdownId === categoryId) {
            setActiveDropdownId(null);
        } else {
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 192,
            });
            setActiveDropdownId(categoryId);
        }
    };

    const handleCreateNew = () => {
        setSelectedCategory(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (category: ProductCategory) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
        setActiveDropdownId(null);
    };

    const handleDeleteClick = (category: ProductCategory) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
        setActiveDropdownId(null);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            try {
                await deleteProductCategory(categoryToDelete.id);
                const updated = await getProductCategories();
                setCategories(updated);
                setIsDeleteModalOpen(false);
                setCategoryToDelete(undefined);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'No se pudo eliminar la categoria.';
                alert(message);
                setIsDeleteModalOpen(false);
                setCategoryToDelete(undefined);
            }
        }
    };

    const handleSubmit = async (formData: FormData) => {
        if (selectedCategory) {
            await updateProductCategory(selectedCategory.id, formData);
        } else {
            await createProductCategory(formData);
        }
    };

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex items-center justify-between rounded-md bg-white p-4 shadow-sm shrink-0">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-sidebar">Categorías de Productos</span>
                    <span>&gt;</span>
                    <span>Insumos</span>
                    <span>&gt;</span>
                    <span>Categorías</span>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="rounded bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                >
                    + Nueva categoría
                </button>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-md bg-white p-6 shadow-sm">
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Descripción</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4">{category.description}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={(e) => handleDropdownClick(e, category.id)}
                                            className="dropdown-trigger flex gap-2 text-sidebar hover:bg-gray-100 p-1 rounded"
                                        >
                                            <span className="cursor-pointer text-xl font-bold">•••</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center">No hay categorías</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                            onClick={() => handleEdit(categories.find(c => c.id === activeDropdownId)!)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <span className="mr-2">✏️</span> Editar
                        </button>
                        <button
                            onClick={() => handleDeleteClick(categories.find(c => c.id === activeDropdownId)!)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            <span className="mr-2">🗑️</span> Eliminar
                        </button>
                    </div>
                </div>
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                category={selectedCategory}
                title="+ Nueva categoría de producto"
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                productName={categoryToDelete?.name || ''}
            />
        </div>
    );
}
