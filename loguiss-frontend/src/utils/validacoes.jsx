export function validarFormatoEmail(email) {
    if (email.trim() === '') {
        return 'O email é obrigatório';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Formato de email inválido';
    }

    return '';
}

export function validarSenha(senha) {
    if (senha.trim() === '') {
        return 'A senha é obrigatória';
    }

    if (senha.length < 6) {
        return 'A senha deve conter no mínimo 6 caracteres';
    }

    return '';
}

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

export function formatarCPFCNPJ(valor) {
    if (!valor) return '';

    valor = String(valor).toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (/^\d{11}$/.test(valor)) {
        // Formato CPF: 000.000.000-00
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (/^[A-Z0-9]{12}\d{2}$/.test(valor)) {
        // Formato CNPJ: 00.000.000/0000-00
        valor = valor.replace(
            /([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})(\d{2})/,
            '$1.$2.$3/$4-$5',
        );
    }

    return valor;
}

export function formatarTelefone(valor) {
    valor = valor.replace(/\D/g, '');

    if (valor.length > 10) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
        valor = valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return valor;
}

export function formatarMoeda(valor) {
    return Number(valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// recebe "2026-11-22" e devolve "22/11/2026"
export function formatarData(iso) {
    return iso ? iso.split('-').reverse().join('/') : '';
}
