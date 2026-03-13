'use server';

import {
    createVehiculo as createVehiculoRecord,
    deleteVehiculo as deleteVehiculoRecord,
    listVehiculos,
    updateVehiculo as updateVehiculoRecord,
    type VehiculoView,
} from '@/lib/mock-db';

export type Vehiculo = VehiculoView;

function getString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

function getNullableId(formData: FormData, key: string): number | null {
    const value = getString(formData, key);
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

export async function getVehiculos() {
    return listVehiculos();
}

export async function createVehiculo(formData: FormData) {
    return createVehiculoRecord({
        categoryName: getString(formData, 'category'),
        brand: getString(formData, 'brand'),
        model: getString(formData, 'model'),
        year: getString(formData, 'year'),
        notes: getString(formData, 'notes'),
        clientId: getNullableId(formData, 'clientId'),
    });
}

export async function updateVehiculo(id: number, formData: FormData) {
    return updateVehiculoRecord(id, {
        categoryName: getString(formData, 'category'),
        brand: getString(formData, 'brand'),
        model: getString(formData, 'model'),
        year: getString(formData, 'year'),
        notes: getString(formData, 'notes'),
        clientId: getNullableId(formData, 'clientId'),
    });
}

export async function deleteVehiculo(id: number) {
    await deleteVehiculoRecord(id);
}
