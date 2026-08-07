import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  preview: {
    allowedHosts: [
      "sentinel-ai-frontend-rz9z.onrender.com"
    ]
  }
});