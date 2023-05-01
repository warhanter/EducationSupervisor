import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "public",

  // ** build for Github Pages //
  base: "/EducationSupervisor/",

  // ** build for local testing //
  // base: "/",
});
