export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Novax",
  description: "The Simmulation for the NOVAS group",
  navItems: [
    {
      label: "Home",
      href: "/main",
    },
    {
      label: "Session",
      href: "/session",
    },


  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },

  ],
  links: {
    github: "https://github.com/Stephcraft/Novas-Hack.git",
    twitter: "I do not know the Twitter Account of novas group...",
    docs: "",
    discord: "",
    sponsor: "",
  },
};
