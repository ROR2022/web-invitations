import { defaultTheme } from "@/components/template-editor/themeSchemas";
import { getSupabase } from "./supabaseClient";
import { TemplateConfig } from "@/components/template-editor/types";
import { v4 as uuidv4 } from 'uuid';

/**
 * List all templates with optional filtering
 */
export const listTemplates = async (options?: {
  isActive?: boolean;
  eventType?: string;
  category?: string;
  includeDrafts?: boolean;
  limit?: number;
}) => {
  const supabase = await getSupabase();
  let query = supabase.from('templates').select('*');
  
  if (options?.isActive !== undefined) {
    query = query.eq('is_active', options.isActive);
  }
  
  if (options?.eventType) {
    query = query.eq('event_type', options.eventType);
  }
  
  if (options?.category) {
    query = query.eq('category', options.category);
  }
  
  // Filter out drafts unless specifically requested
  if (!options?.includeDrafts) {
    query = query.neq('status', 'draft');
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  return query;
};

/**
 * Get a single template by ID
 */
export const getTemplate = async (id: string) => {
  const supabase = await getSupabase();
  return supabase.from('templates').select('*').eq('id', id).single();
};

/**
 * Create a new template with component configuration
 */
export const createTemplate = async (template: {
  name: string;
  description?: string;
  config: TemplateConfig;
  event_type?: string;
  is_active?: boolean;
  thumbnail_url?: string;
  category?: string;
  eventType?: string;
  slug?: string;
}) => {
  const supabase = await getSupabase();
  
  // Set default values
  const templateWithDefaults = {
    ...template,
    is_active: template.is_active ?? true,
    category: template.category ?? 'premium',
    event_type: template.eventType ?? 'otro',
    slug: template.slug ?? `${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    thumbnail_url: template.thumbnail_url ?? '/placeholder.svg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return supabase.from('templates').insert([templateWithDefaults]).select();
};

/**
 * Update an existing template
 */
export const updateTemplate = async (id: string, updates: {
  name?: string;
  description?: string;
  config?: TemplateConfig;
  event_type?: string;
  is_active?: boolean;
  thumbnail_url?: string;
  category?: string;
}) => {
  const supabase = await getSupabase();
  
  // Always update the updated_at timestamp
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return supabase.from('templates').update(updatesWithTimestamp).eq('id', id);
};

/**
 * Delete a template
 */
export const deleteTemplate = async (id: string) => {
  const supabase = await getSupabase();
  return supabase.from('templates').delete().eq('id', id);
};

/**
 * Duplicate a template
 */
export const duplicateTemplate = async (id: string, newName: string) => {
  const supabase = await getSupabase();
  
  // 1. Get the original template
  const { data: originalTemplate, error } = await getTemplate(id);
  
  if (error || !originalTemplate) {
    throw new Error('Template not found');
  }
  
  // 2. Create a new template with the same config but different name
  const newTemplate = {
    name: newName,
    description: `Copy of: ${originalTemplate.description || originalTemplate.name}`,
    config: originalTemplate.config,
    event_type: originalTemplate.event_type,
    is_active: true,
    thumbnail_url: originalTemplate.thumbnail_url,
  };
  
  return createTemplate(newTemplate);
};

/**
 * Convert legacy template to config-only format
 * This is a migration helper function
 */
export const convertLegacyTemplate = async (id: string) => {
  const supabase = await getSupabase();
  
  // 1. Get the template with potential legacy fields
  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !template) {
    throw new Error('Template not found');
  }
  
  // 2. If template already has config but still has html/css/js, just remove those fields
  if (template.config) {
    const updates = {
      html: null,
      css: null,
      js: null,
      updated_at: new Date().toISOString()
    };
    
    return supabase.from('templates').update(updates).eq('id', id);
  }
  
  // 3. If no config exists, this would require a complex migration process
  // This is just a placeholder - actual implementation would depend on your specific needs
  throw new Error('Legacy template without config cannot be automatically converted');
};

/**
 * Get a template's thumbnail
 */
export const getTemplateThumbnail = async (id: string) => {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from('templates')
    .select('thumbnail_url')
    .eq('id', id)
    .single();
    
  return data?.thumbnail_url || null;
};

export const createTemporaryTemplate = async () => {
  const supabase = await getSupabase();
  
  const tempTemplate = {
    id: uuidv4(),
    name: 'Nueva Plantilla',
    description: 'Descripción de la plantilla',
    slug: `nueva-plantilla-${Date.now()}`,
    thumbnail_url: '/placeholder.svg',
    config: {
      id: uuidv4(),
      name: 'Nueva Plantilla',
      description: 'Descripción de la plantilla',
      theme: { ...defaultTheme },
      components: [],
      category: 'premium'
    },
    status: 'draft',
    is_active: true,
    event_type: 'generic',
    category: 'premium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return supabase.from('templates').insert([tempTemplate]).select('*').single();
};