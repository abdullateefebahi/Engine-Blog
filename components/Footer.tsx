"use client";
import Link from "next/link";
import Image from "next/image";
import icon from "@/public/icon.png";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Footer() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();

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
              {t("Footer.description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">{t("Footer.explore")}</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("Navbar.home")}</Link></li>
              <li><Link href="/events" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("Navbar.events")}</Link></li>
              <li><Link href="/notices" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("Navbar.notices")}</Link></li>
              <li><Link href="/credits" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("Navbar.credits")}</Link></li>
              <li><Link href="/about" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("Navbar.about")}</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">{t("Footer.legal")}</h4>
            <ul className="space-y-4">
              <li><Link href="/terms" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("Footer.terms")}</Link></li>
              <li><Link href="/privacy" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("Footer.privacy")}</Link></li>
              <li><Link href="/guidelines" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t("Footer.guidelines")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="py-6 flex flex-wrap items-center gap-6">
          <ThemeToggle />
          <div className="flex items-center gap-3 bg-gray-50/50 dark:bg-gray-900/50 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-blue-500/30">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
              {t("Footer.language")}
            </span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as "en" | "fr")}
              className="bg-transparent text-[11px] font-bold text-gray-700 dark:text-gray-300 outline-none cursor-pointer uppercase tracking-tight [color-scheme:light] dark:[color-scheme:dark]"
            >
              <option value="en" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">English</option>
              <option value="fr" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Français</option>
            </select>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {t("Footer.copyright", { year: new Date().getFullYear().toString() })}
          </p>
          <div className="flex gap-6 footer-links-out">
            <a href="https://ohiocodespace.vercel.app" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest">{t("Footer.developer1")}</a>
            <a href="https://github.com/Ghosty-s-Lab-Inc" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest">{t("Footer.developer2")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
