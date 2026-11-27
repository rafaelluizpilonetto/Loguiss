export function parse_data_iso(valor, nomeCampo = 'Data') {
    if (valor === undefined) return undefined;
    if (valor === null) return null;
    if (typeof valor !== 'string') {
        throw new TypeError(`${nomeCampo} inválida.`);
    }

    const texto = valor.trim();
    if (!texto) return null;

    const dataSemHorario = /^\d{4}-\d{2}-\d{2}$/.test(texto);
    const data = new Date(dataSemHorario ? `${texto}T00:00:00.000Z` : texto);

    if (
        Number.isNaN(data.getTime()) ||
        (dataSemHorario && data.toISOString().slice(0, 10) !== texto)
    ) {
        throw new TypeError(`${nomeCampo} inválida.`);
    }

    return data;
}
