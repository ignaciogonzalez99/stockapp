'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDependencyModules, type DependencyModule } from './actions';

export default function DependenciasPage() {
    const [modules, setModules] = useState<DependencyModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadModules = async () => {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const data = await getDependencyModules();
                if (!isMounted) return;
                setModules(data);
            } catch (error) {
                if (!isMounted) return;
                const message =
                    error instanceof Error
                        ? error.message
                        : 'No se pudieron cargar las dependencias.';
                setErrorMessage(message);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadModules();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="rounded-md bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-sidebar">Configuracion</span>
                    <span>&gt;</span>
                    <span>Dependencias</span>
                </div>
            </div>

            <div className="rounded-md bg-white p-6 shadow-sm">
                <h1 className="text-xl font-bold text-gray-900">Dependencias</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Revisa relaciones entre categorias, vehiculos, insumos, productos y proveedores.
                </p>

                {isLoading && <p className="mt-6 text-sm text-gray-500">Cargando modulos...</p>}

                {errorMessage && (
                    <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMessage}
                    </p>
                )}

                {!isLoading && !errorMessage && (
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {modules.map((module) => (
                            <Link
                                key={module.key}
                                href={`/configuracion/dependencias/${module.key}`}
                                className="group rounded-md border border-gray-200 p-4 transition-colors hover:border-primary hover:bg-primary/5"
                            >
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-sidebar">
                                    {module.label}
                                </p>
                                <p className="mt-2 text-sm text-gray-600">{module.description}</p>
                                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">
                                    {module.count} elemento(s)
                                </p>
                            </Link>
                        ))}

                        {modules.length === 0 && (
                            <p className="text-sm text-gray-500">No hay modulos configurados.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
