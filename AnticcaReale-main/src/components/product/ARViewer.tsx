import { useState, useEffect, useRef } from 'react';
import { View, Smartphone, X, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface ARViewerProps {
    modelUrl: string;
    productName: string;
    posterImage?: string;
}

// Check if WebXR AR is supported
const isARSupported = (): boolean => {
    if (typeof window === 'undefined') return false;

    // Check for WebXR support
    const hasWebXR = 'xr' in navigator;

    // Check for iOS Quick Look support (Safari on iOS)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Check for Android Scene Viewer support
    const isAndroid = /Android/i.test(navigator.userAgent);

    return hasWebXR || isIOS || isAndroid;
};

export default function ARViewer({ modelUrl, productName, posterImage }: ARViewerProps) {
    const [arSupported, setArSupported] = useState(false);
    const [showARModal, setShowARModal] = useState(false);
    const [arError, setArError] = useState<string | null>(null);
    const modelViewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setArSupported(isARSupported());
    }, []);

    // Create model-viewer element when modal opens
    useEffect(() => {
        if (showARModal && modelViewerRef.current && !arError) {
            const container = modelViewerRef.current;

            // Clear any existing content
            container.innerHTML = '';

            // Create model-viewer element
            const modelViewer = document.createElement('model-viewer');
            modelViewer.setAttribute('src', modelUrl);
            if (posterImage) modelViewer.setAttribute('poster', posterImage);
            modelViewer.setAttribute('alt', productName);
            modelViewer.setAttribute('ar', '');
            modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
            modelViewer.setAttribute('camera-controls', '');
            modelViewer.setAttribute('touch-action', 'pan-y');
            modelViewer.setAttribute('auto-rotate', '');
            modelViewer.setAttribute('shadow-intensity', '1');
            modelViewer.style.width = '100%';
            modelViewer.style.height = '100%';
            modelViewer.style.backgroundColor = 'transparent';

            // Create AR button
            const arButton = document.createElement('button');
            arButton.setAttribute('slot', 'ar-button');
            arButton.className = 'absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gold-500 text-espresso-950 px-6 py-3 rounded-lg font-semibold flex items-center gap-2';
            arButton.innerHTML = '📱 AR\'da Görüntüle';
            modelViewer.appendChild(arButton);

            container.appendChild(modelViewer);
        }
    }, [showARModal, modelUrl, posterImage, productName, arError]);

    const handleARClick = () => {
        if (!arSupported) {
            setArError('AR bu cihazda desteklenmiyor');
            return;
        }
        setShowARModal(true);
    };

    const closeARModal = () => {
        setShowARModal(false);
        setArError(null);
    };

    if (!modelUrl) return null;

    return (
        <>
            {/* AR Button */}
            <button
                onClick={handleARClick}
                className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
          ${arSupported
                        ? 'bg-gold-500 text-espresso-950 hover:bg-gold-600 hover-glow'
                        : 'bg-mist-200 text-mist-500 cursor-not-allowed'
                    }
        `}
                disabled={!arSupported}
                title={arSupported ? 'Odaya Yerleştir (AR)' : 'AR bu cihazda desteklenmiyor'}
            >
                <Smartphone className="w-5 h-5" />
                <span className="font-medium text-sm">Odana Yerleştir</span>
            </button>

            {/* AR Modal */}
            {showARModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={closeARModal}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-2xl glass rounded-2xl shadow-luxe overflow-hidden animate-fade-in-up">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-linen-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-gold-100">
                                    <View className="w-5 h-5 text-gold-700" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg text-espresso-900">{productName}</h3>
                                    <p className="text-sm text-espresso-500">Artırılmış Gerçeklik</p>
                                </div>
                            </div>
                            <button
                                onClick={closeARModal}
                                className="p-2 hover:bg-linen-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-espresso-600" />
                            </button>
                        </div>

                        {/* AR Viewer Content */}
                        <div className="p-6">
                            {arError ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <AlertCircle className="w-16 h-16 text-burgundy-500 mb-4" />
                                    <h4 className="font-serif text-xl text-espresso-900 mb-2">AR Kullanılamıyor</h4>
                                    <p className="text-espresso-600 mb-6">{arError}</p>
                                    <Button variant="outline" onClick={closeARModal}>Kapat</Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Model Viewer Container */}
                                    <div
                                        ref={modelViewerRef}
                                        className="aspect-[4/3] bg-linen-100 rounded-xl overflow-hidden relative"
                                    />

                                    {/* Instructions */}
                                    <div className="bg-linen-100 rounded-lg p-4 space-y-2">
                                        <h4 className="font-semibold text-espresso-800 text-sm">Nasıl Kullanılır?</h4>
                                        <ul className="text-sm text-espresso-600 space-y-1">
                                            <li className="flex items-start gap-2">
                                                <span className="text-gold-600">1.</span>
                                                <span>"AR'da Görüntüle" butonuna tıklayın</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-gold-600">2.</span>
                                                <span>Kameranızı düz bir zemine doğrultun</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-gold-600">3.</span>
                                                <span>Ürünü istediğiniz yere yerleştirin</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Export a simple AR availability indicator
export function ARBadge() {
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        setSupported(isARSupported());
    }, []);

    if (!supported) return null;

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gold-100 text-gold-800 text-xs font-medium rounded-full">
            <Smartphone className="w-3 h-3" />
            AR Uyumlu
        </span>
    );
}
