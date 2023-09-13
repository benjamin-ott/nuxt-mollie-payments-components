export default defineNuxtConfig({
  modules: ["../src/module", "@shopware-pwa/nuxt3-module"],
  runtimeConfig: {
    public: {
      shopware: {
        shopwareEndpoint: "https://demo-frontends.shopware.store",
        shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
      },
    },
  },
  mollie: {
    defaultLocale: "en_US",
    profileId: "pfl_E5EmGZ98YT",
    testMode: true,
  },
  devtools: { enabled: true },
});
