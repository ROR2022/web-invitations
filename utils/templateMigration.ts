import { 
  TemplateConfig, 
  ComponentConfig, 
  ComponentType,
  TextProperty,
  ColorProperty,
  ImageProperty,
  SelectProperty,
  Theme
} from "@/components/template-editor/types";

/**
 * Interface for legacy templates that might have HTML/CSS/JS fields
 */
interface LegacyTemplate {
  id: string;
  name: string;
  description?: string | null;
  html?: string | null;
  css?: string | null;
  js?: string | null;
  config?: any | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  is_public: boolean | null;
  event_type: string | null;
  thumbnail: string | null;
}

/**
 * Check if a template needs migration
 * @param template The template object to check
 * @returns True if the template needs migration
 */
export function needsMigration(template: LegacyTemplate): boolean {
  // Template needs migration if it has HTML/CSS/JS fields but no config
  // or if it has both HTML/CSS/JS and config (partial migration)
  return (
    (!!template.html || !!template.css || !!template.js) && 
    (!template.config || Object.keys(template.config).length === 0)
  );
}

/**
 * Check if a template can be automatically migrated
 * @param template The template object to check
 * @returns True if automatic migration is possible
 */
export function canAutoMigrate(template: LegacyTemplate): boolean {
  // Template can be automatically migrated if it has a config
  return !!template.config && Object.keys(template.config).length > 0;
}

/**
 * Get the list of fields that will be cleared during migration
 * @param template The template object to check
 * @returns Array of field names that will be cleared
 */
export function getFieldsToClear(template: LegacyTemplate): string[] {
  const fields: string[] = [];
  
  if (template.html) fields.push('html');
  if (template.css) fields.push('css');
  if (template.js) fields.push('js');
  
  return fields;
}

/**
 * Create a SQL migration statement for converting a template
 * @param templateId The ID of the template to migrate
 * @returns SQL statement for migration
 */
export function createMigrationSQL(templateId: string): string {
  return `
-- Migration for template ${templateId}
UPDATE templates
SET html = NULL, css = NULL, js = NULL, updated_at = NOW()
WHERE id = '${templateId}' AND config IS NOT NULL;
  `.trim();
}

/**
 * Create a SQL migration statement for all templates
 * @returns SQL statement for migrating all templates
 */
export function createBatchMigrationSQL(): string {
  return `
-- Migration for all templates that have a config
UPDATE templates
SET html = NULL, css = NULL, js = NULL, updated_at = NOW()
WHERE config IS NOT NULL AND (html IS NOT NULL OR css IS NOT NULL OR js IS NOT NULL);
  `.trim();
}

/**
 * Create a SQL query to find templates without config
 * @returns SQL query that finds templates needing manual migration
 */
export function findTemplatesWithoutConfigSQL(): string {
  return `
-- Find templates that need manual migration
SELECT id, name, event_type, created_at
FROM templates 
WHERE (html IS NOT NULL OR css IS NOT NULL OR js IS NOT NULL)
AND (config IS NULL OR jsonb_typeof(config) = 'null');
  `.trim();
}

/**
 * Create a basic default config for a template that has none
 * This is a fallback for templates that can't be automatically migrated
 * @param template The legacy template
 * @returns A basic default config
 */
export function createDefaultConfig(template: LegacyTemplate): TemplateConfig {
  const theme: Theme = {
    name: template.name || "Default Theme",
    colors: {
      primary: "#4F46E5",
      secondary: "#EC4899",
      background: "#FFFFFF",
      text: "#333333",
      headings: "#333333"
    },
    fonts: {
      heading: "Montserrat",
      body: "Open Sans",
      accent: "Great Vibes"
    }
  };
  
  // Create a very basic config with minimal components
  return {
    id: template.id,
    name: template.name || "Default Template",
    description: template.description || undefined,
    theme,
    components: [
      createHeroComponent(template),
      createInvitationComponent(template)
    ]
  };
}

/**
 * Helper function to create a hero component with proper typing
 */
function createHeroComponent(template: LegacyTemplate): ComponentConfig {
  return {
    id: "hero-1",
    type: "hero" as ComponentType,
    order: 1,
    visible: true,
    properties: {
      title: createTextProperty("Invitación", "Título principal"),
      subtitle: createTextProperty("Te invitamos a", "Subtítulo"),
      name: createTextProperty(template.event_type || "Nuestro evento", "Nombre del evento"),
      backgroundImages: {
        type: "array",
        label: "Imágenes de fondo",
        default: ["/images/default-hero.jpg"]
      },
      height: createSelectProperty("fullscreen", "Altura", [
        { value: "fullscreen", label: "Pantalla completa" },
        { value: "large", label: "Grande" },
        { value: "medium", label: "Mediano" },
        { value: "small", label: "Pequeño" }
      ]),
      textColor: createColorProperty("#ffffff", "Color de texto"),
      backgroundOverlay: createColorProperty("rgba(0,0,0,0.5)", "Superposición de fondo")
    }
  };
}

/**
 * Helper function to create an invitation component with proper typing
 */
function createInvitationComponent(template: LegacyTemplate): ComponentConfig {
  return {
    id: "invitation-1",
    type: "invitation" as ComponentType,
    order: 2,
    visible: true,
    properties: {
      introText: createTextProperty("Acompáñanos a celebrar", "Texto de introducción"),
      mainEventText: createTextProperty(template.event_type || "Nuestro evento", "Texto principal del evento"),
      formalText: createTextProperty("con la bendición de Dios", "Texto formal")
    }
  };
}

/**
 * Helper functions to create properties with the correct types
 */
function createTextProperty(defaultValue: string, label: string): TextProperty {
  return {
    type: "text",
    label,
    default: defaultValue
  };
}

function createColorProperty(defaultValue: string, label: string): ColorProperty {
  return {
    type: "color",
    label,
    default: defaultValue
  };
}

function createImageProperty(defaultValue: string, label: string): ImageProperty {
  return {
    type: "image",
    label,
    default: defaultValue
  };
}

function createSelectProperty(
  defaultValue: string, 
  label: string, 
  options: { value: string; label: string }[]
): SelectProperty {
  return {
    type: "select",
    label,
    default: defaultValue,
    options
  };
} 