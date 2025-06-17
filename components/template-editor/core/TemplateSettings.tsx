import React from 'react';
import { TemplateConfig } from '../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TemplateSettingsProps {
  config: TemplateConfig;
  onChange: (updatedConfig: TemplateConfig) => void;
}

export default function TemplateSettings({ config, onChange }: TemplateSettingsProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...config, name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...config, description: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    onChange({ ...config, category: value });
  };

  const handleEventTypeChange = (value: string) => {
    onChange({ ...config, eventType: value });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium">Configuración de la plantilla</h3>
      
      <div className="space-y-2">
        <Label htmlFor="template-name">Nombre</Label>
        <Input 
          id="template-name" 
          value={config.name || ''} 
          onChange={handleNameChange} 
          placeholder="Nombre de la plantilla"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template-description">Descripción</Label>
        <Textarea 
          id="template-description" 
          value={config.description || ''} 
          onChange={handleDescriptionChange} 
          placeholder="Descripción de la plantilla"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template-event-type">Tipo de Evento</Label>
        <Select 
          value={config.eventType || 'otro'} 
          onValueChange={handleEventTypeChange}
        >
          <SelectTrigger id="template-event-type">
            <SelectValue placeholder="Selecciona un tipo de evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="boda">Boda</SelectItem>
            <SelectItem value="cumpleanos">Cumpleaños</SelectItem>
            <SelectItem value="xvanos">XV Años</SelectItem>
            <SelectItem value="bautizo">Bautizo</SelectItem>
            <SelectItem value="babyshower">Baby Shower</SelectItem>
            <SelectItem value="graduacion">Graduación</SelectItem>
            <SelectItem value="aniversario">Aniversario</SelectItem>
            <SelectItem value="fiestacorporativa">Fiesta corporativa</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          El tipo de evento ayuda a categorizar y encontrar la plantilla más fácilmente.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template-category">Categoría</Label>
        <Select 
          value={config.category || 'premium'} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="template-category">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Básica</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          La categoría determina en qué paquete estará disponible esta plantilla.
        </p>
      </div>
    </div>
  );
} 