import bcrypt from "bcryptjs";
import jwt, {JwtPayload} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateReferralCode(length: number = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export const validatePassword = async (
  inputPassword: string,
  hash: string | null
): Promise<boolean> => {
  return bcrypt.compare(inputPassword, String(hash));
};

export const generateVerifiationToken = (data: {username: string, email: string}) => {
  return jwt.sign(
    {email: data.email, username: data.username},
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

export const generateAccessToken = (user: { user_id: number; role: string; is_verified: boolean }) => {
  return jwt.sign(
    { id: user.user_id, role: user.role, is_verified: user.is_verified},
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const generateTokens = (user: { user_id: number; role: string; is_verified: boolean }) => {
  const accessToken = jwt.sign(
    { id: user.user_id, role: user.role, is_verified:  user.is_verified},
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign({ id: user.user_id }, JWT_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export function extractToken(authHeader?: string): string {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token missing or invalid");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Authorization token missing");
  }
  return token;
}

export function verifyToken(token: string, secretKey: string): JwtPayload {
  const decoded = jwt.verify(token, secretKey);
  if (typeof decoded !== "object" || !("email" in decoded) || !("username" in decoded)) {
    throw new Error("Invalid token payload");
  }
  return decoded as JwtPayload;
}
