import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        User-agent: *
        Disallow: "/"
      }
    ],
    sitemap: 'https://acme.com/sitemap.xml',
  };
}
