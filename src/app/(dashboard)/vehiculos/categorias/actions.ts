'use server';

import {
    createVehicleCategory as createVehicleCategoryRecord,
    deleteVehicleCategory as deleteVehicleCategoryRecord,
    listVehicleCategories,
    updateVehicleCategory as updateVehicleCategoryRecord,
    type CategoryView,
} from '@/lib/mock-db';

export type VehicleCategory = CategoryView;

function getString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

export async function getVehicleCategories() {
    return listVehicleCategories();
}

export async function createVehicleCategory(formData: FormData) {
    return createVehicleCategoryRecord(
        getString(formData, 'name'),
        getString(formData, 'description'),
    );
}

export async function updateVehicleCategory(id: number, formData: FormData) {
    return updateVehicleCategoryRecord(
        id,
        getString(formData, 'name'),
        getString(formData, 'description'),
    );
}

export async function deleteVehicleCategory(id: number) {
    await deleteVehicleCategoryRecord(id);
}
