'use client';

import { useEffect, useState } from 'react';
import { getReparacionDetalle, type Reparacion, type ReparacionDetalle } from '@/app/(dashboard)/reparaciones/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface ReparacionInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    reparacion?: Reparacion;
}

export function ReparacionInfoModal({ isOpen, onClose, reparacion }: ReparacionInfoModalProps) {
    const [detalle, setDetalle] = useState<ReparacionDetalle | null>(null);

    useEffect(() => {
        if (!isOpen || !reparacion) return;
        getReparacionDetalle(reparacion.id).then(setDetalle);
    }, [isOpen, reparacion]);

    if (!isOpen || !reparacion) return null;

    const info = detalle ?? (reparacion as unknown as ReparacionDetalle);

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles de la reparacion"
            maxWidthClass="max-w-6xl"
        >
            <div className="bottom-sheet-form space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Identificativo</label>
                        <p className="mt-1 rounded-md border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-white">
                            {info.identificativo || 'Sin dato'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Prioridad</label>
                        <p className="mt-1 rounded-md border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-white">
                            {info.prioridad || 'Normal'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Cliente</label>
                        <p className="mt-1 rounded-md border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-white">
                            {info.clienteName || 'Sin cliente'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Vehiculo</label>
                        <p className="mt-1 rounded-md border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-white">
                            {info.vehiculoInfo || 'Sin vehiculo'}
                        </p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300">Descripcion</label>
                    <div className="mt-1 min-h-[100px] whitespace-pre-wrap rounded-md border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-white">
                        {info.descripcion || 'Sin descripcion'}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Estado</label>
                        <p className="mt-1 text-white">{info.estado}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Fecha de ingreso</label>
                        <p className="mt-1 text-white">{info.ingreso}</p>
                    </div>
                </div>

                <div className="rounded-md border border-zinc-700/50 bg-zinc-800/30 p-4">
                    <h3 className="text-sm font-bold text-zinc-200">Insumos cargados</h3>
                    <div className="mt-2 space-y-2">
                        {(info.insumos ?? []).length === 0 && (
                            <p className="text-sm text-zinc-400">Sin insumos cargados.</p>
                        )}
                        {(info.insumos ?? []).map((insumo) => (
                            <div key={insumo.id} className="rounded border border-zinc-700/50 bg-zinc-900/30 px-3 py-2 text-sm text-zinc-200">
                                {insumo.productName} ({insumo.sku}) - {insumo.quantity} {insumo.measure}
                                {insumo.extra ? ' [extra]' : ''}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-md border border-zinc-700/50 bg-zinc-800/30 p-4">
                    <h3 className="text-sm font-bold text-zinc-200">Mano de obra</h3>
                    <div className="mt-2 space-y-2">
                        {(info.manoObra ?? []).length === 0 && (
                            <p className="text-sm text-zinc-400">Sin mano de obra cargada.</p>
                        )}
                        {(info.manoObra ?? []).map((item) => (
                            <div key={item.id} className="rounded border border-zinc-700/50 bg-zinc-900/30 px-3 py-2 text-sm text-zinc-200">
                                {item.description} - {item.hours} hs - $ {item.amount.toFixed(2)}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center pt-2">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </BottomSheet>
    );
}
