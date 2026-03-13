'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const [isVehiculosOpen, setIsVehiculosOpen] = useState(true);
    const [isInsumosOpen, setIsInsumosOpen] = useState(true);
    const [isReparacionesOpen, setIsReparacionesOpen] = useState(true);
    const [isConfiguracionOpen, setIsConfiguracionOpen] = useState(true);

    // Prevent scrolling when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="relative flex h-full w-64 flex-col bg-sidebar text-white shadow-xl transition-transform">
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-bold text-white">BUS</span>
                            <span className="text-xl font-bold text-primary">&</span>
                            <span className="text-xl font-bold text-white">TRUCK</span>
                        </div>
                        <span className="text-[10px] text-muted uppercase tracking-wider">workshop</span>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
                    <NavItem href="/" icon={<HomeIcon />} label="Inicio" onClick={onClose} />
                    <NavItem href="#" icon={<UsersIcon />} label="Órdenes de trabajo" onClick={onClose} />
                    {/* Reparaciones with Submenu */}
                    <div className="space-y-1">
                        <NavItem
                            href="#"
                            icon={<WrenchIcon />}
                            label="Reparaciones"
                            hasSubmenu
                            isOpen={isReparacionesOpen}
                            onClick={() => setIsReparacionesOpen(!isReparacionesOpen)}
                        />
                        {isReparacionesOpen && (
                            <div className="pl-10 space-y-1">
                                <Link href="/reparaciones/lista" onClick={onClose} className="block rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-white/10 hover:text-white">
                                    &gt; Lista de reparaciones
                                </Link>
                                <Link href="/reparaciones/finalizadas" onClick={onClose} className="block rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-white/10 hover:text-white">
                                    &gt; Reparaciones Finalizadas
                                </Link>
                            </div>
                        )}
                    </div>

                    <NavItem href="/clientes" icon={<UserIcon />} label="Mis clientes" onClick={onClose} />

                    {/* Vehículos with Submenu */}
                    <div className="space-y-1">
                        <NavItem
                            href="#"
                            icon={<CarIcon />}
                            label="Vehículos"
                            hasSubmenu
                            isOpen={isVehiculosOpen}
                            onClick={() => setIsVehiculosOpen(!isVehiculosOpen)}
                        />
                        {isVehiculosOpen && (
                            <div className="pl-10 space-y-1">
                                <Link href="/vehiculos" onClick={onClose} className="block rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-white/10 hover:text-white">
                                    &gt; Vehículos
                                </Link>
                                <Link href="/vehiculos/categorias" onClick={onClose} className="block rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-white/10 hover:text-white">
                                    &gt; Categorías
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Insumos with Submenu */}
                    <div className="space-y-1">
                        <NavItem
                            href="#"
                            icon={<BoxIcon />}
                            label="Insumos"
                            hasSubmenu
                            isOpen={isInsumosOpen}
                            onClick={() => setIsInsumosOpen(!isInsumosOpen)}
                        />
                        {isInsumosOpen && (
                            <div className="pl-10 space-y-1">
                                <Link href="/insumos/productos" onClick={onClose} className="block rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-white/10 hover:text-white">
                                    &gt; Productos
                                </Link>
                                <Link href="/insumos/proveedores" onClick={onClose} className="block rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-white/10 hover:text-white">
                                    &gt; Proveedores
                                </Link>
                                <Link href="/insumos/categorias" onClick={onClose} className="block rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-white/10 hover:text-white">
                                    &gt; Categorías
                                </Link>
                            </div>
                        )}
                    </div>

                    <NavItem href="#" icon={<FileTextIcon />} label="Control" hasSubmenu onClick={onClose} />

                    <div className="space-y-1">
                        <NavItem
                            href="#"
                            icon={<SettingsIcon />}
                            label="Configuración"
                            hasSubmenu
                            isOpen={isConfiguracionOpen}
                            onClick={() => setIsConfiguracionOpen(!isConfiguracionOpen)}
                        />
                        {isConfiguracionOpen && (
                            <div className="pl-10 space-y-1">
                                <Link
                                    href="/configuracion/dependencias"
                                    onClick={onClose}
                                    className="block rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-white/10 hover:text-white"
                                >
                                    &gt; Dependencias
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="border-t border-white/10 p-4 text-xs text-muted">
                    COPYRIGHT © 2025 NATO DEV
                </div>
            </div>
        </div>
    );
}

function NavItem({
    href,
    icon,
    label,
    active = false,
    hasSubmenu = false,
    isOpen = false,
    onClick,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    hasSubmenu?: boolean;
    isOpen?: boolean;
    onClick?: () => void;
}) {
    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className={`group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium ${active
                ? 'bg-primary text-primary-foreground font-bold'
                : 'text-muted hover:bg-white/10 hover:text-white'
                }`}
        >
            <div className="flex items-center">
                <span className={`mr-3 h-6 w-6 ${active ? 'text-primary-foreground' : 'text-muted group-hover:text-white'}`}>
                    {icon}
                </span>
                {label}
            </div>
            {hasSubmenu && (
                <svg
                    className={`h-4 w-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
            )}
        </Link>
    );
}

// Icons (Duplicated for now to keep it self-contained as per plan, but ideally should be shared)
function HomeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
}

function WrenchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

function CarIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
    );
}

function BoxIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

function FileTextIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}
