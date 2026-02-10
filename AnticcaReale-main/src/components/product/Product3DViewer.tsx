import React, { useState, useEffect, lazy, Suspense } from 'react';
import { X, Box, RotateCcw, Maximize2 } from 'lucide-react';

interface Product3DViewerProps {
    modelUrl: string;
    productName: string;
    posterImage?: string;
    onClose?: () => void;
    isModal?: boolean;
}

// Dynamically load model-viewer script
const loadModelViewerScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="model-viewer"]')) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Model viewer yüklenemedi'));
        document.head.appendChild(script);
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

    useEffect(() => {
        loadModelViewerScript()
            .then(() => setIsScriptLoaded(true))
            .catch((err) => setError(err.message));
    }, []);

    const containerClasses = isModal
        ? 'fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4'
        : 'relative w-full aspect-square bg-linen-100 rounded-lg overflow-hidden';

    const viewerClasses = isModal
        ? 'w-full max-w-4xl aspect-square bg-linen-50 rounded-lg shadow-2xl'
        : 'w-full h-full';

    if (error) {
        return (
            <div className={containerClasses}>
                <div className="text-center p-8">
                    <Box className="w-12 h-12 text-espresso-400 mx-auto mb-4" />
                    <p className="text-espresso-600">{error}</p>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 bg-olive-800 text-white rounded-sm hover:bg-olive-700 transition-colors"
                        >
                            Kapat
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={containerClasses} onClick={isModal ? onClose : undefined}>
            {/* Modal Close Button */}
            {isModal && onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    aria-label="Kapat"
                >
                    <X className="w-6 h-6" />
                </button>
            )}

            {/* 3D Viewer Container */}
            <div
                className={viewerClasses}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-linen-100 z-10">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-espresso-600 text-sm">3D model yükleniyor...</p>
                        </div>
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
                                viewer.setAttribute('touch-action', 'pan-y');
                                viewer.setAttribute('auto-rotate', '');
                                viewer.setAttribute('auto-rotate-delay', '2000');
                                viewer.setAttribute('rotation-per-second', '30deg');
                                viewer.setAttribute('interaction-prompt', 'auto');
                                viewer.setAttribute('shadow-intensity', '1');
                                viewer.setAttribute('shadow-softness', '1');
                                viewer.setAttribute('exposure', '1');
                                viewer.setAttribute('environment-image', 'neutral');
                                viewer.style.width = '100%';
                                viewer.style.height = '100%';
                                viewer.style.backgroundColor = 'transparent';

                                viewer.addEventListener('load', () => setIsLoading(false));
                                viewer.addEventListener('error', () => setError('3D model yüklenirken bir hata oluştu'));

                                container.appendChild(viewer);
                            }
                        }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {/* Controls Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 pointer-events-none z-10">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
                                <RotateCcw className="w-3 h-3" />
                                <span>Döndürmek için sürükleyin</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Header */}
            {isModal && (
                <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
                        <Box className="w-4 h-4 text-gold-400" />
                        <span className="text-sm font-medium">3D Görünüm</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Toggle Button Component
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
            className={`
        inline-flex items-center gap-2 px-4 py-2
        bg-white/80 backdrop-blur-sm border border-linen-300
        text-olive-800 rounded-sm shadow-sm
        hover:bg-white hover:border-gold-500 hover:text-gold-700
        transition-all duration-300
        text-sm font-medium
        ${className}
      `}
            aria-label="3D görünümü aç"
        >
            <Box className="w-4 h-4" />
            <span>3D Görünüm</span>
        </button>
    );
}
