
import { Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { DeleteModal } from '../components/deleteModal';
import { EntityCard } from '../components/card';
import { Inputs } from '../components/inputs';
import { SideBar } from '../components/sidebar';
import api from '../services/api';
import { formatarCPFCNPJ, formatarTelefone } from '../utils/validacoes';

function Clientes() {
    const [showClientesForm, setShowClientesForm] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [clienteParaExcluir, setClienteParaExcluir] = useState(null);

    const [newCliente, setNewCliente] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        dt_nasc: '',
        endereco: {
            rua: '',
            bairro: '',
            numero: '',
            estado: '',
        },
    });

    const filteredClientes = (clientes ?? [])
        .map((cliente, index) => ({ cliente, index }))
        .filter(({ cliente }) => {
            const texto = (cliente.nome ?? '').toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    // Listar clientes
    const cliente_api = async () => {
        try {
            const response = await api.get('/cliente/list_clientes');

            setClientes(Array.isArray(response.data.Clientes) ? response.data.Clientes : []);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error.response?.data || error);
            toast.error('Erro ao carregar clientes!');
        }
    };

    useEffect(() => {
        cliente_api();
    }, []);

    // Limpar formulário
    const resetCliente = () => {
        setNewCliente({
            nome: '',
            email: '',
            telefone: '',
            cpf: '',
            dt_nasc: '',
            endereco: {
                rua: '',
                bairro: '',
                numero: '',
                estado: '',
            },
        });

        setEditingIndex(null);
    };

    // Adicionar cliente
    const addNewCliente = async () => {
        try {
            await api.post('/cliente/create_cliente', {
                nome_cliente: newCliente.nome,
                email: newCliente.email,
                telefone: newCliente.telefone,
                cpf_cnpj: newCliente.cpf,
            });

            await cliente_api();

            setShowClientesForm(false);
            resetCliente();

            toast.success('Cliente cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error.response?.data || error);
            toast.error(error.response?.data?.MSG || 'Erro ao cadastrar cliente!');
        }
    };

    // Editar cliente
    const editCliente = async (id, updatedCliente) => {
        try {
            await api.patch(`/cliente/edit_cliente/${id}`, {
                nome_cliente: updatedCliente.nome,
                email: updatedCliente.email,
                telefone: updatedCliente.telefone,
                cpf_cnpj: updatedCliente.cpf,
            });

            await cliente_api();

            setShowClientesForm(false);
            resetCliente();

            toast.success('Cliente atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error.response?.data || error);
            toast.error(error.response?.data?.MSG || 'Erro ao atualizar cliente!');
        }
    };

    // Excluir cliente
    const deleteCliente = async () => {
        if (!clienteParaExcluir) return;

        try {
            await api.delete(`/cliente/delete_cliente/${clienteParaExcluir.id_cliente}`);

            setClientes((listaAtual) =>
                listaAtual.filter(
                    (cliente) => cliente.id_cliente !== clienteParaExcluir.id_cliente
                )
            );

            toast.success('Cliente excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir cliente:', error.response?.data || error);
            toast.error('Erro ao excluir cliente!');
            throw error;
        }
    };

    // Abrir edição
    const onEdit = (cliente) => {
        setEditingIndex(cliente.id_cliente);

        setNewCliente({
            ...cliente,
            endereco: {
                rua: cliente.endereco?.rua ?? '',
                bairro: cliente.endereco?.bairro ?? '',
                numero: cliente.endereco?.numero ?? '',
                estado: cliente.endereco?.estado ?? '',
            },
        });

        setShowClientesForm(true);
    };

    useEffect(() => {
        if (!showClientesForm && !clienteParaExcluir) return;

        const overflowAnterior = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowAnterior;
        };
    }, [showClientesForm, clienteParaExcluir]);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                {/* Cabeçalho */}
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold text-[var(--text)]">
                            Clientes
                        </h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de clientes. Aqui você pode gerenciar os clientes
                            cadastrados no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto p-3"
                        onClick={() => {
                            resetCliente();
                            setShowClientesForm(true);
                        }}
                    >
                        Adicionar novo cliente
                    </Button>
                </div>

                {/* Pesquisa */}
                <Inputs
                    type="text"
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
                    {filteredClientes.length === 0 && (
                        <p className="text-texto-suave">Nenhum cliente encontrado.</p>
                    )}

                    {filteredClientes.map(({ cliente }) => (
                        <EntityCard
                            key={cliente.id_cliente}
                            titulo={cliente.nome}
                            icone={User}
                            onEdit={() => onEdit(cliente)}
                            onDelete={() => setClienteParaExcluir(cliente)}
                        >
                            <p className="mt-1 text-texto-suave">Email: {cliente.email}</p>

                            <p className="mt-1 text-texto-suave">Telefone: {cliente.telefone}</p>

                            <p className="mt-1 text-texto-suave">CPF | CNPJ: {cliente.cpf}</p>
                        </EntityCard>
                    ))}
                </div>
            </main>

            {/* Modal */}
            {showClientesForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl border border-borda bg-superficie p-6 shadow-2xl">
                        <div className="mb-2 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-texto">
                                    {editingIndex !== null ? 'Editar cliente' : 'Adicionar cliente'}
                                </h2>

                                <p className="mt-1 text-sm text-texto-suave">
                                    {editingIndex !== null
                                        ? 'Atualize os dados do cliente.'
                                        : 'Preencha os dados do novo cliente.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowClientesForm(false);
                                    resetCliente();
                                }}
                                className="text-2xl text-texto-suave transition-colors hover:text-primaria"
                            >
                                ×
                            </button>
                        </div>

                        {/* Formulário */}
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();

                                if (editingIndex !== null) {
                                    await editCliente(editingIndex, newCliente);
                                } else {
                                    await addNewCliente();
                                }
                            }}
                            className="p-6"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Inputs
                                    label="Nome do cliente"
                                    className="sm:col-span-2"
                                    value={newCliente.nome}
                                    onChange={(e) =>
                                        setNewCliente({
                                            ...newCliente,
                                            nome: e.target.value,
                                        })
                                    }
                                    placeholder="Nome do cliente"
                                    required
                                />

                                <Inputs
                                    label="Email"
                                    type="email"
                                    value={newCliente.email}
                                    onChange={(e) =>
                                        setNewCliente({
                                            ...newCliente,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="Ex: nomecliente@dominio.com"
                                    required
                                />

                                <Inputs
                                    label="Telefone"
                                    type="text"
                                    value={newCliente.telefone}
                                    onChange={(e) =>
                                        setNewCliente({
                                            ...newCliente,
                                            telefone: formatarTelefone(e.target.value),
                                        })
                                    }
                                    placeholder="Ex: (00) 00000-0000"
                                    required
                                />

                                <Inputs
                                    label="CPF | CNPJ"
                                    type="text"
                                    value={newCliente.cpf}
                                    onChange={(e) =>
                                        setNewCliente({
                                            ...newCliente,
                                            cpf: formatarCPFCNPJ(e.target.value),
                                        })
                                    }
                                    placeholder="Ex: 123.456.789-00"
                                    required
                                />
                            </div>

                            {/* Botões */}
                            <div className="mt-6 flex justify-end gap-3 border-t border-borda pt-5">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="px-5"
                                    onClick={() => {
                                        setShowClientesForm(false);
                                        resetCliente();
                                    }}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    className="px-5"
                                >
                                    {editingIndex !== null
                                        ? 'Salvar alterações'
                                        : 'Cadastrar cliente'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={!!clienteParaExcluir}
                onClose={() => setClienteParaExcluir(null)}
                onConfirm={deleteCliente}
                titulo="Excluir cliente"
                descricao={`Tem certeza de que deseja excluir o cliente ${clienteParaExcluir?.nome ?? ''}?`}
            />
        </div>
    );
}

export default Clientes;
