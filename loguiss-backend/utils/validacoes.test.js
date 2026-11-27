import assert from 'node:assert/strict';
import { test } from 'node:test';

import { validarCNPJ, validarCPF } from './validacoes.js';

test('aceita CPF válido com e sem máscara', () => {
    assert.equal(validarCPF('529.982.247-25'), true);
    assert.equal(validarCPF('52998224725'), true);
});

test('rejeita CPF com dígitos verificadores incorretos', () => {
    assert.equal(validarCPF('529.982.247-24'), false);
});

test('rejeita números repetidos, tamanhos incorretos e entradas não numéricas', () => {
    assert.equal(validarCPF('000.000.000-00'), false);
    assert.equal(validarCPF('1234567890'), false);
    assert.equal(validarCPF('abcdefghijk'), false);
});

test('aceita CNPJ válido com e sem máscara', () => {
    assert.equal(validarCNPJ('04.252.011/0001-10'), true);
    assert.equal(validarCNPJ('04252011000110'), true);
    assert.equal(validarCNPJ('12.ABC.345/01DE-35'), true);
});

test('rejeita CNPJ com dígitos verificadores incorretos', () => {
    assert.equal(validarCNPJ('04.252.011/0001-11'), false);
});

test('rejeita CNPJ repetido, com tamanho incorreto ou não numérico', () => {
    assert.equal(validarCNPJ('11.111.111/1111-11'), false);
    assert.equal(validarCNPJ('0425201100011'), false);
    assert.equal(validarCNPJ('abcdefghijklmn'), false);
    assert.equal(validarCNPJ('12.ABC.345/01DE-34'), false);
});
