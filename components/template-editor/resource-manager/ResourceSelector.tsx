"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ImageIcon, Upload, X } from 'lucide-react';
import ImageUploader from './ImageUploader';
import ResourceGallery from './ResourceGallery';

interface ResourceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  bucketName?: string;
  folderPath?: string;
  label?: string;
  aspectRatio?: number;
}

interface ResourceInfo {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  size: number;
  type: string;
  metadata: any;
}

/**
 * Selector de recursos de imagen para el editor de propiedades
 */
const ResourceSelector: React.FC<ResourceSelectorProps> = ({
  value,
  onChange,
  bucketName = 'invitations-media',
  folderPath = 'images',
  label = 'Imagen',
  aspectRatio
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceInfo | null>(null);
  const [activeTab, setActiveTab] = useState<string>('gallery');
  
  // Manejar selección de recurso
  const handleSelectResource = (resource: ResourceInfo) => {
    setSelectedResource(resource);
  };
  
  // Confirmar selección
  const handleConfirmSelection = () => {
    if (selectedResource) {
      onChange(selectedResource.url);
    }
    setDialogOpen(false);
  };
  
  // Manejar carga de imagen
  const handleUploadComplete = (url: string) => {
    onChange(url);
    setDialogOpen(false);
  };
  
  // Limpiar selección actual
  const handleClearSelection = () => {
    onChange('');
  };
  
  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        {/* Vista previa de imagen seleccionada */}
        {value ? (
          <div className="relative mb-2">
            <div className={`border rounded-md overflow-hidden ${aspectRatio ? `aspect-[${aspectRatio}]` : 'aspect-square'} relative`}>
              <Image
                src={typeof value === 'string' && (value.startsWith('/') || value.startsWith('http')) 
                  ? value 
                  : '/placeholder.svg'}
                alt={label}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target && target.naturalWidth === 0) {
                    target.src = 'https://via.placeholder.com/300x200?text=Error+al+cargar+imagen';
                  }
                }}
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 rounded-full"
              onClick={handleClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div 
            className={`
              border-2 border-dashed rounded-md flex items-center justify-center bg-muted/20
              ${aspectRatio ? `aspect-[${aspectRatio}]` : 'aspect-square'}
            `}
          >
            <div className="text-center py-4 px-2">
              <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No hay imagen seleccionada</p>
            </div>
          </div>
        )}
        
        {/* Botones de acción */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2">
              {value ? 'Cambiar imagen' : 'Seleccionar imagen'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] h-[90vh] p-6 flex flex-col">
            <DialogHeader className="mb-4 pb-2 border-b">
              <DialogTitle>Seleccionar imagen</DialogTitle>
              <DialogDescription>
                Elige una imagen de tu biblioteca o sube una nueva.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="mb-4 grid grid-cols-2">
                <TabsTrigger value="gallery">Biblioteca</TabsTrigger>
                <TabsTrigger value="upload">Subir nueva</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 relative" style={{ height: "calc(100% - 50px)" }}>
                <TabsContent 
                  value="gallery" 
                  className="absolute inset-0 overflow-hidden"
                  style={{ visibility: activeTab === 'gallery' ? 'visible' : 'hidden' }}
                >
                  <ResourceGallery
                    bucketName={bucketName}
                    folderPath={folderPath}
                    onSelectResource={handleSelectResource}
                    selectedResourceUrl={selectedResource?.url}
                    allowSelection={true}
                  />
                </TabsContent>
                
                <TabsContent 
                  value="upload" 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ visibility: activeTab === 'upload' ? 'visible' : 'hidden' }}
                >
                  <ImageUploader
                    bucketName={bucketName}
                    folderPath={folderPath}
                    onUploadComplete={handleUploadComplete}
                  />
                </TabsContent>
              </div>
            </Tabs>
            
            <DialogFooter className="mt-4 pt-2 border-t">
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmSelection}
                disabled={!selectedResource}
              >
                Confirmar selección
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ResourceSelector;
