import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parse_data_iso } from './parse_data_iso.js';

test('converte data sem horário em meia-noite UTC', () => {
    assert.equal(
        parse_data_iso('2026-12-31').toISOString(),
        '2026-12-31T00:00:00.000Z',
    );
});

test('aceita ausência e valor vazio como campo opcional', () => {
    assert.equal(parse_data_iso(undefined), undefined);
    assert.equal(parse_data_iso(null), null);
    assert.equal(parse_data_iso(''), null);
});

test('rejeita datas inválidas', () => {
    assert.throws(() => parse_data_iso('2026-02-30'), /Data inválida/);
    assert.throws(() => parse_data_iso('não é uma data'), /Data inválida/);
});
