"use client";

import { Logo } from "@/components/landing/logo";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-6 2xl:py-10 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 w-full">
      <div className="mx-auto max-w-7xl 2xl:max-w-screen-2xl px-6 2xl:px-12">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" aria-label="go home" className="block size-fit">
            <Logo imgClassName="h-10" />
          </Link>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/tulsiveda2/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} TulsiVeda. {t("All Rights Reserved.")}</span>
          <span>
            build by{" "}
            <a
              href="https://navigateskill.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline underline-offset-4"
            >
              Navigate Skill
            </a>
          </span>
        </div>

      </div>
    </footer>
  );
}
