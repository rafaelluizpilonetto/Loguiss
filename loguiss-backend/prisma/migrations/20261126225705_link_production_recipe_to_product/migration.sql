ALTER TABLE "receita" ADD COLUMN "id_produto_producao" INTEGER;

CREATE UNIQUE INDEX "receita_id_produto_producao_key"
ON "receita"("id_produto_producao");

ALTER TABLE "receita"
ADD CONSTRAINT "receita_id_produto_producao_fkey"
FOREIGN KEY ("id_produto_producao")
REFERENCES "produto"("id_produto")
ON DELETE SET NULL
ON UPDATE CASCADE;

WITH candidatas AS (
    SELECT
        p."id_produto",
        r."id_receita",
        COUNT(*) OVER (PARTITION BY p."id_produto") AS "produtos_correspondentes",
        COUNT(*) OVER (PARTITION BY r."id_receita") AS "receitas_correspondentes"
    FROM "produto" p
    JOIN "tipo_produto" tp ON tp."id_tipo_produto" = p."id_tipo_produto"
    JOIN "receita" r ON r."created_at" = p."created_at"
    WHERE tp."flag_tipo" = 'P'
)
UPDATE "receita" r
SET "id_produto_producao" = c."id_produto"
FROM candidatas c
WHERE c."id_receita" = r."id_receita"
  AND c."produtos_correspondentes" = 1
  AND c."receitas_correspondentes" = 1;
