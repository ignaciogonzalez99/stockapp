'use client';
'use client';

import { useState, useEffect } from 'react';
import { getProducts, deleteProduct, type Product } from './actions';
import { ProductModal } from '@/components/ProductModal';
import { EditPriceStockModal } from '@/components/EditPriceStockModal';
import { ProductInfoModal } from '@/components/ProductInfoModal';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

export default function ProductsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditPriceStockModalOpen, setIsEditPriceStockModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [productToDelete, setProductToDelete] = useState<Product | undefined>(undefined);

    useEffect(() => {
        // Fetch products on mount
        getProducts().then(setProducts);
    }, [isModalOpen, isEditPriceStockModalOpen, isDeleteModalOpen]); // Refresh when modals close

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
                setActiveDropdownId(null); // Close dropdown on scroll to avoid detachment
            }
        };
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [activeDropdownId]);

    const handleDropdownClick = (event: React.MouseEvent, productId: number) => {
        event.stopPropagation();
        if (activeDropdownId === productId) {
            setActiveDropdownId(null);
        } else {
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 192, // 192px is w-48
            });
            setActiveDropdownId(productId);
        }
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
        setActiveDropdownId(null);
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                await deleteProduct(productToDelete.id);
                const updatedProducts = await getProducts();
                setProducts(updatedProducts);
                setIsDeleteModalOpen(false);
                setProductToDelete(undefined);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'No se pudo eliminar el producto.';
                alert(message);
                setIsDeleteModalOpen(false);
                setProductToDelete(undefined);
            }
        }
    };

    const handleEditPriceStock = (product: Product) => {
        setSelectedProduct(product);
        setIsEditPriceStockModalOpen(true);
        setActiveDropdownId(null);
    };

    const handleInfo = (product: Product) => {
        setSelectedProduct(product);
        setIsInfoModalOpen(true);
        setActiveDropdownId(null);
    };

    const handleEditGeneral = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
        setActiveDropdownId(null);
    };

    const handleCreateNew = () => {
        setSelectedProduct(undefined); // Clear selected product for new creation
        setIsModalOpen(true);
    };

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm shrink-0 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-sidebar">Productos</span>
                    <span>&gt;</span>
                    <span>Inicio</span>
                    <span>&gt;</span>
                    <span>Productos</span>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="w-full rounded bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 md:w-auto"
                >
                    + Nuevo producto
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
                                    <th className="px-6 py-3">Código</th>
                                    <th className="px-6 py-3">Stock</th>
                                    <th className="px-6 py-3">Medida</th>
                                    <th className="px-6 py-3">Min. Stock</th>
                                    <th className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4">{product.sku}</td>
                                        <td className="px-6 py-4">{product.quantity}</td>
                                        <td className="px-6 py-4">{product.measure}</td>
                                        <td className="px-6 py-4">{product.minStock}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => handleDropdownClick(e, product.id)}
                                                className="dropdown-trigger flex gap-2 text-sidebar hover:bg-gray-100 p-1 rounded"
                                            >
                                                <span className="cursor-pointer text-xl font-bold">•••</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center">No hay productos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 text-sm text-gray-600 shrink-0">
                        1-10 de {products.length} registros
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
                                onClick={() => handleInfo(products.find(p => p.id === activeDropdownId)!)}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <span className="mr-2">ℹ️</span> + Información
                            </button>
                            <button
                                onClick={() => handleEditGeneral(products.find(p => p.id === activeDropdownId)!)}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <span className="mr-2">✏️</span> Editar General
                            </button>
                            <button
                                onClick={() => handleEditPriceStock(products.find(p => p.id === activeDropdownId)!)}
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <span className="mr-2">💲</span> Editar Precio/Stock
                            </button>
                            <button
                                onClick={() => handleDeleteClick(products.find(p => p.id === activeDropdownId)!)}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                <span className="mr-2">🗑️</span> Eliminar
                            </button>
                        </div>
                    </div>
                )}

                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={selectedProduct}
                />
                <EditPriceStockModal
                    isOpen={isEditPriceStockModalOpen}
                    onClose={() => setIsEditPriceStockModalOpen(false)}
                    product={selectedProduct}
                />
                <ProductInfoModal
                    isOpen={isInfoModalOpen}
                    onClose={() => setIsInfoModalOpen(false)}
                    product={selectedProduct}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    productName={productToDelete?.name || ''}
                />
            </div>
        </div>
    );
}
