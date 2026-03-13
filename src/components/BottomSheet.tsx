'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    maxWidthClass?: string;
}

export function BottomSheet({
    isOpen,
    onClose,
    title,
    children,
    maxWidthClass = 'max-w-3xl',
}: BottomSheetProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[2px] md:p-4"
            onClick={onClose}
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className={`bottom-sheet w-full ${maxWidthClass} overflow-hidden rounded-t-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-2xl md:rounded-3xl`}
            >
                <div className="flex items-center justify-center border-b border-slate-200 px-4 pt-3">
                    <span className="h-1.5 w-14 rounded-full bg-slate-300" />
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <h2 className="text-lg font-semibold text-slate-900 md:text-xl">{title}</h2>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setIsCollapsed((value) => !value)}
                            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            aria-label={isCollapsed ? 'Expandir formulario' : 'Contraer formulario'}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7-7 7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Cerrar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                    className={`transition-[max-height] duration-300 ease-out ${isCollapsed ? 'max-h-0' : 'max-h-[82vh]'}`}
                >
                    <div className="overflow-y-auto px-5 py-5 md:px-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
