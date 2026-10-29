import "server-only";
import { prisma } from "@/lib/db";
import { decryptSecret } from "@/lib/settings/crypto";

export async function getSettingsRow() {
  let row = await prisma.integrationSettings.findUnique({ where: { id: 1 } });
  if (!row) {
    row = await prisma.integrationSettings.create({ data: { id: 1 } });
  }
  return row;
}

/** Decrypted settings, for internal use only (never render this to the client). */
export async function getDecryptedSettings() {
  const row = await getSettingsRow();
  return {
    ...row,
    openaiApiKey: row.openaiApiKeyEnc ? decryptSecret(row.openaiApiKeyEnc) : null,
    googleServiceAccountJson: row.googleServiceAccountJsonEnc
      ? decryptSecret(row.googleServiceAccountJsonEnc)
      : null,
    smtpPass: row.smtpPassEnc ? decryptSecret(row.smtpPassEnc) : null,
    resendApiKey: row.resendApiKeyEnc ? decryptSecret(row.resendApiKeyEnc) : null,
  };
}

/** Safe-to-render settings, with secrets masked to booleans. */
export async function getMaskedSettings() {
  const row = await getSettingsRow();
  return {
    hasOpenaiApiKey: !!row.openaiApiKeyEnc,
    hasGoogleServiceAccount: !!row.googleServiceAccountJsonEnc,
    sheetUrlPhilippines: row.sheetUrlPhilippines ?? "",
    sheetUrlDominicanRepublic: row.sheetUrlDominicanRepublic ?? "",
    sheetUrlSouthAfrica: row.sheetUrlSouthAfrica ?? "",
    sheetUrlJobs: row.sheetUrlJobs ?? "",
    emailMethod: row.emailMethod,
    smtpHost: row.smtpHost,
    smtpPort: row.smtpPort,
    smtpUser: row.smtpUser ?? "",
    hasSmtpPass: !!row.smtpPassEnc,
    hasResendApiKey: !!row.resendApiKeyEnc,
    fromEmail: row.fromEmail ?? "",
    fromName: row.fromName,
    companyLogoPath: row.companyLogoPath,
    brandColorHex: row.brandColorHex,
    matchThreshold: row.matchThreshold,
    syncIntervalMinutes: row.syncIntervalMinutes,
  };
}
