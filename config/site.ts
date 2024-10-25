interface SiteConfig {
  name: string;
  origin: string;
  description: string;
  localeDefault: string;
  links: {
    twitter: string;
    github: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "CookieJar",
  origin: "https://cookiejar.wtf",
  description: "A slush fund for small trusted groups.",
  localeDefault: "en",
  links: {
    twitter: "https://x.com/CookieJarWtf",
    github: "https://github.com/Cookie-Jar-DAO",
  },
};
