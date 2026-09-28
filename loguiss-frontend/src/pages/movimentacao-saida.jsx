import { useState } from 'react';
import { toast } from 'sonner';

import { SideBar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Inputs } from '../components/Inputs';
import { formatarCPFCNPJ } from '../utils/validacoes';

const movimentacaoInicial = {
    id: null,
    dt_movimentacao: '',
    produto: {
        desc: '',
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
    const [newMovimentacao, setNewMovimentacao] = useState(movimentacaoInicial);
    const [proximoId, setProximoId] = useState(1);

    const atualizarCliente = (campo, valor) => {
        setNewMovimentacao((prev) => ({
            ...prev,
            cliente: {
                ...prev.cliente,
                [campo]: valor,
            },
        }));
    };

    const atualizarProduto = (campo, valor) => {
        setNewMovimentacao((prev) => ({
            ...prev,
            produto: {
                ...prev.produto,
                [campo]: valor,
            },
        }));
    };

    const fecharFormulario = () => {
        setShowMovimentacaoForm(false);
        setNewMovimentacao(movimentacaoInicial);
    };

    const salvarMovimentacao = (event) => {
        event.preventDefault();

        const movimentacaoComId = {
            ...newMovimentacao,
            id: proximoId,
        };

        setMovimentacoes((atuais) => [...atuais, movimentacaoComId]);
        setProximoId((atual) => atual + 1);

        toast.success('Movimentação cadastrada com sucesso!');
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
                            setNewMovimentacao(movimentacaoInicial);
                            setShowMovimentacaoForm(true);
                        }}
                    >
                        Adicionar movimentação
                    </Button>

                </div>

                <div className="mt-5 overflow-hidden rounded-lg border-2 border-gray-500">

                    <div className="grid grid-cols-[110px_250px_110px_130px_230px_1fr] justify-items-start gap-1 border-b border-gray-500 bg-[#15102b] p-1">

                        <div className="px-4 py-2">
                            Id
                        </div>

                        <div className="px-4 py-2">
                            Produto
                        </div>

                        <div className="px-4 py-2">
                            Qtd.
                        </div>

                        <div className="px-4 py-2">
                            Valor
                        </div>

                        <div className="px-4 py-2">
                            Data da movimentação
                        </div>

                        <div className="px-4 py-2">
                            Cliente
                        </div>

                    </div>

                    {/* Movimentações */}
                    <div className="flex flex-col gap-2 bg-[#08031a]">

                        {movimentacoes.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-400">
                                Nenhuma movimentação encontrada.
                            </div>
                        ) : (
                            movimentacoes.map((movimentacao) => (
                                <div
                                    key={movimentacao.id}
                                    className="grid grid-cols-[110px_250px_110px_130px_230px_1fr] justify-items-start gap-1 p-1"
                                >

                                    <div className="px-4 py-4 text-gray-200">
                                        {movimentacao.id}
                                    </div>

                                    <div className="w-full min-w-0 truncate px-4 py-4 text-gray-200">
                                        {movimentacao.produto.desc}
                                    </div>

                                    <div className="px-4 py-4">
                                        <span className="rounded-lg bg-[#21183d] px-3 py-1 text-gray-200">
                                            {movimentacao.produto.quantidade}
                                        </span>
                                    </div>

                                    <div className="px-4 py-4 text-green-500">
                                        R$ {Number(movimentacao.produto.valor).toFixed(2)}
                                    </div>

                                    <div className="px-4 py-4 text-gray-200">
                                        {movimentacao.dt_movimentacao}
                                    </div>

                                    <div className="w-full min-w-0 truncate px-4 py-4 text-gray-200">
                                        {movimentacao.cliente.desc}
                                    </div>

                                </div>
                            ))
                        )}

                    </div>

                </div>

            </main>

            {showMovimentacaoForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-lg bg-[#050210] p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    Adicionar movimentação
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
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />

                                </div>

                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        Produto
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newMovimentacao.produto.desc}
                                        onChange={(event) =>
                                            atualizarProduto('desc', event.target.value)
                                        }
                                        placeholder="Nome do produto"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E]"
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
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E]"
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
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E]"
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
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E]"
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
                                    Cadastrar movimentação
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