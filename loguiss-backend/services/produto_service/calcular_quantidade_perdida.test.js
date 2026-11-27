import assert from 'node:assert/strict';
import { test } from 'node:test';

import { calcular_quantidade_perdida } from './calcular_quantidade_perdida.js';

test('calcula a perda prevista como percentual da produção', () => {
    assert.equal(calcular_quantidade_perdida(10, 5), 0.5);
});

test('retorna zero quando a margem de perda é zero', () => {
    assert.equal(calcular_quantidade_perdida(10, 0), 0);
});

test('rejeita quantidade ou margem fora dos limites', () => {
    assert.throws(() => calcular_quantidade_perdida(-1, 5), /Quantidade produzida inválida/);
    assert.throws(() => calcular_quantidade_perdida(10, 101), /entre 0 e 100%/);
});
