/*
  Warnings:

  - You are about to alter the column `text` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "text" SET DATA TYPE VARCHAR(500);
