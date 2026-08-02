import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Foreign/legacy directories that live inside this repo's working tree
    // but aren't part of this Next.js project - old backend attempts, the
    // new Laravel LMS (its own project), and stale source dumps.
    "backend-reference/**",
    "cybergoat-backend/**",
    "cybergoat-lms-backend/**",
    "cybergoat-laravel-lms/**",
    "v1-backup-snapshot/**",
    "scratch/**",
  ]),
]);

export default eslintConfig;
