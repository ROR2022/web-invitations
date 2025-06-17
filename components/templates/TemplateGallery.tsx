"use client";

import React, { useState, useEffect } from 'react';
import TemplateCard from './TemplateCard';
import { Template } from '@/types/template';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PackageType } from '@/types/invitation';
import { Search, CircleDashed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getAllTemplates, 
  getTemplateCategories,
  searchTemplates,
  getTemplatesByCategory,
  getTemplatesByPackage
} from '@/services/templates.service';

interface TemplateGalleryProps {
  packageType: string;
  selectedTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  packageType,
  selectedTemplateId,
  onSelectTemplate
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías y plantillas
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar todas las plantillas compatible con el tipo de paquete
        let templatesData: Template[];
        
         if (packageType) {
          templatesData = await getTemplatesByPackage(packageType);
        } else {
          templatesData = await getAllTemplates();
        } 
       //templatesData = await getAllTemplates();
        
        setTemplates(templatesData);
        
        // Extraer las categorías únicas
        const uniqueCategories = Array.from(
          new Set(templatesData.map(t => t.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading template data:', error);
        setError('No se pudieron cargar las plantillas. Intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [packageType]);

  // Filtrar plantillas cuando cambie la categoría
  useEffect(() => {
    async function filterTemplates() {
      setLoading(true);
      setError(null);
      
      try {
        if (selectedCategory === 'todas') {
          // Si ya tenemos las plantillas filtradas por tipo de paquete, solo usamos esas
          if (packageType) {
            const allPackageTemplates = await getTemplatesByPackage(packageType);
            setTemplates(allPackageTemplates);
          } else {
            const allTemplates = await getAllTemplates();
            setTemplates(allTemplates);
          }
        } else {
          // Primero obtenemos por categoría
          const categoryTemplates = await getTemplatesByCategory(selectedCategory);
          
          // Luego filtramos por tipo de paquete si es necesario
          if (packageType) {
            const packageTemplates = await getTemplatesByPackage(packageType);
            const packageTemplateIds = packageTemplates.map(t => t.id);
            
            // Mantener solo las que están en ambas listas
            const filteredTemplates = categoryTemplates.filter(t => 
              packageTemplateIds.includes(t.id)
            );
            
            setTemplates(filteredTemplates);
          } else {
            setTemplates(categoryTemplates);
          }
        }
      } catch (error) {
        console.error('Error filtering templates:', error);
        setError('Error al filtrar plantillas');
      } finally {
        setLoading(false);
      }
    }
    
    filterTemplates();
  }, [selectedCategory, packageType]);

  // Función para buscar plantillas
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchTemplates(searchTerm);
      
      // Si hay un tipo de paquete seleccionado, filtrar resultados
      if (packageType) {
        const packageTemplates = await getTemplatesByPackage(packageType);
        const packageTemplateIds = packageTemplates.map(t => t.id);
        
        const filteredResults = results.filter(t => 
          packageTemplateIds.includes(t.id)
        );
        
        setTemplates(filteredResults);
      } else {
        setTemplates(results);
      }
    } catch (error) {
      console.error('Error searching templates:', error);
      setError('Error al buscar plantillas');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      // Si se borró la búsqueda, restablecer según la categoría seleccionada
      if (selectedCategory === 'todas') {
        if (packageType) {
          getTemplatesByPackage(packageType).then(setTemplates);
        } else {
          getAllTemplates().then(setTemplates);
        }
      } else {
        getTemplatesByCategory(selectedCategory).then(templates => {
          if (packageType) {
            getTemplatesByPackage(packageType).then(packageTemplates => {
              const packageTemplateIds = packageTemplates.map(t => t.id);
              const filteredTemplates = templates.filter(t => 
                packageTemplateIds.includes(t.id)
              );
              setTemplates(filteredTemplates);
            });
          } else {
            setTemplates(templates);
          }
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="searchTemplate" className="mb-2 block">Buscar plantilla</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="searchTemplate"
              placeholder="Buscar por nombre, categoría o estilo..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Label htmlFor="category" className="mb-2 block">Categoría</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {/* Galería de plantillas */}
      <div className={cn("relative min-h-[400px]", loading && "opacity-60")}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 z-10">
            <CircleDashed className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              selected={template.id === selectedTemplateId}
              onSelect={onSelectTemplate}
              packageType={packageType}
            />
          ))}
        </div>

        {!loading && templates.length === 0 && !error && (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No se encontraron plantillas que coincidan con tu búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery; 