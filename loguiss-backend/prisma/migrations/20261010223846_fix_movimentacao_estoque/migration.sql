-- AlterTable
ALTER TABLE "movimentacao_estoque" ADD COLUMN     "id_cliente" INTEGER,
ADD COLUMN     "valor_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "valor_unitario" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "movimentacao_estoque_id_cliente_idx" ON "movimentacao_estoque"("id_cliente");
