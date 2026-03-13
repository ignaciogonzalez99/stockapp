'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';

interface Category {
    id: number;
    name: string;
    description: string;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
    category?: Category;
    title: string;
}

export function CategoryModal({ isOpen, onClose, onSubmit, category, title }: CategoryModalProps) {
    const [isPending, setIsPending] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Failed to save category', error);
            alert('Failed to save category');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title={category ? 'Editar categoria' : title}
            maxWidthClass="max-w-xl"
        >
            <form action={handleSubmit} className="bottom-sheet-form space-y-4">
                <div>
                    <label className="block text-sm font-bold text-zinc-300">
                        <span className="text-red-500">*</span> Nombre
                    </label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={category?.name}
                        required
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300">Descripcion</label>
                    <textarea
                        name="description"
                        rows={3}
                        defaultValue={category?.description}
                        className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div className="flex justify-center gap-2 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        <span className="font-bold">X</span> Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        {isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </BottomSheet>
    );
}
