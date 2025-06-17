import React from "react";
import { Layers, Grid, Settings, LayoutGrid, Mail, Heart } from "lucide-react";
import type { ComponentType } from "../types";

// Iconos para los tipos de componentes
export const componentTypeIcons: Record<string, React.ReactNode> = {
  hero: <Layers className="h-4 w-4" />,
  countdown: <Grid className="h-4 w-4" />,
  eventDetails: <Settings className="h-4 w-4" />,
  gallery: <LayoutGrid className="h-4 w-4" />,
  attendance: <Layers className="h-4 w-4" />,
  giftOptions: <Layers className="h-4 w-4" />,
  musicPlayer: <Layers className="h-4 w-4" />,
  thankYou: <Layers className="h-4 w-4" />,
  invitation: <Mail className="h-4 w-4" />,
  couple: <Heart className="h-4 w-4" />,
};

// Componente de icono por tipo
export const ComponentIcon: React.FC<{type: ComponentType}> = ({ type }) => {
  return <>{componentTypeIcons[type] || <Layers className="h-4 w-4" />}</>;
};

export default ComponentIcon;
