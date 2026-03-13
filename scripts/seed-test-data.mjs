import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';

const prisma = new PrismaClient();

function normalizeText(value) {
    return value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function normalizeDoc(value) {
    return normalizeText(value).replace(/[^a-z0-9]/g, '');
}

function normalizeIdentifier(value) {
    return normalizeDoc(value).toUpperCase();
}

function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const key = scryptSync(password, salt, 64).toString('hex');
    return `scrypt$${salt}$${key}`;
}

function daysAgo(days) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function formatVehiculoSnapshot(vehiculo) {
    return `${vehiculo.brand} ${vehiculo.model} ${vehiculo.year}`.trim().replace(/\s+/g, ' ');
}

async function main() {
    const vehicleCategoryDefs = [
        { key: 'veh_bus', name: 'TST Bus Urbano', description: 'Categoria de prueba para buses.' },
        { key: 'veh_camion', name: 'TST Camion Pesado', description: 'Categoria de prueba para camiones.' },
        { key: 'veh_utilitario', name: 'TST Utilitario', description: 'Categoria de prueba para utilitarios.' },
    ];

    const productCategoryDefs = [
        { key: 'cat_filtros', name: 'TST Filtros', description: 'Categoria test para filtros.' },
        { key: 'cat_frenos', name: 'TST Frenos', description: 'Categoria test para frenos.' },
        { key: 'cat_lubricantes', name: 'TST Lubricantes', description: 'Categoria test para lubricantes.' },
        { key: 'cat_mecanica', name: 'TST Mecanica', description: 'Categoria test para mecanica general.' },
    ];

    const providerDefs = [
        {
            key: 'prov_andina',
            name: 'TST Proveedor Andina',
            rut: '219000100012',
            address: 'Ruta 1 KM 20',
            phone: '098111111',
            phone2: '098111112',
            email: 'andina.test@example.com',
            notes: 'Proveedor de prueba principal.',
        },
        {
            key: 'prov_sur',
            name: 'TST Repuestos del Sur',
            rut: '219000100013',
            address: 'Av. Sur 2450',
            phone: '098222221',
            phone2: '',
            email: 'sur.test@example.com',
            notes: 'Proveedor de prueba secundario.',
        },
        {
            key: 'prov_norte',
            name: 'TST Industrial Norte',
            rut: '219000100014',
            address: 'Cno. Norte 1180',
            phone: '098333331',
            phone2: '',
            email: 'norte.test@example.com',
            notes: 'Proveedor de prueba para mecanica.',
        },
    ];

    const clientDefs = [
        {
            key: 'cli_delta',
            name: 'TST Transporte Delta',
            phone: '099100001',
            email: 'delta.test@example.com',
            docType: 'RUT',
            docNumber: '219000200011',
            address: 'Montevideo',
        },
        {
            key: 'cli_oeste',
            name: 'TST Logistica Oeste',
            phone: '099100002',
            email: 'oeste.test@example.com',
            docType: 'RUT',
            docNumber: '219000200012',
            address: 'Canelones',
        },
        {
            key: 'cli_perez',
            name: 'TST Maria Perez',
            phone: '099100003',
            email: 'maria.test@example.com',
            docType: 'CI',
            docNumber: '45678901',
            address: 'San Jose',
        },
    ];

    const vehicleDefs = [
        {
            key: 'veh_001',
            categoryKey: 'veh_bus',
            clientKey: 'cli_delta',
            brand: 'Mercedes-Benz',
            model: 'OF-1721',
            year: 2021,
            notes: 'Unidad de prueba para rutas urbanas.',
            plate: 'TST-001',
            vin: 'TSTVIN00000000001',
        },
        {
            key: 'veh_002',
            categoryKey: 'veh_camion',
            clientKey: 'cli_oeste',
            brand: 'Volvo',
            model: 'FH16',
            year: 2023,
            notes: 'Unidad de carga pesada para test.',
            plate: 'TST-002',
            vin: 'TSTVIN00000000002',
        },
        {
            key: 'veh_003',
            categoryKey: 'veh_utilitario',
            clientKey: 'cli_perez',
            brand: 'Iveco',
            model: 'Daily',
            year: 2020,
            notes: 'Unidad utilitaria para test.',
            plate: 'TST-003',
            vin: 'TSTVIN00000000003',
        },
    ];

    const productDefs = [
        {
            key: 'prd_filtro',
            name: 'TST Filtro de aire pesado',
            sku: 'TST-FIL-001',
            initialQuantity: 45,
            minStock: 10,
            measure: 'Unidades',
            currency: '$U',
            costPrice: 680,
            sellPrice: 990,
            brand: 'FleetGuard',
            model: 'AF-555',
            providerKey: 'prov_andina',
            categoryKey: 'cat_filtros',
            description: 'Filtro de aire para vehiculo pesado.',
        },
        {
            key: 'prd_pastilla',
            name: 'TST Pastilla de freno delantera',
            sku: 'TST-FRE-001',
            initialQuantity: 60,
            minStock: 12,
            measure: 'Unidades',
            currency: '$U',
            costPrice: 420,
            sellPrice: 650,
            brand: 'Brembo',
            model: 'BF-900',
            providerKey: 'prov_sur',
            categoryKey: 'cat_frenos',
            description: 'Juego de pastillas de freno.',
        },
        {
            key: 'prd_aceite',
            name: 'TST Aceite 15W40',
            sku: 'TST-LUB-001',
            initialQuantity: 220,
            minStock: 40,
            measure: 'Litros',
            currency: '$U',
            costPrice: 95,
            sellPrice: 150,
            brand: 'Shell',
            model: 'Rimula',
            providerKey: 'prov_andina',
            categoryKey: 'cat_lubricantes',
            description: 'Aceite multigrado para motores diesel.',
        },
        {
            key: 'prd_correa',
            name: 'TST Correa de alternador',
            sku: 'TST-MEC-001',
            initialQuantity: 35,
            minStock: 8,
            measure: 'Unidades',
            currency: '$U',
            costPrice: 210,
            sellPrice: 340,
            brand: 'Gates',
            model: 'GA-770',
            providerKey: 'prov_norte',
            categoryKey: 'cat_mecanica',
            description: 'Correa para sistema de carga.',
        },
    ];

    const reparacionDefs = [
        {
            code: 'TEST-R-0001',
            identificativo: 'TEST-ING-001',
            description: 'Cambio de filtros y servicio preventivo.',
            priority: 'ALTA',
            status: 'EN_CURSO',
            clientKey: 'cli_delta',
            vehicleKey: 'veh_001',
            ingreso: daysAgo(2),
            insumos: [
                { productKey: 'prd_filtro', quantity: 2, extra: false },
                { productKey: 'prd_aceite', quantity: 18, extra: false },
                { productKey: 'prd_correa', quantity: 1, extra: true },
            ],
            manoObra: [
                { description: 'Diagnostico general y desmontaje inicial.', hours: 1.5, amount: 1800 },
                { description: 'Servicio de mantenimiento preventivo.', hours: 2.5, amount: 3200 },
            ],
            history: ['SIN_INICIAR', 'EN_CURSO'],
        },
        {
            code: 'TEST-R-0002',
            identificativo: 'TEST-ING-002',
            description: 'Reemplazo de frenos y ajuste final.',
            priority: 'NORMAL',
            status: 'FINALIZADO',
            clientKey: 'cli_oeste',
            vehicleKey: 'veh_002',
            ingreso: daysAgo(8),
            insumos: [
                { productKey: 'prd_pastilla', quantity: 6, extra: false },
                { productKey: 'prd_aceite', quantity: 12, extra: false },
            ],
            manoObra: [
                { description: 'Cambio completo de sistema de frenos.', hours: 3, amount: 4100 },
            ],
            history: ['SIN_INICIAR', 'EN_CURSO', 'FINALIZADO'],
        },
        {
            code: 'TEST-R-0003',
            identificativo: 'TEST-ING-003',
            description: 'Inspeccion de motor, reparacion en pausa por repuesto.',
            priority: 'URGENTE',
            status: 'PAUSADO',
            clientKey: 'cli_perez',
            vehicleKey: 'veh_003',
            ingreso: daysAgo(4),
            insumos: [{ productKey: 'prd_filtro', quantity: 1, extra: false }],
            manoObra: [
                { description: 'Inspeccion y pruebas de compresion.', hours: 2, amount: 2600 },
            ],
            history: ['SIN_INICIAR', 'EN_CURSO', 'PAUSADO'],
        },
    ];

    await prisma.$transaction(async (tx) => {
        const testerUsername = 'tester';
        const testerPassword = 'tester123';
        await tx.user.upsert({
            where: { normalizedUsername: testerUsername },
            update: {
                username: testerUsername,
                displayName: 'Usuario Test',
                isActive: true,
                passwordHash: hashPassword(testerPassword),
            },
            create: {
                username: testerUsername,
                normalizedUsername: testerUsername,
                displayName: 'Usuario Test',
                isActive: true,
                passwordHash: hashPassword(testerPassword),
            },
        });

        const vehicleCategories = new Map();
        for (const definition of vehicleCategoryDefs) {
            const normalizedName = normalizeText(definition.name);
            const category = await tx.category.upsert({
                where: {
                    type_normalizedName: {
                        type: 'VEHICLE',
                        normalizedName,
                    },
                },
                update: {
                    name: definition.name,
                    description: definition.description,
                },
                create: {
                    type: 'VEHICLE',
                    name: definition.name,
                    normalizedName,
                    description: definition.description,
                },
                select: { id: true, name: true },
            });
            vehicleCategories.set(definition.key, category);
        }

        const productCategories = new Map();
        for (const definition of productCategoryDefs) {
            const normalizedName = normalizeText(definition.name);
            const category = await tx.category.upsert({
                where: {
                    type_normalizedName: {
                        type: 'PRODUCT',
                        normalizedName,
                    },
                },
                update: {
                    name: definition.name,
                    description: definition.description,
                },
                create: {
                    type: 'PRODUCT',
                    name: definition.name,
                    normalizedName,
                    description: definition.description,
                },
                select: { id: true, name: true },
            });
            productCategories.set(definition.key, category);
        }

        const providers = new Map();
        for (const definition of providerDefs) {
            const provider = await tx.proveedor.upsert({
                where: { normalizedRut: normalizeDoc(definition.rut) },
                update: {
                    name: definition.name,
                    rut: definition.rut,
                    address: definition.address,
                    phone: definition.phone,
                    phone2: definition.phone2,
                    email: definition.email,
                    notes: definition.notes,
                },
                create: {
                    name: definition.name,
                    rut: definition.rut,
                    normalizedRut: normalizeDoc(definition.rut),
                    address: definition.address,
                    phone: definition.phone,
                    phone2: definition.phone2,
                    email: definition.email,
                    notes: definition.notes,
                },
                select: { id: true, name: true },
            });
            providers.set(definition.key, provider);
        }

        const clients = new Map();
        for (const definition of clientDefs) {
            const normalizedDocNumber = normalizeDoc(definition.docNumber);
            const normalizedEmail = definition.email ? normalizeText(definition.email) : null;

            const client = await tx.cliente.upsert({
                where: {
                    docType_normalizedDocNumber: {
                        docType: definition.docType,
                        normalizedDocNumber,
                    },
                },
                update: {
                    name: definition.name,
                    phone: definition.phone,
                    email: definition.email,
                    normalizedEmail,
                    address: definition.address,
                    docNumber: definition.docNumber,
                },
                create: {
                    name: definition.name,
                    phone: definition.phone,
                    email: definition.email,
                    normalizedEmail,
                    docType: definition.docType,
                    docNumber: definition.docNumber,
                    normalizedDocNumber,
                    address: definition.address,
                },
                select: { id: true, name: true },
            });
            clients.set(definition.key, client);
        }

        const vehicles = new Map();
        for (const definition of vehicleDefs) {
            const category = vehicleCategories.get(definition.categoryKey);
            const client = clients.get(definition.clientKey);
            if (!category || !client) {
                throw new Error(`No se pudieron resolver relaciones para vehiculo ${definition.key}.`);
            }

            const normalizedPlate = normalizeIdentifier(definition.plate);
            const normalizedVin = normalizeIdentifier(definition.vin);

            const vehicle = await tx.vehiculo.upsert({
                where: { normalizedPlate },
                update: {
                    brand: definition.brand,
                    model: definition.model,
                    year: definition.year,
                    notes: definition.notes,
                    categoryId: category.id,
                    clientId: client.id,
                    plate: definition.plate,
                    normalizedPlate,
                    vin: definition.vin,
                    normalizedVin,
                },
                create: {
                    brand: definition.brand,
                    model: definition.model,
                    year: definition.year,
                    notes: definition.notes,
                    categoryId: category.id,
                    clientId: client.id,
                    plate: definition.plate,
                    normalizedPlate,
                    vin: definition.vin,
                    normalizedVin,
                },
                select: { id: true, brand: true, model: true, year: true, clientId: true },
            });
            vehicles.set(definition.key, vehicle);
        }

        const products = new Map();
        for (const definition of productDefs) {
            const provider = providers.get(definition.providerKey);
            const category = productCategories.get(definition.categoryKey);
            if (!provider || !category) {
                throw new Error(`No se pudieron resolver relaciones para producto ${definition.key}.`);
            }

            const normalizedSku = normalizeText(definition.sku);
            const product = await tx.product.upsert({
                where: { normalizedSku },
                update: {
                    name: definition.name,
                    sku: definition.sku,
                    quantity: definition.initialQuantity,
                    minStock: definition.minStock,
                    measure: definition.measure,
                    currency: definition.currency,
                    costPrice: definition.costPrice,
                    sellPrice: definition.sellPrice,
                    brand: definition.brand,
                    model: definition.model,
                    description: definition.description,
                    providerId: provider.id,
                    categoryId: category.id,
                },
                create: {
                    name: definition.name,
                    sku: definition.sku,
                    normalizedSku,
                    quantity: definition.initialQuantity,
                    minStock: definition.minStock,
                    measure: definition.measure,
                    currency: definition.currency,
                    costPrice: definition.costPrice,
                    sellPrice: definition.sellPrice,
                    brand: definition.brand,
                    model: definition.model,
                    description: definition.description,
                    providerId: provider.id,
                    categoryId: category.id,
                },
                select: { id: true, name: true, sku: true, measure: true },
            });
            products.set(definition.key, product);
        }

        const reparaciones = new Map();
        for (const definition of reparacionDefs) {
            const client = clients.get(definition.clientKey);
            const vehicle = vehicles.get(definition.vehicleKey);
            if (!client || !vehicle) {
                throw new Error(`No se pudieron resolver relaciones para reparacion ${definition.code}.`);
            }

            const fechaInicio =
                definition.status === 'SIN_INICIAR'
                    ? null
                    : new Date(definition.ingreso.getTime() + 2 * 60 * 60 * 1000);
            const fechaFin =
                definition.status === 'FINALIZADO' && fechaInicio
                    ? new Date(fechaInicio.getTime() + 6 * 60 * 60 * 1000)
                    : null;

            const reparacion = await tx.reparacion.upsert({
                where: { code: definition.code },
                update: {
                    identificativo: definition.identificativo,
                    description: definition.description,
                    priority: definition.priority,
                    status: definition.status,
                    fechaIngreso: definition.ingreso,
                    fechaInicio,
                    fechaFin,
                    clienteId: client.id,
                    vehiculoId: vehicle.id,
                    clienteSnapshot: client.name,
                    vehiculoSnapshot: formatVehiculoSnapshot(vehicle),
                },
                create: {
                    code: definition.code,
                    identificativo: definition.identificativo,
                    description: definition.description,
                    priority: definition.priority,
                    status: definition.status,
                    fechaIngreso: definition.ingreso,
                    fechaInicio,
                    fechaFin,
                    clienteId: client.id,
                    vehiculoId: vehicle.id,
                    clienteSnapshot: client.name,
                    vehiculoSnapshot: formatVehiculoSnapshot(vehicle),
                },
                select: { id: true, code: true, fechaIngreso: true },
            });
            reparaciones.set(definition.code, reparacion);
        }

        const reparacionIds = Array.from(reparaciones.values()).map((item) => item.id);
        const productIds = Array.from(products.values()).map((item) => item.id);

        await tx.reparacionHistory.deleteMany({
            where: { reparacionId: { in: reparacionIds } },
        });
        await tx.reparacionInsumo.deleteMany({
            where: { reparacionId: { in: reparacionIds } },
        });
        await tx.reparacionManoObra.deleteMany({
            where: { reparacionId: { in: reparacionIds } },
        });
        await tx.stockMovement.deleteMany({
            where: {
                productId: { in: productIds },
                reason: { startsWith: 'TEST_' },
            },
        });

        for (const definition of productDefs) {
            const product = products.get(definition.key);
            if (!product) continue;
            await tx.stockMovement.create({
                data: {
                    productId: product.id,
                    type: 'IN',
                    amount: definition.initialQuantity,
                    reason: 'TEST_INITIAL_STOCK',
                    createdAt: daysAgo(15),
                },
            });
        }

        const consumedByProductId = new Map();
        for (const definition of reparacionDefs) {
            const reparacion = reparaciones.get(definition.code);
            if (!reparacion) continue;

            for (let index = 0; index < definition.history.length; index += 1) {
                await tx.reparacionHistory.create({
                    data: {
                        reparacionId: reparacion.id,
                        status: definition.history[index],
                        changedAt: new Date(definition.ingreso.getTime() + index * 60 * 60 * 1000),
                    },
                });
            }

            for (let index = 0; index < definition.insumos.length; index += 1) {
                const insumo = definition.insumos[index];
                const product = products.get(insumo.productKey);
                if (!product) continue;

                const consumedCurrent = consumedByProductId.get(product.id) ?? 0;
                consumedByProductId.set(product.id, consumedCurrent + insumo.quantity);

                const createdAt = new Date(definition.ingreso.getTime() + (index + 1) * 30 * 60 * 1000);
                await tx.reparacionInsumo.create({
                    data: {
                        reparacionId: reparacion.id,
                        productId: product.id,
                        productSnapshot: product.name,
                        skuSnapshot: product.sku,
                        measureSnapshot: product.measure,
                        quantity: insumo.quantity,
                        extra: insumo.extra,
                        createdAt,
                    },
                });

                await tx.stockMovement.create({
                    data: {
                        productId: product.id,
                        type: 'OUT',
                        amount: insumo.quantity,
                        reason: insumo.extra
                            ? `TEST_REPARACION_${definition.code}_EXTRA`
                            : `TEST_REPARACION_${definition.code}`,
                        createdAt,
                    },
                });
            }

            for (let index = 0; index < definition.manoObra.length; index += 1) {
                const item = definition.manoObra[index];
                await tx.reparacionManoObra.create({
                    data: {
                        reparacionId: reparacion.id,
                        description: item.description,
                        hours: item.hours,
                        amount: item.amount,
                        createdAt: new Date(definition.ingreso.getTime() + (index + 1) * 45 * 60 * 1000),
                    },
                });
            }
        }

        for (const definition of productDefs) {
            const product = products.get(definition.key);
            if (!product) continue;
            const consumed = consumedByProductId.get(product.id) ?? 0;
            const finalQuantity = Math.max(0, definition.initialQuantity - consumed);

            await tx.product.update({
                where: { id: product.id },
                data: {
                    quantity: finalQuantity,
                    minStock: definition.minStock,
                    version: { increment: 1 },
                },
            });
        }
    });

    console.log('Test data seed completado.');
    console.log('Usuario test: tester / tester123');
    console.log(`Categorias vehiculo: ${3}`);
    console.log(`Categorias producto: ${4}`);
    console.log(`Proveedores: ${3}`);
    console.log(`Clientes: ${3}`);
    console.log(`Vehiculos: ${3}`);
    console.log(`Productos: ${4}`);
    console.log(`Reparaciones: ${3}`);
}

main()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
