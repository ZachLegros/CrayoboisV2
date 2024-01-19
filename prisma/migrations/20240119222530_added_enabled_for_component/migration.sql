-- AlterTable
ALTER TABLE "hardware" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "material" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
