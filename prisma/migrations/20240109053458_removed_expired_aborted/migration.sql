/*
  Warnings:

  - The values [expired,aborted] on the enum `CheckoutSessionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CheckoutSessionStatus_new" AS ENUM ('ongoing', 'completed');
ALTER TABLE "checkoutSession" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "checkoutSession" ALTER COLUMN "status" TYPE "CheckoutSessionStatus_new" USING ("status"::text::"CheckoutSessionStatus_new");
ALTER TYPE "CheckoutSessionStatus" RENAME TO "CheckoutSessionStatus_old";
ALTER TYPE "CheckoutSessionStatus_new" RENAME TO "CheckoutSessionStatus";
DROP TYPE "CheckoutSessionStatus_old";
ALTER TABLE "checkoutSession" ALTER COLUMN "status" SET DEFAULT 'ongoing';
COMMIT;
