"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCategories } from "@/lib/posts";
import { useRouter } from "next/navigation";
import icon from "@/public/icon.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logAnalyticsEvent } from "@/lib/firebase";
import { faHome, faCalendarDays, faLayerGroup, faBell, faInfoCircle, faCalendarDay, faSignOut, faSignIn, faBookmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "./ThemeToggle";
import CommandPalette from "./CommandPalette";
import { useUser, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; title: string; slug: string }[]>([]);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-all"
          >
            {/* Logo Icon */}
            <div className="relative w-9 h-9 flex items-center justify-center overflow-hidden rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Image src={icon} alt="Logo" width={32} height={32} />
            </div>

            {/* Logo Text */}
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Engine
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-gray-500 ml-[1px]">
                Blog
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/events">Events</NavLink>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Categories
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute left-0 mt-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/?category=${encodeURIComponent(cat.title)}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-1">
              <NavLink href="/notices">Notices</NavLink>
              <NavLink href="/about">About</NavLink>
            </div>

            {/* Search integrated here */}
            <div className="ml-2 xl:ml-4">
              <CommandPalette />
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 xl:gap-4 ml-2 xl:ml-4 pl-2 xl:pl-4 border-l border-gray-100 dark:border-gray-800">

              <div className="ml-2">
                <SignedIn>
                  <div className="flex items-center gap-4">
                    <Link href="/profile" className="flex items-center gap-2 group p-1 pr-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-full transition-all">
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-600 transition-all shrink-0">
                        <img
                          src={user?.imageUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="hidden xl:flex flex-col text-left">
                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">
                          {user?.username || user?.firstName || "Profile"}
                        </span>
                      </div>
                    </Link>

                  </div>
                </SignedIn>
                <SignedOut>
                  <Link href="/sign-in">
                    <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                      Sign In
                    </button>
                  </Link>
                </SignedOut>
              </div>
            </div>
          </div>

          {/* Mobile button */}
          <div className="flex items-center gap-3 lg:hidden">
            <SignedIn>
              <Link href="/profile">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={user?.imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </SignedIn>
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Toggle menu"
              title="Menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute inset-0 transform transition-all duration-300 ease-in-out ${open ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h12" />
                  </svg>
                </span>
                <span className={`absolute inset-0 transform transition-all duration-300 ease-in-out ${open ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Animated Drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ${open ? 'max-h-[80vh] opacity-100 border-t visible' : 'max-h-0 opacity-0 invisible border-t-0'
          }`}
      >
        <div className={`px-4 py-6 space-y-2 transition-transform duration-500 ${open ? 'translate-y-0' : '-translate-y-4'}`}>
          {/* User Profile at Top on Mobile */}
          <SignedIn>
            <div className={`pb-4 mb-4 border-b border-gray-100 dark:border-gray-800 transition-all duration-700 delay-100 ${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="flex items-center gap-3 px-3 mb-3">
                <Link href="/profile" onClick={() => setOpen(false)}>
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-100 dark:border-blue-900/30">
                    <img
                      src={user?.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex flex-col flex-1">
                  <span className="text-gray-900 dark:text-white font-black leading-tight uppercase tracking-tight">
                    {user?.username || user?.firstName || "User"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
                <button
                  onClick={() => signOut(() => router.push("/"))}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95"
                >
                  <FontAwesomeIcon icon={faSignOut} />
                  <span>Sign Out</span>
                </button>
              </div>
              <div className="px-3">
                <MobileNavLink href="/bookmarks" onClick={() => setOpen(false)}>
                  <FontAwesomeIcon icon={faBookmark} size="lg" /> Saved Posts
                </MobileNavLink>
              </div>
            </div>
          </SignedIn>

          <div className={`space-y-1 transition-all duration-700 delay-200 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <MobileNavLink href="/" onClick={() => setOpen(false)}><FontAwesomeIcon icon={faHome} size="lg" /> Home</MobileNavLink>
            <MobileNavLink href="/events" onClick={() => setOpen(false)}><FontAwesomeIcon icon={faCalendarDay} size="lg" /> Events</MobileNavLink>

            {/* Mobile Categories */}
            <div className="py-1">
              <button
                onClick={() => setMobileCatOpen(!mobileCatOpen)}
                className="flex items-center justify-between w-full text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5" />
                  <span>Categories</span>
                </div>
                <svg className={`w-4 h-4 transition-transform duration-300 ${mobileCatOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`pl-4 space-y-1 mt-1 overflow-hidden transition-all duration-300 ${mobileCatOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                {categories.map((cat) => (
                  <MobileNavLink
                    key={cat._id}
                    href={`/?category=${encodeURIComponent(cat.title)}`}
                    onClick={() => setOpen(false)}
                  >
                    {cat.title}
                  </MobileNavLink>
                ))}
              </div>
            </div>

            <MobileNavLink href="/notices" onClick={() => setOpen(false)}><FontAwesomeIcon icon={faBell} size="lg" />Notices</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setOpen(false)}><FontAwesomeIcon icon={faInfoCircle} size="lg" />About</MobileNavLink>
          </div>

          <SignedOut>
            <div className={`pt-6 mt-4 border-t border-gray-100 dark:border-gray-800 transition-all duration-700 delay-300 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                <button className="flex items-center justify-center gap-3 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg active:scale-[0.98]">
                  <FontAwesomeIcon icon={faSignIn} className="w-5" />
                  <span>Sign In</span>
                </button>
              </Link>
            </div>
          </SignedOut>

          {/* Mobile Theme Toggle */}
          <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 transition-all duration-700 delay-500 ${open ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* Reusable link components */

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-2 xl:px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      {children}
    </Link>
  );
}
