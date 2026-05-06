import crypto from "crypto";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;

interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

const base64UrlEncode = (input: string | Buffer): string => {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const base64UrlDecode = (input: string): string => {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64").toString("utf8");
};

const sign = (data: string): string => {
  return base64UrlEncode(
    crypto.createHmac("sha256", SECRET).update(data).digest()
  );
};

export const createToken = (userId: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload: JwtPayload = {
    userId,
    iat: now,
    exp: now + EXPIRES_IN_SECONDS,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(`${headerB64}.${payloadB64}`);

  return `${headerB64}.${payloadB64}.${signature}`;
};

export const verifyToken = (token: string): JwtPayload => {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token format");

  const [headerB64, payloadB64, signatureB64] = parts;

  // Recompute signature and compare
  const expectedSignature = sign(`${headerB64}.${payloadB64}`);
  if (
    !crypto.timingSafeEqual(
      Buffer.from(signatureB64),
      Buffer.from(expectedSignature)
    )
  ) {
    throw new Error("Invalid signature");
  }

  const payload: JwtPayload = JSON.parse(base64UrlDecode(payloadB64));

  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) throw new Error("Token expired");

  return payload;
};
