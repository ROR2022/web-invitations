/**
 * Utilities for generating and validating slugs
 */

/**
 * Generates a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Checks if a slug is valid
 * @param slug The slug to validate
 * @returns True if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  // Slugs should only contain lowercase letters, numbers, and hyphens
  // and should not start or end with a hyphen
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Creates a unique slug by appending a number if needed
 * @param baseSlug The initial slug to make unique
 * @param existingSlugs Array of existing slugs to check against
 * @returns A unique slug
 */
export function createUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
} 