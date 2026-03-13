'use server';

import {
    deleteDependencyItem,
    listDependencyItems,
    listDependencyModules,
    type DependencyItemView,
    type DependencyModuleKey,
    type DependencyModuleView,
} from '@/lib/mock-db';

export type DependencyModule = DependencyModuleView;
export type DependencyItem = DependencyItemView;

const DEPENDENCY_MODULE_KEYS: DependencyModuleKey[] = [
    'vehiculo-categorias',
    'vehiculos',
    'insumo-categorias',
    'productos',
    'proveedores',
];

function parseModuleKey(value: string): DependencyModuleKey {
    if (DEPENDENCY_MODULE_KEYS.includes(value as DependencyModuleKey)) {
        return value as DependencyModuleKey;
    }
    throw new Error('Modulo de dependencias invalido.');
}

export async function getDependencyModules(): Promise<DependencyModule[]> {
    return listDependencyModules();
}

export async function getDependencyModuleByKey(moduleKey: string): Promise<DependencyModule | null> {
    const parsedKey = parseModuleKey(moduleKey);
    const modules = await listDependencyModules();
    return modules.find((module) => module.key === parsedKey) ?? null;
}

export async function getDependencyItems(moduleKey: string): Promise<DependencyItem[]> {
    return listDependencyItems(parseModuleKey(moduleKey));
}

export async function deleteDependencyModuleItem(moduleKey: string, id: number): Promise<void> {
    await deleteDependencyItem(parseModuleKey(moduleKey), id);
}
