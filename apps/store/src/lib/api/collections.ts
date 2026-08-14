import { apiClient } from "./client";


export interface ApiCollection {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}


export function fetchFeaturedCollections() {
  return apiClient<ApiCollection[]>(
    "/collections/featured",
    {
      auth: false,
    }
  );
}