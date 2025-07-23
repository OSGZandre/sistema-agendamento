-- CreateEnum
CREATE TYPE "MetodoPagamento" AS ENUM ('PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'DINHEIRO');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "duracao" INTEGER NOT NULL,
    "metodosPagamento" "MetodoPagamento"[],
    "diasDisponiveis" "DiaSemana"[],
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "donoId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_donoId_fkey" FOREIGN KEY ("donoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
