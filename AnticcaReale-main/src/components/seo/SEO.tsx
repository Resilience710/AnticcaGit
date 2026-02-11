import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    jsonLd?: object | object[];
    noindex?: boolean;
}

const SITE_URL = 'https://anticca.com.tr';
const SITE_NAME = 'Anticca';
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export default function SEO({
    title,
    description,
    canonical,
    ogImage,
    ogType = 'website',
    jsonLd,
    noindex = false,
}: SEOProps) {
    const fullTitle = title.includes(SITE_NAME)
        ? title
        : `${title} | ${SITE_NAME}`;
    const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
    const image = ogImage || DEFAULT_OG_IMAGE;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {noindex && <meta name="robots" content="noindex,nofollow" />}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:image" content={image} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="tr_TR" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
                </script>
            )}
        </Helmet>
    );
}
