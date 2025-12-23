export type Category =
  | "Engineering"
  | "Campus News"
  | "Academics"
  | "Events"
  | "Opportunities"
  | "Student Life";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  author?: string;
  category?: Category;
}

export interface PostData {
  content: string;
  data: {
    title: string;
    date: string;
    author?: string;
  };
}
