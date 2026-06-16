import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.terraforgehome.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.terraforgehome.com/dashboard/garden',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://www.terraforgehome.com/homestead-planner',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: 'https://www.terraforgehome.com/permaculture-design',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.terraforgehome.com/food-forest-planner',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.terraforgehome.com/seasonal-planting-calendar',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.88,
    },
  ]
}
