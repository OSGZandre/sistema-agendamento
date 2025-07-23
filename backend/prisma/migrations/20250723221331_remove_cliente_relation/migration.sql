/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Agendamento` table. All the data in the column will be lost.
  - Added the required column `nomeCliente` to the `Agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_clienteId_fkey";

-- AlterTable
ALTER TABLE "Agendamento" DROP COLUMN "clienteId",
ADD COLUMN     "nomeCliente" TEXT NOT NULL;
