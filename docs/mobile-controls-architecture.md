# Mobile Controls Architecture

This document describes the architecture of the mobile-optimized controls for the template editor.

## Component Hierarchy

```
MobileTemplateEditor
└── MobileEditModal
    └── MobilePropertyEditor
        ├── MobileStringControl
        ├── MobileColorControl
        ├── MobileBooleanControl
        ├── MobileDateControl
        ├── MobileTimeControl
        ├── MobileImageControl
        ├── MobileLocationControl
        ├── MobileMusicControl
        ├── MobileFontControl
        └── MobileRichTextControl
```

## Control Types Mapping

| Property Type | Mobile Control          | Description                                      |
|---------------|------------------------|--------------------------------------------------|
| string        | MobileStringControl    | Basic text input                                 |
| color         | MobileColorControl     | Color selection with preview                     |
| boolean       | MobileBooleanControl   | Toggle switch for yes/no values                  |
| date          | MobileDateControl      | Date picker optimized for touch                  |
| time          | MobileTimeControl      | Time picker with 12h/24h format support          |
| image         | MobileImageControl     | Image selection and preview                      |
| location      | MobileLocationControl  | Address input with map link generation           |
| music         | MobileMusicControl     | Audio selection with playback preview            |
| font          | MobileFontControl      | Font selection with categorized list             |
| richtext      | MobileRichTextControl  | Text with basic formatting options               |

## Type Definitions

Each control accepts a standardized set of props:
- `label` - Display name for the property
- `value` - Current value of the property
- `onChange` - Callback function to update the property value

Specialized props include:
- **MobileTimeControl**: `format` for 12h/24h time display
- **MobileFontControl**: `sampleText` for font preview
- **MobileRichTextControl**: `multiline` for text area behavior
- **MobileLocationControl**: Handles complex object with address, URL, and button text

## Property Type Detection

The `MobilePropertyEditor` determines which control to use based on the `type` field in each property definition:

```typescript
// In MobilePropertyEditor.tsx
const renderPropertyControl = (propertyName: string, propertyType: string) => {
  // ...
  switch (propertyType) {
    case 'string': return <MobileStringControl ... />;
    case 'color': return <MobileColorControl ... />;
    // ... other cases
  }
};
```

## Component-Specific Property Mappings

Different component types have their essential properties mapped to appropriate control types:

```typescript
// Example for EVENT_DETAILS component
case ComponentType.EVENT_DETAILS:
  return [
    { name: 'title', type: 'string' },
    { name: 'date', type: 'date' },
    { name: 'time', type: 'time' },
    { name: 'location', type: 'location' },
    { name: 'showMap', type: 'boolean' }
  ];
```

## Styling Approach

All mobile controls follow these styling conventions:
- Common class `.property-control` for consistent spacing
- Common class `.property-label` for labels
- Control-specific container classes (e.g., `.time-control`)
- Touch-friendly input elements with adequate sizing
- Mobile-optimized dropdowns and selectors
- Visual feedback for active states

## Integration with Backend

Controls are designed to work with the existing property system and convert between:
- Native JavaScript types (string, boolean, number)
- Complex object types (for location, rich text)
- Formatted strings (for dates, times)

The mobile editor maintains compatibility with the desktop editor's data format while providing a simplified mobile interface.
