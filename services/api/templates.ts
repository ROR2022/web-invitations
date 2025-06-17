import { TemplateConfig } from "@/components/template-editor/types";

// Tipo para las plantillas
export interface TemplateData {
  id: string;
  name: string;
  description?: string | null;
  config: TemplateConfig | null;
  event_type?: string | null;
  is_active?: boolean | null;
  created_at?: string;
  updated_at?: string;
  thumbnail_url?: string | null;
  category?: string | null;
  status?: string | null;
  slug: string;
}

// Crear plantilla temporal
export async function createTemporaryTemplate() {
  const response = await fetch('/api/templates/temp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear plantilla temporal');
  }

  const result = await response.json();
  return result.data;
}

// Obtener plantilla por ID
export async function getTemplate(id: string) {
  const response = await fetch(`/api/templates/${id}`);

  if (response.status === 404) {
    return { data: null, notFound: true };
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener plantilla');
  }

  const result = await response.json();
  return { data: result.data, notFound: false };
}

// Actualizar plantilla
export async function updateTemplate(id: string, templateData: Partial<TemplateData>) {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(templateData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar plantilla');
  }

  const result = await response.json();
  return result.data;
}

// Listar plantillas con filtros
export async function listTemplates(options: {
  isActive?: boolean;
  eventType?: string;
  category?: string;
  status?: string;
  includeDrafts?: boolean;
  limit?: number;
} = {}) {
  const params = new URLSearchParams();
  
  if (options.isActive !== undefined) {
    params.append('isActive', options.isActive.toString());
  }
  
  if (options.eventType) {
    params.append('eventType', options.eventType);
  }
  
  if (options.category) {
    params.append('category', options.category);
  }
  
  if (options.status) {
    params.append('status', options.status);
  }
  
  if (options.includeDrafts !== undefined) {
    params.append('includeDrafts', options.includeDrafts.toString());
  }
  
  if (options.limit !== undefined) {
    params.append('limit', options.limit.toString());
  }
  
  const response = await fetch(`/api/templates?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Error al listar plantillas');
  }
  
  const result = await response.json();
  return result.data;
}

// Eliminar plantilla
export async function deleteTemplate(id: string) {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al eliminar plantilla');
  }

  return true;
} 