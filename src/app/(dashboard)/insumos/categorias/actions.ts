'use server';

import {
    createProductCategory as createProductCategoryRecord,
    deleteProductCategory as deleteProductCategoryRecord,
    listProductCategories,
    updateProductCategory as updateProductCategoryRecord,
    type CategoryView,
} from '@/lib/mock-db';

export type ProductCategory = CategoryView;

function getString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

export async function getProductCategories() {
    return listProductCategories();
}

export async function createProductCategory(formData: FormData) {
    return createProductCategoryRecord(
        getString(formData, 'name'),
        getString(formData, 'description'),
    );
}

export async function updateProductCategory(id: number, formData: FormData) {
    return updateProductCategoryRecord(
        id,
        getString(formData, 'name'),
        getString(formData, 'description'),
    );
}

export async function deleteProductCategory(id: number) {
    await deleteProductCategoryRecord(id);
}
