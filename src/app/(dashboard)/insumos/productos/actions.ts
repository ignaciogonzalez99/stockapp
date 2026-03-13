'use server';

import {
    createProduct as createProductRecord,
    deleteProduct as deleteProductRecord,
    listProducts,
    updateProduct as updateProductRecord,
    type ProductPatch,
    type ProductView,
} from '@/lib/mock-db';

export type Product = ProductView;

function getString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

function getOptionalNumber(formData: FormData, key: string): number | undefined {
    const raw = getString(formData, key);
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
}

export async function getProducts() {
    return listProducts();
}

export async function createProduct(formData: FormData) {
    return createProductRecord({
        name: getString(formData, 'name'),
        sku: getString(formData, 'sku'),
        quantity: getOptionalNumber(formData, 'quantity'),
        minStock: getOptionalNumber(formData, 'minStock'),
        measure: getString(formData, 'measure'),
        currency: getString(formData, 'currency'),
        costPrice: getOptionalNumber(formData, 'costPrice'),
        sellPrice: getOptionalNumber(formData, 'sellPrice'),
        brand: getString(formData, 'brand'),
        model: getString(formData, 'model'),
        providerName: getString(formData, 'provider') || null,
        categoryName: getString(formData, 'category') || null,
        description: getString(formData, 'description'),
    });
}

export async function updateProduct(id: number, formData: FormData) {
    const patch: ProductPatch = {};

    if (formData.has('name')) patch.name = getString(formData, 'name');
    if (formData.has('sku')) patch.sku = getString(formData, 'sku');
    if (formData.has('quantity')) patch.quantity = getOptionalNumber(formData, 'quantity');
    if (formData.has('minStock')) patch.minStock = getOptionalNumber(formData, 'minStock');
    if (formData.has('measure')) patch.measure = getString(formData, 'measure');
    if (formData.has('currency')) patch.currency = getString(formData, 'currency');
    if (formData.has('costPrice')) patch.costPrice = getOptionalNumber(formData, 'costPrice');
    if (formData.has('sellPrice')) patch.sellPrice = getOptionalNumber(formData, 'sellPrice');
    if (formData.has('brand')) patch.brand = getString(formData, 'brand');
    if (formData.has('model')) patch.model = getString(formData, 'model');
    if (formData.has('description')) patch.description = getString(formData, 'description');

    if (formData.has('provider')) patch.providerName = getString(formData, 'provider') || null;
    if (formData.has('category')) patch.categoryName = getString(formData, 'category') || null;

    return updateProductRecord(id, patch);
}

export async function deleteProduct(id: number) {
    await deleteProductRecord(id);
}
