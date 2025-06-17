# Mobile Editor Implementation - Phase 1 Documentation

## Essential Properties for Each Component Type

Based on the investigation of the existing configurable components, here's a list of the essential properties for each component type that should be editable in the mobile interface:

### 1. Hero Component
- **Critical Properties**:
  - `title`: Main title text
  - `subtitle`: Secondary text
  - `name`: Celebrated person's name
  - `backgroundImages`: Background image(s)
  - `textColor`: Color of all text elements

- **Optional Properties** (can be excluded from mobile editing):
  - `useCarousel`: Whether to use carousel for background images
  - `carouselInterval`: Time between image changes
  - `carouselEffect`: Transition effect type
  - `backgroundOverlay`: Overlay color opacity
  - `titleFont`, `subtitleFont`, `nameFont`: Font selections
  - `height`: Section height
  - `animation`: Animation type

### 2. Event Details Component
- **Critical Properties**:
  - `title`: Section title
  - `date`: Event date
  - `time`: Event time
  - `location`: Event location
  - `showMap`: Whether to display map

- **Optional Properties**:
  - `backgroundColor`: Background color
  - `textColor`: Text color
  - `accentColor`: Accent color for design elements

### 3. Countdown Component
- **Critical Properties**:
  - `title`: Section title
  - `eventDate`: Date to count down to
  - `eventTime`: Time of the event

- **Optional Properties**:
  - `showLabels`: Whether to show labels
  - `backgroundColor`: Background color
  - `textColor`: Text color
  - `accentColor`: Accent color
  - `style`: Visual style (simple, boxes, circles, flip)
  - `animation`: Whether to animate

### 4. Gallery Component
- **Critical Properties**:
  - `title`: Gallery title
  - `images`: Array of images or individual image properties (image1-image12)
  - `layout`: Display layout (grid, masonry, carousel, slideshow)

- **Optional Properties**:
  - `description`: Gallery description
  - `numberOfImages`: Maximum number of images to display
  - `captions`: Image captions
  - `backgroundColor`: Background color
  - `textColor`: Text color
  - `showCaptions`: Whether to display captions
  - `enableLightbox`: Whether to enable fullscreen viewing
  - `imageStyle`: Image display style (square, rounded, circle, polaroid)

### 5. Attendance Component
- **Critical Properties**:
  - `title`: Section title
  - `description`: Section description
  - `buttonText`: RSVP button text

- **Optional Properties**:
  - `backgroundColor`: Background color
  - `textColor`: Text color
  - `buttonColor`: Button color
  - `buttonTextColor`: Button text color
  - `deadlineDate`: RSVP deadline

### 6. Music Player Component
- **Critical Properties**:
  - `title`: Section title
  - `audioUrl`: URL to audio file
  - `songTitle`: Name of the song
  - `songArtist`: Name of the artist

- **Optional Properties**:
  - `backgroundColor`: Background color
  - `textColor`: Text color
  - `accentColor`: Accent color
  - `coverImage`: Album/song cover image
  - `autoplay`: Whether to autoplay the music

### 7. Thank You Component
- **Critical Properties**:
  - `title`: Section title
  - `message`: Thank you message
  - `signature`: Host names or signature

- **Optional Properties**:
  - `backgroundColor`: Background color
  - `textColor`: Text color
  - `signatureFont`: Font for signature

### 8. Gift Options Component
- **Critical Properties**:
  - `title`: Section title
  - `description`: Section description
  - `options`: Gift registry options

- **Optional Properties**:
  - `backgroundColor`: Background color
  - `textColor`: Text color
  - `showImages`: Whether to show registry logos/images

## Mobile Modal Wireframes

### General Modal Structure
All component editing modals should follow this basic structure:

```
+------------------------------------------+
|  Component Name                      X   |
+------------------------------------------+
|                                          |
|  [Preview of the component]              |
|                                          |
+------------------------------------------+
|  Property 1                              |
|  [Control for Property 1]                |
|                                          |
|  Property 2                              |
|  [Control for Property 2]                |
|                                          |
|  ...                                     |
|                                          |
+------------------------------------------+
|  [Cancel]              [Save Changes]    |
+------------------------------------------+
```

### Specific Modal Examples

#### Hero Component Modal
```
+------------------------------------------+
|  Edit Hero Section                   X   |
+------------------------------------------+
|                                          |
|  [Preview of current hero]               |
|                                          |
+------------------------------------------+
|  Title                                   |
|  [Text Input: "Mis XV Años"]             |
|                                          |
|  Subtitle                                |
|  [Text Input: "Te invito a celebrar..."] |
|                                          |
|  Your Name                               |
|  [Text Input: "Ana Sofía"]               |
|                                          |
|  Background Image                        |
|  [Image selector with preview]           |
|                                          |
|  Text Color                              |
|  [Color picker]                          |
|                                          |
+------------------------------------------+
|  [Cancel]              [Save Changes]    |
+------------------------------------------+
```

#### Event Details Modal
```
+------------------------------------------+
|  Edit Event Details                  X   |
+------------------------------------------+
|                                          |
|  [Preview of event details section]      |
|                                          |
+------------------------------------------+
|  Title                                   |
|  [Text Input: "Detalles del Evento"]     |
|                                          |
|  Date                                    |
|  [Date picker]                           |
|                                          |
|  Time                                    |
|  [Time picker]                           |
|                                          |
|  Location                                |
|  [Text Input with map pin option]        |
|                                          |
|  Show Map                                |
|  [Toggle switch]                         |
|                                          |
+------------------------------------------+
|  [Cancel]              [Save Changes]    |
+------------------------------------------+
```

## Interaction Flow

1. **Identifying Editable Areas**:
   - All editable components display a subtle edit indicator (pencil icon) when the user is in edit mode
   - The indicator appears when the user hovers or taps on an editable section

2. **Component Selection**:
   - User taps on the component they want to edit
   - Component is highlighted with a subtle outline
   - A floating edit button appears

3. **Opening Edit Modal**:
   - User taps the edit button
   - Modal slides up from the bottom of the screen
   - Modal shows a preview of the component and critical properties

4. **Making Changes**:
   - User edits properties using appropriate controls
   - Live preview updates as changes are made (when possible)
   - Properties are organized by importance

5. **Saving Changes**:
   - User taps "Save Changes" to confirm edits
   - Modal closes with a sliding animation
   - Component reflects the changes
   - A success message appears briefly

6. **Canceling Changes**:
   - User can tap "Cancel" or the X button
   - Modal closes
   - No changes are applied to the component

## Transition Animations

1. **Modal Opening Animation**:
   - Slide up from bottom of screen
   - Duration: 300ms
   - Easing: ease-out
   - Backdrop fades in simultaneously

2. **Modal Closing Animation**:
   - Slide down to bottom of screen
   - Duration: 250ms
   - Easing: ease-in
   - Backdrop fades out simultaneously

3. **Property Changes Preview**:
   - Gentle fade transition for text/color changes
   - Cross-fade for image changes
   - Duration: 200ms

4. **Success Indicator**:
   - Brief green checkmark or success message
   - Fades in quickly (150ms)
   - Stays visible briefly (1.5s)
   - Fades out (300ms)

## Edit Indicators Style Guide

1. **Inactive State (Normal Viewing)**:
   - No visible edit indicators
   - Components appear exactly as they will in the final invitation

2. **Edit Mode Activated**:
   - Subtle pencil icon appears at the top-right corner of each editable component
   - Icon is semi-transparent (opacity: 0.6) until hovered/tapped
   - Light subtle dashed outline appears on hover

3. **Component Selected**:
   - Solid outline appears around the component (2px width)
   - Outline color: Primary theme color with 60% opacity
   - Edit button becomes fully opaque
   - Background receives a very subtle highlight

4. **Visual Accessibility**:
   - Edit indicators maintain sufficient contrast with any background
   - Minimum touch target size: 44x44px for mobile interactions
   - Visual feedback on every interaction

## Component Structure for Mobile Version

### MobileTemplateEditor Component
```typescript
// Main container component for mobile editing
const MobileTemplateEditor: React.FC<{
  invitation: Invitation;
  onSave: (config: any) => Promise<void>;
}> = ({ invitation, onSave }) => {
  // State and handlers
  return (
    <div className="mobile-template-editor">
      <PreviewSection />
      <EditableComponentList />
      <MobileEditModal />
    </div>
  );
};
```

### EditableComponent HOC
```typescript
// Higher-order component to make any component editable on mobile
const EditableComponent: React.FC<{
  component: ComponentConfig;
  onEdit: (componentId: string) => void;
}> = ({ component, onEdit, children }) => {
  // Logic for showing edit indicators and handling taps
  return (
    <div className="editable-component-wrapper">
      {children}
      <EditIndicator onClick={() => onEdit(component.id)} />
    </div>
  );
};
```

### MobileEditModal Component
```typescript
// Modal for editing component properties on mobile
const MobileEditModal: React.FC<{
  isOpen: boolean;
  component: ComponentConfig | null;
  onClose: () => void;
  onSave: (componentId: string, updates: Record<string, any>) => void;
}> = ({ isOpen, component, onClose, onSave }) => {
  // Modal state and logic
  return (
    <motion.div 
      className="mobile-edit-modal"
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {component && (
        <>
          <ModalHeader title={component.type} onClose={onClose} />
          <ComponentPreview component={component} />
          <MobilePropertyEditor 
            component={component}
            onChange={handlePropertyChange} 
          />
          <ModalFooter onCancel={onClose} onSave={handleSave} />
        </>
      )}
    </motion.div>
  );
};
```

### MobilePropertyEditor Component
```typescript
// Simplified property editor for mobile
const MobilePropertyEditor: React.FC<{
  component: ComponentConfig;
  onChange: (propertyName: string, value: any) => void;
}> = ({ component, onChange }) => {
  // Filter to only show essential properties
  const essentialProperties = getEssentialProperties(component.type);
  
  return (
    <div className="mobile-property-editor">
      {essentialProperties.map(prop => (
        <MobilePropertyControl
          key={prop.name}
          property={prop}
          value={component.properties[prop.name]}
          onChange={(value) => onChange(prop.name, value)}
        />
      ))}
    </div>
  );
};
```

## Integration Strategy with Existing Components

1. **Shared Component Pool**:
   - Both desktop and mobile editors will use the same underlying configurable components
   - Component configs (schemas) will be shared but filtered for mobile

2. **Interface Adapters**:
   - Create adapter components that translate between desktop and mobile editing paradigms
   - Property filtering logic to show only essential properties on mobile

3. **Shared State Management**:
   - Both editors will use the same state management approach
   - Mobile editor will apply partial updates to the shared state

4. **Progressive Enhancement**:
   - Desktop editor will have all capabilities
   - Mobile editor will focus on the most common editing needs
   - Detection system will automatically choose the appropriate editor based on device

## Data Model for Partial Edits

For the mobile editor, we'll use a simplified data model that focuses only on the essential properties:

```typescript
interface MobileEditOperation {
  componentId: string;
  propertyUpdates: Record<string, any>;
  timestamp: number;
}

interface MobileEditorState {
  invitation: Invitation;
  activeComponentId: string | null;
  editHistory: MobileEditOperation[];
  pendingChanges: Record<string, Record<string, any>>;
  isModalOpen: boolean;
}
```

The mobile editor will track changes separately and only update the main configuration when the user explicitly saves their changes. This approach allows for better performance on mobile devices and easier implementation of features like undo/redo.

## Device Detection Strategy

We'll use a combination of techniques to detect mobile devices and provide the appropriate editor interface:

1. **CSS Media Queries**:
   - Use responsive breakpoints to adjust layout
   - Base detection on screen width (< 768px for mobile)

2. **Feature Detection**:
   - Check for touch capabilities
   - Consider available memory and processing power

3. **User Agent Analysis** (as fallback):
   - Parse User-Agent string to identify mobile devices
   - Consider this as secondary to the other methods

4. **User Preference**:
   - Allow users to manually switch between mobile and desktop interfaces
   - Remember preference in local storage

```typescript
const determineEditorType = () => {
  // Check screen width (primary method)
  const isMobileViewport = window.innerWidth < 768;
  
  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || 
    navigator.maxTouchPoints > 0;
  
  // Get user preference (if set)
  const userPreference = localStorage.getItem('editorPreference');
  
  if (userPreference === 'desktop') return 'desktop';
  if (userPreference === 'mobile') return 'mobile';
  
  // Auto-detect based on device capabilities
  return (isMobileViewport && isTouchDevice) ? 'mobile' : 'desktop';
};
```

This strategy will provide a seamless experience for users on different devices while allowing them to override the automatic detection if needed.

## Next Steps

The next phase (Phase 2) will focus on implementing the core mobile editor container component and the basic modal interface structure based on this documentation.
