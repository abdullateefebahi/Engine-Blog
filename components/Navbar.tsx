"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCategories } from "@/lib/posts";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import icon from "@/public/icon.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logAnalyticsEvent } from "@/lib/firebase";
import { faHome, faCalendarDays, faLayerGroup, faBell, faInfoCircle, faCalendarDay, faSignOut, faSignIn } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; title: string; slug: string }[]>([]);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    getAllCategories().then(setCategories);
    const syncUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    syncUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // If it's a social login or fresh sign-in, getUser() is safer for metadata
        if (event === 'SIGNED_IN') {
          syncUser();
        } else {
          setUser(session.user);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getAvatarUrl = (user: User | null) => {
    return user?.user_metadata?.engine_avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    logAnalyticsEvent('sign_out');
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/events">Events</NavLink>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
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

            <NavLink href="/notices">Notices</NavLink>
            <NavLink href="/about">About</NavLink>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-100 dark:border-gray-800">
                <Link href="/profile" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-gray-800 group-hover:ring-blue-500/30 transition-all overflow-hidden">
                    {getAvatarUrl(user) ? (
                      <img
                        src={getAvatarUrl(user)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      user.user_metadata?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:inline group-hover:text-blue-600 transition-colors">
                    {user.user_metadata?.username || user.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-bold text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="ml-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile button */}
          <div className="flex items-center gap-3 md:hidden">
            {user && (
              <Link href="/profile" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-gray-800 overflow-hidden">
                  {getAvatarUrl(user) ? (
                    <img
                      src={getAvatarUrl(user)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    user.user_metadata?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()
                  )}
                </div>
              </Link>
            )}
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
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ${open ? 'max-h-[80vh] opacity-100 border-t visible' : 'max-h-0 opacity-0 invisible border-t-0'
          }`}
      >
        <div className={`px-4 py-6 space-y-2 transition-transform duration-500 ${open ? 'translate-y-0' : '-translate-y-4'}`}>
          {/* User Profile at Top on Mobile */}
          {user && (
            <div className={`pb-4 mb-4 border-b border-gray-100 dark:border-gray-800 transition-all duration-700 delay-100 ${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 mb-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold group-hover:ring-2 group-hover:ring-blue-500/30 transition-all overflow-hidden shadow-sm">
                  {getAvatarUrl(user) ? (
                    <img
                      src={getAvatarUrl(user)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    user.user_metadata?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 dark:text-white font-black leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {user.user_metadata?.username || user.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                    {user.email}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => { handleSignOut(); setOpen(false); }}
                className="flex items-center gap-3 w-full text-left px-3 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
              >
                <FontAwesomeIcon icon={faSignOut} className="w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

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

          {!user && (
            <div className={`pt-6 mt-4 border-t border-gray-100 dark:border-gray-800 transition-all duration-700 delay-300 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg active:scale-[0.98]"
              >
                <FontAwesomeIcon icon={faSignIn} className="w-5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
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
      className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-colors"
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
