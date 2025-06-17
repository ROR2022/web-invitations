"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, X, Filter, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import * as templateApi from "@/services/api/templates";

interface TemplateListProps {
  initialTemplates: any[];
}

export default function TemplateList({ initialTemplates }: TemplateListProps) {
  // Estado para plantillas
  const [templates, setTemplates] = useState(initialTemplates);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  
  // Contar cuántos filtros están activos para mostrar la cantidad en el botón
  const activeFiltersCount = [
    categoryFilter !== null,
    statusFilter !== null,
    activeFilter !== null
  ].filter(Boolean).length;
  
  // Función para cargar plantillas con filtros desde la API
  const loadTemplates = useCallback(async (filters: {
    category?: string;
    status?: string;
    includeDrafts?: boolean;
  } = {}) => {
    try {
      setIsLoading(true);
      const serverFilters: any = { ...filters };
      
      // Solo incluir los filtros que tienen valor
      if (categoryFilter) serverFilters.category = categoryFilter;
      if (statusFilter) serverFilters.status = statusFilter;
      
      // Para ver borradores, necesitamos incluirlos explícitamente
      if (statusFilter === 'draft' || statusFilter === null) {
        serverFilters.includeDrafts = true;
      }
      
      const data = await templateApi.listTemplates(serverFilters);
      setTemplates(data);
    } catch (error) {
      console.error("Error al cargar plantillas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, statusFilter]);
  
  // Cargar plantillas cuando cambian los filtros de servidor
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);
  
  // Aplicar filtros locales (búsqueda y activo/inactivo)
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Filtrar por búsqueda
      const matchesSearch = searchTerm === "" || 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtrar por activo/inactivo
      const matchesActive = activeFilter === null || template.is_active === activeFilter;
      
      return matchesSearch && matchesActive;
    });
  }, [templates, searchTerm, activeFilter]);
  
  // Agrupar plantillas por tipo de evento después de filtrar
  const templatesByType = useMemo(() => {
    const groupedTemplates: Record<string, any[]> = {};
    
    filteredTemplates.forEach(template => {
      const eventType = template.event_type || "sin-categoria";
      if (!groupedTemplates[eventType]) {
        groupedTemplates[eventType] = [];
      }
      groupedTemplates[eventType].push(template);
    });
    
    return groupedTemplates;
  }, [filteredTemplates]);
  
  // Limpiar todos los filtros
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter(null);
    setStatusFilter(null);
    setActiveFilter(null);
  };
  
  return (
    <div className="space-y-8">
      {/* Cabecera y botón de añadir */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plantillas</h1>
          <p className="text-muted-foreground">
            Gestiona las plantillas de invitaciones
          </p>
        </div>
        <Link href="/admin/templates/editor/new" className="flex items-center text-sm" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Plantilla
          </Button>
        </Link>
      </div>
      
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar plantillas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Select
          value={categoryFilter === null ? "all" : categoryFilter}
          onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="basic">Básica</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={statusFilter === null ? "all" : statusFilter}
          onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Borrador</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Más filtros
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={activeFilter === true}
              onCheckedChange={() => setActiveFilter(activeFilter === true ? null : true)}
            >
              Activas
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilter === false}
              onCheckedChange={() => setActiveFilter(activeFilter === false ? null : false)}
            >
              Inactivas
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {(searchTerm || categoryFilter || statusFilter || activeFilter !== null) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        )}
      </div>
      
      {/* Estado de carga */}
      {isLoading && (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {/* Plantillas agrupadas por tipo */}
      {!isLoading && Object.keys(templatesByType).length > 0 ? (
        Object.entries(templatesByType).map(([eventType, eventTemplates]) => (
          <div key={eventType} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold capitalize">
                {eventType.replace('-', ' ')}
              </h2>
              <Badge variant="outline">{eventTemplates.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventTemplates.map((template) => (
                <div key={template.id} className="relative rounded-lg border overflow-hidden">
                  {template.status === 'draft' && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        Borrador
                      </Badge>
                    </div>
                  )}
                  <div className="aspect-video relative">
                    <Image 
                      src={template.thumbnail_url || '/placeholder.svg'} 
                      alt={template.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback para imágenes que no cargan
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    {template.category && (
                      <div className="absolute bottom-2 left-2">
                        <Badge 
                          variant="secondary" 
                          className={
                            template.category === 'vip' 
                              ? 'bg-purple-100 text-purple-800' 
                              : template.category === 'premium' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }
                        >
                          {template.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{template.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        template.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {template.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description || "Sin descripción"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {template.package_templates?.length || 0} paquetes asociados
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/templates/editor/${template.id}`} passHref>
                        <Button variant="outline" size="sm">Editar</Button>
                      </Link>
                      <form action={`/api/admin/templates/${template.id}/toggle`} method="POST">
                        <Button 
                          type="submit" 
                          variant={template.is_active ? "destructive" : "outline"}
                          size="sm"
                        >
                          {template.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : !isLoading && (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">No hay plantillas que coincidan con los filtros</p>
          {(searchTerm || categoryFilter || statusFilter || activeFilter !== null) && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 