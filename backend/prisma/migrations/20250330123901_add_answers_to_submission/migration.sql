/*
  Warnings:

  - The `answers` column on the `AssignmentSubmission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AssignmentSubmission" DROP COLUMN "answers",
ADD COLUMN     "answers" TEXT[];
