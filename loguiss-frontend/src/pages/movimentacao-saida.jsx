import { useState } from 'react';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

import { SideBar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Inputs } from '../components/Inputs';
import { formatarCPFCNPJ } from '../utils/validacoes';

const movimentacaoInicial = {
    id: null,
    dt_movimentacao: '',
    produto: {
        quantidade: '',
        fornecedor: '',
        valor: '',
    },
    cliente: {
        desc: '',
        cpf: '',
    },
};

function MovimentacaoSaida() {
    const [showMovimentacaoForm, setShowMovimentacaoForm] = useState(false);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [newMovimentacao, setNewMovimentacao] = useState(movimentacaoInicial);
    const [proximoId, setProximoId] = useState(1);


    const filteredMovimentacoes = movimentacoes
        .map((movimentacao, index) => ({ movimentacao, index }))
        .filter(({ movimentacao }) => {
            const texto = [
                movimentacao.dt_movimentacao,
                movimentacao.produto.fornecedor,
                movimentacao.cliente.desc,
                movimentacao.cliente.cpf,
            ]
                .join(' ')
                .toLowerCase();

            return texto.includes(appliedSearch.toLowerCase());
        });

    const atualizarProduto = (campo, valor) => {
        setNewMovimentacao((atual) => ({
            ...atual,
            produto: {
                ...atual.produto,
                [campo]: valor,
            },
        }));
    };

    const atualizarCliente = (campo, valor) => {
        setNewMovimentacao((atual) => ({
            ...atual,
            cliente: {
                ...atual.cliente,
                [campo]: valor,
            },
        }));
    };

    const fecharFormulario = () => {
        setShowMovimentacaoForm(false);
        setEditingIndex(null);
        setNewMovimentacao(movimentacaoInicial);
    };

    const salvarMovimentacao = (event) => {
        event.preventDefault();

        if (editingIndex !== null) {
            setMovimentacoes((atuais) =>
                atuais.map((item, index) =>
                    index === editingIndex ? newMovimentacao : item,
                ),
            );

            toast.success('Movimentação atualizada com sucesso!');
        } else {
            const movimentacaoComId = {
                ...newMovimentacao,
                id: proximoId,
            };

            setMovimentacoes((atuais) => [
                ...atuais,
                movimentacaoComId,
            ]);

            setProximoId((atual) => atual + 1);
            toast.success('Movimentação cadastrada com sucesso!');
        }

        fecharFormulario();
    };

    return (
        <div className="min-h-screen bg-[#050212] text-white">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold">
                            Movimentações de saída
                        </h1>
                        <p className="text-gray-400">
                            Gerencie as movimentações de saída realizadas no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto bg-[#4EDB4E] p-3 hover:bg-[#3CB43C]"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewMovimentacao(movimentacaoInicial);
                            setShowMovimentacaoForm(true);
                        }}
                    >
                        Adicionar movimentação
                    </Button>
                </div>

                <Inputs
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            setAppliedSearch(searchTerm.trim());
                        }
                    }}
                    className="mt-5 w-1/2 rounded-lg border bg-[#15102b] p-3 focus:border-[#4EDB4E]"
                    icon={Search}
                />

                <div className="mt-5 grid grid-cols-[110px_250px_110px_130px_230px_1fr] gap-1 border-2 border-gray-300 rounded-lg bg-[#15102b]">

                    <div className="px-4 py-2 text-center">
                        Id
                    </div>

                    <div className="px-4 py-2 text-center">
                        Produto
                    </div>

                    <div className="px-4 py-2 text-center">
                        Quantidade
                    </div>

                    <div className="px-4 py-2 text-center">
                        Valor
                    </div>

                    <div className="px-4 py-2 text-center">
                        Data da movimentação
                    </div>

                    <div className="px-4 py-2 text-center">
                        Cliente
                    </div>

                </div>

                <div className="mt-3 flex flex-col gap-2">
                    {filteredMovimentacoes.map(({ movimentacao, index }) => (
                        <div
                            key={movimentacao.id}
                            className="grid grid-cols-[110px_250px_110px_130px_230px_1fr] items-center gap-1"
                        >
                            <div className="rounded-lg bg-[#15102b] px-4 py-4 text-center">
                                {movimentacao.id}
                            </div>

                            <div className="rounded-lg bg-[#15102b] px-4 py-4 text-center">
                                {movimentacao.produto.fornecedor}
                            </div>

                            <div className="rounded-lg bg-[#15102b] px-4 py-4 text-center">
                                {movimentacao.produto.quantidade}
                            </div>

                            <div className="rounded-lg bg-[#15102b] px-4 py-4 text-center">
                                R$ {Number(movimentacao.produto.valor).toFixed(2)}
                            </div>

                            <div className="rounded-lg bg-[#15102b] px-4 py-4 text-center">
                                {movimentacao.dt_movimentacao}
                            </div>

                            <div className="rounded-lg bg-[#15102b] px-4 py-4 text-center">
                                {movimentacao.cliente.desc}
                            </div>

                        </div>
                    ))}
                </div>
            </main>

            {showMovimentacaoForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-lg bg-[#050210] p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {editingIndex !== null
                                        ? 'Editar movimentação'
                                        : 'Adicionar movimentação'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    Preencha os dados da movimentação de saída.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharFormulario}
                                className="text-2xl text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={salvarMovimentacao}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Data da movimentação
                                    </label>
                                    <input
                                        type="date"
                                        value={newMovimentacao.dt_movimentacao}
                                        onChange={(event) =>
                                            setNewMovimentacao({
                                                ...newMovimentacao,
                                                dt_movimentacao: event.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Cliente
                                    </label>
                                    <Inputs
                                        type="text"
                                        value={newMovimentacao.cliente.desc}
                                        onChange={(event) =>
                                            atualizarCliente('desc', event.target.value)
                                        }
                                        placeholder="Nome do cliente"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Produto
                                    </label>
                                    <Inputs
                                        type="text"
                                        value={newMovimentacao.produto.fornecedor}
                                        onChange={(event) =>
                                            atualizarProduto('fornecedor', event.target.value)
                                        }
                                        placeholder="Nome do produto"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Quantidade
                                    </label>
                                    <Inputs
                                        type="number"
                                        min="1"
                                        value={newMovimentacao.produto.quantidade}
                                        onChange={(event) =>
                                            atualizarProduto('quantidade', event.target.value)
                                        }
                                        placeholder="Quantidade"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Valor
                                    </label>
                                    <Inputs
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newMovimentacao.produto.valor}
                                        onChange={(event) =>
                                            atualizarProduto('valor', event.target.value)
                                        }
                                        placeholder="R$ 0,00"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        CPF/CNPJ do cliente
                                    </label>
                                    <Inputs
                                        type="text"
                                        value={newMovimentacao.cliente.cpf}
                                        onChange={(event) =>
                                            atualizarCliente(
                                                'cpf',
                                                formatarCPFCNPJ(event.target.value),
                                            )
                                        }
                                        placeholder="CPF ou CNPJ"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={fecharFormulario}
                                    className="rounded-lg bg-gray-700 px-5 py-3 font-bold hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>

                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
                                >
                                    {editingIndex !== null
                                        ? 'Salvar alterações'
                                        : 'Cadastrar movimentação'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovimentacaoSaida;