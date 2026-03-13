'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
    deleteDependencyModuleItem,
    getDependencyItems,
    getDependencyModuleByKey,
    type DependencyItem,
    type DependencyModule,
} from '../actions';

export function DependenciasModuloClient({ moduleKey }: { moduleKey: string }) {
    const [module, setModule] = useState<DependencyModule | null>(null);
    const [items, setItems] = useState<DependencyItem[]>([]);
    const [expandedItemIds, setExpandedItemIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const [moduleData, itemsData] = await Promise.all([
                getDependencyModuleByKey(moduleKey),
                getDependencyItems(moduleKey),
            ]);

            if (!moduleData) {
                setModule(null);
                setItems([]);
                setErrorMessage('El modulo solicitado no existe.');
                return;
            }

            setModule(moduleData);
            setItems(itemsData);
        } catch (error) {
            setModule(null);
            setItems([]);
            const message =
                error instanceof Error
                    ? error.message
                    : 'No se pudieron cargar los elementos del modulo.';
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }, [moduleKey]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const toggleDependencies = (itemId: number) => {
        setExpandedItemIds((previous) =>
            previous.includes(itemId)
                ? previous.filter((id) => id !== itemId)
                : [...previous, itemId],
        );
    };

    const handleDelete = async (item: DependencyItem) => {
        if (!item.canDelete) return;

        const accepted = window.confirm(
            `Se eliminara "${item.title}". Esta accion no se puede deshacer.`,
        );
        if (!accepted) return;

        try {
            await deleteDependencyModuleItem(moduleKey, item.id);
            await loadData();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'No se pudo eliminar el elemento.';
            alert(message);
            await loadData();
        }
    };

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="rounded-md bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link className="font-bold text-sidebar hover:underline" href="/configuracion/dependencias">
                        Configuracion
                    </Link>
                    <span>&gt;</span>
                    <span>{module?.label ?? 'Dependencias'}</span>
                </div>
            </div>

            <div className="flex flex-1 flex-col rounded-md bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-2">
                    <h1 className="text-xl font-bold text-gray-900">
                        {module?.label ?? 'Dependencias'}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {module?.description ?? 'Lista de elementos y sus dependencias.'}
                    </p>
                </div>

                {isLoading && <p className="text-sm text-gray-500">Cargando elementos...</p>}

                {errorMessage && (
                    <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMessage}
                    </p>
                )}

                {!isLoading && !errorMessage && (
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-4 py-3">Elemento</th>
                                    <th className="px-4 py-3">Dependencias</th>
                                    <th className="px-4 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => {
                                    const isExpanded = expandedItemIds.includes(item.id);

                                    return (
                                        <tr key={item.id} className="border-b border-gray-100 align-top">
                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-gray-900">{item.title}</p>
                                                {item.subtitle && (
                                                    <p className="mt-1 text-xs text-gray-500">{item.subtitle}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                        item.dependencyCount > 0
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : 'bg-emerald-100 text-emerald-700'
                                                    }`}
                                                >
                                                    {item.dependencyCount}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => toggleDependencies(item.id)}
                                                        className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                                                    >
                                                        {isExpanded
                                                            ? 'Ocultar dependencias'
                                                            : 'Ver dependencias'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        disabled={!item.canDelete}
                                                        title={
                                                            item.canDelete
                                                                ? 'Eliminar elemento'
                                                                : 'No se puede eliminar porque tiene dependencias'
                                                        }
                                                        className={`rounded px-3 py-1 text-xs font-semibold ${
                                                            item.canDelete
                                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                                : 'cursor-not-allowed bg-gray-200 text-gray-500'
                                                        }`}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>

                                                {isExpanded && (
                                                    <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                                                        {item.dependencies.map((dependency) => (
                                                            <p key={dependency.label} className="text-xs text-gray-700">
                                                                {dependency.label}: {dependency.count}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                                            No hay elementos en este modulo.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
