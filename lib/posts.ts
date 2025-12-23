import { client } from "./sanity";

export async function getAllCategories() {
  return client.fetch(`
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      "slug": slug.current
    }
  `);
}

export async function getAllPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name
    }
  `);
}

export async function getPostsByCategory(category: string) {
  return client.fetch(
    `
    *[_type == "post" && $category in categories[]->title] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name
    }
  `,
    { category }
  );
}
export async function getPost(slug: string) {
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name
    }
  `,
    { slug }
  );
}

export async function searchPosts(query: string) {
  return client.fetch(
    `*[_type=="post" && (title match $q || excerpt match $q)]{
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name
    }`,
    { q: `*${query}*` }
  );
}

