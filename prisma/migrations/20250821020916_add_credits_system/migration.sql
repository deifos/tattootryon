-- AlterTable
ALTER TABLE "tattootraceai"."user" ADD COLUMN     "availableCredits" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "freeCreditsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "tattootraceai"."purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "stripeSessionId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tattootraceai"."generation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "baseImageUrl" TEXT,
    "tattooImageUrl" TEXT,
    "bodyPart" TEXT,
    "creditsUsed" INTEGER NOT NULL DEFAULT 1,
    "wasFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tattootraceai"."purchase" ADD CONSTRAINT "purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tattootraceai"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tattootraceai"."generation" ADD CONSTRAINT "generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tattootraceai"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
