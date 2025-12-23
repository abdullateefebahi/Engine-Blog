import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "data/posts");

export function getAllPosts() {
  const files = fs.readdirSync(postsDir);

  return files.map((file) => {
    const slug = file.replace(".md", "");
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const { data, content: bodyContent } = matter(content);
    const excerpt = bodyContent.substring(0, 150).replace(/\r?\n|\r/g, " ").trim() + (bodyContent.length > 150 ? "..." : "");

    return { slug, ...data, excerpt };
  });
}

export function getPost(slug: string) {
  const filePath = path.join(postsDir, `${slug}.md`);
  const content = fs.readFileSync(filePath, "utf8");
  return matter(content);
}
