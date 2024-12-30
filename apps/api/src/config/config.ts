import environment from "dotenv";

environment.config();

const config = {
  JWT_SECRET: process.env.JWT_SECRET || "",
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000",
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || "",
};

if (!config.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!config.NEXT_PUBLIC_BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables");
}

if (!config.CLOUDINARY_NAME) {
  throw new Error("CLOUDINARY_NAME is not defined in environment variables");
}

export default config;
