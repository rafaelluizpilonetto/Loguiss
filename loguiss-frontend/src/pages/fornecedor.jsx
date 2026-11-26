
import { Building2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { DeleteModal } from '../components/deleteModal';
import { EntityCard } from '../components/card';
import { Inputs } from '../components/inputs';
import { SideBar } from '../components/sidebar';
import api from '../services/api';
import { formatarCPFCNPJ, formatarTelefone } from '../utils/validacoes';

const fornecedorInicial = {
    cnpj: '',
    nome: '',
    endereco: {
        rua: '',
        bairro: '',
        numero: '',
        estado: '',
    },
    email: '',
    telefone: '',
};

function Fornecedor() {
    const [showFornecedorForm, setShowFornecedorForm] = useState(false);
    const [fornecedores, setFornecedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [fornecedorParaExcluir, setFornecedorParaExcluir] = useState(null);
    const [newFornecedor, setNewFornecedor] = useState(fornecedorInicial);

    const filteredFornecedores = (fornecedores ?? [])
        .map((fornecedor, index) => ({ fornecedor, index }))
        .filter(({ fornecedor }) => {
            const texto = (fornecedor.nome ?? '').toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    // Listar fornecedores
    const fornecedores_api = async () => {
        try {
            const response = await api.get('/fornecedor/list_fornecedor');

            const lista = response.data.fornecedores;

            setFornecedores(Array.isArray(lista) ? lista : []);
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error.response?.data || error);

            toast.error('Erro ao carregar fornecedores.');
        }
    };

    useEffect(() => {
        fornecedores_api();
    }, []);

    // Atualizar endereço
    const setEndereco = (campo) => (e) => {
        setNewFornecedor((atual) => ({
            ...atual,
            endereco: {
                ...atual.endereco,
                [campo]: e.target.value,
            },
        }));
    };

    // Limpar formulário
    const resetFornecedor = () => {
        setNewFornecedor({
            ...fornecedorInicial,
            endereco: { ...fornecedorInicial.endereco },
        });

        setEditingIndex(null);
    };

    // Cadastrar fornecedor
    const addNewFornecedor = async () => {
        try {
            await api.post('/fornecedor/create_fornecedor', {
                cnpj: newFornecedor.cnpj,
                nome: newFornecedor.nome,
                rua: newFornecedor.endereco.rua,
                bairro: newFornecedor.endereco.bairro,
                numero: newFornecedor.endereco.numero,
                estado: newFornecedor.endereco.estado,
                email: newFornecedor.email,
                telefone: newFornecedor.telefone,
            });

            await fornecedores_api();

            setShowFornecedorForm(false);
            resetFornecedor();

            toast.success('Fornecedor cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar fornecedor:', error.response?.data || error);

            toast.error(error.response?.data?.MSG || 'Erro ao cadastrar fornecedor!');
        }
    };

    // Editar fornecedor
    const editFornecedor = async (id, updatedFornecedor) => {
        try {
            await api.patch(`/fornecedor/edit_fornecedor/${id}`, {
                cnpj: updatedFornecedor.cnpj,
                nome: updatedFornecedor.nome,
                rua: updatedFornecedor.endereco.rua,
                bairro: updatedFornecedor.endereco.bairro,
                numero: updatedFornecedor.endereco.numero,
                estado: updatedFornecedor.endereco.estado,
                email: updatedFornecedor.email,
                telefone: updatedFornecedor.telefone,
            });

            await fornecedores_api();

            setShowFornecedorForm(false);
            resetFornecedor();

            toast.success('Fornecedor atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar fornecedor:', error.response?.data || error);

            toast.error(error.response?.data?.MSG || 'Erro ao atualizar fornecedor!');
        }
    };

    // Excluir fornecedor
    const deleteFornecedor = async () => {
        if (!fornecedorParaExcluir) return;

        try {
            await api.delete(`/fornecedor/delete_fornecedor/${fornecedorParaExcluir.id_fornecedor}`);

            setFornecedores((listaAtual) =>
                listaAtual.filter(
                    (fornecedor) =>
                        fornecedor.id_fornecedor !== fornecedorParaExcluir.id_fornecedor
                )
            );

            toast.success('Fornecedor excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir fornecedor:', error.response?.data || error);

            toast.error(error.response?.data?.MSG || 'Erro ao excluir fornecedor!');
            throw error;
        }
    };

    // Abrir edição
    const onEdit = (fornecedor) => {
        setEditingIndex(fornecedor.id_fornecedor);

        setNewFornecedor({
            ...fornecedorInicial,
            ...fornecedor,
            endereco: {
                ...fornecedorInicial.endereco,
                ...(fornecedor.endereco ?? {}),
            },
        });

        setShowFornecedorForm(true);
    };

    useEffect(() => {
        if (!showFornecedorForm && !fornecedorParaExcluir) return;

        const overflowAnterior = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowAnterior;
        };
    }, [showFornecedorForm, fornecedorParaExcluir]);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold text-[var(--text)]">
                            Fornecedores
                        </h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de fornecedores. Aqui você pode gerenciar os
                            fornecedores cadastrados no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto p-3"
                        onClick={() => {
                            resetFornecedor();
                            setShowFornecedorForm(true);
                        }}
                    >
                        Adicionar novo fornecedor
                    </Button>
                </div>

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

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredFornecedores.length === 0 && (
                        <p className="text-[var(--text-secondary)]">
                            Nenhum fornecedor encontrado.
                        </p>
                    )}

                    {filteredFornecedores.map(({ fornecedor }) => (
                        <EntityCard
                            key={fornecedor.id_fornecedor}
                            titulo={fornecedor.nome}
                            icon={
                                <Building2 className="mt-2 h-6 w-6 text-[var(--text-secondary)]" />
                            }
                            onEdit={() => onEdit(fornecedor)}
                            onDelete={() => setFornecedorParaExcluir(fornecedor)}
                        >
                            <p className="mt-1 text-[var(--text-secondary)]">
                                CNPJ: {fornecedor.cnpj}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Email: {fornecedor.email}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Telefone: {fornecedor.telefone}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Endereço: {fornecedor.endereco?.bairro}, {fornecedor.endereco?.rua},{' '}
                                {fornecedor.endereco?.numero}, {fornecedor.endereco?.estado}
                            </p>
                        </EntityCard>
                    ))}
                </div>
            </main>

            {showFornecedorForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl border border-borda bg-superficie p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-texto">
                                    {editingIndex !== null
                                        ? 'Editar fornecedor'
                                        : 'Adicionar fornecedor'}
                                </h2>

                                <p className="mt-1 text-sm text-texto-suave">
                                    {editingIndex !== null
                                        ? 'Atualize os dados do fornecedor.'
                                        : 'Preencha os dados do novo fornecedor.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowFornecedorForm(false);
                                    resetFornecedor();
                                }}
                                className="text-2xl text-texto-suave transition-colors hover:text-primaria"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();

                                if (editingIndex !== null) {
                                    await editFornecedor(editingIndex, newFornecedor);
                                } else {
                                    await addNewFornecedor();
                                }
                            }}
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Inputs
                                    label="Nome do fornecedor"
                                    className="sm:col-span-2"
                                    value={newFornecedor.nome}
                                    onChange={(e) =>
                                        setNewFornecedor({
                                            ...newFornecedor,
                                            nome: e.target.value,
                                        })
                                    }
                                    placeholder="Nome do fornecedor"
                                    required
                                />

                                <Inputs
                                    label="CNPJ"
                                    value={newFornecedor.cnpj}
                                    onChange={(e) =>
                                        setNewFornecedor({
                                            ...newFornecedor,
                                            cnpj: formatarCPFCNPJ(e.target.value),
                                        })
                                    }
                                    placeholder="Ex: 12.345.678/0001-00"
                                    required
                                />

                                <Inputs
                                    label="Email"
                                    type="email"
                                    value={newFornecedor.email}
                                    onChange={(e) =>
                                        setNewFornecedor({
                                            ...newFornecedor,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="Ex: contato@empresa.com"
                                    required
                                />

                                <Inputs
                                    label="Telefone"
                                    value={newFornecedor.telefone}
                                    onChange={(e) =>
                                        setNewFornecedor({
                                            ...newFornecedor,
                                            telefone: formatarTelefone(e.target.value),
                                        })
                                    }
                                    placeholder="Ex: (00) 00000-0000"
                                    required
                                />

                                <Inputs
                                    label="Rua"
                                    value={newFornecedor.endereco.rua}
                                    onChange={setEndereco('rua')}
                                    placeholder="Rua"
                                    required
                                />

                                <Inputs
                                    label="Bairro"
                                    value={newFornecedor.endereco.bairro}
                                    onChange={setEndereco('bairro')}
                                    placeholder="Bairro"
                                    required
                                />

                                <Inputs
                                    label="Número"
                                    value={newFornecedor.endereco.numero}
                                    onChange={setEndereco('numero')}
                                    placeholder="Número"
                                    required
                                />

                                <Inputs
                                    label="Estado"
                                    value={newFornecedor.endereco.estado}
                                    onChange={setEndereco('estado')}
                                    placeholder="Estado"
                                    required
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-borda pt-5">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="px-5"
                                    onClick={() => {
                                        setShowFornecedorForm(false);
                                        resetFornecedor();
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
                                        : 'Cadastrar fornecedor'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={!!fornecedorParaExcluir}
                onClose={() => setFornecedorParaExcluir(null)}
                onConfirm={deleteFornecedor}
                titulo="Excluir fornecedor"
                descricao={`Tem certeza de que deseja excluir o fornecedor ${fornecedorParaExcluir?.nome ?? ''}?`}
            />
        </div>
    );
}

export default Fornecedor;
