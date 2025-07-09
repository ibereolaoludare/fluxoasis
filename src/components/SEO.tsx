import { useEffect } from "react";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: "website" | "article" | "product";
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
}

export default function SEO({
    title = "Fluxoasis - Premium Beverages & Drinks",
    description = "Discover premium beverages and drinks at Fluxoasis. Shop our curated collection of soft drinks, energy drinks, juices, and more. Fast delivery and excellent customer service.",
    keywords = "beverages, drinks, soft drinks, energy drinks, juices, water, premium drinks, online drinks store",
    image = "/og-image.jpg",
    url = "",
    type = "website",
    author = "Fluxoasis",
    publishedTime,
    modifiedTime,
    section,
    tags = [],
}: SEOProps) {
    useEffect(() => {
        // Update document title
        document.title = title;

        // Update or create meta tags
        const updateMetaTag = (name: string, content: string) => {
            let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
            if (!meta) {
                meta = document.createElement("meta");
                meta.name = name;
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        const updatePropertyTag = (property: string, content: string) => {
            let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
            if (!meta) {
                meta = document.createElement("meta");
                meta.setAttribute("property", property);
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        // Basic meta tags
        updateMetaTag("description", description);
        updateMetaTag("keywords", keywords);
        updateMetaTag("author", author);

        // Open Graph tags
        updatePropertyTag("og:title", title);
        updatePropertyTag("og:description", description);
        updatePropertyTag("og:type", type);
        updatePropertyTag("og:url", `${window.location.origin}${url}`);
        updatePropertyTag("og:image", `${window.location.origin}${image}`);
        updatePropertyTag("og:site_name", "Fluxoasis");

        // Twitter Card tags
        updatePropertyTag("twitter:card", "summary_large_image");
        updatePropertyTag("twitter:title", title);
        updatePropertyTag("twitter:description", description);
        updatePropertyTag("twitter:image", `${window.location.origin}${image}`);

        // Additional meta tags for articles/products
        if (publishedTime) {
            updatePropertyTag("article:published_time", publishedTime);
        }
        if (modifiedTime) {
            updatePropertyTag("article:modified_time", modifiedTime);
        }
        if (section) {
            updatePropertyTag("article:section", section);
        }
        if (tags.length > 0) {
            tags.forEach(tag => {
                const meta = document.createElement("meta");
                meta.setAttribute("property", "article:tag");
                meta.content = tag;
                document.head.appendChild(meta);
            });
        }

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = `${window.location.origin}${url}`;

    }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, section, tags]);

    return null; // This component doesn't render anything
} 