/**
 * Types related to invitation templates
 */

/**
 * Database template model - matching the Supabase table structure
 */
export interface DatabaseTemplate {
  id: string;
  name: string;
  event_type: string;
  slug: string;
  thumbnail_url: string;
  html_content: string;
  css_content?: string;
  js_content?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Template with package compatibility information
 */
export interface TemplateWithPackages extends DatabaseTemplate {
  compatible_packages: string[];
}

/**
 * Template model for UI components
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  previewImage: string;
  category: string;
  tags: string[];
  packageTypes: string[]; // 'basic', 'premium', 'vip'
}

/**
 * Transform database template to UI template
 */
export function transformDatabaseTemplate(template: DatabaseTemplate | TemplateWithPackages): Template {
  return {
    id: template.id,
    name: template.name,
    description: template.slug, // Using slug as description for now
    thumbnail: template.thumbnail_url,
    previewImage: template.thumbnail_url, // Using same image for preview
    category: template.event_type,
    tags: [], // Tags not currently in database
    packageTypes: 'compatible_packages' in template 
      ? template.compatible_packages 
      : ['basic', 'premium', 'vip'] // Default to all packages if not specified
  };
} 