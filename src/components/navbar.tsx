import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  navigationHeaderMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavBar() {
  return (
    <NavigationMenu className="flex min-w-full p-3 bg-transparent backdrop-blur-sm shadow-lg ">
      <NavigationMenuList className="flex justify-items-start">
        <NavigationMenuItem>
          <a href="/">
            <NavigationMenuLink className={navigationHeaderMenuTriggerStyle()}>
              Portfolio
            </NavigationMenuLink>
          </a>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <a href="/#about-me">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About me
            </NavigationMenuLink>
          </a>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <a href="/random">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Random
            </NavigationMenuLink>
          </a>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
