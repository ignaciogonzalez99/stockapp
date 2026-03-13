'use client';

import { useEffect, useState } from 'react';
import { addReparacionManoObra } from '@/app/(dashboard)/reparaciones/actions';
import { BottomSheet } from '@/components/BottomSheet';

interface ReparacionManoObraModalProps {
    isOpen: boolean;
    onClose: () => void;
    reparacionId: number;
    onSuccess: () => void;
}

export function ReparacionManoObraModal({
    isOpen,
    onClose,
    reparacionId,
    onSuccess,
}: ReparacionManoObraModalProps) {
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState('0');
    const [amount, setAmount] = useState('0');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setDescription('');
        setHours('0');
        setAmount('0');
        setError(null);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsPending(true);
        setError(null);

        try {
            await addReparacionManoObra(reparacionId, {
                description,
                hours: Number(hours),
                amount: Number(amount),
            });
            onSuccess();
            onClose();
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'No se pudo agregar la mano de obra.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Agregar mano de obra"
            maxWidthClass="max-w-3xl"
        >
            <form onSubmit={handleSubmit} className="bottom-sheet-form space-y-4">
                <div>
                    <label className="block text-sm font-bold text-zinc-300">Descripcion</label>
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={3}
                        required
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Horas</label>
                        <input
                            type="number"
                            min={0}
                            step="0.5"
                            value={hours}
                            onChange={(event) => setHours(event.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300">Monto</label>
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                </div>

                {error && (
                    <div className="rounded-md border border-red-500/30 bg-red-100 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        {isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </BottomSheet>
    );
}
