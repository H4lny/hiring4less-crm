import "server-only";
import { prisma } from "@/lib/db";
import { encryptSecret } from "@/lib/settings/crypto";
import { getSettingsRow } from "@/lib/settings/get-settings";

export type SettingsUpdateInput = {
  openaiApiKey?: string; // blank = leave unchanged
  googleServiceAccountJson?: string;
  sheetUrlPhilippines?: string;
  sheetUrlDominicanRepublic?: string;
  sheetUrlSouthAfrica?: string;
  sheetUrlJobs?: string;
  emailMethod?: "SMTP" | "RESEND";
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  resendApiKey?: string;
  fromEmail?: string;
  fromName?: string;
  companyLogoPath?: string;
  brandColorHex?: string;
  matchThreshold?: number;
  syncIntervalMinutes?: number;
};

export async function updateSettings(input: SettingsUpdateInput): Promise<void> {
  await getSettingsRow(); // ensure row exists

  const data: Record<string, unknown> = {};

  if (input.openaiApiKey) data.openaiApiKeyEnc = encryptSecret(input.openaiApiKey);
  if (input.googleServiceAccountJson)
    data.googleServiceAccountJsonEnc = encryptSecret(input.googleServiceAccountJson);
  if (input.smtpPass) data.smtpPassEnc = encryptSecret(input.smtpPass);
  if (input.resendApiKey) data.resendApiKeyEnc = encryptSecret(input.resendApiKey);

  if (input.sheetUrlPhilippines !== undefined) data.sheetUrlPhilippines = input.sheetUrlPhilippines;
  if (input.sheetUrlDominicanRepublic !== undefined)
    data.sheetUrlDominicanRepublic = input.sheetUrlDominicanRepublic;
  if (input.sheetUrlSouthAfrica !== undefined) data.sheetUrlSouthAfrica = input.sheetUrlSouthAfrica;
  if (input.sheetUrlJobs !== undefined) data.sheetUrlJobs = input.sheetUrlJobs;
  if (input.emailMethod !== undefined) data.emailMethod = input.emailMethod;
  if (input.smtpHost !== undefined) data.smtpHost = input.smtpHost;
  if (input.smtpPort !== undefined) data.smtpPort = input.smtpPort;
  if (input.smtpUser !== undefined) data.smtpUser = input.smtpUser;
  if (input.fromEmail !== undefined) data.fromEmail = input.fromEmail;
  if (input.fromName !== undefined) data.fromName = input.fromName;
  if (input.companyLogoPath !== undefined) data.companyLogoPath = input.companyLogoPath;
  if (input.brandColorHex !== undefined) data.brandColorHex = input.brandColorHex;
  if (input.matchThreshold !== undefined) data.matchThreshold = input.matchThreshold;
  if (input.syncIntervalMinutes !== undefined)
    data.syncIntervalMinutes = input.syncIntervalMinutes;

  await prisma.integrationSettings.update({ where: { id: 1 }, data });
}
