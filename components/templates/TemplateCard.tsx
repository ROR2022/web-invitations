"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Check, ImageOff } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Template } from '@/types/template';

interface TemplateCardProps {
  template: Template;
  selected?: boolean;
  onSelect?: (templateId: string) => void;
  disabled?: boolean;
  packageType?: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  selected = false,
  onSelect,
  disabled = false,
  packageType = 'basic'
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isCompatible = packageType ? template.packageTypes.includes(packageType) : true;
  
  // Si no es compatible con el paquete seleccionado, mostrar estado deshabilitado
  const isDisabled = disabled || !isCompatible;
  
  const handleSelect = () => {
    if (!isDisabled && onSelect) {
      onSelect(template.id);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-200 cursor-pointer h-full flex flex-col", 
          selected ? "ring-2 ring-primary" : "hover:shadow-md",
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        )}
        onClick={isDisabled ? undefined : handleSelect}
      >
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {!imageError ? (
            <Image
              src={template.thumbnail}
              alt={template.name}
              fill
              className="object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted">
              <ImageOff className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
          )}
          {selected && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <span className="rounded-full bg-primary p-1">
                <Check className="h-4 w-4 text-white" />
              </span>
            </div>
          )}
          {!isCompatible && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">No disponible</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-medium">{template.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {template.description || `Plantilla para ${template.category}`}
          </p>
          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {template.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{template.tags.length - 2} más
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="px-4 py-3 border-t bg-muted/40">
          <div className="w-full flex justify-between items-center">
            <p className="text-xs capitalize">{template.category}</p>
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" disabled={isDisabled}>
                  <Eye className="h-4 w-4 mr-1" />
                  Vista previa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{template.name}</DialogTitle>
                  <DialogDescription>
                    {template.description || `Plantilla para ${template.category}`}
                  </DialogDescription>
                </DialogHeader>
                <div className="relative aspect-[16/9] w-full mt-2 bg-muted rounded-md overflow-hidden">
                  {!imageError ? (
                    <Image
                      src={template.previewImage || template.thumbnail}
                      alt={`Vista previa de ${template.name}`}
                      fill
                      className="object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <ImageOff className="h-16 w-16 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground mt-2">Vista previa no disponible</p>
                    </div>
                  )}
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                    Cerrar
                  </Button>
                  <Button onClick={() => {
                    setPreviewOpen(false);
                    handleSelect();
                  }} disabled={isDisabled}>
                    Seleccionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default TemplateCard; 