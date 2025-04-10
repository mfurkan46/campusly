-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "followers" INTEGER[],
ADD COLUMN     "following" INTEGER[],
ADD COLUMN     "profileImage" TEXT;
