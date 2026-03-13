import { notFound } from 'next/navigation';
import { DependenciasModuloClient } from './DependenciasModuloClient';

const ALLOWED_MODULES = new Set([
    'vehiculo-categorias',
    'vehiculos',
    'insumo-categorias',
    'productos',
    'proveedores',
]);

export default async function DependenciasModuloPage({
    params,
}: {
    params: Promise<{ modulo: string }>;
}) {
    const { modulo } = await params;
    if (!ALLOWED_MODULES.has(modulo)) notFound();

    return <DependenciasModuloClient moduleKey={modulo} />;
}
