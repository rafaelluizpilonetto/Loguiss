import { Package, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { EntityCard } from '../components/card';
import { Combobox } from '../components/combobox';
import { DeleteModal } from '../components/deleteModal';
import { Inputs } from '../components/inputs';
import { SideBar } from '../components/sidebar';
import api from '../services/api';
import { formatarMoeda } from '../utils/validacoes';

// Formata dígitos como moeda pt-BR enquanto digita (ex.: "1250" -> "12,50")
function formatarMoedaDigitacao(valor) {
    const apenasDigitos = String(valor ?? '').replace(/\D/g, '');
    if (!apenasDigitos) return '';

    const numero = Number(apenasDigitos) / 100;
    return numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// Formata número vindo da API (ex.: 12.5 ou "12.50") para exibição no input ("12,50")
function formatarNumeroParaInput(valor) {
    if (valor === null || valor === undefined || valor === '') return '';
    if (typeof valor === 'number') {
        return valor.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }
    const str = String(valor).trim();
    if (str.includes(',')) {
        return formatarMoedaDigitacao(str);
    }
    const num = Number(str);
    if (!Number.isFinite(num)) return '';
    return num.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// Converte valor formatado ("1.250,50" ou "12,50") para Number (1250.5 / 12.5)
function converterMoedaParaNumero(valorFormatado) {
    if (valorFormatado === null || valorFormatado === undefined || valorFormatado === '') {
        return 0;
    }
    if (typeof valorFormatado === 'number') {
        return Number.isFinite(valorFormatado) ? valorFormatado : 0;
    }
    const limpo = String(valorFormatado)
        .replace(/\s/g, '')
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.');

    const numero = Number(limpo);
    return Number.isFinite(numero) ? numero : 0;
}

// Normaliza datas vindas da API para o formato "AAAA-MM-DD" exigido por <input type="date" />
function extrairDataInput(...candidatos) {
    for (const valor of candidatos) {
        if (!valor) continue;

        if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
            return valor.toISOString().slice(0, 10);
        }

        const texto = String(valor).trim();
        if (!texto) continue;

        const matchIso = texto.match(/^(\d{4}-\d{2}-\d{2})/);
        if (matchIso) {
            return matchIso[1];
        }

        const matchBr = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (matchBr) {
            return `${matchBr[3]}-${matchBr[2]}-${matchBr[1]}`;
        }

        const dataParseada = new Date(texto);
        if (!Number.isNaN(dataParseada.getTime())) {
            return dataParseada.toISOString().slice(0, 10);
        }
    }

    return '';
}

const produtoInicial = {
    id_produto: null,
    id_tipo_produto: null,
    desc: '',
    id_categoria: null,
    categoria: '',
    id_unidade_medida: null,
    unidade: '',
    minimo: '',
    valor: '',
    quantidade_estoque: '0',
    id_fornecedor: null,
    fornecedor: '',
    dt_entrada: '',
    prazo_saida: '',
    dt_validade: '',
    fgTipoProducao: false,
};

const ingredienteInicial = {
    produto: '',
    id_produto: null,
    quantidade: '',
    id_unidade: '',
};

const receitaInicial = {
    nome: '',
    margemPerda: '',
    quantidadeProduzida: '',
    ingredientes: [ingredienteInicial],
};

const calcularPerdaPrevista = (quantidadeProduzida, margemPerdaPercentual) => {
    const quantidade = Number(quantidadeProduzida);
    const margem = Number(margemPerdaPercentual);

    if (!Number.isFinite(quantidade) || !Number.isFinite(margem)) return 0;
    return Number(((quantidade * margem) / 100).toFixed(10));
};

const produtoEhProducao = (produto) =>
    Boolean(
        produto.fgTipoProducao ??
            String(produto.tipo_produto?.flag_tipo ?? produto.flag_tipo ?? produto.tipo ?? '')
                .toUpperCase() === 'P',
    );

const receitaParaForm = (produto) => {
    const receita = produto.receita_producao ?? produto.receita;
    if (!receita) {
        return {
            ...receitaInicial,
            ingredientes: receitaInicial.ingredientes.map((ingrediente) => ({ ...ingrediente })),
        };
    }

    const ingredientes = receita.produtos ?? receita.ingredientes ?? [];
    return {
        nome: receita.descricao ?? receita.nome ?? '',
        margemPerda: String(receita.margem_perda ?? receita.margemPerda ?? ''),
        quantidadeProduzida: String(
            receita.quantidade_produzida ?? receita.quantidadeProduzida ?? '',
        ),
        ingredientes: ingredientes.map((item) => ({
            produto: item.produto?.descricao ?? item.descricao ?? '',
            id_produto: item.id_produto ?? item.produto?.id_produto ?? null,
            quantidade: String(item.quantidade ?? ''),
            unidade:
                item.unidade_medida?.nomenclatura ??
                item.unidade_medida?.descrunidade ??
                item.unidade ??
                '',
            id_unidade:
                item.id_unidade ?? item.unidade_medida?.id_unidade ?? '',
        })),
    };
};

const produtoParaForm = (p) => {
    const categoria = p.categorias?.[0]?.categoria;
    const fornecedor = p.fornecedores?.[0]?.fornecedor;
    const estoque = Array.isArray(p.estoques)
        ? p.estoques[0] ?? {}
        : p.estoque ?? {};
    const unidadeObj = p.unidade_medida ?? p.unidadeMedida ?? null;
    const isProducao = produtoEhProducao(p);

    return {
        ...produtoInicial,
        id_produto: p.id_produto,
        id_tipo_produto: p.id_tipo_produto ?? null,
        desc: p.descricao ?? '',
        categoria: categoria?.descricao ?? '',
        id_categoria: categoria?.id_categoria ?? null,
        fornecedor: fornecedor?.nome ?? estoque.fornecedor?.nome ?? '',
        id_fornecedor: fornecedor?.id_fornecedor ?? estoque.id_fornecedor_user ?? null,
        minimo: estoque.minimo ?? p.minimo ?? '',
        valor: formatarNumeroParaInput(p.valor),
        quantidade_estoque: String(estoque.quantidade ?? p.quantidade ?? 0),
        fgTipoProducao: isProducao,
        unidade:
            typeof p.unidade === 'string'
                ? p.unidade
                : unidadeObj?.nomenclatura ?? unidadeObj?.descrunidade ?? '',
        id_unidade_medida:
            p.id_unidade_medida ?? unidadeObj?.id_unidade ?? unidadeObj?.id_unidade_medida ?? null,
        dt_entrada: extrairDataInput(
            estoque.dt_entrada,
            estoque.data_entrada,
            p.dt_entrada,
            p.data_entrada,
        ),
        prazo_saida: extrairDataInput(
            estoque.prazo_saida,
            p.prazo_saida,
        ),
        dt_validade: extrairDataInput(
            estoque.dt_validade,
            estoque.data_validade,
            p.dt_validade,
            p.data_validade,
        ),
    };
};

const semSelecao = (texto, id) => texto.trim() !== '' && !id;

const lista = (resultado, chave) =>
    resultado.status === 'fulfilled' && Array.isArray(resultado.value.data?.[chave])
        ? resultado.value.data[chave]
        : [];

function Produtos() {
    const [showProductForm, setShowProductForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
    const [newProduct, setNewProduct] = useState(produtoInicial);
    const [newReceita, setNewReceita] = useState(receitaInicial);

    const filteredProducts = products.filter((produto) =>
        (produto.descricao ?? '').toLowerCase().includes(appliedSearch.toLowerCase()),
    );

    // Retorna "P" quando marcado (produto produção) e "N" quando desmarcado (produto normal)
    const obterFlagTipo = (fgProducao) => (fgProducao ? 'P' : 'N');

    const montarPayloadProduto = () => {
        const flagTipo = obterFlagTipo(newProduct.fgTipoProducao);
        const valorNumerico = converterMoedaParaNumero(newProduct.valor);

        return {
            descricao: newProduct.desc.trim(),
            id_tipo_produto: newProduct.id_tipo_produto,
            tipo: flagTipo,
            flag_tipo: flagTipo,
            id_unidade_medida: Number(newProduct.id_unidade_medida),
            valor: valorNumerico,
            flag_ativo: 'T',
            id_categoria_user: Number(newProduct.id_categoria),

            estoque: {
                id_receita: 0,
                id_fornecedor_user: Number(newProduct.id_fornecedor),
                is_fracionado: 'F',
                quantidade: Number(newProduct.quantidade_estoque),
                dt_entrada: newProduct.dt_entrada,
                minimo: Number(newProduct.minimo),
                prazo_saida: newProduct.prazo_saida,
                dt_validade: newProduct.dt_validade || null,
            },

            receita: newProduct.fgTipoProducao
                ? {
                      descricao: newReceita.nome,
                      margem_perda: Number(newReceita.margemPerda),
                      quantidade_produzida: Number(newReceita.quantidadeProduzida),
                      quantidade_perdida: calcularPerdaPrevista(
                          newReceita.quantidadeProduzida,
                          newReceita.margemPerda,
                      ),
                  }
                : null,

            ingredientes: newProduct.fgTipoProducao
                ? newReceita.ingredientes.map((ingrediente) => ({
                      id_produto: Number(ingrediente.id_produto),
                      quantidade: Number(ingrediente.quantidade),
                      unidade_medida_ingrediente: Number(ingrediente.id_unidade),
                  }))
                : [],
        };
    };

    useEffect(() => {
        const carregar = async () => {
            const resultados = await Promise.allSettled([
                api.get('/produto/list_produtos'),
                api.get('/fornecedor/list_fornecedor'),
                api.get('/categoria/list_categorias'),
                api.get('/unidade_medida/list_unidade_medida'),
            ]);

            setProducts(lista(resultados[0], 'produtos'));
            setFornecedores(lista(resultados[1], 'fornecedores'));
            setCategorias(lista(resultados[2], 'categorias'));
            setUnidades(lista(resultados[3], 'unidades'));

            if (resultados.slice(0, 4).some((r) => r.status === 'rejected')) {
                toast.error('Alguns dados não puderam ser carregados.');
            }
        };

        carregar();
    }, []);

    useEffect(() => {
        // bloqueia o scroll da tela de trás quando algum modal estiver aberto
        if (!showProductForm && !produtoParaExcluir) return;

        const overflowAnterior = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowAnterior;
        };
    }, [showProductForm, produtoParaExcluir]);

    const setCampo = (campo) => (e) =>
        setNewProduct((prev) => ({
            ...prev,
            [campo]: e.target.value,
        }));

    const handleChangeValor = (e) => {
        const formatado = formatarMoedaDigitacao(e.target.value);
        setNewProduct((prev) => ({
            ...prev,
            valor: formatado,
        }));
    };

    const handleToggleProducao = (e) => {
        setNewProduct((prev) => ({
            ...prev,
            fgTipoProducao: e.target.checked,
        }));
    };

    const setCampoReceita = (campo) => (e) =>
        setNewReceita((prev) => ({
            ...prev,
            [campo]: e.target.value,
        }));

    const atualizarIngrediente = (index, campos) =>
        setNewReceita((prev) => ({
            ...prev,
            ingredientes: prev.ingredientes.map((ing, i) =>
                i === index ? { ...ing, ...campos } : ing,
            ),
        }));

    const adicionarIngrediente = () =>
        setNewReceita((prev) => ({
            ...prev,
            ingredientes: [...prev.ingredientes, { ...ingredienteInicial }],
        }));

    const removerIngrediente = (index) =>
        setNewReceita((prev) => ({
            ...prev,
            ingredientes: prev.ingredientes.filter((_, i) => i !== index),
        }));

    const abrirNovo = () => {
        setEditingId(null);
        setNewProduct(produtoInicial);
        setNewReceita(receitaInicial);
        setShowProductForm(true);
    };

    const abrirEdicao = (produto) => {
        setEditingId(produto.id_produto);
        setNewProduct(produtoParaForm(produto));
        setNewReceita(receitaParaForm(produto));
        setShowProductForm(true);
    };

    const fecharForm = () => {
        setShowProductForm(false);
        setEditingId(null);
        setNewProduct(produtoInicial);
        setNewReceita(receitaInicial);
    };

    const validarSelecoes = () => {
        if (semSelecao(newProduct.categoria, newProduct.id_categoria)) {
            return 'Escolha uma categoria da lista.';
        }

        if (semSelecao(newProduct.unidade, newProduct.id_unidade_medida)) {
            return 'Escolha uma unidade de medida da lista.';
        }

        if (semSelecao(newProduct.fornecedor, newProduct.id_fornecedor)) {
            return 'Escolha um fornecedor da lista.';
        }

        if (
            newProduct.fgTipoProducao &&
            newReceita.ingredientes.some(
                (ingrediente) =>
                    !Number.isInteger(Number(ingrediente.id_produto)) ||
                    Number(ingrediente.id_produto) <= 0,
            )
        ) {
            return 'Escolha os produtos da receita na lista.';
        }

        if (
            newProduct.fgTipoProducao &&
            newReceita.ingredientes.some(
                (ingrediente) =>
                    !Number.isInteger(Number(ingrediente.id_unidade)) ||
                    Number(ingrediente.id_unidade) <= 0,
            )
        ) {
            return 'Escolha uma unidade para cada ingrediente na lista.';
        }

        return '';
    };

    const [saving, setSaving] = useState(false);

    const editarProduto = async () => {
        const valorNumerico = converterMoedaParaNumero(newProduct.valor);

        const payload = {
            descricao: newProduct.desc.trim(),
            id_unidade_medida: Number(newProduct.id_unidade_medida),
            valor: valorNumerico,
            flag_ativo: 'T',
            dt_entrada: newProduct.dt_entrada || null,
            prazo_saida: newProduct.prazo_saida || null,
            dt_validade: newProduct.dt_validade || null,
            estoque: {
                dt_entrada: newProduct.dt_entrada || null,
                prazo_saida: newProduct.prazo_saida || null,
                dt_validade: newProduct.dt_validade || null,
                minimo: Number(newProduct.minimo),
            },
            receita: newProduct.fgTipoProducao
                ? {
                      descricao: newReceita.nome,
                      margem_perda: Number(newReceita.margemPerda),
                      quantidade_produzida: Number(newReceita.quantidadeProduzida),
                      quantidade_perdida: calcularPerdaPrevista(
                          newReceita.quantidadeProduzida,
                          newReceita.margemPerda,
                      ),
                  }
                : null,
            ingredientes: newProduct.fgTipoProducao
                ? newReceita.ingredientes.map((ingrediente) => ({
                      id_produto: Number(ingrediente.id_produto),
                      quantidade: Number(ingrediente.quantidade),
                      unidade_medida_ingrediente: Number(ingrediente.id_unidade),
                  }))
                : [],
        };

        const response = await api.patch(`/produto/edit_produto/${editingId}`, payload);

        toast.success(response.data.MSG || 'Produto atualizado com sucesso!');
    };

    const salvarProduto = async (e) => {
        e.preventDefault();

        const erro = validarSelecoes();

        if (erro) {
            toast.error(erro);
            return;
        }

        if (!newProduct.desc.trim()) {
            toast.error('Informe a descrição do produto.');
            return;
        }

        const valorNumerico = converterMoedaParaNumero(newProduct.valor);
        if (newProduct.valor === '' || valorNumerico < 0) {
            toast.error('Informe um valor válido.');
            return;
        }

        try {
            setSaving(true);

            if (editingId !== null) {
                await editarProduto();
            } else {
                const payload = montarPayloadProduto();

                const response = await api.post('/produto/create_produto', payload);

                toast.success(response.data.MSG || 'Produto cadastrado com sucesso!');
            }

            fecharForm();

            const atualizacao = await api.get('/produto/list_produtos');

            setProducts(atualizacao.data.produtos ?? []);
        } catch (error) {
            toast.error(
                error.response?.data?.MSG || error.message || 'Erro ao salvar produto!',
            );
        } finally {
            setSaving(false);
        }
    };

    const excluirProduto = async () => {
        if (!produtoParaExcluir) return;

        try {
            await api.delete(
                `/produto/delete_produto/${produtoParaExcluir.id_produto}`
            );

            setProducts((listaAtual) =>
                listaAtual.filter(
                    (item) => item.id_produto !== produtoParaExcluir.id_produto
                )
            );

            toast.success('Produto excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir:', error);

            toast.error(
                error.response?.data?.MSG || 'Erro ao excluir o produto.'
            );

            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                {/* Cabeçalho */}
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text)]">Produtos</h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de produtos. Aqui você pode gerenciar os produtos
                            cadastrados no sistema.
                        </p>
                    </div>

                    <Button type="button" className="mt-2 w-auto" onClick={abrirNovo}>
                        Adicionar novo produto
                    </Button>
                </div>

                {/* Pesquisa */}
                <Inputs
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            setAppliedSearch(searchTerm.trim());
                        }
                    }}
                    className="mt-5 w-1/2"
                    icon={Search}
                />

                {/* Cards */}
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.length === 0 && (
                        <p className="text-texto-suave">Nenhum produto encontrado.</p>
                    )}

                    {filteredProducts.map((produto) => {
                        const isProducao = produtoEhProducao(produto);

                        return (
                            <EntityCard
                                key={produto.id_produto}
                                titulo={produto.descricao}
                                icone={Package}
                                onEdit={() => abrirEdicao(produto)}
                                onDelete={() => setProdutoParaExcluir(produto)}
                            >
                                <p className="mt-2 text-texto-suave">
                                    Categoria:{' '}
                                    {produto.categorias?.[0]?.categoria?.descricao ??
                                        'Sem categoria'}
                                </p>

                                <p className="mt-1 text-texto-suave">
                                    Quantidade: {produto.estoque?.quantidade ?? 0}
                                </p>

                                <p className="mt-1 text-texto-suave">
                                    Valor: {formatarMoeda(produto.valor)}
                                </p>

                                <p className="mt-1 text-texto-suave">
                                    Fornecedor:{' '}
                                    {produto.fornecedores?.[0]?.fornecedor?.nome ??
                                        'Sem fornecedor'}
                                </p>

                                <p className="mt-1 text-texto-suave">
                                    Produto Produção: {isProducao ? 'Sim' : 'Não'}
                                </p>
                            </EntityCard>
                        );
                    })}
                </div>
            </main>

            {/* Modal de cadastro/edição */}
            {showProductForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-borda bg-superficie shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                        {/* Cabeçalho */}
                        <div className="flex items-center justify-between px-6 py-5">
                            <div>
                                <h2 className="text-2xl font-bold text-texto">
                                    {editingId !== null ? 'Editar produto' : 'Adicionar produto'}
                                </h2>

                                <p className="mt-1 text-sm text-texto-suave">
                                    {editingId !== null
                                        ? 'Atualize as informações do produto.'
                                        : 'Preencha os dados para cadastrar um novo produto.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharForm}
                                className="text-2xl text-texto-suave transition-colors hover:text-primaria"
                            >
                                ×
                            </button>
                        </div>

                        <form className="flex min-h-0 flex-1 flex-col" onSubmit={salvarProduto}>
                            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                                {/* Informações do produto */}
                                <div className="mb-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <div className="h-5 w-1 rounded-full bg-primaria" />

                                        <h3 className="text-sm font-bold uppercase tracking-wider text-texto">
                                            Informações do produto
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Inputs
                                            label="Descrição"
                                            className="sm:col-span-2"
                                            value={newProduct.desc}
                                            onChange={setCampo('desc')}
                                            placeholder="Nome do produto"
                                            required
                                        />

                                        <Combobox
                                            label="Categoria"
                                            value={newProduct.categoria}
                                            opcoes={categorias}
                                            getLabel={(c) => c.descricao}
                                            getChave={(c) => c.id_categoria}
                                            onChange={(texto) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    categoria: texto,
                                                    id_categoria: null,
                                                })
                                            }
                                            onSelect={(c) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    categoria: c.descricao,
                                                    id_categoria: c.id_categoria,
                                                })
                                            }
                                        />

                                        <Combobox
                                            label="Unidade de medida"
                                            value={newProduct.unidade}
                                            opcoes={unidades}
                                            getLabel={(u) =>
                                                `${u.descrunidade} - ${u.nomenclatura}`
                                            }
                                            getChave={(u) => u.id_unidade}
                                            onChange={(texto) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    unidade: texto,
                                                    id_unidade_medida: null,
                                                })
                                            }
                                            onSelect={(u) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    unidade: u.nomenclatura,
                                                    id_unidade_medida: u.id_unidade,
                                                })
                                            }
                                        />

                                        <Inputs
                                            label="Estoque mínimo"
                                            type="number"
                                            min="0"
                                            value={newProduct.minimo}
                                            onChange={setCampo('minimo')}
                                            placeholder="0"
                                            required
                                        />

                                        <Inputs
                                            label="Quantidade em estoque"
                                            type="number"
                                            value={newProduct.quantidade_estoque}
                                            placeholder="0"
                                            disabled
                                        />

                                        <Inputs
                                            label="Valor unitário"
                                            type="text"
                                            inputMode="numeric"
                                            value={newProduct.valor}
                                            onChange={handleChangeValor}
                                            placeholder="0,00"
                                            required
                                        />

                                        <Combobox
                                            label="Fornecedor"
                                            value={newProduct.fornecedor}
                                            opcoes={fornecedores}
                                            getLabel={(f) => f.nome}
                                            getChave={(f) => f.id_fornecedor}
                                            onChange={(texto) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    fornecedor: texto,
                                                    id_fornecedor: null,
                                                })
                                            }
                                            onSelect={(f) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    fornecedor: f.nome,
                                                    id_fornecedor: f.id_fornecedor,
                                                })
                                            }
                                        />

                                        <Inputs
                                            label="Data de entrada"
                                            type="date"
                                            value={newProduct.dt_entrada}
                                            onChange={setCampo('dt_entrada')}
                                            required
                                        />

                                        <Inputs
                                            label="Prazo de saída"
                                            type="date"
                                            value={newProduct.prazo_saida}
                                            onChange={setCampo('prazo_saida')}
                                        />

                                        <Inputs
                                            label="Data de validade"
                                            type="date"
                                            value={newProduct.dt_validade}
                                            onChange={setCampo('dt_validade')}
                                        />

                                        {/* Tipo de produto */}
                                        <div className="sm:col-span-2">
                                            <label
                                                className={`flex items-center gap-3 rounded-xl border border-borda bg-elevada/50 p-4 transition-colors ${
                                                    editingId === null
                                                        ? 'cursor-pointer hover:border-primaria/40'
                                                        : 'cursor-not-allowed opacity-70'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={newProduct.fgTipoProducao}
                                                    onChange={handleToggleProducao}
                                                    disabled={editingId !== null}
                                                    className="h-5 w-5 cursor-pointer accent-primaria disabled:cursor-not-allowed"
                                                />

                                                <div>
                                                    <span className="block text-sm font-semibold text-texto">
                                                        Produto de produção ({obterFlagTipo(newProduct.fgTipoProducao)})
                                                    </span>

                                                    <span className="text-xs text-texto-suave">
                                                        {editingId !== null
                                                            ? 'O tipo do produto não pode ser alterado após o cadastro.'
                                                            : newProduct.fgTipoProducao
                                                            ? 'Tipo "P": produto de produção (permite cadastrar receita e ingredientes).'
                                                            : 'Tipo "N": produto normal.'}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Receita */}
                                {newProduct.fgTipoProducao && (
                                    <div className="rounded-xl border border-primaria/25 bg-elevada/40 p-5">
                                        <div className="mb-5 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primaria/10 text-primaria">
                                                <Package size={21} />
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-texto">
                                                    Receita de produção
                                                </h3>

                                                <p className="text-xs text-texto-suave">
                                                    Configure os dados e ingredientes da receita.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <Inputs
                                                label="Nome da receita"
                                                className="sm:col-span-2"
                                                value={newReceita.nome}
                                                onChange={setCampoReceita('nome')}
                                                placeholder="Nome da receita"
                                                required
                                            />

                                            <Inputs
                                                label="Margem de perda (%)"
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="any"
                                                value={newReceita.margemPerda}
                                                onChange={setCampoReceita('margemPerda')}
                                                placeholder="0"
                                            />

                                            <Inputs
                                                label="Quantidade produzida"
                                                type="number"
                                                min="0"
                                                step="any"
                                                value={newReceita.quantidadeProduzida}
                                                onChange={setCampoReceita('quantidadeProduzida')}
                                                placeholder="0"
                                                required
                                            />

                                            <Inputs
                                                label="Previsão de perda"
                                                type="number"
                                                min="0"
                                                step="any"
                                                value={calcularPerdaPrevista(
                                                    newReceita.quantidadeProduzida,
                                                    newReceita.margemPerda,
                                                )}
                                                readOnly
                                                aria-label="Previsão de perda calculada automaticamente"
                                            />
                                        </div>

                                        {/* Ingredientes */}
                                        <div className="mt-6 border-t border-borda pt-5">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-texto">
                                                    Produtos utilizados
                                                </h4>

                                                <span className="rounded-full bg-primaria/10 px-2.5 py-1 text-xs font-semibold text-primaria">
                                                    {newReceita.ingredientes.length} ingrediente(s)
                                                </span>
                                            </div>

                                            {newReceita.ingredientes.map((ingrediente, index) => (
                                                <div
                                                    key={index}
                                                    className="mb-3 rounded-lg border border-borda bg-superficie p-3"
                                                >
                                                    <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-4">
                                                        <Combobox
                                                            aria-label="Produto"
                                                            placeholder="Produto"
                                                            value={ingrediente.produto}
                                                            opcoes={products.filter(
                                                                (p) => p.id_produto !== editingId,
                                                            )}
                                                            getLabel={(p) => p.descricao}
                                                            getChave={(p) => p.id_produto}
                                                            onChange={(texto) =>
                                                                atualizarIngrediente(index, {
                                                                    produto: texto,
                                                                    id_produto: null,
                                                                })
                                                            }
                                                            onSelect={(p) =>
                                                                atualizarIngrediente(index, {
                                                                    produto: p.descricao,
                                                                    id_produto: p.id_produto,
                                                                })
                                                            }
                                                        />

                                                        <Inputs
                                                            aria-label="Quantidade"
                                                            type="number"
                                                            min="0"
                                                            step="any"
                                                            placeholder="Qtd"
                                                            value={ingrediente.quantidade}
                                                            onChange={(e) =>
                                                                atualizarIngrediente(index, {
                                                                    quantidade: e.target.value,
                                                                })
                                                            }
                                                        />

                                                        <Combobox
                                                            aria-label="Unidade"
                                                            placeholder="Unidade"
                                                            value={ingrediente.unidade ?? ''}
                                                            opcoes={unidades}
                                                            getLabel={(u) =>
                                                                `${u.descrunidade} - ${u.nomenclatura}`
                                                            }
                                                            getChave={(u) => u.id_unidade}
                                                            onChange={(texto) =>
                                                                atualizarIngrediente(index, {
                                                                    unidade: texto,
                                                                    id_unidade: '',
                                                                })
                                                            }
                                                            onSelect={(u) =>
                                                                atualizarIngrediente(index, {
                                                                    unidade: u.nomenclatura,
                                                                    id_unidade: u.id_unidade,
                                                                })
                                                            }
                                                        />

                                                        {newReceita.ingredientes.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                onClick={() => removerIngrediente(index)}
                                                                className="w-auto"
                                                            >
                                                                Remover
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                onClick={adicionarIngrediente}
                                                className="mt-2 w-auto"
                                            >
                                                + Adicionar ingrediente
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Rodapé do Modal */}
                            <div className="flex items-center justify-end gap-3 border-t border-borda px-6 py-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="px-5"
                                    onClick={fecharForm}
                                >
                                    Cancelar
                                </Button>

                                <Button type="submit" disabled={saving} className="w-auto">
                                    {saving
                                        ? 'Salvando...'
                                        : editingId !== null
                                          ? 'Salvar alterações'
                                          : 'Salvar produto'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={!!produtoParaExcluir}
                onClose={() => setProdutoParaExcluir(null)}
                onConfirm={excluirProduto}
                titulo="Excluir produto"
                descricao={`Tem certeza de que deseja excluir o produto ${produtoParaExcluir?.descricao}?`}
            />
        </div>
    );
}

export default Produtos;
