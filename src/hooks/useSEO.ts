/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  twitterCard?: string;
}

/**
 * Custom hook to manage SEO meta tags for each page
 * @param config - SEO configuration object
 */
export function useSEO(config: SEOConfig) {
  useEffect(() => {
    // Update document title
    document.title = config.title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', config.description);

    // Update keywords if provided
    if (config.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', config.keywords);
    }

    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    if (config.ogTitle) updateOGTag('og:title', config.ogTitle);
    if (config.ogDescription) updateOGTag('og:description', config.ogDescription);
    if (config.ogImage) updateOGTag('og:image', config.ogImage);
    if (config.ogType) updateOGTag('og:type', config.ogType);

    // Update canonical URL
    if (config.canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', config.canonicalUrl);
    }

    // Update Twitter card
    if (config.twitterCard) {
      let twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) {
        twitterCard = document.createElement('meta');
        twitterCard.setAttribute('name', 'twitter:card');
        document.head.appendChild(twitterCard);
      }
      twitterCard.setAttribute('content', config.twitterCard);
    }
  }, [config]);
}

export default useSEO;
