import "server-only";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const KEY_PATH = path.join(process.cwd(), "..", "data", "secret.key");
const KEY_PATH_FALLBACK = path.join(process.cwd(), "data", "secret.key");

function resolveKeyPath(): string {
  const dataDir = path.dirname(KEY_PATH_FALLBACK);
  if (fs.existsSync(dataDir)) return KEY_PATH_FALLBACK;
  return KEY_PATH_FALLBACK;
}

function getOrCreateKey(): Buffer {
  const envKey = process.env.SETTINGS_ENCRYPTION_KEY;
  if (envKey) {
    const buf = Buffer.from(envKey.trim(), "hex");
    if (buf.length !== 32) {
      throw new Error("SETTINGS_ENCRYPTION_KEY must be a 64-character hex string (32 bytes).");
    }
    return buf;
  }

  // Local dev fallback only — on a host with an ephemeral filesystem (e.g. Render),
  // a file-based key gets regenerated on every restart and silently breaks every
  // previously-encrypted setting. Always set SETTINGS_ENCRYPTION_KEY in production.
  const keyPath = resolveKeyPath();
  const dir = path.dirname(keyPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(keyPath)) {
    return Buffer.from(fs.readFileSync(keyPath, "utf8").trim(), "hex");
  }

  const key = crypto.randomBytes(32);
  fs.writeFileSync(keyPath, key.toString("hex"), { encoding: "utf8" });
  return key;
}

let cachedKey: Buffer | null = null;
function key(): Buffer {
  if (!cachedKey) cachedKey = getOrCreateKey();
  return cachedKey;
}

/** Encrypts a secret for storage in the local database. Returns "iv:authTag:ciphertext" hex-encoded. */
export function encryptSecret(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("hex"), authTag.toString("hex"), ciphertext.toString("hex")].join(":");
}

export function decryptSecret(encoded: string): string {
  const [ivHex, authTagHex, ciphertextHex] = encoded.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key(),
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(ciphertextHex, "hex")),
    decipher.final(),
  ]);
  return plain.toString("utf8");
}
