import assert from 'node:assert/strict';
import { test } from 'node:test';

import { resolver_tipo_produto } from './resolver_tipo_produto.js';

test('resolve o tipo pelo flag enviado pelo formulário', async () => {
    const tipoNormal = { id_tipo_produto: 7, flag_tipo: 'N' };
    const prisma = {
        tipo_produto: {
            findFirst: async ({ where }) => (where.flag_tipo === 'N' ? tipoNormal : null),
        },
    };

    assert.equal(
        await resolver_tipo_produto(prisma, { id_tipo_produto: 2, flag_tipo: 'N' }),
        tipoNormal,
    );
});

test('usa o id quando o cliente antigo não envia o flag', async () => {
    const tipoProducao = { id_tipo_produto: 2, flag_tipo: 'P' };
    const prisma = {
        tipo_produto: {
            findUnique: async ({ where }) =>
                where.id_tipo_produto === 2 ? tipoProducao : null,
        },
    };

    assert.equal(await resolver_tipo_produto(prisma, { id_tipo_produto: 2 }), tipoProducao);
});
