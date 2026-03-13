'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getSessionUser, logout } from '@/app/(auth)/login/actions';

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [username, setUsername] = useState('Usuario');

    useEffect(() => {
        let isMounted = true;

        getSessionUser()
            .then((sessionUser) => {
                if (!isMounted || !sessionUser) return;
                const nextName = sessionUser.username?.trim() || sessionUser.displayName?.trim() || 'Usuario';
                setUsername(nextName);
            })
            .catch(() => {
                if (!isMounted) return;
                setUsername('Usuario');
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const userInitial = useMemo(
        () => username.trim().charAt(0).toUpperCase() || 'U',
        [username],
    );

    return (
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {/* Placeholder for search or other left-side items */}
            </div>
            <div className="relative flex items-center gap-4">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-full p-1 transition-colors"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        {userInitial}
                    </div>
                    <div className="hidden flex-col text-right md:flex">
                        <span className="font-medium text-gray-700">{username}</span>
                        <span className="text-xs text-gray-500">Administrador</span>
                    </div>
                    <svg
                        className={`h-4 w-4 text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                        <Link
                            href="/configuracion/dependencias"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Configuración
                        </Link>
                        <button
                            onClick={() => logout()}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
