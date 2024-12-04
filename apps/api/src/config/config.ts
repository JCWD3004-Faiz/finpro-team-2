const config = {
  JWT_SECRET: process.env.JWT_SECRET || "",
};

if (!config.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export default config;
