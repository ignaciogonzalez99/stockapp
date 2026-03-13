'use client';

import { useState } from 'react';
import { updateReparacionEstado } from '@/app/(dashboard)/reparaciones/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface EstadoModalProps {
    isOpen: boolean;
    onClose: () => void;
    reparacionId: number;
    currentEstado: 'Sin Iniciar' | 'En Curso' | 'Pausado' | 'Finalizado';
    onSuccess: () => void;
}

export function EstadoModal({
    isOpen,
    onClose,
    reparacionId,
    currentEstado,
    onSuccess,
}: EstadoModalProps) {
    const [selectedEstado, setSelectedEstado] = useState(currentEstado);
    const [isPending, setIsPending] = useState(false);

    if (!isOpen) return null;

    const estados = [
        { value: 'Sin Iniciar', label: 'Sin Iniciar' },
        { value: 'En Curso', label: 'En Curso' },
        { value: 'Pausado', label: 'Pausado' },
        { value: 'Finalizado', label: 'Finalizado' },
    ] as const;

    const isOptionDisabled = (estadoValue: string) => {
        if (currentEstado === 'Sin Iniciar') {
            return estadoValue === 'Pausado' || estadoValue === 'Finalizado';
        }
        if (currentEstado === 'En Curso') {
            return estadoValue === 'Sin Iniciar';
        }
        if (currentEstado === 'Pausado') {
            return estadoValue === 'Sin Iniciar';
        }
        if (currentEstado === 'Finalizado') {
            return estadoValue !== 'Finalizado';
        }
        return false;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsPending(true);
        try {
            await updateReparacionEstado(reparacionId, selectedEstado);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to update estado', error);
            alert('Failed to update estado');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Cambiar estado"
            maxWidthClass="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="bottom-sheet-form space-y-4">
                <div className="flex flex-col gap-2">
                    <span className="mb-1 block text-sm font-medium text-zinc-300">Estado actual</span>
                    <div className="flex flex-col space-y-2 text-zinc-800">
                        {estados.map((estado) => (
                            <label key={estado.value} className="inline-flex cursor-pointer items-center hover:text-green-700">
                                <input
                                    type="radio"
                                    name="estado"
                                    value={estado.value}
                                    checked={selectedEstado === estado.value}
                                    onChange={() => setSelectedEstado(estado.value)}
                                    disabled={isOptionDisabled(estado.value)}
                                    className="form-radio border-zinc-600 text-green-500 focus:ring-green-500"
                                />
                                <span className={`ml-2 ${isOptionDisabled(estado.value) ? 'text-zinc-400' : ''}`}>{estado.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {selectedEstado === 'En Curso' && (
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                        Se registrara la fecha y hora de inicio automaticamente.
                    </div>
                )}
                {selectedEstado === 'Finalizado' && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        Se registrara la fecha y hora de finalizacion automaticamente.
                    </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending || selectedEstado === currentEstado}
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isPending ? 'Guardando...' : 'Guardar cambio'}
                    </button>
                </div>
            </form>
        </BottomSheet>
    );
}
