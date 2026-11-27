export function calcular_quantidade_perdida(quantidadeProduzida, margemPerdaPercentual) {
    const quantidade = Number(quantidadeProduzida);
    const margem = Number(margemPerdaPercentual);

    if (!Number.isFinite(quantidade) || quantidade < 0) {
        throw new TypeError('Quantidade produzida inválida.');
    }

    if (!Number.isFinite(margem) || margem < 0 || margem > 100) {
        throw new TypeError('A margem de perda deve estar entre 0 e 100%.');
    }

    return Number(((quantidade * margem) / 100).toFixed(10));
}
