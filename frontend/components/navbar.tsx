"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Generate", href: "/generate" },
  { name: "Analyze", href: "/analyze" },
  { name: "Gallery", href: "/gallery" },
  { name: "About Kolam", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b-4 border-neoDark bg-neoLight shadow-[8px_8px_0_0_#232323] dark:bg-neoDark dark:shadow-[8px_8px_0_0_#00FFFF]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-playfair font-extrabold text-neoBlue dark:text-neoCyan tracking-wide">
              Kolamkar's
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-lg font-source-sans-pro font-semibold transition-all duration-300",
                    pathname === item.href
                      ? "bg-neoMagenta text-neoLight shadow-neoDark shadow-[4px_4px_0_0_#FFDB58] dark:bg-neoMustard dark:text-neoDark dark:shadow-neoCyan dark:shadow-[4px_4px_0_0_#007BFF]"
                      : "text-neoDark hover:text-neoBlue dark:text-neoLight dark:hover:text-neoCyan hover:bg-neoLight/20 dark:hover:bg-neoDark/20",
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <span className="absolute inset-0 border-2 border-neoDark dark:border-neoCyan rounded-full -z-10 animate-pulse-slow" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-neoDark hover:bg-neoLight/20 focus:outline-none focus:ring-4 focus:ring-neoBlue focus:ring-offset-2 dark:text-neoLight dark:hover:bg-neoDark/20 dark:focus:ring-neoCyan"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
