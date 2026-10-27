import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "StreamElements Widgets",
  description: "A list of StreamElements custom Widgets",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Widgets", link: "/webcam-mask" },
    ],

    sidebar: [
      {
        text: "Widgets",
        items: [
          { text: "Cache de webcam", link: "/webcam-mask" },
          {
            text: "Compte à rebours participatif",
            link: "/community-countdown",
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/thoanny/streamelements-widgets",
      },
    ],
  },
});
