/**
 * 站点地图：站点页面与全部组件的详情页。构建时生成。
 */
import type { MetadataRoute } from "next";
import { COMPONENTS } from "@/registry/registry";
import { SITE_URL } from "@/site/constants";

const sitemap = (): MetadataRoute.Sitemap => [
  { url: SITE_URL, priority: 1 },
  { url: `${SITE_URL}/components`, priority: 0.9 },
  { url: `${SITE_URL}/docs`, priority: 0.8 },
  { url: `${SITE_URL}/ai-surface-spec.txt`, priority: 0.75 },
  ...COMPONENTS.map(({ slug, createdAt }) => ({
    url: `${SITE_URL}/components/${slug}`,
    lastModified: createdAt,
    priority: 0.7,
  })),
];

export default sitemap;
