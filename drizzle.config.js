import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://form-build_owner:1DYph4nRqzjw@ep-snowy-shadow-a54bwf8o.us-east-2.aws.neon.tech/form-build?sslmode=require',
  }
});