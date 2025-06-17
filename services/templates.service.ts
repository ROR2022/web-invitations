import { Template } from '@/types/template';
import { createClient } from '@/utils/supabase/client';

// Initialize Supabase client
const supabase = createClient();

/**
 * Fetch all templates from the database
 */
export async function getAllTemplates(): Promise<Template[]> {
  try {
    // Fetch templates from the API
    const response = await fetch('/api/templates?isActive=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }

    const { data } = await response.json();

    console.log('Fetched templates:', data);
    
    // Transform templates to UI format
    return transformTemplates(data);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}

/**
 * Fetch templates by category (event type)
 */
export async function getTemplatesByCategory(category: string): Promise<Template[]> {
  try {
    const response = await fetch(`/api/templates?isActive=true&eventType=${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch templates by category');
    }

    const { data } = await response.json();
    return transformTemplates(data);
  } catch (error) {
    console.error('Error fetching templates by category:', error);
    return [];
  }
}

/**
 * Fetch templates compatible with a specific package
 */
export async function getTemplatesByPackage(packageType: string): Promise<Template[]> {
  try {
    console.log('Fetching templates for package type:', packageType);
    // Use the API endpoint with the packageType parameter
    const response = await fetch(`/api/templates?isActive=true&category=${packageType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch templates by package');
    }

    const { data } = await response.json();
    return transformTemplates(data);
  } catch (error) {
    console.error('Error fetching templates by package:', error);
    return [];
  }
}

/**
 * Fetch template by ID
 */
export async function getTemplateById(id: string): Promise<Template | null> {
  try {
    const response = await fetch(`/api/templates/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch template');
    }

    const { data } = await response.json();
    
    if (!data) {
      return null;
    }
    
    const templates = transformTemplates([data]);
    return templates[0] || null;
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    return null;
  }
}

/**
 * Search templates by term
 */
export async function searchTemplates(searchTerm: string): Promise<Template[]> {
  try {
    // Until we have a search endpoint, we'll fetch all and filter client-side
    const allTemplates = await getAllTemplates();
    const term = searchTerm.toLowerCase();
    
    return allTemplates.filter(template => 
      template.name.toLowerCase().includes(term) ||
      template.description.toLowerCase().includes(term) ||
      template.category.toLowerCase().includes(term) ||
      template.tags.some(tag => tag.toLowerCase().includes(term))
    );
  } catch (error) {
    console.error('Error searching templates:', error);
    return [];
  }
}

/**
 * Get unique template categories
 */
export async function getTemplateCategories(): Promise<string[]> {
  try {
    const allTemplates = await getAllTemplates();
    const categories = new Set(allTemplates.map(template => template.category));
    return Array.from(categories);
  } catch (error) {
    console.error('Error fetching template categories:', error);
    return [];
  }
}

/**
 * Transform database templates to UI format
 */
function transformTemplates(dbTemplates: any[]): Template[] {
  return dbTemplates.map(template => ({ 
    id: template.id,
    name: template.name,
    description: template.description || template.slug || '',
    thumbnail: template.thumbnail_url,
    previewImage: template.thumbnail_url, // Using same image for preview
    category: template.event_type,
    tags: template.tags?.split(',') || [],
    // We'll set this as all package types for now - will be updated by getTemplatesByPackage
    packageTypes: ['basic', 'premium', 'vip']
  }));
} 