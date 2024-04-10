"use client";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
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
  function onNavChange() {
    setTimeout(() => {
      const triggers = document.querySelectorAll(
        '.submenu-trigger[data-state="open"]'
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
    <NavigationMenu onValueChange={onNavChange}>
      <NavigationMenuList>
        <Link legacyBehavior href="/" passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuLink>
        </Link>
        <Link legacyBehavior href="/jars" passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Jars
          </NavigationMenuLink>
        </Link>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={`submenu-trigger ${navigationMenuTriggerStyle()}`}
          >
            Mint Jar
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <Link legacyBehavior href="/mintERC20" passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                ERC20
              </NavigationMenuLink>
            </Link>{" "}
            <Link legacyBehavior href="/mintERC721" passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                ERC721
              </NavigationMenuLink>
            </Link>{" "}
            <Link legacyBehavior href="/mintBaal" passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Baal
              </NavigationMenuLink>
            </Link>{" "}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>

      <ConnectKitButton />
    </NavigationMenu>
  );
};
