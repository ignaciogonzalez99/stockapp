'use server';

import {
    createCliente as createClienteRecord,
    deleteCliente as deleteClienteRecord,
    listClientes,
    updateCliente as updateClienteRecord,
    type ClienteView,
} from '@/lib/mock-db';

export type Cliente = ClienteView;

function getString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

export async function getClientes() {
    return listClientes();
}

export async function createCliente(formData: FormData) {
    return createClienteRecord({
        name: getString(formData, 'name'),
        phone: getString(formData, 'phone'),
        email: getString(formData, 'email'),
        docType: getString(formData, 'docType'),
        docNumber: getString(formData, 'docNumber'),
        address: getString(formData, 'address'),
    });
}

export async function updateCliente(id: number, formData: FormData) {
    return updateClienteRecord(id, {
        name: getString(formData, 'name'),
        phone: getString(formData, 'phone'),
        email: getString(formData, 'email'),
        docType: getString(formData, 'docType'),
        docNumber: getString(formData, 'docNumber'),
        address: getString(formData, 'address'),
    });
}

export async function deleteCliente(id: number) {
    await deleteClienteRecord(id);
}
