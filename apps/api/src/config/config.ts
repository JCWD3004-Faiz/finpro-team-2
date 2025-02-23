import environment from "dotenv";

environment.config();

const config = {
  port: Number(process.env.SERVER_PORT_DEV) || 8000,
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRY ? `${process.env.JWT_EXPIRY}s` : "86400s", // Default to 24 hours in seconds
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
  frontendUrl: process.env.FRONTEND_URL || ""
} as const;

// Validate required environment variables
if (!config.jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!config.baseUrl) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined in environment variables");
}

if (!config.frontendUrl) {
  throw new Error("FRONTEND_URL is not defined in environment variables");
}

// Validate numeric values
if (isNaN(config.port) || config.port <= 0) {
  throw new Error("SERVER_PORT_DEV must be a positive number");
}

if (isNaN(config.bcryptSaltRounds) || config.bcryptSaltRounds < 10) {
  throw new Error("BCRYPT_SALT_ROUNDS must be at least 10");
}

// Validate JWT expiry format
const jwtExpiryValue = parseInt(config.jwtExpiresIn);
if (isNaN(jwtExpiryValue) || jwtExpiryValue <= 0) {
  throw new Error("JWT_EXPIRY must be a positive number");
}

// Validate URL formats
try {
  new URL(config.baseUrl);
  new URL(config.frontendUrl);
} catch (error) {
  throw new Error("Invalid URL format for BASE_URL or FRONTEND_URL");
}

export { config };