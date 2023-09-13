# Vue components for Mollie Payments (Nuxt module)

- [📖 &nbsp;Documentation](https://frontends.shopware.com)

## Features

<!-- Highlight some of the features your module provide here -->

- ⛰ &nbsp;`useMollie` & `useMollieCreditCard` composable function
- 🚠 &nbsp;`MollieCreditCardComponent.vue` component to use in a Vue project
- 🌲 &nbsp;`ShopwareFrontendsCreditCard.vue` component to use in a Nuxt Shopware Powered project

## Requirements
- Nuxt 3
- installed: @shopware-pwa/nuxt3-module / @shopware-pwa/composables-next - optional if you want to use `ShopwareFrontendsCreditCard` component which sends additional request to Mollie's endpoint in order to store Credit Card token.

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```
