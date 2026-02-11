import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Play, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useBlogPost } from '../hooks/useFirestore';
import Loading from '../components/ui/Loading';
import { useState } from 'react';
import { isVideoBlogPost, isRichTextBlogPost } from '../types';
import SEO from '../components/seo/SEO';

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { post, loading, error } = useBlogPost(id || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (loading) {
    return <Loading fullScreen text="Blog yazısı yükleniyor..." />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-linen-300 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-espresso-900 mb-4">Blog yazısı bulunamadı</h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Blog'a Dön
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  // Get gallery images for rich text posts
  const galleryImages = isRichTextBlogPost(post) ? post.galleryImages : [];

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null || galleryImages.length === 0) return;
    const newIndex = direction === 'prev'
      ? (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length
      : (selectedImageIndex + 1) % galleryImages.length;
    setSelectedImageIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-linen-50">
      <SEO
        title={post.title}
        description={post.excerpt?.substring(0, 155) || `${post.title} - Anticca Blog`}
        canonical={`/blog/${post.slug || post.id}`}
        ogImage={post.thumbnailUrl}
        ogType="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "image": post.thumbnailUrl,
          "datePublished": post.publishedAt ? new Date((post.publishedAt as any).toDate?.() || post.publishedAt).toISOString() : undefined,
          "dateModified": post.updatedAt ? new Date((post.updatedAt as any).toDate?.() || post.updatedAt).toISOString() : undefined,
          "author": { "@type": "Organization", "name": "Anticca" },
          "publisher": { "@type": "Organization", "name": "Anticca", "logo": { "@type": "ImageObject", "url": "https://anticca.com.tr/logo.png" } },
          "description": post.excerpt
        }}
      />
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] border-b border-linen-200">
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="w-full h-full object-cover attachment-fixed"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-olive-900/90 via-olive-900/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-sm hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium tracking-wide text-sm">Blog'a Dön</span>
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            {/* Type Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-600/90 backdrop-blur-sm text-white rounded-sm text-xs font-medium uppercase tracking-wider mb-6 shadow-sm border border-gold-500/50">
              {post.type === 'video' ? (
                <>
                  <Play className="w-3 h-3" />
                  Video İçerik
                </>
              ) : (
                <>
                  <ImageIcon className="w-3 h-3" />
                  Makale
                </>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-medium text-white mb-6 drop-shadow-sm leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-linen-100 text-sm font-light tracking-wide uppercase">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-500" />
                {formatDate(post.createdAt)}
              </span>
              {isVideoBlogPost(post) && post.videoDuration && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-500" />
                  {post.videoDuration}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Video Content */}
        {isVideoBlogPost(post) && post.videoUrl && (
          <div className="mb-12">
            <div className="aspect-video rounded-sm overflow-hidden shadow-2xl border-4 border-white bg-black">
              <iframe
                src={getVideoEmbedUrl(post.videoUrl)}
                title={post.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Description */}
            {post.videoDescription && (
              <div className="mt-8 p-8 bg-white rounded-sm border-l-4 border-gold-600 shadow-soft">
                <p className="text-espresso-800 text-lg leading-relaxed font-light">
                  {post.videoDescription}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Rich Text Content */}
        {isRichTextBlogPost(post) && (
          <>
            {/* Rich Text Body */}
            {post.content && (
              <div className="bg-white rounded-sm p-8 md:p-12 mb-12 border border-linen-200 shadow-soft">
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-serif prose-headings:font-medium prose-headings:text-olive-900
                    prose-p:text-espresso-600 prose-p:leading-8 prose-p:font-light
                    prose-a:text-gold-700 prose-a:no-underline hover:prose-a:text-gold-800 hover:prose-a:underline
                    prose-strong:text-olive-900 prose-strong:font-semibold
                    prose-blockquote:border-l-gold-500 prose-blockquote:text-espresso-700 prose-blockquote:italic prose-blockquote:bg-linen-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-sm
                    prose-ul:text-espresso-600 prose-ol:text-espresso-600
                    prose-li:marker:text-gold-500
                    prose-code:text-espresso-800 prose-code:bg-linen-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-light
                    prose-pre:bg-olive-900 prose-pre:text-linen-100 prose-pre:rounded-sm"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            )}

            {/* Image Gallery */}
            {post.galleryImages && post.galleryImages.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-serif font-medium text-olive-900 mb-8 flex items-center gap-3 border-b border-linen-200 pb-4">
                  <ImageIcon className="w-6 h-6 text-gold-600" />
                  Galeri
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {post.galleryImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => openLightbox(index)}
                      className="relative aspect-square rounded-sm overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all"
                    >
                      <img
                        src={image}
                        alt={`${post.title} - Görsel ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-olive-900/0 group-hover:bg-olive-900/30 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 font-medium tracking-wider uppercase text-xs bg-black/50 px-3 py-1.5 rounded-sm backdrop-blur-sm">
                          Büyüt
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-linen-200">
            <h3 className="text-xs uppercase tracking-widest text-espresso-400 mb-4 font-semibold">Etiketler</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-linen-100 text-espresso-600 border border-linen-200 rounded-sm text-sm hover:bg-white hover:border-gold-400 hover:text-gold-700 transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 pt-12 border-t border-linen-200 flex justify-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 px-8 py-3 bg-olive-900 text-white rounded-sm font-medium hover:bg-olive-800 transition-all shadow-md hover:shadow-lg group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="tracking-wide">Blog'a Dön</span>
          </Link>
        </div>
      </div>

      {/* Lightbox - Kept mostly same but with backdrop update */}
      {selectedImageIndex !== null && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-olive-950/95 backdrop-blur-md flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
            className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <img
            src={galleryImages[selectedImageIndex]}
            alt={`${post.title} - Görsel ${selectedImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
            className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
