# Lotus AI Studio - Interactive Demos

Production-ready AI demonstrations built with Astro, React, and Tailwind CSS.

## 🚀 Tech Stack

- **Astro** - Static site framework
- **React** - Interactive components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Cloudflare** - Deployment platform

## 📦 Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Visit `http://localhost:4321` to see the site.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 🌐 Deploy to Cloudflare

```bash
npx wrangler deploy
```

Make sure to configure your `wrangler.toml` with the correct zone_id for demo.lotusaistudio.com

## 📁 Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # React components (.tsx)
│   ├── layouts/         # Astro layouts
│   ├── lib/            # Utility functions
│   ├── pages/          # Astro pages (routes)
│   └── styles/         # Global CSS
├── astro.config.js     # Astro configuration
├── tailwind.config.mjs # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── wrangler.toml       # Cloudflare Workers config
```

## 🎨 Design Language

Matches the main lotusaistudio.com design:
- Purple-pink gradient accents
- Dark/light mode support
- Rounded cards with hover effects
- Smooth animations with Framer Motion

## 📝 License

Built by Lotus AI Studio
