/**
 * Migration Script: Add slugs to existing products
 * 
 * Bu scripti tarayıcı konsolunda veya admin panelinden çalıştırabilirsiniz.
 * Mevcut tüm ürünleri tarar ve slug'ı olmayanlara slug atar.
 * 
 * Kullanım: Admin panelinde tarayıcı konsolunu açın ve bu scripti çalıştırın,
 * veya admin paneline bir "Migration" butonu ekleyin.
 */

import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateSlug } from '../hooks/useFirestore';

export async function migrateProductSlugs(): Promise<{ migrated: number; skipped: number; errors: string[] }> {
    const result = { migrated: 0, skipped: 0, errors: [] as string[] };

    try {
        const snapshot = await getDocs(collection(db, 'products'));
        const allProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        // Track used slugs to ensure uniqueness within migration
        const usedSlugs = new Set<string>();

        // First, collect all existing slugs
        allProducts.forEach((p: any) => {
            if (p.slug) {
                usedSlugs.add(p.slug);
            }
        });

        for (const product of allProducts) {
            const p = product as any;

            // Skip products that already have a slug
            if (p.slug) {
                result.skipped++;
                continue;
            }

            if (!p.name) {
                result.errors.push(`Product ${p.id} has no name, skipping.`);
                result.skipped++;
                continue;
            }

            // Generate base slug
            let slug = generateSlug(p.name);
            let attempt = 0;

            // Ensure uniqueness
            while (usedSlugs.has(slug)) {
                attempt++;
                slug = `${generateSlug(p.name)}-${attempt}`;
            }

            try {
                await updateDoc(doc(db, 'products', p.id), { slug });
                usedSlugs.add(slug);
                result.migrated++;
                console.log(`✅ Migrated: ${p.name} → /products/${slug}`);
            } catch (err) {
                const errorMsg = `Failed to update ${p.id} (${p.name}): ${err}`;
                result.errors.push(errorMsg);
                console.error(`❌ ${errorMsg}`);
            }
        }

        console.log(`\n🏁 Migration complete: ${result.migrated} migrated, ${result.skipped} skipped, ${result.errors.length} errors`);
    } catch (err) {
        result.errors.push(`Fatal error: ${err}`);
        console.error('❌ Migration failed:', err);
    }

    return result;
}
