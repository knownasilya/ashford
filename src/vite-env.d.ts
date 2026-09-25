/// <reference types="vite/client" />

/** Compiled ink JSON, made by the ink plugin in vite.config.ts. */
declare module '*.ink' {
  const json: string;
  export default json;
}
