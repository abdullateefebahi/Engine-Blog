# Engine Blog





Great question — this is where your blog becomes **useful**, **popular**, and **trusted** on campus 👌
Since you’re building an **Engine Blog for UNIBEN**, here’s a **clear, practical content blueprint** you can follow.

---

## 🏫 CORE CONTENT (Must-Have)

### 1. **Campus News & Updates**

These bring daily traffic.

* Lecture cancellations / rescheduling
* Faculty announcements
* ASUU / strike updates
* Exam timetables
* Power / water / network updates on campus

📌 *Example post:*

> “UNIBEN Faculty of Engineering Postpones 200L Exams”

---

### 2. **Academic Information**

Very valuable to students.

* Course registration guides
* Clearance procedures (100L especially 👀)
* Faculty & departmental notices
* Study tips for specific courses
* GPA / CGPA calculation guides

📌 *Example:*

> “How to Register Courses in UNIBEN (Step-by-Step Guide)”

---

### 3. **Events & Activities**

Good for visibility and partnerships.

* Departmental events
* Seminars & workshops
* Fellowships / student gatherings
* Convocation & matriculation updates

📌 *Example:*

> “Upcoming Engineering Week Activities at UNIBEN”

---

## 🎓 STUDENT LIFE CONTENT

### 4. **Hostel & Accommodation Updates**

Very popular topic.

* Hostel allocation info
* Rent updates around Ugbowo
* Tips for off-campus living
* Security & safety tips

📌 *Example:*

> “Best Places to Rent a Room Near UNIBEN in 2025”

---

### 5. **Student Opportunities**

This builds trust quickly.

* Scholarships
* Internships
* SIWES placement info
* Tech & non-tech opportunities

📌 *Example:*

> “Scholarships UNIBEN Students Can Apply for Right Now”

---

### 6. **Lost & Found / Notices**

Short posts but high engagement.

* Lost ID cards
* Missing phones
* Important notices

📌 *Example:*

> “Lost UNIBEN ID Card Found at Engineering Complex”

---

## 💡 VALUE-ADDED CONTENT (Growth Boosters)

### 7. **Faculty-Specific Categories**

Since it’s called **Engine Blog**, this is 🔥

* Engineering faculty updates
* Course breakdowns
* Lab & workshop updates
* Project tips

📌 *Example:*

> “What to Expect in Mechatronics Engineering at UNIBEN”

---

### 8. **Interviews & Spotlights**

Makes your blog unique.

* Outstanding students
* Class reps
* Lecturers (if possible)
* Student entrepreneurs

📌 *Example:*

> “Meet the 400L Student Building a Robotics Startup”

---

### 9. **Tech & Skills (Optional but Powerful)**

Since you’re a frontend dev 😉

* Coding guides
* Software recommendations
* Free learning resources
* Tech events on campus

📌 *Example:*

> “Best Free Programming Resources for UNIBEN Students”

---

## 📣 ENGAGEMENT & COMMUNITY

### 10. **Polls & Opinion Posts**

Keeps students coming back.

* “Should UNIBEN adopt CBT exams fully?”
* “Is hostel accommodation worth it?”

---

### 11. **Announcements & Ads (Later)**

Monetization path.

* Department ads
* Event promotions
* Business shoutouts

---

## 🧭 RECOMMENDED BLOG CATEGORIES

You can structure your blog like this:

```
Campus News
Academics
Engineering
Student Life
Opportunities
Events
Hostels
Tech
Notices
```

---

## 🚀 CONTENT STRATEGY (Simple & Effective)

* **2–4 posts per week**
* Short, clear titles
* Real, verified info (very important)
* Share posts on:

  * WhatsApp groups
  * Telegram channels
  * Twitter (X)
  * Facebook UNIBEN groups

---

## ⚠️ VERY IMPORTANT (Trust Rule)

To avoid issues:

* Verify info before posting
* Avoid fake or unconfirmed news
* Add disclaimer:

  > “Engine Blog is a student-run platform and not an official UNIBEN outlet.”

Great question — this is **exactly how real blogs are structured** 👍
On large screens, you should use a **main content + sidebar layout**.

---

## ✅ Recommended layout (Desktop)

```
| Posts (Left – 70%) | Sidebar (Right – 30%) |
```

Mobile stays **single column**.

---

## 🧠 What should go on the RIGHT (Sidebar)?

For a **campus / engineering blog**, these are the best options 👇

---

## ⭐ MUST-HAVE SIDEBAR ITEMS (in order of importance)

### 1️⃣ Categories (Top priority)

Helps users filter content fast.

* Engineering
* Campus News
* Academics
* Events
* Opportunities
* Student Life

👉 Click → filters posts

---

### 2️⃣ Latest Posts

Shows the 4–6 most recent posts.

Why?

* Keeps users browsing
* Reduces bounce rate

---

### 3️⃣ Notices / Announcements

Perfect for UNIBEN:

* ⚠️ Exam schedule
* 🧪 Lab timetable
* 🏗 Faculty announcements.
* 📢 Urgent updates

This makes your blog **more useful than UNIBEN Blog** 

---

### 4️⃣ Quick Links

Useful campus links:

* UNIBEN Portal
* Faculty of Engineering
* Course registration
* Academic calendar

---

### 5️⃣ Subscribe / WhatsApp (Optional but powerful)

For growth:

* Email subscription
* WhatsApp channel link
* Telegram group

---

## ❌ What NOT to put

* Ads (early stage)
* Too many widgets
* Random quotes
* Empty content

---

## ✅ Ideal Sidebar Structure

```txt
[ Categories ]
[ Latest Posts ]
[ Notices ]
[ Quick Links ]
```

---

## 🧩 Sample Sidebar Component (Tailwind)

### 📁 `components/Sidebar.tsx`

```tsx
import Link from "next/link";

export default function Sidebar({ categories, latestPosts }: any) {
  return (
    <aside className="space-y-8">
      {/* Categories */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm">
        <h3 className="font-semibold mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat: string) => (
            <li key={cat}>
              <Link
                href={`/?category=${encodeURIComponent(cat)}`}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Latest posts */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm">
        <h3 className="font-semibold mb-4">Latest Posts</h3>
        <ul className="space-y-3">
          {latestPosts.slice(0, 5).map((post: any) => (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
```

---

## 🧱 Layout Integration (Home Page)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
  {/* Posts */}
  <div className="lg:col-span-2">
    <PostsGrid />
  </div>

  {/* Sidebar */}
  <div className="hidden lg:block">
    <Sidebar categories={categories} latestPosts={posts} />
  </div>
</div>
```

✔ Sidebar hidden on mobile
✔ Appears only on large screens
✔ Clean & scalable

---

## 🏆 Why this works for UNIBEN

* Students scan fast
* Notices stand out
* Categories improve navigation
* Looks **professional & credible**

---

### 🔥 Next steps I recommend

1️⃣ Add **sticky sidebar**
2️⃣ Add **Notices schema**
3️⃣ Highlight **urgent posts**
4️⃣ Admin-controlled sidebar content

Which one should we build next?




engine-blog/
├─ public/                  # static files (images, logos, favicons)
│   ├─ images/
│   │   ├─ posts/           # images for blog posts
│   │   └─ logo.png
│   └─ favicon.ico
│
├─ pages/                   # Next.js pages
│   ├─ index.tsx            # homepage, latest posts
│   ├─ about.tsx            # about page
│   ├─ contact.tsx          # contact page with form
│   └─ posts/               # dynamic blog post pages
│       └─ [slug].tsx       # dynamic route for each post
│
├─ components/              # reusable UI components
│   ├─ Header.tsx
│   ├─ Footer.tsx
│   ├─ Navbar.tsx
│   ├─ PostCard.tsx         # preview card for posts
│   └─ Layout.tsx           # page wrapper with Header/Footer
│
├─ styles/                  # global and component styles
│   ├─ globals.css
│   └─ tailwind.css         # if using Tailwind
│
├─ lib/                     # utility functions & data fetching
│   ├─ posts.ts             # fetch blog posts from Markdown or CMS
│   └─ categories.ts        # optional: manage categories/tags
│
├─ data/                    # optional local data (Markdown posts)
│   └─ posts/               # markdown files for blog posts
│       └─ welcome.md
│
├─ hooks/                   # custom React hooks
│   └─ usePosts.ts
│
├─ context/                 # React context for global state
│   └─ ThemeContext.tsx
│
├─ public/                  # images, assets, icons
│
├─ next.config.js           # Next.js configuration
├─ tailwind.config.js       # if using Tailwind
├─ tsconfig.json            # TypeScript config
├─ package.json
└─ README.md
