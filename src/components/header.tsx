"use client";
import Link from "next/link";
import posthog from "posthog-js";
import { Logo } from "@/components/logo";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuState(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const closeMenu = () => setMenuState(false);

  return (
    <header>
      <nav
        data-state={menuState ? "active" : undefined}
        className={cn(
          "fixed z-20 w-full transition-all duration-300",
          isScrolled &&
            "bg-background/75 border-b border-black/5 backdrop-blur-lg",
        )}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-6 lg:gap-0">
            <div className="flex w-full justify-between gap-6 lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <button
                onClick={() => {
                  const newState = !menuState;
                  setMenuState(newState);
                  posthog.capture("mobile_menu_toggled", {
                    action: newState ? "opened" : "closed",
                  });
                }}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <HugeiconsIcon
                  icon={Menu01Icon}
                  strokeWidth={2}
                  className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200"
                />
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200"
                />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-1">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Button
                      variant="ghost"
                      size="sm"
                      render={<Link href={item.href} className="text-base" />}
                      nativeButton={false}
                      onClick={() =>
                        posthog.capture("navigation_clicked", {
                          nav_item: item.name,
                          nav_href: item.href,
                          device_type: "desktop",
                        })
                      }
                    >
                      <span>{item.name}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          closeMenu();
                          posthog.capture("navigation_clicked", {
                            nav_item: item.name,
                            nav_href: item.href,
                            device_type: "mobile",
                          });
                        }}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(isScrolled && "lg:hidden")}
                  render={<Link href="/sign-in" onClick={closeMenu} />}
                  nativeButton={false}
                >
                  <span>Login</span>
                </Button>
                <Button
                  size="sm"
                  className={cn(isScrolled && "lg:hidden")}
                  render={<Link href="/sign-up" onClick={closeMenu} />}
                  nativeButton={false}
                >
                  <span>Sign Up</span>
                </Button>
                <Button
                  size="sm"
                  className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                  render={<Link href="/sign-up" onClick={closeMenu} />}
                  nativeButton={false}
                >
                  <span>Get Started</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
