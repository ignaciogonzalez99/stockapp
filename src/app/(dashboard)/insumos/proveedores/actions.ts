'use server';

import {
    createProveedor as createProveedorRecord,
    deleteProveedor as deleteProveedorRecord,
    listProveedores,
    updateProveedor as updateProveedorRecord,
    type ProveedorView,
} from '@/lib/mock-db';

export type Proveedor = ProveedorView;

function getString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

export async function getProveedores() {
    return listProveedores();
}

export async function createProveedor(formData: FormData) {
    return createProveedorRecord({
        name: getString(formData, 'name'),
        rut: getString(formData, 'rut'),
        address: getString(formData, 'address'),
        phone: getString(formData, 'phone'),
        phone2: getString(formData, 'phone2'),
        email: getString(formData, 'email'),
        notes: getString(formData, 'notes'),
    });
}

export async function updateProveedor(id: number, formData: FormData) {
    return updateProveedorRecord(id, {
        name: getString(formData, 'name'),
        rut: getString(formData, 'rut'),
        address: getString(formData, 'address'),
        phone: getString(formData, 'phone'),
        phone2: getString(formData, 'phone2'),
        email: getString(formData, 'email'),
        notes: getString(formData, 'notes'),
    });
}

export async function deleteProveedor(id: number) {
    await deleteProveedorRecord(id);
}
