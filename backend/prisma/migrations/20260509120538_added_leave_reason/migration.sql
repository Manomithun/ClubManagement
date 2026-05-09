-- CreateEnum
CREATE TYPE "LeaveReason" AS ENUM ('LEFT_VOLUNTARILY', 'REMOVED_BY_ADMIN', 'REMOVED_BY_SYSTEM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "EventStatus" ADD VALUE 'ONGOING';

-- AlterTable
ALTER TABLE "ClubJoinHistory" ADD COLUMN     "leaveReason" "LeaveReason" DEFAULT 'LEFT_VOLUNTARILY';
