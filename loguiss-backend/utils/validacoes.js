export function validarCPF(cpf) {
    const numeros = String(cpf ?? '').replace(/\D/g, '');

    if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) {
        return false;
    }

    const calcularDigito = (base, pesoInicial) => {
        const soma = base
            .split('')
            .reduce((total, digito, indice) => total + Number(digito) * (pesoInicial - indice), 0);
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    const primeiroDigito = calcularDigito(numeros.slice(0, 9), 10);
    const segundoDigito = calcularDigito(numeros.slice(0, 10), 11);

    return (
        primeiroDigito === Number(numeros[9]) &&
        segundoDigito === Number(numeros[10])
    );
}

export function validarCNPJ(cnpj) {
    const documento = String(cnpj ?? '')
        .toUpperCase()
        .replace(/[.\s/-]/g, '');

    if (!/^[A-Z0-9]{12}\d{2}$/.test(documento) || /^([A-Z0-9])\1{13}$/.test(documento)) {
        return false;
    }

    const calcularDigito = (base, pesos) => {
        const soma = base
            .split('')
            .reduce(
                (total, caractere, indice) =>
                    total + (caractere.charCodeAt(0) - 48) * pesos[indice],
                0,
            );
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const primeiroDigito = calcularDigito(
        documento.slice(0, 12),
        [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );
    const segundoDigito = calcularDigito(
        documento.slice(0, 13),
        [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );

    return (
        primeiroDigito === Number(documento[12]) &&
        segundoDigito === Number(documento[13])
    );
}
