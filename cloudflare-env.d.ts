import type { D1Database } from "@cloudflare/workers-types";

declare global {
  interface CloudflareEnv {
    DB: D1Database;
  }
}

declare module "@opennextjs/cloudflare" {
  interface CloudflareEnv {
    DB: D1Database;
  }
}

export {};
