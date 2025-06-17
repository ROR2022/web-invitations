"use client";

import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import PropertyWrapper from '../common/PropertyWrapper';
import { NamedComponentProperty } from '../../types';

interface DateControlProps {
  property: NamedComponentProperty;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Control para propiedades de tipo fecha
 */
const DateControl: React.FC<DateControlProps> = ({
  property,
  value,
  onChange
}) => {
  const { name, label, description, required } = property;
  const minDate = (property as any).minDate ? new Date((property as any).minDate) : undefined;
  const maxDate = (property as any).maxDate ? new Date((property as any).maxDate) : undefined;
  
  // Convertir el valor de string a Date para el calendario
  const date = value ? new Date(value) : undefined;
  
  // Manejar cambio de fecha
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onChange(date.toISOString());
    } else {
      onChange('');
    }
  };
  
  return (
    <PropertyWrapper
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            fromDate={minDate}
            toDate={maxDate}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </PropertyWrapper>
  );
};

export default DateControl;
