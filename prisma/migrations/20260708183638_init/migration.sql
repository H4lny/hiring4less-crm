-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "countryScope" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CandidateSequence" (
    "country" TEXT NOT NULL PRIMARY KEY,
    "lastNumber" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "skills" JSONB NOT NULL,
    "software" JSONB NOT NULL,
    "yearsExperience" REAL NOT NULL,
    "englishLevel" TEXT NOT NULL,
    "hourlyRate" REAL NOT NULL,
    "availability" TEXT NOT NULL,
    "availabilityNote" TEXT,
    "resumePath" TEXT,
    "resumeFileName" TEXT,
    "videoRawPath" TEXT,
    "videoBrandedPath" TEXT,
    "videoStatus" TEXT NOT NULL DEFAULT 'NONE',
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "dateAdded" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "embedding" JSONB,
    "embeddingUpdatedAt" DATETIME,
    "sourceSheetCountry" TEXT,
    "sourceSheetRowRef" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Candidate_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "requiredSkills" JSONB NOT NULL,
    "experienceRequired" TEXT,
    "minYearsExperience" REAL,
    "maxYearsExperience" REAL,
    "industry" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "hiringEmail" TEXT NOT NULL,
    "website" TEXT,
    "budgetMinRate" REAL,
    "budgetMaxRate" REAL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "embedding" JSONB,
    "embeddingUpdatedAt" DATETIME,
    "createdByUserId" TEXT,
    "sourceSheetRowRef" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Job_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "scoreBreakdown" JSONB NOT NULL,
    "explanation" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "dismissedByUserId" TEXT,
    "dismissedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Match_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_dismissedByUserId_fkey" FOREIGN KEY ("dismissedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT,
    "candidateId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "sentByUserId" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "resumeAttached" BOOLEAN NOT NULL DEFAULT false,
    "videoLinkIncluded" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "providerMessageId" TEXT,
    "errorMessage" TEXT,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EmailLog_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EmailLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EmailLog_sentByUserId_fkey" FOREIGN KEY ("sentByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SheetSyncLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetType" TEXT NOT NULL,
    "country" TEXT,
    "triggeredByUserId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "rowsRead" INTEGER NOT NULL DEFAULT 0,
    "rowsCreated" INTEGER NOT NULL DEFAULT 0,
    "rowsUpdated" INTEGER NOT NULL DEFAULT 0,
    "rowsSkipped" INTEGER NOT NULL DEFAULT 0,
    "errorLog" JSONB,
    CONSTRAINT "SheetSyncLog_triggeredByUserId_fkey" FOREIGN KEY ("triggeredByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VideoJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "rawVideoPath" TEXT NOT NULL,
    "brandedVideoPath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "ffmpegLog" TEXT,
    "errorMessage" TEXT,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VideoJob_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CandidateShareLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CandidateShareLink_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CandidateShareLink_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntegrationSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "openaiApiKeyEnc" TEXT,
    "googleServiceAccountJsonEnc" TEXT,
    "sheetUrlPhilippines" TEXT,
    "sheetUrlDominicanRepublic" TEXT,
    "sheetUrlSouthAfrica" TEXT,
    "sheetUrlJobs" TEXT,
    "emailMethod" TEXT NOT NULL DEFAULT 'SMTP',
    "smtpHost" TEXT NOT NULL DEFAULT 'smtp.gmail.com',
    "smtpPort" INTEGER NOT NULL DEFAULT 465,
    "smtpUser" TEXT,
    "smtpPassEnc" TEXT,
    "resendApiKeyEnc" TEXT,
    "fromEmail" TEXT,
    "fromName" TEXT NOT NULL DEFAULT 'Hiring4Less',
    "companyLogoPath" TEXT,
    "brandColorHex" TEXT NOT NULL DEFAULT '#0F172A',
    "matchThreshold" REAL NOT NULL DEFAULT 70,
    "syncIntervalMinutes" INTEGER NOT NULL DEFAULT 30,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_candidateId_key" ON "Candidate"("candidateId");

-- CreateIndex
CREATE INDEX "Candidate_country_idx" ON "Candidate"("country");

-- CreateIndex
CREATE INDEX "Candidate_status_idx" ON "Candidate"("status");

-- CreateIndex
CREATE INDEX "Candidate_recruiterId_idx" ON "Candidate"("recruiterId");

-- CreateIndex
CREATE INDEX "Candidate_englishLevel_idx" ON "Candidate"("englishLevel");

-- CreateIndex
CREATE INDEX "Candidate_availability_idx" ON "Candidate"("availability");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_industry_idx" ON "Job"("industry");

-- CreateIndex
CREATE INDEX "Match_score_idx" ON "Match"("score");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Match_candidateId_jobId_key" ON "Match"("candidateId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateShareLink_token_key" ON "CandidateShareLink"("token");
