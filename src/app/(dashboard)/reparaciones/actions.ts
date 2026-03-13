'use server';

import {
    addReparacionInsumo as addReparacionInsumoRecord,
    addReparacionManoObra as addReparacionManoObraRecord,
    createReparacion as createReparacionRecord,
    deleteReparacion as deleteReparacionRecord,
    getReparacionDetalle as getReparacionDetalleRecord,
    listReparaciones,
    listReparacionesByEstado,
    updateReparacion as updateReparacionRecord,
    updateReparacionEstado as updateReparacionEstadoRecord,
    type ReparacionDetalleView,
    type ReparacionEstado,
    type ReparacionInsumoInput,
    type ReparacionManoObraInput,
    type ReparacionPatch,
    type ReparacionView,
} from '@/lib/mock-db';

export type Reparacion = ReparacionView;
export type ReparacionDetalle = ReparacionDetalleView;

function getString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

function getId(value: string): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

export async function getReparaciones() {
    return listReparaciones();
}

export async function getReparacionesByEstado(estado?: string) {
    return listReparacionesByEstado(estado);
}

export async function createReparacion(formData: FormData) {
    return createReparacionRecord({
        identificativo: getString(formData, 'identificativo'),
        prioridad: getString(formData, 'prioridad'),
        clienteId: getId(getString(formData, 'clienteId')),
        vehiculoId: getId(getString(formData, 'vehiculoId')) || null,
        descripcion: getString(formData, 'descripcion'),
    });
}

export async function updateReparacion(id: number, formData: FormData) {
    const patch: ReparacionPatch = {};

    if (formData.has('identificativo')) patch.identificativo = getString(formData, 'identificativo');
    if (formData.has('prioridad')) patch.prioridad = getString(formData, 'prioridad');
    if (formData.has('descripcion')) patch.descripcion = getString(formData, 'descripcion');

    if (formData.has('clienteId')) {
        patch.clienteId = getId(getString(formData, 'clienteId')) || null;
    }

    if (formData.has('vehiculoId')) {
        patch.vehiculoId = getId(getString(formData, 'vehiculoId')) || null;
    }

    return updateReparacionRecord(id, patch);
}

export async function deleteReparacion(id: number) {
    await deleteReparacionRecord(id);
}

export async function updateReparacionEstado(id: number, nuevoEstado: ReparacionEstado) {
    await updateReparacionEstadoRecord(id, nuevoEstado);
}

export async function getReparacionDetalle(id: number) {
    return getReparacionDetalleRecord(id);
}

export async function addReparacionInsumo(id: number, payload: ReparacionInsumoInput) {
    return addReparacionInsumoRecord(id, payload);
}

export async function addReparacionManoObra(id: number, payload: ReparacionManoObraInput) {
    return addReparacionManoObraRecord(id, payload);
}
