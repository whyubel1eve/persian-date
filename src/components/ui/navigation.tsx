"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const routes = [
  {
    href: "/persian-date-converter",
    label: "Date Converter",
  },
  {
    href: "/web3-feeds",
    label: "Web3 News",
  },
  {
    href: "/ocr",
    label: "OCR",
  },
];

export function Navigation() {
  const pathname = usePathname();
  
  const isPrismPage = pathname === "/persian-date-converter";
  const navClass = isPrismPage 
    ? "fixed top-0 left-0 right-0 z-50" 
    : "fixed top-0 left-0 right-0 z-50";
  
  const navBgClass = isPrismPage ? "" : "bg-gradient-to-b from-background/95 to-transparent backdrop-blur-2xl";
  const textClass = isPrismPage ? "text-foreground" : "text-foreground";
  const textHoverClass = isPrismPage ? "text-foreground/80" : "text-foreground";
  const linkActiveClass = isPrismPage ? "text-foreground" : "text-foreground";
  const linkInactiveClass = isPrismPage ? "text-foreground/70 hover:text-foreground" : "text-foreground/60 hover:text-foreground/90";
  const indicatorClass = isPrismPage ? "bg-foreground" : "bg-foreground";

  return (
    <nav className={navClass}>
      <div className={`container mx-auto px-8 py-5 ${navBgClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link 
              href="/persian-date-converter" 
              className={`text-xl font-bold tracking-tight ${textClass} hover:${textHoverClass} transition-colors duration-300`}
            >
              Tools
            </Link>
            
            <div className="flex items-center space-x-10">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`text-sm font-semibold tracking-wide transition-all duration-300 ease-out relative py-1 ${
                    pathname === route.href
                      ? linkActiveClass
                      : linkInactiveClass
                  }`}
                >
                  {route.label}
                  {pathname === route.href && (
                    <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 ${indicatorClass} rounded-full`} />
                  )}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="opacity-80 hover:opacity-100 transition-opacity duration-300">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}