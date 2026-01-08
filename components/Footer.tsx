"use client";
import Link from "next/link";
import Image from "next/image";
import icon from "@/public/icon.png";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/onboarding") return null;

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group transition-all">
              <div className="relative w-9 h-9 flex items-center justify-center overflow-hidden rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Image src={icon} alt="Logo" width={32} height={32} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter text-gray-900 dark:text-white uppercase group-hover:text-blue-600 transition-colors">
                  Engine
                </span>
                <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-gray-500">
                  Blog
                </span>
              </div>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed text-sm font-medium">
              The official digital hub for the Faculty of Engineering at the University of Benin. Bridging the gap between engineering excellence and student life.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/events" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Events</Link></li>
              <li><Link href="/notices" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Notices</Link></li>
              <li><Link href="/credits" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Credits</Link></li>
              <li><Link href="/about" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/terms" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/guidelines" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>
        <div className="py-6 flex">
          <ThemeToggle />
        </div>
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Engine Blog.
          </p>
          <div className="flex gap-6 footer-links-out">
            <a href="https://ohiocodespace.vercel.app" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest">Ohio Codespace</a>
            <a href="https://github.com/Ghosty-s-Lab-Inc" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest">Ghosty's Lab Technology</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
