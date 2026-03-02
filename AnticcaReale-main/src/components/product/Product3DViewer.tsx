import { useState, useEffect, useRef, useCallback } from 'react';
import { X, RotateCcw, Maximize2, Box } from 'lucide-react';

interface Product3DViewerProps {
    modelUrl: string;
    productName: string;
    posterImage?: string;
    onClose?: () => void;
    isModal?: boolean;
}

// Dynamically load model-viewer script, yielding to main thread first
const loadModelViewerScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="model-viewer"]')) {
            resolve();
            return;
        }

        setTimeout(() => {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Model viewer yüklenemedi'));
            document.head.appendChild(script);
        }, 100);
    });
};

export default function Product3DViewer({
    modelUrl,
    productName,
    posterImage,
    onClose,
    isModal = false,
}: Product3DViewerProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [hintsVisible, setHintsVisible] = useState(true);
    const viewerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadModelViewerScript()
            .then(() => setIsScriptLoaded(true))
            .catch((err) => setError(err.message));
    }, []);

    // Fade out hints after 5 seconds of model being loaded
    useEffect(() => {
        if (!isLoading && !error) {
            const timer = setTimeout(() => setHintsVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, error]);

    // Escape key handler
    useEffect(() => {
        if (!isModal) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isModal]);

    const handleClose = useCallback(() => {
        if (!onClose) return;
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 480);
    }, [onClose]);

    // Non-modal mode: simple inline viewer
    if (!isModal) {
        return (
            <div className="relative w-full aspect-square rounded-lg overflow-hidden"
                style={{ background: 'radial-gradient(ellipse at center, var(--color-charcoal-100) 0%, var(--color-obsidian-400) 100%)' }}>
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-4">
                        <div className="viewer-spinner" />
                        <p className="font-serif text-parchment-600 text-sm tracking-elegant">Model yükleniyor...</p>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3">
                        <Box className="w-10 h-10 text-agold-600" />
                        <p className="text-parchment-600 text-sm">{error}</p>
                    </div>
                )}
                {isScriptLoaded && (
                    <div
                        ref={(container) => {
                            if (container && !container.querySelector('model-viewer')) {
                                const viewer = document.createElement('model-viewer');
                                viewer.setAttribute('src', modelUrl);
                                viewer.setAttribute('alt', `${productName} 3D görünümü`);
                                if (posterImage) viewer.setAttribute('poster', posterImage);
                                viewer.setAttribute('camera-controls', '');
                                viewer.setAttribute('auto-rotate', '');
                                viewer.setAttribute('shadow-intensity', '1');
                                viewer.setAttribute('environment-image', 'neutral');
                                viewer.style.width = '100%';
                                viewer.style.height = '100%';
                                viewer.style.backgroundColor = 'transparent';
                                viewer.addEventListener('load', () => setIsLoading(false));
                                viewer.addEventListener('error', () => setError('3D model yüklenirken hata oluştu'));
                                container.appendChild(viewer);
                            }
                        }}
                        style={{ width: '100%', height: '100%' }}
                    />
                )}
            </div>
        );
    }

    // ──────────────────── MODAL MODE: Cinematic Overlay ────────────────────

    return (
        <>
            {/* Cinematic Backdrop */}
            <div
                className={`viewer-backdrop ${isClosing ? 'closing' : ''}`}
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Viewer Container */}
            <div className="viewer-container">
                <div
                    className={`viewer-panel ${isClosing ? 'closing' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Title Badge */}
                    <div className="viewer-title">
                        <Box className="w-3.5 h-3.5 text-agold-400" />
                        <span>360° Görünüm</span>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="viewer-close"
                        aria-label="Kapat"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Loading State */}
                    {isLoading && !error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-[5] gap-5">
                            <div className="viewer-spinner" />
                            <p className="font-serif text-parchment-600 text-sm tracking-elegant">
                                Model yükleniyor...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-[5] gap-4">
                            <Box className="w-14 h-14 text-agold-700" />
                            <p className="font-serif text-parchment-400 text-lg">Yüklenemedi</p>
                            <p className="text-parchment-700 text-sm max-w-xs text-center">{error}</p>
                            <button
                                onClick={handleClose}
                                className="mt-4 btn-3d-trigger"
                            >
                                <span>Kapat</span>
                            </button>
                        </div>
                    )}

                    {/* Model Viewer */}
                    {isScriptLoaded && !error && (
                        <div
                            ref={viewerContainerRef}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <div
                                ref={(container) => {
                                    if (container && !container.querySelector('model-viewer')) {
                                        const viewer = document.createElement('model-viewer');
                                        viewer.setAttribute('src', modelUrl);
                                        viewer.setAttribute('alt', `${productName} 3D görünümü`);
                                        if (posterImage) viewer.setAttribute('poster', posterImage);
                                        viewer.setAttribute('camera-controls', '');
                                        viewer.setAttribute('touch-action', 'pan-y');
                                        viewer.setAttribute('auto-rotate', '');
                                        viewer.setAttribute('auto-rotate-delay', '1500');
                                        viewer.setAttribute('rotation-per-second', '24deg');
                                        viewer.setAttribute('interaction-prompt', 'none');
                                        viewer.setAttribute('shadow-intensity', '1.2');
                                        viewer.setAttribute('shadow-softness', '0.8');
                                        viewer.setAttribute('exposure', '1.1');
                                        viewer.setAttribute('environment-image', 'neutral');
                                        viewer.style.width = '100%';
                                        viewer.style.height = '100%';
                                        viewer.style.backgroundColor = 'transparent';

                                        viewer.addEventListener('load', () => setIsLoading(false));
                                        viewer.addEventListener('error', () =>
                                            setError('3D model yüklenirken bir hata oluştu')
                                        );

                                        container.appendChild(viewer);
                                    }
                                }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    )}

                    {/* Interaction Hints */}
                    {!isLoading && !error && (
                        <div
                            className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-3 z-10"
                            style={{ opacity: hintsVisible ? 1 : 0, transition: 'opacity 1.2s ease' }}
                        >
                            <div className="viewer-hint">
                                <RotateCcw className="w-3 h-3 text-agold-500" />
                                <span>Döndürmek için sürükleyin</span>
                            </div>
                            <div className="viewer-hint">
                                <Maximize2 className="w-3 h-3 text-agold-500" />
                                <span>Yakınlaştırmak için kaydırın</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ──────────────────── Trigger Button ────────────────────

export function Product3DToggle({
    onClick,
    className = '',
}: {
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`btn-3d-trigger ${className}`}
            aria-label="Eseri 360° keşfet"
        >
            <RotateCcw className="w-3.5 h-3.5 trigger-icon" />
            <span>Eseri 360° Keşfet</span>
        </button>
    );
}
