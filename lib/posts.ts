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

export async function getAllPosts(start = 0, end = 10) {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name,
      "authorImage": author->image.asset->url,
      "authorSlug": author->slug.current,
      "authorBio": author->bio
    }
  `, { start, end });
}

export async function getPostsByCategory(category: string, start = 0, end = 10) {
  return client.fetch(
    `
    *[_type == "post" && $category in categories[]->title] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name,
      "authorImage": author->image.asset->url,
      "authorSlug": author->slug.current,
      "authorBio": author->bio
    }
  `,
    { category, start, end }
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
      "author": author->name,
      "authorImage": author->image.asset->url,
      "authorSlug": author->slug.current,
      "authorBio": author->bio
    }
  `,
    { slug }
  );
}

export async function searchPosts(query: string, start = 0, end = 10) {
  return client.fetch(
    `*[_type=="post" && (title match $q || excerpt match $q)] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name,
      "authorImage": author->image.asset->url,
      "authorSlug": author->slug.current,
      "authorBio": author->bio
    }`,
    { q: `*${query}*`, start, end }
  );
}

export async function getAuthorBySlug(slug: string) {
  return client.fetch(
    `*[_type == "author" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      "image": image.asset->url,
      bio
    }`,
    { slug }
  );
}

export async function getPostsByAuthor(slug: string, start = 0, end = 10) {
  return client.fetch(
    `*[_type == "post" && author->slug.current == $slug] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name,
      "authorImage": author->image.asset->url,
      "authorSlug": author->slug.current
    }`,
    { slug, start, end }
  );
}

export async function getAllAuthors() {
  return client.fetch(`
    *[_type == "author"] {
      _id,
      name,
      "slug": slug.current
    }
  `);
}

export async function getPostsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return [];

  return client.fetch(
    `*[_type == "post" && slug.current in $slugs] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name,
      "authorImage": author->image.asset->url,
      "authorSlug": author->slug.current,
      "authorBio": author->bio
    }`,
    { slugs }
  );
}

export async function getRelatedPosts(slug: string, categories: string[]) {
  return client.fetch(
    `
    *[_type == "post" && slug.current != $slug && count((categories[]->title)[@ in $categories]) > 0] | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      "author": author->name,
      "authorImage": author->image.asset->url
    }
  `,
    { slug, categories }
  );
}
