import {
    DocumentType,
    Prisma,
    ReparacionPriority,
    ReparacionStatus,
    type CategoryType,
} from '@prisma/client';
import { prisma } from '@/lib/prisma';

type CategoryKind = 'PRODUCT' | 'VEHICLE';
type DbClient = Prisma.TransactionClient | typeof prisma;

export type ReparacionEstado = 'Sin Iniciar' | 'En Curso' | 'Pausado' | 'Finalizado';
export type ReparacionPrioridad = 'Baja' | 'Normal' | 'Alta' | 'Urgente';
export type ClienteDocType = 'RUT' | 'CI';

export interface CategoryView {
    id: number;
    name: string;
    description: string;
}

export interface ClienteView {
    id: number;
    name: string;
    phone: string;
    email: string;
    docType: ClienteDocType;
    docNumber: string;
    address: string;
    createdAt: string;
}

export interface VehiculoView {
    id: number;
    category: string;
    brand: string;
    model: string;
    year: string;
    notes: string;
    clientId: number | null;
    clientName: string | null;
}

export interface ProveedorView {
    id: number;
    name: string;
    rut: string;
    address: string;
    phone: string;
    phone2: string;
    email: string;
    notes: string;
}

export interface ProductView {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    measure: string;
    minStock: number;
    currency: string;
    costPrice: number;
    sellPrice: number;
    brand: string;
    model: string;
    provider: string;
    category: string;
    description: string;
}

export interface ReparacionView {
    id: number;
    code: string;
    identificativo: string;
    prioridad: ReparacionPrioridad;
    clienteId: number;
    clienteName: string;
    vehiculoId: number;
    vehiculoInfo: string;
    descripcion: string;
    ingreso: string;
    estado: ReparacionEstado;
    fechaInicio?: string;
    fechaFin?: string;
}

export interface ReparacionInsumoView {
    id: number;
    productId: number;
    productName: string;
    sku: string;
    measure: string;
    quantity: number;
    extra: boolean;
    createdAt: string;
}

export interface ReparacionManoObraView {
    id: number;
    description: string;
    hours: number;
    amount: number;
    createdAt: string;
}

export interface ReparacionDetalleView extends ReparacionView {
    insumos: ReparacionInsumoView[];
    manoObra: ReparacionManoObraView[];
}

export interface ClienteInput {
    name: string;
    phone: string;
    email?: string;
    docType: string;
    docNumber: string;
    address?: string;
}

export interface VehiculoInput {
    categoryName: string;
    brand: string;
    model?: string;
    year?: number | string;
    notes?: string;
    clientId?: number | null;
    plate?: string;
    vin?: string;
}

export interface VehiculoPatch {
    categoryName?: string;
    brand?: string;
    model?: string;
    year?: number | string;
    notes?: string;
    clientId?: number | null;
    plate?: string;
    vin?: string;
}

export interface ProveedorInput {
    name: string;
    rut: string;
    address?: string;
    phone?: string;
    phone2?: string;
    email?: string;
    notes?: string;
}

export interface ProductInput {
    name: string;
    sku: string;
    quantity?: number;
    minStock?: number;
    measure?: string;
    currency?: string;
    costPrice?: number;
    sellPrice?: number;
    brand?: string;
    model?: string;
    providerName?: string | null;
    categoryName?: string | null;
    description?: string;
}

export interface ProductPatch {
    name?: string;
    sku?: string;
    quantity?: number;
    minStock?: number;
    measure?: string;
    currency?: string;
    costPrice?: number;
    sellPrice?: number;
    brand?: string;
    model?: string;
    providerName?: string | null;
    categoryName?: string | null;
    description?: string;
}

export interface ReparacionInput {
    identificativo: string;
    prioridad: string;
    clienteId: number;
    vehiculoId?: number | null;
    descripcion: string;
}

export interface ReparacionPatch {
    identificativo?: string;
    prioridad?: string;
    clienteId?: number | null;
    vehiculoId?: number | null;
    descripcion?: string;
}

export interface ReparacionInsumoInput {
    productId: number;
    quantity: number;
    extra?: boolean;
}

export interface ReparacionManoObraInput {
    description: string;
    hours?: number;
    amount?: number;
}

export type DependencyModuleKey =
    | 'vehiculo-categorias'
    | 'vehiculos'
    | 'insumo-categorias'
    | 'productos'
    | 'proveedores';

export interface DependencyModuleView {
    key: DependencyModuleKey;
    label: string;
    description: string;
    count: number;
}

export interface DependencyItemDependencyView {
    label: string;
    count: number;
}

export interface DependencyItemView {
    id: number;
    title: string;
    subtitle: string;
    dependencyCount: number;
    canDelete: boolean;
    dependencies: DependencyItemDependencyView[];
}

type VehiculoWithRelations = Prisma.VehiculoGetPayload<{
    include: { category: true; client: true };
}>;

type ProductWithRelations = Prisma.ProductGetPayload<{
    include: { provider: true; category: true };
}>;

type ReparacionWithRelations = Prisma.ReparacionGetPayload<{
    include: { cliente: true; vehiculo: true };
}>;

type ReparacionDetalleRecord = Prisma.ReparacionGetPayload<{
    include: {
        cliente: true;
        vehiculo: true;
        insumos: true;
        manoObra: true;
    };
}>;

const STATUS_TO_LABEL: Record<ReparacionStatus, ReparacionEstado> = {
    SIN_INICIAR: 'Sin Iniciar',
    EN_CURSO: 'En Curso',
    PAUSADO: 'Pausado',
    FINALIZADO: 'Finalizado',
};

const LABEL_TO_STATUS: Record<ReparacionEstado, ReparacionStatus> = {
    'Sin Iniciar': 'SIN_INICIAR',
    'En Curso': 'EN_CURSO',
    Pausado: 'PAUSADO',
    Finalizado: 'FINALIZADO',
};

const PRIORITY_TO_LABEL: Record<ReparacionPriority, ReparacionPrioridad> = {
    BAJA: 'Baja',
    NORMAL: 'Normal',
    ALTA: 'Alta',
    URGENTE: 'Urgente',
};

const ALLOWED_STATUS_TRANSITIONS: Record<ReparacionEstado, ReparacionEstado[]> = {
    'Sin Iniciar': ['En Curso'],
    'En Curso': ['Pausado', 'Finalizado'],
    Pausado: ['En Curso', 'Finalizado'],
    Finalizado: [],
};

const DEPENDENCY_MODULES_META: Record<
    DependencyModuleKey,
    { label: string; description: string }
> = {
    'vehiculo-categorias': {
        label: 'Categorias de vehiculos',
        description: 'Categorias usadas por vehiculos.',
    },
    vehiculos: {
        label: 'Vehiculos',
        description: 'Vehiculos usados por reparaciones.',
    },
    'insumo-categorias': {
        label: 'Categorias de insumos',
        description: 'Categorias usadas por productos.',
    },
    productos: {
        label: 'Productos',
        description: 'Insumos con movimientos y uso en reparaciones.',
    },
    proveedores: {
        label: 'Proveedores',
        description: 'Proveedores asociados a productos.',
    },
};

const DEPENDENCY_MODULE_ORDER: DependencyModuleKey[] = [
    'vehiculo-categorias',
    'vehiculos',
    'insumo-categorias',
    'productos',
    'proveedores',
];

function normalizeText(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function normalizeKey(value: string): string {
    return normalizeText(value).replace(/\s+/g, ' ');
}

function normalizeDoc(value: string): string {
    return normalizeText(value).replace(/[^a-z0-9]/g, '');
}

function normalizeIdentifier(value: string): string {
    return normalizeDoc(value).toUpperCase();
}

function cleanString(value: string | undefined | null): string {
    return (value ?? '').trim();
}

function toInt(value: number | string | undefined | null, fallback = 0): number {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.trunc(numeric);
}

function toNonNegative(value: number | undefined | null, fallback = 0): number {
    if (value === undefined || value === null || !Number.isFinite(value)) return fallback;
    return Math.max(0, Math.trunc(value));
}

function toNonNegativeFloat(value: number | undefined | null, fallback = 0): number {
    if (value === undefined || value === null || !Number.isFinite(value)) return fallback;
    return Math.max(0, value);
}

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

function toDate(value: Date | string): Date {
    return value instanceof Date ? value : new Date(value);
}

function formatDate(value: Date | string): string {
    const date = toDate(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatDateTime(value: Date | string | null): string | undefined {
    if (!value) return undefined;
    const date = toDate(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatSqlDateTime(value: Date | string): string {
    const date = toDate(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatVehiculo(vehiculo: { brand: string; model: string; year: number }): string {
    const base = `${vehiculo.brand} ${vehiculo.model} ${vehiculo.year}`.trim();
    return base.replace(/\s+/g, ' ');
}

function parseYear(value: string | number | undefined): number {
    if (value === undefined || value === null || String(value).trim() === '') {
        return new Date().getFullYear();
    }
    const parsed = toInt(value, new Date().getFullYear());
    if (parsed < 1900 || parsed > new Date().getFullYear() + 1) {
        throw new Error('El anio del vehiculo es invalido.');
    }
    return parsed;
}

function parseDocType(value: string): DocumentType {
    return value === 'CI' ? 'CI' : 'RUT';
}

function parsePriority(value: string | undefined): ReparacionPriority {
    if (value === 'Baja') return 'BAJA';
    if (value === 'Alta') return 'ALTA';
    if (value === 'Urgente') return 'URGENTE';
    return 'NORMAL';
}

function isUniqueConstraintError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function toStatusOrNull(value: string): ReparacionStatus | null {
    return (LABEL_TO_STATUS as Record<string, ReparacionStatus | undefined>)[value] ?? null;
}

function extractUniqueTarget(error: Prisma.PrismaClientKnownRequestError): string {
    const target = error.meta?.target;
    if (Array.isArray(target)) return target.join(',');
    return String(target ?? '');
}

function toCategoryView(category: { id: number; name: string; description: string | null }): CategoryView {
    return {
        id: category.id,
        name: category.name,
        description: category.description ?? '',
    };
}

function toClienteView(cliente: {
    id: number;
    name: string;
    phone: string;
    email: string;
    docType: DocumentType;
    docNumber: string;
    address: string;
    createdAt: Date;
}): ClienteView {
    return {
        id: cliente.id,
        name: cliente.name,
        phone: cliente.phone,
        email: cliente.email,
        docType: cliente.docType,
        docNumber: cliente.docNumber,
        address: cliente.address,
        createdAt: formatSqlDateTime(cliente.createdAt),
    };
}

function toVehiculoView(vehiculo: VehiculoWithRelations): VehiculoView {
    return {
        id: vehiculo.id,
        category: vehiculo.category?.name ?? 'Sin categoria',
        brand: vehiculo.brand,
        model: vehiculo.model,
        year: String(vehiculo.year),
        notes: vehiculo.notes,
        clientId: vehiculo.clientId,
        clientName: vehiculo.client?.name ?? null,
    };
}

function toProveedorView(proveedor: {
    id: number;
    name: string;
    rut: string;
    address: string;
    phone: string;
    phone2: string;
    email: string;
    notes: string;
}): ProveedorView {
    return {
        id: proveedor.id,
        name: proveedor.name,
        rut: proveedor.rut,
        address: proveedor.address,
        phone: proveedor.phone,
        phone2: proveedor.phone2,
        email: proveedor.email,
        notes: proveedor.notes,
    };
}

function toProductView(product: ProductWithRelations): ProductView {
    return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        measure: product.measure,
        minStock: product.minStock,
        currency: product.currency,
        costPrice: product.costPrice,
        sellPrice: product.sellPrice,
        brand: product.brand ?? '',
        model: product.model ?? '',
        provider: product.provider?.name ?? '',
        category: product.category?.name ?? '',
        description: product.description ?? '',
    };
}

function toReparacionView(reparacion: ReparacionWithRelations): ReparacionView {
    const clienteName = (reparacion.cliente?.name ?? reparacion.clienteSnapshot) || 'Sin cliente';
    const vehiculoInfo =
        reparacion.vehiculo
            ? formatVehiculo(reparacion.vehiculo)
            : reparacion.vehiculoSnapshot || 'Sin vehiculo';

    return {
        id: reparacion.id,
        code: reparacion.code,
        identificativo: reparacion.identificativo,
        prioridad: PRIORITY_TO_LABEL[reparacion.priority],
        clienteId: reparacion.clienteId ?? 0,
        clienteName,
        vehiculoId: reparacion.vehiculoId ?? 0,
        vehiculoInfo,
        descripcion: reparacion.description,
        ingreso: formatDate(reparacion.fechaIngreso),
        estado: STATUS_TO_LABEL[reparacion.status],
        fechaInicio: formatDateTime(reparacion.fechaInicio),
        fechaFin: formatDateTime(reparacion.fechaFin),
    };
}

function toReparacionDetalleView(reparacion: ReparacionDetalleRecord): ReparacionDetalleView {
    const base = toReparacionView(reparacion);
    return {
        ...base,
        insumos: reparacion.insumos
            .sort((a, b) => a.id - b.id)
            .map((insumo) => ({
                id: insumo.id,
                productId: insumo.productId,
                productName: insumo.productSnapshot,
                sku: insumo.skuSnapshot,
                measure: insumo.measureSnapshot,
                quantity: insumo.quantity,
                extra: insumo.extra,
                createdAt: formatDateTime(insumo.createdAt) ?? '',
            })),
        manoObra: reparacion.manoObra
            .sort((a, b) => a.id - b.id)
            .map((item) => ({
                id: item.id,
                description: item.description,
                hours: item.hours,
                amount: item.amount,
                createdAt: formatDateTime(item.createdAt) ?? '',
            })),
    };
}

function buildDependencyItemView(
    id: number,
    title: string,
    subtitle: string,
    dependencies: DependencyItemDependencyView[],
): DependencyItemView {
    const normalizedDependencies = dependencies.map((dependency) => ({
        label: cleanString(dependency.label),
        count: Math.max(0, toInt(dependency.count, 0)),
    }));
    const dependencyCount = normalizedDependencies.reduce(
        (total, dependency) => total + dependency.count,
        0,
    );

    return {
        id,
        title: cleanString(title) || `Elemento #${id}`,
        subtitle: cleanString(subtitle),
        dependencyCount,
        canDelete: dependencyCount === 0,
        dependencies: normalizedDependencies,
    };
}

async function listVehicleCategoryDependencyItems(): Promise<DependencyItemView[]> {
    const categories = await prisma.category.findMany({
        where: { type: 'VEHICLE' },
        include: {
            _count: {
                select: { vehicles: true },
            },
        },
        orderBy: { id: 'asc' },
    });

    return categories.map((category) =>
        buildDependencyItemView(
            category.id,
            category.name,
            category.description ?? '',
            [{ label: 'Vehiculos', count: category._count.vehicles }],
        ),
    );
}

async function listVehiculoDependencyItems(): Promise<DependencyItemView[]> {
    const vehiculos = await prisma.vehiculo.findMany({
        include: {
            category: {
                select: { name: true },
            },
            _count: {
                select: { reparaciones: true },
            },
        },
        orderBy: { id: 'asc' },
    });

    return vehiculos.map((vehiculo) =>
        buildDependencyItemView(
            vehiculo.id,
            formatVehiculo({
                brand: vehiculo.brand,
                model: vehiculo.model,
                year: vehiculo.year,
            }),
            vehiculo.category?.name ? `Categoria: ${vehiculo.category.name}` : 'Sin categoria',
            [{ label: 'Reparaciones', count: vehiculo._count.reparaciones }],
        ),
    );
}

async function listProductCategoryDependencyItems(): Promise<DependencyItemView[]> {
    const categories = await prisma.category.findMany({
        where: { type: 'PRODUCT' },
        include: {
            _count: {
                select: { products: true },
            },
        },
        orderBy: { id: 'asc' },
    });

    return categories.map((category) =>
        buildDependencyItemView(
            category.id,
            category.name,
            category.description ?? '',
            [{ label: 'Productos', count: category._count.products }],
        ),
    );
}

async function listProductDependencyItems(): Promise<DependencyItemView[]> {
    const products = await prisma.product.findMany({
        include: {
            provider: {
                select: { name: true },
            },
            category: {
                select: { name: true },
            },
            _count: {
                select: {
                    movements: true,
                    reparacionInsumos: true,
                },
            },
        },
        orderBy: { id: 'asc' },
    });

    return products.map((product) => {
        const subtitleParts = [
            `SKU: ${product.sku}`,
            product.category?.name ? `Categoria: ${product.category.name}` : '',
            product.provider?.name ? `Proveedor: ${product.provider.name}` : '',
        ].filter(Boolean);

        return buildDependencyItemView(product.id, product.name, subtitleParts.join(' | '), [
            { label: 'Movimientos de stock', count: product._count.movements },
            {
                label: 'Usos en reparaciones',
                count: product._count.reparacionInsumos,
            },
        ]);
    });
}

async function listProveedorDependencyItems(): Promise<DependencyItemView[]> {
    const proveedores = await prisma.proveedor.findMany({
        include: {
            _count: {
                select: { products: true },
            },
        },
        orderBy: { id: 'asc' },
    });

    return proveedores.map((proveedor) =>
        buildDependencyItemView(
            proveedor.id,
            proveedor.name,
            proveedor.rut ? `RUT: ${proveedor.rut}` : '',
            [{ label: 'Productos', count: proveedor._count.products }],
        ),
    );
}

async function ensureVehicleCategoryCanBeDeleted(id: number): Promise<void> {
    const [category, vehiclesCount] = await Promise.all([
        prisma.category.findFirst({
            where: { id, type: 'VEHICLE' },
            select: { id: true, name: true },
        }),
        prisma.vehiculo.count({
            where: { categoryId: id },
        }),
    ]);

    if (!category || vehiclesCount === 0) return;

    throw new Error(
        `No se puede eliminar la categoria "${category.name}" porque tiene ${vehiclesCount} vehiculo(s) asociados.`,
    );
}

async function ensureProductCategoryCanBeDeleted(id: number): Promise<void> {
    const [category, productsCount] = await Promise.all([
        prisma.category.findFirst({
            where: { id, type: 'PRODUCT' },
            select: { id: true, name: true },
        }),
        prisma.product.count({
            where: { categoryId: id },
        }),
    ]);

    if (!category || productsCount === 0) return;

    throw new Error(
        `No se puede eliminar la categoria "${category.name}" porque tiene ${productsCount} producto(s) asociados.`,
    );
}

async function ensureVehiculoCanBeDeleted(id: number): Promise<void> {
    const [vehiculo, reparacionesCount] = await Promise.all([
        prisma.vehiculo.findUnique({
            where: { id },
            select: {
                id: true,
                brand: true,
                model: true,
                year: true,
            },
        }),
        prisma.reparacion.count({
            where: { vehiculoId: id },
        }),
    ]);

    if (!vehiculo || reparacionesCount === 0) return;

    throw new Error(
        `No se puede eliminar el vehiculo "${formatVehiculo(vehiculo)}" porque tiene ${reparacionesCount} reparacion(es) asociadas.`,
    );
}

async function ensureProveedorCanBeDeleted(id: number): Promise<void> {
    const [proveedor, productsCount] = await Promise.all([
        prisma.proveedor.findUnique({
            where: { id },
            select: { id: true, name: true },
        }),
        prisma.product.count({
            where: { providerId: id },
        }),
    ]);

    if (!proveedor || productsCount === 0) return;

    throw new Error(
        `No se puede eliminar el proveedor "${proveedor.name}" porque tiene ${productsCount} producto(s) asociados.`,
    );
}

async function ensureProductCanBeDeleted(id: number): Promise<void> {
    const [product, movementsCount, reparacionInsumosCount] = await Promise.all([
        prisma.product.findUnique({
            where: { id },
            select: { id: true, name: true },
        }),
        prisma.stockMovement.count({
            where: { productId: id },
        }),
        prisma.reparacionInsumo.count({
            where: { productId: id },
        }),
    ]);

    if (!product) return;

    const dependencyFragments: string[] = [];
    if (movementsCount > 0) dependencyFragments.push(`${movementsCount} movimiento(s) de stock`);
    if (reparacionInsumosCount > 0)
        dependencyFragments.push(`${reparacionInsumosCount} uso(s) en reparaciones`);

    if (dependencyFragments.length === 0) return;

    throw new Error(
        `No se puede eliminar el producto "${product.name}" porque tiene dependencias: ${dependencyFragments.join(' y ')}.`,
    );
}

async function resolveCategoryId(kind: CategoryKind, name: string): Promise<number> {
    const cleanName = cleanString(name);
    if (!cleanName) throw new Error('La categoria es obligatoria.');

    const category = await prisma.category.findFirst({
        where: {
            type: kind,
            normalizedName: normalizeKey(cleanName),
        },
        select: { id: true },
    });

    if (!category) throw new Error(`La categoria "${cleanName}" no existe.`);
    return category.id;
}

async function findProveedorByName(name: string): Promise<{ id: number; name: string } | null> {
    const cleanName = cleanString(name);
    if (!cleanName) return null;

    const normalized = normalizeKey(cleanName);
    const proveedores = await prisma.proveedor.findMany({
        select: { id: true, name: true },
    });

    return proveedores.find((proveedor) => normalizeKey(proveedor.name) === normalized) ?? null;
}

async function validateVehiculoDuplicate(
    data: {
        categoryId: number | null;
        brand: string;
        model: string;
        year: number;
        clientId: number | null;
    },
    excludeId?: number,
): Promise<void> {
    const candidates = await prisma.vehiculo.findMany({
        where: {
            categoryId: data.categoryId,
            clientId: data.clientId,
            year: data.year,
            ...(excludeId ? { id: { not: excludeId } } : {}),
        },
        select: {
            brand: true,
            model: true,
        },
    });

    const duplicated = candidates.some(
        (vehiculo) =>
            normalizeKey(vehiculo.brand) === normalizeKey(data.brand) &&
            normalizeKey(vehiculo.model) === normalizeKey(data.model),
    );

    if (duplicated) {
        throw new Error('Ya existe un vehiculo con los mismos datos principales.');
    }
}

async function resolveVehiculoClientId(clientId?: number | null): Promise<number | null> {
    if (clientId === undefined || clientId === null) return null;

    const cliente = await prisma.cliente.findUnique({
        where: { id: clientId },
        select: { id: true },
    });
    if (!cliente) throw new Error('El cliente seleccionado no existe.');

    return clientId;
}

async function validateProductSkuUniqueness(sku: string, excludeId?: number): Promise<void> {
    const normalizedSku = normalizeKey(sku);
    if (!normalizedSku) throw new Error('El SKU es obligatorio.');

    const duplicated = await prisma.product.findFirst({
        where: {
            normalizedSku,
            ...(excludeId ? { id: { not: excludeId } } : {}),
        },
        select: { id: true },
    });
    if (duplicated) throw new Error('Ya existe un producto con ese codigo.');
}

async function resolveProviderIdByName(name: string | null): Promise<number | null> {
    if (name === null) return null;

    const cleanName = cleanString(name);
    if (!cleanName) return null;

    const proveedor = await findProveedorByName(cleanName);
    if (!proveedor) throw new Error(`El proveedor "${cleanName}" no existe.`);

    return proveedor.id;
}

async function resolveProductCategoryIdByName(name: string | null): Promise<number | null> {
    if (name === null) return null;

    const cleanName = cleanString(name);
    if (!cleanName) return null;

    const category = await prisma.category.findFirst({
        where: {
            type: 'PRODUCT',
            normalizedName: normalizeKey(cleanName),
        },
        select: { id: true },
    });

    if (!category) throw new Error(`La categoria "${cleanName}" no existe.`);
    return category.id;
}

async function registerStockMovement(
    tx: DbClient,
    productId: number,
    before: number,
    after: number,
    reason: string,
): Promise<void> {
    if (before === after) return;
    const diff = after - before;

    await tx.stockMovement.create({
        data: {
            productId,
            type: diff >= 0 ? 'IN' : 'OUT',
            amount: Math.abs(diff),
            reason,
        },
    });
}

async function ensureReparacionReferences(
    clienteId: number | null,
    vehiculoId: number | null,
): Promise<{
    cliente: { id: number; name: string } | null;
    vehiculo: { id: number; brand: string; model: string; year: number; clientId: number | null } | null;
}> {
    let cliente: { id: number; name: string } | null = null;
    let vehiculo: { id: number; brand: string; model: string; year: number; clientId: number | null } | null = null;

    if (clienteId !== null) {
        const found = await prisma.cliente.findUnique({
            where: { id: clienteId },
            select: { id: true, name: true },
        });
        if (!found) throw new Error('El cliente seleccionado no existe.');
        cliente = found;
    }

    if (vehiculoId !== null) {
        const found = await prisma.vehiculo.findUnique({
            where: { id: vehiculoId },
            select: { id: true, brand: true, model: true, year: true, clientId: true },
        });
        if (!found) throw new Error('El vehiculo seleccionado no existe.');
        vehiculo = found;
    }

    if (cliente && vehiculo && vehiculo.clientId !== null && vehiculo.clientId !== cliente.id) {
        throw new Error('El vehiculo no pertenece al cliente seleccionado.');
    }

    return { cliente, vehiculo };
}

async function generateReparacionCode(): Promise<string> {
    while (true) {
        const code = `${Date.now()}${Math.floor(Math.random() * 90 + 10)}`;
        const exists = await prisma.reparacion.findUnique({
            where: { code },
            select: { id: true },
        });
        if (!exists) return code;
    }
}

async function getReparacionDetalleRecord(
    id: number,
    tx: DbClient = prisma,
): Promise<ReparacionDetalleRecord | null> {
    return tx.reparacion.findUnique({
        where: { id },
        include: {
            cliente: true,
            vehiculo: true,
            insumos: { orderBy: { id: 'asc' } },
            manoObra: { orderBy: { id: 'asc' } },
        },
    });
}

export async function listProductCategories(): Promise<CategoryView[]> {
    const categories = await prisma.category.findMany({
        where: { type: 'PRODUCT' },
        orderBy: { id: 'asc' },
        select: { id: true, name: true, description: true },
    });
    return categories.map(toCategoryView);
}

export async function listVehicleCategories(): Promise<CategoryView[]> {
    const categories = await prisma.category.findMany({
        where: { type: 'VEHICLE' },
        orderBy: { id: 'asc' },
        select: { id: true, name: true, description: true },
    });
    return categories.map(toCategoryView);
}

export async function listDependencyModules(): Promise<DependencyModuleView[]> {
    const [
        vehicleCategoryCount,
        vehiculoCount,
        insumoCategoryCount,
        productCount,
        proveedorCount,
    ] = await Promise.all([
        prisma.category.count({ where: { type: 'VEHICLE' } }),
        prisma.vehiculo.count(),
        prisma.category.count({ where: { type: 'PRODUCT' } }),
        prisma.product.count(),
        prisma.proveedor.count(),
    ]);

    const countByModule: Record<DependencyModuleKey, number> = {
        'vehiculo-categorias': vehicleCategoryCount,
        vehiculos: vehiculoCount,
        'insumo-categorias': insumoCategoryCount,
        productos: productCount,
        proveedores: proveedorCount,
    };

    return DEPENDENCY_MODULE_ORDER.map((key) => ({
        key,
        label: DEPENDENCY_MODULES_META[key].label,
        description: DEPENDENCY_MODULES_META[key].description,
        count: countByModule[key],
    }));
}

export async function listDependencyItems(moduleKey: DependencyModuleKey): Promise<DependencyItemView[]> {
    switch (moduleKey) {
        case 'vehiculo-categorias':
            return listVehicleCategoryDependencyItems();
        case 'vehiculos':
            return listVehiculoDependencyItems();
        case 'insumo-categorias':
            return listProductCategoryDependencyItems();
        case 'productos':
            return listProductDependencyItems();
        case 'proveedores':
            return listProveedorDependencyItems();
        default:
            return [];
    }
}

export async function deleteDependencyItem(moduleKey: DependencyModuleKey, id: number): Promise<void> {
    switch (moduleKey) {
        case 'vehiculo-categorias':
            await deleteVehicleCategory(id);
            return;
        case 'vehiculos':
            await deleteVehiculo(id);
            return;
        case 'insumo-categorias':
            await deleteProductCategory(id);
            return;
        case 'productos':
            await deleteProduct(id);
            return;
        case 'proveedores':
            await deleteProveedor(id);
            return;
        default:
            return;
    }
}

async function createCategory(
    kind: CategoryType,
    name: string,
    description: string,
): Promise<CategoryView> {
    const cleanName = cleanString(name);
    if (!cleanName) throw new Error('El nombre de la categoria es obligatorio.');

    const normalizedName = normalizeKey(cleanName);
    const duplicated = await prisma.category.findFirst({
        where: {
            type: kind,
            normalizedName,
        },
        select: { id: true },
    });
    if (duplicated) throw new Error('Ya existe una categoria con ese nombre.');

    const category = await prisma.category.create({
        data: {
            type: kind,
            name: cleanName,
            normalizedName,
            description: cleanString(description),
        },
        select: { id: true, name: true, description: true },
    });

    return toCategoryView(category);
}

async function updateCategory(
    kind: CategoryType,
    id: number,
    name: string,
    description: string,
): Promise<CategoryView | null> {
    const existing = await prisma.category.findFirst({
        where: { id, type: kind },
        select: { id: true },
    });
    if (!existing) return null;

    const cleanName = cleanString(name);
    if (!cleanName) throw new Error('El nombre de la categoria es obligatorio.');

    const normalizedName = normalizeKey(cleanName);
    const duplicated = await prisma.category.findFirst({
        where: {
            type: kind,
            normalizedName,
            id: { not: id },
        },
        select: { id: true },
    });
    if (duplicated) throw new Error('Ya existe una categoria con ese nombre.');

    const updated = await prisma.category.update({
        where: { id },
        data: {
            name: cleanName,
            normalizedName,
            description: cleanString(description),
        },
        select: { id: true, name: true, description: true },
    });

    return toCategoryView(updated);
}

async function deleteCategory(kind: CategoryType, id: number): Promise<void> {
    if (kind === 'VEHICLE') {
        await ensureVehicleCategoryCanBeDeleted(id);
    } else {
        await ensureProductCategoryCanBeDeleted(id);
    }

    await prisma.category.deleteMany({
        where: { id, type: kind },
    });
}

export async function createProductCategory(name: string, description: string): Promise<CategoryView> {
    return createCategory('PRODUCT', name, description);
}

export async function updateProductCategory(
    id: number,
    name: string,
    description: string,
): Promise<CategoryView | null> {
    return updateCategory('PRODUCT', id, name, description);
}

export async function deleteProductCategory(id: number): Promise<void> {
    await deleteCategory('PRODUCT', id);
}

export async function createVehicleCategory(name: string, description: string): Promise<CategoryView> {
    return createCategory('VEHICLE', name, description);
}

export async function updateVehicleCategory(
    id: number,
    name: string,
    description: string,
): Promise<CategoryView | null> {
    return updateCategory('VEHICLE', id, name, description);
}

export async function deleteVehicleCategory(id: number): Promise<void> {
    await deleteCategory('VEHICLE', id);
}

async function validateClienteUniqueness(input: ClienteInput, excludeId?: number): Promise<void> {
    const docType = parseDocType(input.docType);
    const normalizedDocNumber = normalizeDoc(input.docNumber);
    if (!normalizedDocNumber) throw new Error('El documento es obligatorio.');

    const duplicatedDoc = await prisma.cliente.findFirst({
        where: {
            docType,
            normalizedDocNumber,
            ...(excludeId ? { id: { not: excludeId } } : {}),
        },
        select: { id: true },
    });
    if (duplicatedDoc) {
        throw new Error('Ya existe un cliente con ese documento.');
    }

    const normalizedEmail = normalizeKey(input.email ?? '');
    if (!normalizedEmail) return;

    const duplicatedEmail = await prisma.cliente.findFirst({
        where: {
            normalizedEmail,
            ...(excludeId ? { id: { not: excludeId } } : {}),
        },
        select: { id: true },
    });
    if (duplicatedEmail) {
        throw new Error('Ya existe un cliente con ese email.');
    }
}

export async function listClientes(): Promise<ClienteView[]> {
    const clientes = await prisma.cliente.findMany({
        orderBy: { id: 'asc' },
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            docType: true,
            docNumber: true,
            address: true,
            createdAt: true,
        },
    });
    return clientes.map(toClienteView);
}

export async function createCliente(input: ClienteInput): Promise<ClienteView> {
    const name = cleanString(input.name);
    const phone = cleanString(input.phone);
    const docNumber = cleanString(input.docNumber);

    if (!name) throw new Error('El nombre del cliente es obligatorio.');
    if (!phone) throw new Error('El telefono del cliente es obligatorio.');
    if (!docNumber) throw new Error('El documento del cliente es obligatorio.');

    await validateClienteUniqueness(input);

    const email = cleanString(input.email);
    const cliente = await prisma.cliente.create({
        data: {
            name,
            phone,
            email,
            normalizedEmail: email ? normalizeKey(email) : null,
            docType: parseDocType(input.docType),
            docNumber,
            normalizedDocNumber: normalizeDoc(docNumber),
            address: cleanString(input.address),
        },
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            docType: true,
            docNumber: true,
            address: true,
            createdAt: true,
        },
    });

    return toClienteView(cliente);
}

export async function updateCliente(id: number, input: ClienteInput): Promise<ClienteView | null> {
    const existing = await prisma.cliente.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!existing) return null;

    const name = cleanString(input.name);
    const phone = cleanString(input.phone);
    const docNumber = cleanString(input.docNumber);

    if (!name) throw new Error('El nombre del cliente es obligatorio.');
    if (!phone) throw new Error('El telefono del cliente es obligatorio.');
    if (!docNumber) throw new Error('El documento del cliente es obligatorio.');

    await validateClienteUniqueness(input, id);

    const email = cleanString(input.email);
    const cliente = await prisma.cliente.update({
        where: { id },
        data: {
            name,
            phone,
            email,
            normalizedEmail: email ? normalizeKey(email) : null,
            docType: parseDocType(input.docType),
            docNumber,
            normalizedDocNumber: normalizeDoc(docNumber),
            address: cleanString(input.address),
        },
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            docType: true,
            docNumber: true,
            address: true,
            createdAt: true,
        },
    });

    return toClienteView(cliente);
}

export async function deleteCliente(id: number): Promise<void> {
    await prisma.cliente.deleteMany({
        where: { id },
    });
}

export async function listVehiculos(): Promise<VehiculoView[]> {
    const vehiculos = await prisma.vehiculo.findMany({
        include: {
            category: true,
            client: true,
        },
        orderBy: { id: 'asc' },
    });
    return vehiculos.map(toVehiculoView);
}

export async function createVehiculo(input: VehiculoInput): Promise<VehiculoView> {
    const brand = cleanString(input.brand);
    if (!brand) throw new Error('La marca del vehiculo es obligatoria.');

    const categoryId = await resolveCategoryId('VEHICLE', input.categoryName);
    const year = parseYear(input.year);
    const clientId = await resolveVehiculoClientId(input.clientId);
    const model = cleanString(input.model);
    const notes = cleanString(input.notes);
    const plate = cleanString(input.plate);
    const vin = cleanString(input.vin);

    await validateVehiculoDuplicate({ categoryId, brand, model, year, clientId });

    try {
        const vehiculo = await prisma.vehiculo.create({
            data: {
                categoryId,
                brand,
                model,
                year,
                notes,
                clientId,
                plate: plate || null,
                normalizedPlate: plate ? normalizeIdentifier(plate) : null,
                vin: vin || null,
                normalizedVin: vin ? normalizeIdentifier(vin) : null,
            },
            include: {
                category: true,
                client: true,
            },
        });
        return toVehiculoView(vehiculo);
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new Error('Ya existe un vehiculo con esa matricula o VIN.');
        }
        throw error;
    }
}

export async function updateVehiculo(id: number, patch: VehiculoPatch): Promise<VehiculoView | null> {
    const vehiculo = await prisma.vehiculo.findUnique({
        where: { id },
    });
    if (!vehiculo) return null;

    const nextCategoryId =
        patch.categoryName !== undefined
            ? await resolveCategoryId('VEHICLE', patch.categoryName)
            : vehiculo.categoryId;
    const nextBrand =
        patch.brand !== undefined ? cleanString(patch.brand) || vehiculo.brand : vehiculo.brand;
    if (!nextBrand) throw new Error('La marca del vehiculo es obligatoria.');

    const nextModel = patch.model !== undefined ? cleanString(patch.model) : vehiculo.model;
    const nextYear = patch.year !== undefined ? parseYear(patch.year) : vehiculo.year;
    const nextNotes = patch.notes !== undefined ? cleanString(patch.notes) : vehiculo.notes;
    const nextClientId =
        patch.clientId !== undefined ? await resolveVehiculoClientId(patch.clientId) : vehiculo.clientId;
    const nextPlate = patch.plate !== undefined ? cleanString(patch.plate) : vehiculo.plate ?? '';
    const nextVin = patch.vin !== undefined ? cleanString(patch.vin) : vehiculo.vin ?? '';

    await validateVehiculoDuplicate(
        {
            categoryId: nextCategoryId,
            brand: nextBrand,
            model: nextModel,
            year: nextYear,
            clientId: nextClientId,
        },
        id,
    );

    try {
        const updated = await prisma.vehiculo.update({
            where: { id },
            data: {
                categoryId: nextCategoryId,
                brand: nextBrand,
                model: nextModel,
                year: nextYear,
                notes: nextNotes,
                clientId: nextClientId,
                plate: nextPlate || null,
                normalizedPlate: nextPlate ? normalizeIdentifier(nextPlate) : null,
                vin: nextVin || null,
                normalizedVin: nextVin ? normalizeIdentifier(nextVin) : null,
            },
            include: {
                category: true,
                client: true,
            },
        });
        return toVehiculoView(updated);
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new Error('Ya existe un vehiculo con esa matricula o VIN.');
        }
        throw error;
    }
}

export async function deleteVehiculo(id: number): Promise<void> {
    await ensureVehiculoCanBeDeleted(id);

    await prisma.vehiculo.deleteMany({
        where: { id },
    });
}

async function validateProveedorUniqueness(input: ProveedorInput, excludeId?: number): Promise<void> {
    const rut = cleanString(input.rut);
    if (!rut) throw new Error('El RUT del proveedor es obligatorio.');

    const duplicated = await prisma.proveedor.findFirst({
        where: {
            normalizedRut: normalizeDoc(rut),
            ...(excludeId ? { id: { not: excludeId } } : {}),
        },
        select: { id: true },
    });
    if (duplicated) throw new Error('Ya existe un proveedor con ese RUT.');
}

export async function listProveedores(): Promise<ProveedorView[]> {
    const proveedores = await prisma.proveedor.findMany({
        orderBy: { id: 'asc' },
        select: {
            id: true,
            name: true,
            rut: true,
            address: true,
            phone: true,
            phone2: true,
            email: true,
            notes: true,
        },
    });
    return proveedores.map(toProveedorView);
}

export async function createProveedor(input: ProveedorInput): Promise<ProveedorView> {
    const name = cleanString(input.name);
    const rut = cleanString(input.rut);
    if (!name) throw new Error('El nombre del proveedor es obligatorio.');
    if (!rut) throw new Error('El RUT del proveedor es obligatorio.');

    await validateProveedorUniqueness(input);

    const proveedor = await prisma.proveedor.create({
        data: {
            name,
            rut,
            normalizedRut: normalizeDoc(rut),
            address: cleanString(input.address),
            phone: cleanString(input.phone),
            phone2: cleanString(input.phone2),
            email: cleanString(input.email),
            notes: cleanString(input.notes),
        },
        select: {
            id: true,
            name: true,
            rut: true,
            address: true,
            phone: true,
            phone2: true,
            email: true,
            notes: true,
        },
    });

    return toProveedorView(proveedor);
}

export async function updateProveedor(id: number, input: ProveedorInput): Promise<ProveedorView | null> {
    const existing = await prisma.proveedor.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!existing) return null;

    const name = cleanString(input.name);
    const rut = cleanString(input.rut);
    if (!name) throw new Error('El nombre del proveedor es obligatorio.');
    if (!rut) throw new Error('El RUT del proveedor es obligatorio.');

    await validateProveedorUniqueness(input, id);

    const proveedor = await prisma.proveedor.update({
        where: { id },
        data: {
            name,
            rut,
            normalizedRut: normalizeDoc(rut),
            address: cleanString(input.address),
            phone: cleanString(input.phone),
            phone2: cleanString(input.phone2),
            email: cleanString(input.email),
            notes: cleanString(input.notes),
        },
        select: {
            id: true,
            name: true,
            rut: true,
            address: true,
            phone: true,
            phone2: true,
            email: true,
            notes: true,
        },
    });

    return toProveedorView(proveedor);
}

export async function deleteProveedor(id: number): Promise<void> {
    await ensureProveedorCanBeDeleted(id);

    await prisma.proveedor.deleteMany({
        where: { id },
    });
}

export async function listProducts(): Promise<ProductView[]> {
    const products = await prisma.product.findMany({
        include: {
            provider: true,
            category: true,
        },
        orderBy: { id: 'asc' },
    });

    return products.map(toProductView);
}

export async function createProduct(input: ProductInput): Promise<ProductView> {
    const name = cleanString(input.name);
    const sku = cleanString(input.sku);
    if (!name) throw new Error('El nombre del producto es obligatorio.');
    if (!sku) throw new Error('El codigo del producto es obligatorio.');

    await validateProductSkuUniqueness(sku);

    const quantity = toNonNegative(toInt(input.quantity, 0), 0);
    const providerId = await resolveProviderIdByName(input.providerName ?? null);
    const categoryId = await resolveProductCategoryIdByName(input.categoryName ?? null);

    const created = await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
            data: {
                name,
                sku,
                normalizedSku: normalizeKey(sku),
                quantity,
                minStock: toNonNegative(toInt(input.minStock, 0), 0),
                measure: cleanString(input.measure) || 'Unidades',
                currency: cleanString(input.currency) || '$U',
                costPrice: toNonNegativeFloat(input.costPrice, 0),
                sellPrice: toNonNegativeFloat(input.sellPrice, 0),
                brand: cleanString(input.brand),
                model: cleanString(input.model),
                providerId,
                categoryId,
                description: cleanString(input.description),
            },
            include: {
                provider: true,
                category: true,
            },
        });

        await registerStockMovement(tx, product.id, 0, quantity, 'INITIAL_STOCK');
        return product;
    });

    return toProductView(created);
}

export async function updateProduct(id: number, patch: ProductPatch): Promise<ProductView | null> {
    const product = await prisma.product.findUnique({
        where: { id },
    });
    if (!product) return null;

    const data: Prisma.ProductUncheckedUpdateInput = {};
    let hasChanges = false;
    let nextQuantity = product.quantity;

    if (patch.name !== undefined) {
        const next = cleanString(patch.name);
        if (!next) throw new Error('El nombre del producto es obligatorio.');
        if (next !== product.name) {
            data.name = next;
            hasChanges = true;
        }
    }

    if (patch.sku !== undefined) {
        const next = cleanString(patch.sku);
        if (!next) throw new Error('El codigo del producto es obligatorio.');
        await validateProductSkuUniqueness(next, id);
        if (next !== product.sku) {
            data.sku = next;
            data.normalizedSku = normalizeKey(next);
            hasChanges = true;
        }
    }

    if (patch.quantity !== undefined) {
        const next = toNonNegative(toInt(patch.quantity, product.quantity), product.quantity);
        if (next !== product.quantity) {
            data.quantity = next;
            nextQuantity = next;
            hasChanges = true;
        }
    }

    if (patch.minStock !== undefined) {
        const next = toNonNegative(toInt(patch.minStock, product.minStock), product.minStock);
        if (next !== product.minStock) {
            data.minStock = next;
            hasChanges = true;
        }
    }

    if (patch.measure !== undefined) {
        const next = cleanString(patch.measure) || product.measure;
        if (next !== product.measure) {
            data.measure = next;
            hasChanges = true;
        }
    }

    if (patch.currency !== undefined) {
        const next = cleanString(patch.currency) || product.currency;
        if (next !== product.currency) {
            data.currency = next;
            hasChanges = true;
        }
    }

    if (patch.costPrice !== undefined) {
        const next = toNonNegativeFloat(patch.costPrice, product.costPrice);
        if (next !== product.costPrice) {
            data.costPrice = next;
            hasChanges = true;
        }
    }

    if (patch.sellPrice !== undefined) {
        const next = toNonNegativeFloat(patch.sellPrice, product.sellPrice);
        if (next !== product.sellPrice) {
            data.sellPrice = next;
            hasChanges = true;
        }
    }

    if (patch.brand !== undefined) {
        const next = cleanString(patch.brand);
        if (next !== (product.brand ?? '')) {
            data.brand = next;
            hasChanges = true;
        }
    }

    if (patch.model !== undefined) {
        const next = cleanString(patch.model);
        if (next !== (product.model ?? '')) {
            data.model = next;
            hasChanges = true;
        }
    }

    if (patch.description !== undefined) {
        const next = cleanString(patch.description);
        if (next !== (product.description ?? '')) {
            data.description = next;
            hasChanges = true;
        }
    }

    if (patch.providerName !== undefined) {
        const nextProviderId = await resolveProviderIdByName(patch.providerName);
        if (nextProviderId !== product.providerId) {
            data.providerId = nextProviderId;
            hasChanges = true;
        }
    }

    if (patch.categoryName !== undefined) {
        const nextCategoryId = await resolveProductCategoryIdByName(patch.categoryName);
        if (nextCategoryId !== product.categoryId) {
            data.categoryId = nextCategoryId;
            hasChanges = true;
        }
    }

    if (!hasChanges) {
        const unchanged = await prisma.product.findUnique({
            where: { id },
            include: {
                provider: true,
                category: true,
            },
        });
        return unchanged ? toProductView(unchanged) : null;
    }

    const updated = await prisma.$transaction(async (tx) => {
        const next = await tx.product.update({
            where: { id },
            data: {
                ...data,
                version: { increment: 1 },
            },
            include: {
                provider: true,
                category: true,
            },
        });

        await registerStockMovement(tx, id, product.quantity, nextQuantity, 'MANUAL_UPDATE');
        return next;
    });

    return toProductView(updated);
}

export async function deleteProduct(id: number): Promise<void> {
    await ensureProductCanBeDeleted(id);

    await prisma.product.deleteMany({
        where: { id },
    });
}

export async function listReparaciones(): Promise<ReparacionView[]> {
    const reparaciones = await prisma.reparacion.findMany({
        include: {
            cliente: true,
            vehiculo: true,
        },
        orderBy: { id: 'asc' },
    });

    return reparaciones.map(toReparacionView);
}

export async function listReparacionesByEstado(estado?: string): Promise<ReparacionView[]> {
    if (!estado) return listReparaciones();

    const where: Prisma.ReparacionWhereInput =
        estado === 'activas'
            ? { status: { not: 'FINALIZADO' } }
            : (() => {
                  const status = toStatusOrNull(estado);
                  return status ? { status } : { id: -1 };
              })();

    const reparaciones = await prisma.reparacion.findMany({
        where,
        include: {
            cliente: true,
            vehiculo: true,
        },
        orderBy: { id: 'asc' },
    });

    return reparaciones.map(toReparacionView);
}

export async function getReparacionDetalle(id: number): Promise<ReparacionDetalleView | null> {
    const reparacion = await getReparacionDetalleRecord(id);
    if (!reparacion) return null;
    return toReparacionDetalleView(reparacion);
}

export async function addReparacionInsumo(
    id: number,
    input: ReparacionInsumoInput,
): Promise<ReparacionDetalleView | null> {
    const reparacion = await prisma.reparacion.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!reparacion) return null;

    const productId = toInt(input.productId, 0);
    const quantity = toInt(input.quantity, 0);

    if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error('La cantidad debe ser mayor a cero.');
    }

    const updatedDetalle = await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id: productId },
        });
        if (!product) throw new Error('El producto seleccionado no existe.');

        if (product.quantity < quantity) {
            throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.quantity}.`);
        }

        const nextQuantity = product.quantity - quantity;
        await tx.product.update({
            where: { id: product.id },
            data: {
                quantity: nextQuantity,
                version: { increment: 1 },
            },
        });

        await registerStockMovement(
            tx,
            product.id,
            product.quantity,
            nextQuantity,
            input.extra ? `REPARACION_${id}_EXTRA` : `REPARACION_${id}`,
        );

        await tx.reparacionInsumo.create({
            data: {
                reparacionId: id,
                productId: product.id,
                productSnapshot: product.name,
                skuSnapshot: product.sku,
                measureSnapshot: product.measure,
                quantity,
                extra: Boolean(input.extra),
            },
        });

        await tx.reparacion.update({
            where: { id },
            data: {
                version: { increment: 1 },
            },
        });

        const detalle = await getReparacionDetalleRecord(id, tx);
        if (!detalle) throw new Error('No se pudo cargar la reparacion actualizada.');
        return detalle;
    });

    return toReparacionDetalleView(updatedDetalle);
}

export async function addReparacionManoObra(
    id: number,
    input: ReparacionManoObraInput,
): Promise<ReparacionDetalleView | null> {
    const reparacion = await prisma.reparacion.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!reparacion) return null;

    const description = cleanString(input.description);
    if (!description) throw new Error('La descripcion de la mano de obra es obligatoria.');

    const hours = Math.max(0, toNonNegativeFloat(input.hours ?? 0, 0));
    const amount = Math.max(0, toNonNegativeFloat(input.amount ?? 0, 0));

    const updatedDetalle = await prisma.$transaction(async (tx) => {
        await tx.reparacionManoObra.create({
            data: {
                reparacionId: id,
                description,
                hours,
                amount,
            },
        });

        await tx.reparacion.update({
            where: { id },
            data: {
                version: { increment: 1 },
            },
        });

        const detalle = await getReparacionDetalleRecord(id, tx);
        if (!detalle) throw new Error('No se pudo cargar la reparacion actualizada.');
        return detalle;
    });

    return toReparacionDetalleView(updatedDetalle);
}

export async function createReparacion(input: ReparacionInput): Promise<ReparacionView> {
    const identificativo = cleanString(input.identificativo);
    const descripcion = cleanString(input.descripcion);
    if (!identificativo) throw new Error('El identificativo es obligatorio.');
    if (!descripcion) throw new Error('La descripcion es obligatoria.');

    const clienteId = toInt(input.clienteId, 0);
    if (!clienteId) throw new Error('Debe seleccionar un cliente.');

    const vehiculoId = input.vehiculoId ? toInt(input.vehiculoId, 0) : 0;
    const references = await ensureReparacionReferences(clienteId, vehiculoId || null);

    for (let attempt = 0; attempt < 5; attempt += 1) {
        const code = await generateReparacionCode();
        try {
            const reparacion = await prisma.$transaction(async (tx) => {
                const created = await tx.reparacion.create({
                    data: {
                        code,
                        identificativo,
                        description: descripcion,
                        priority: parsePriority(input.prioridad),
                        clienteId: clienteId || null,
                        vehiculoId: vehiculoId || null,
                        clienteSnapshot: references.cliente?.name ?? '',
                        vehiculoSnapshot: references.vehiculo
                            ? formatVehiculo(references.vehiculo)
                            : '',
                        status: 'SIN_INICIAR',
                    },
                    include: {
                        cliente: true,
                        vehiculo: true,
                    },
                });

                await tx.reparacionHistory.create({
                    data: {
                        reparacionId: created.id,
                        status: 'SIN_INICIAR',
                    },
                });

                return created;
            });

            return toReparacionView(reparacion);
        } catch (error) {
            if (isUniqueConstraintError(error) && extractUniqueTarget(error).includes('code')) {
                continue;
            }
            throw error;
        }
    }

    throw new Error('No se pudo generar un codigo unico para la reparacion.');
}

export async function updateReparacion(
    id: number,
    patch: ReparacionPatch,
): Promise<ReparacionView | null> {
    const reparacion = await prisma.reparacion.findUnique({
        where: { id },
    });
    if (!reparacion) return null;

    const nextClienteId =
        patch.clienteId !== undefined ? (patch.clienteId ? toInt(patch.clienteId, 0) : null) : reparacion.clienteId;
    const nextVehiculoId =
        patch.vehiculoId !== undefined ? (patch.vehiculoId ? toInt(patch.vehiculoId, 0) : null) : reparacion.vehiculoId;

    const references = await ensureReparacionReferences(nextClienteId, nextVehiculoId);

    const nextIdentificativo =
        patch.identificativo !== undefined
            ? cleanString(patch.identificativo) || reparacion.identificativo
            : reparacion.identificativo;
    const nextDescripcion =
        patch.descripcion !== undefined
            ? cleanString(patch.descripcion) || reparacion.description
            : reparacion.description;

    const updated = await prisma.reparacion.update({
        where: { id },
        data: {
            identificativo: nextIdentificativo,
            description: nextDescripcion,
            priority: patch.prioridad !== undefined ? parsePriority(patch.prioridad) : reparacion.priority,
            clienteId: nextClienteId,
            vehiculoId: nextVehiculoId,
            clienteSnapshot: references.cliente?.name ?? reparacion.clienteSnapshot,
            vehiculoSnapshot: references.vehiculo
                ? formatVehiculo(references.vehiculo)
                : reparacion.vehiculoSnapshot,
            version: { increment: 1 },
        },
        include: {
            cliente: true,
            vehiculo: true,
        },
    });

    return toReparacionView(updated);
}

export async function deleteReparacion(id: number): Promise<void> {
    await prisma.reparacion.deleteMany({
        where: { id },
    });
}

export async function updateReparacionEstado(
    id: number,
    nuevoEstado: ReparacionEstado,
): Promise<void> {
    const reparacion = await prisma.reparacion.findUnique({
        where: { id },
        select: {
            id: true,
            status: true,
            fechaInicio: true,
        },
    });
    if (!reparacion) return;

    const estadoActual = STATUS_TO_LABEL[reparacion.status];
    if (!ALLOWED_STATUS_TRANSITIONS[estadoActual].includes(nuevoEstado)) return;
    if (estadoActual === nuevoEstado) return;

    const nextStatus = LABEL_TO_STATUS[nuevoEstado];
    const now = new Date();

    const data: Prisma.ReparacionUpdateInput = {
        status: nextStatus,
        version: { increment: 1 },
    };

    if (nuevoEstado === 'En Curso' && !reparacion.fechaInicio) data.fechaInicio = now;
    if (nuevoEstado === 'Finalizado') data.fechaFin = now;

    await prisma.$transaction(async (tx) => {
        await tx.reparacion.update({
            where: { id },
            data,
        });

        await tx.reparacionHistory.create({
            data: {
                reparacionId: id,
                status: nextStatus,
            },
        });
    });
}
