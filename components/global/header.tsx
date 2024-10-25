"use client";
import Link from "next/link";
import { useAccount } from "wagmi";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export const Header = () => {
  const { address } = useAccount();

  // TODO: Fix this onNavChange
  function onNavChange() {
    setTimeout(() => {
      const triggers = document.querySelectorAll(
        '.submenu-trigger[data-state="open"]',
      );
      if (triggers.length === 0) return;

      const firstTrigger = triggers[0] as HTMLElement;
      const viewports = document.getElementsByClassName("submenu-viewport");

      if (viewports.length > 0) {
        const viewport = viewports[0] as HTMLElement;
        viewport.style.left = `${firstTrigger.offsetLeft}px`;
      }
    });
  }

  return (
    <>
      <NavigationMenu
        className="max-h-16 bg-amber-100 bg-opacity-90"
        onValueChange={onNavChange}
      >
        <NavigationMenuList className="space-x-2">
          <NavigationMenuItem>
            <Link legacyBehavior href="/" passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link legacyBehavior href="/jars" passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Jars
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {address && (
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`submenu-trigger ${navigationMenuTriggerStyle()}`}
              >
                Mint Jar
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col gap-2 bg-amber-100 p-2">
                <Link legacyBehavior href="/mintERC20" passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "w-full")}
                  >
                    ERC20
                  </NavigationMenuLink>
                </Link>
                <Link legacyBehavior href="/mintERC721" passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "w-full")}
                  >
                    ERC721
                  </NavigationMenuLink>
                </Link>
                <Link legacyBehavior href="/mintBaal" passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "w-full")}
                  >
                    Baal
                  </NavigationMenuLink>
                </Link>
                <Link legacyBehavior href="/mintHats" passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "w-full")}
                  >
                    Hats
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
