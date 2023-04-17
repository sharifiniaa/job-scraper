/*
  Warnings:

  - A unique constraint covering the columns `[job_name]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `job_name` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "job_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_job_name_key" ON "Job"("job_name");
