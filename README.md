# Engine Blog 🚀

> The official digital heartbeat of the Faculty of Engineering, University of Benin (UNIBEN).

Engine Blog is a modern, dynamic web platform designed to keep engineering students updated with campus news, academic resources, and opportunities. Built with a focus on speed, aesthetics, and user experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/)
- **CMS**: [Sanity](https://www.sanity.io/)
- **Analytics**: Firebase

## 🚀 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up Environment Variables**:
    Create a `.env.local` file with the following keys:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
    CLERK_SECRET_KEY=...
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    NEXT_PUBLIC_SANITY_PROJECT_ID=...
    NEXT_PUBLIC_SANITY_DATASET=...
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

---

## 📚 Content Strategy (The Blueprint)

This blog follows a "Student-First" content strategy designed to be useful, popular, and trusted.

### 1. Core Content (Must-Have)
*   **Campus News**: Lecture updates, cancellations, exam timetables.
*   **Academic Info**: Course registration guides, clearance procedures, GPA calculation.
*   **Events**: Seminars, workshops, faculty week activities.

### 2. Student Life
*   **Accommodation**: Hostel updates, rent info, off-campus tips.
*   **Opportunities**: Scholarships, internships, SIWES placements.
*   **Notices**: Lost & found, urgent announcements.

### 3. Growth Boosters
*   **Faculty Specifics**: Department updates (Mechatronics, Civil, etc.).
*   **Spotlights**: Interviews with outstanding students and entrepreneurs.
*   **Tech & Skills**: Coding guides and software recommendations.

---

## � Project Structure

```
engine-blog/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Authentication routes (Clerk)
│   ├── actions/         # Server Actions
│   ├── api/             # API Routes
│   ├── posts/           # Blog post display logic
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/           # Reusable UI components
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── PostCard.tsx
│   ├── Comments.tsx
│   └── ...
├── lib/                  # Utilities & Database clients
│   ├── supabase.ts
│   ├── sanity/          # Sanity CMS client & queries
│   └── utils.ts
├── sanity/               # Sanity CMS configuration
├── public/               # Static assets (images, icons)
└── ...
```

---

## 🛠️ Sanity Webhooks

To ensure that reactions and comments are cleaned up in Supabase when a post is deleted in Sanity, you must set up a webhook:

1.  Go to your [Sanity Management Dashboard](https://www.sanity.io/manage).
2.  Navigate to **API** > **Webhooks**.
3.  Click **Create Webhook**.
4.  **Name**: Deletion Cleanup
5.  **URL**: `https://your-domain.com/api/webhooks/sanity`
6.  **Dataset**: Your active dataset (e.g., `production`).
7.  **Trigger on**: `Deleted`.
8.  **Filter**: `_type == "post"`.
9.  **Projection**: `{ "slug": slug.current, "type": _type }`.
10. **HTTP Method**: `POST`.

---

## 🤝 Contribution Guidelines

*   **Verify Info**: Always verify news before pushing content.
*   **Disclaimer**: Ensure the "Student-run platform" disclaimer is visible.
*   **Code Style**: Follow standard Prettier/ESLint rules configured in the project.