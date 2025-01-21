"use client";
import Link from "next/link";
import { useAccount } from "wagmi";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

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
      <NavigationMenu onValueChange={onNavChange}>
        <NavigationMenuList>
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
                className={`${navigationMenuTriggerStyle()}`}
              >
                Mint Jar
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <Link legacyBehavior href="/mintERC20" passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle())}
                  >
                    ERC20
                  </NavigationMenuLink>
                </Link>
                <Link legacyBehavior href="/mintERC721" passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle())}
                  >
                    ERC721
                  </NavigationMenuLink>
                </Link>
                <Link legacyBehavior href="/mintBaal" passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle())}
                  >
                    Baal
                  </NavigationMenuLink>
                </Link>
                <Link legacyBehavior href="/mintHats" passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle())}
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
