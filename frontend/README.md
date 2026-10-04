# Frontend

The frontend is a React 19 single-page application built with Vite. `src/main.jsx` mounts `src/App.jsx`, which selects a dashboard or portal using the URL hash. The pages currently use local sample data and in-memory state; they are not connected to the Python backend.

## Run Locally

From this directory, with Node.js and npm installed:

```powershell
npm ci
npm run dev
```

Open the URL printed by Vite. Routes are `#/dashboard`, `#/farmer`, `#/admin`, and `#/partner`. Farmer subviews are selected with `#/farmer/<view>`.

## Checks

```powershell
npm run lint
npm run build
```

`npm run preview` serves a built bundle locally. See the portal READMEs for each view's current behavior and limitations.

## Vite Scaffold Notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
