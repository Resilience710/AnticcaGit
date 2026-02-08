// Type declarations for custom elements used in the project

declare namespace JSX {
    interface IntrinsicElements {
        'model-viewer': ModelViewerAttributes;
    }
}

interface ModelViewerAttributes extends React.HTMLAttributes<HTMLElement> {
    src?: string;
    poster?: string;
    alt?: string;
    ar?: boolean;
    'ar-modes'?: string;
    'camera-controls'?: boolean;
    'touch-action'?: string;
    'auto-rotate'?: boolean;
    'shadow-intensity'?: string;
    slot?: string;
}
