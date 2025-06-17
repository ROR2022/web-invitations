"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Grid,
  List,
  MoreVertical,
  Trash2,
  Download,
  Copy,
  Search,
  Loader2,
  ImageIcon,
  X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ImageUploader from './ImageUploader';
import {createClient} from '@/utils/supabase/client';
import Image from 'next/image';

interface ResourceInfo {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  size: number;
  type: string;
  metadata: any;
}

interface ResourceGalleryProps {
  bucketName?: string;
  folderPath?: string;
  onSelectResource?: (resource: ResourceInfo) => void;
  selectedResourceUrl?: string;
  allowSelection?: boolean;
}

/**
 * Componente para mostrar y gestionar recursos de imágenes
 */
const ResourceGallery: React.FC<ResourceGalleryProps> = ({
  bucketName = 'invitations-media',
  folderPath = 'images',
  onSelectResource,
  selectedResourceUrl,
  allowSelection = true
}) => {
  const [resources, setResources] = useState<ResourceInfo[]>([]);
  const [filteredResources, setFilteredResources] = useState<ResourceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceInfo | null>(null);
  
  
  // Cargar recursos
  const loadResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    
    try {
      const path = folderPath ? `${folderPath}/` : '';
      
      // Listar archivos en el bucket/carpeta
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(path, {
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (error) throw error;
      
      // Transformar datos y obtener URLs
      const resourcesWithUrls = await Promise.all(
        data
          .filter(item => !item.id.endsWith('/')) // Filtrar carpetas
          .map(async (item) => {
            const filePath = `${path}${item.name}`;
            const { data: { publicUrl } } = supabase.storage
              .from('invitations-media')
              .getPublicUrl(filePath);
            
            return {
              id: item.id,
              name: item.name,
              url: publicUrl,
              createdAt: item.created_at,
              size: item.metadata?.size || 0,
              type: item.metadata?.mimetype || 'image/jpeg',
              metadata: item.metadata
            };
          })
      );
      
      setResources(resourcesWithUrls);
      setFilteredResources(resourcesWithUrls);
    } catch (err: any) {
      console.error('Error al cargar recursos:', err);
      setError(err.message || 'Error al cargar recursos');
    } finally {
      setLoading(false);
    }
  }, [bucketName, folderPath]);
  
  // Efecto para cargar recursos al montar el componente
  useEffect(() => {
    loadResources();
  }, [bucketName, folderPath, loadResources]);
  
  // Filtrar recursos al cambiar la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResources(resources);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredResources(
        resources.filter(
          resource => resource.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, resources]);
  
  // Manejar selección de recurso
  const handleSelectResource = (resource: ResourceInfo) => {
    if (!allowSelection) return;
    
    setSelectedResource(resource);
    if (onSelectResource) {
      onSelectResource(resource);
    }
  };
  
  // Manejar eliminación de recurso
  const handleDeleteResource = async (resource: ResourceInfo) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${resource.name}"?`)) {
      return;
    }
    const supabase = createClient();
    try {
      const path = folderPath ? `${folderPath}/${resource.name}` : resource.name;
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);
      
      if (error) throw error;
      
      // Actualizar estado local
      setResources(prev => prev.filter(r => r.id !== resource.id));
      setFilteredResources(prev => prev.filter(r => r.id !== resource.id));
      
      // Si el recurso eliminado estaba seleccionado, deseleccionarlo
      if (selectedResource?.id === resource.id) {
        setSelectedResource(null);
      }
      
    } catch (err: any) {
      console.error('Error al eliminar recurso:', err);
      alert(`Error al eliminar recurso: ${err.message}`);
    }
  };
  
  // Manejar carga de nuevo recurso
  const handleUploadComplete = (url: string, metadata: any) => {
    // Recargar recursos
    loadResources();
    setUploaderOpen(false);
  };
  
  // Renderizar tarjeta de recurso
  const renderResourceCard = (resource: ResourceInfo) => {
    const isSelected = selectedResourceUrl === resource.url || selectedResource?.id === resource.id;
    
    return (
      <div 
        key={resource.id}
        className={`
          border rounded-md overflow-hidden ${viewMode === 'grid' ? 'w-full' : 'flex items-center p-2 gap-3'}
          ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-accent/20'}
          ${allowSelection ? 'cursor-pointer' : ''}
        `}
        onClick={() => allowSelection && handleSelectResource(resource)}
        onKeyDown={(e) => {
          if (allowSelection && (e.key === 'Enter' || e.key === ' ')) {
            handleSelectResource(resource);
            e.preventDefault();
          }
        }}
        role={allowSelection ? "button" : undefined}
        tabIndex={allowSelection ? 0 : undefined}
      >
        {/* Imagen */}
        <div className={viewMode === 'grid' ? 'aspect-square relative' : 'h-14 w-14 flex-shrink-0 relative'}>
          <Image
            src={resource.url}
            alt={resource.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              // Para recursos de imagen con error, usamos una imagen de fallback
              // Nota: onError no funciona exactamente igual con Next.js Image, pero podemos usar onLoadingComplete en su lugar
              const target = e.target as HTMLImageElement;
              if (target && target.naturalWidth === 0) {
                // La imagen falló en cargar
                target.src = 'https://via.placeholder.com/150?text=Error';
              }
            }}
          />
        </div>
        
        {/* Información */}
        <div className={viewMode === 'grid' ? 'p-2' : 'flex-1 min-w-0'}>
          <p className="font-medium truncate text-sm">
            {resource.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(resource.size)}
          </p>
        </div>
        
        {/* Menú de acciones */}
        <div className={viewMode === 'grid' ? 'absolute top-1 right-1' : ''}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7 bg-black/20 text-white hover:bg-black/30 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(resource.url)}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar URL
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(resource.url, '_blank')}>
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-500"
                onClick={() => handleDeleteResource(resource)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };
  
  // Utilidad para formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Cabecera con controles */}
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar recursos..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-2.5"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-2">
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Dialog open={uploaderOpen} onOpenChange={setUploaderOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                Subir imagen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subir nueva imagen</DialogTitle>
              </DialogHeader>
              <ImageUploader
                bucketName={bucketName}
                folderPath={folderPath}
                onUploadComplete={handleUploadComplete}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Estados de carga, error, sin recursos */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-sm text-muted-foreground">Cargando recursos...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <Button onClick={loadResources}>Reintentar</Button>
          </div>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            {searchQuery ? (
              <p className="text-muted-foreground">No se encontraron recursos que coincidan con &quot;{searchQuery}&quot;</p>
            ) : (
              <>
                <p className="text-muted-foreground">No hay recursos disponibles</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setUploaderOpen(true)}
                >
                  Subir tu primera imagen
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Implementación directa de scroll sin ScrollArea component */
        <div className="flex-1 overflow-auto pr-2">
          <div 
            className={viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 gap-4' 
              : 'space-y-2'
            }
          >
            {filteredResources.map(resource => renderResourceCard(resource))}
          </div>
          <div className="h-6"></div> {/* Espacio al final para scroll */}
        </div>
      )}
    </div>
  );
};

export default ResourceGallery;
