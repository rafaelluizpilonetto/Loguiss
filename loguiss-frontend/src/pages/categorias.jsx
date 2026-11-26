
import { Layers2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { DeleteModal } from '../components/deleteModal';
import { EntityCard } from '../components/card';
import { Inputs } from '../components/inputs';
import { SideBar } from '../components/sidebar';
import api from '../services/api';

function Categorias() {
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [categoriaParaExcluir, setCategoriaParaExcluir] = useState(null);

    const [newCategory, setNewCategory] = useState({
        desc: '',
    });

    const filteredCategories = (categories ?? []).filter((categoria) => {
        const texto = (categoria.descricao ?? categoria.desc ?? '').toLowerCase();

        return texto.includes(appliedSearch.toLowerCase());
    });

    const categoria_api = async () => {
        try {
            const response = await api.get('/categoria/list_categorias');

            const categoriasRecebidas = response.data.categorias;

            setCategories(Array.isArray(categoriasRecebidas) ? categoriasRecebidas : []);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            toast.error('Erro ao carregar categorias.');
            setCategories([]);
        }
    };

    useEffect(() => {
        categoria_api();
    }, []);

    const fecharFormulario = () => {
        setShowCategoryForm(false);
        setEditingIndex(null);
        setNewCategory({ desc: '' });
    };

    const addNewCategory = async (e) => {
        e.preventDefault();

        if (!newCategory.desc.trim()) {
            toast.error('Informe a descrição da categoria.');
            return;
        }

        try {
            if (editingIndex !== null) {
                await editCategory(editingIndex, newCategory.desc.trim());
                toast.success('Categoria atualizada com sucesso!');
            } else {
                await api.post('/categoria/create_categoria', {
                    descricao: newCategory.desc.trim(),
                });

                toast.success('Categoria cadastrada com sucesso!');
            }

            await categoria_api();
            fecharFormulario();
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
            toast.error('Erro ao salvar categoria!');
        }
    };

    const editCategory = async (id, descricao) => {
        await api.patch('/categoria/edit_categoria', {
            id_categoria: id,
            descricao: descricao,
        });
    };

    const deleteCategory = async () => {
        if (!categoriaParaExcluir) return;

        try {
            await api.delete(`/categoria/delete_categoria/${categoriaParaExcluir.id_categoria}`);

            setCategories((listaAtual) =>
                listaAtual.filter(
                    (categoria) => categoria.id_categoria !== categoriaParaExcluir.id_categoria
                )
            );

            toast.success('Categoria excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            toast.error('Erro ao excluir categoria!');
            throw error;
        }
    };

    useEffect(() => {
        if (!showCategoryForm && !categoriaParaExcluir) return;

        const overflowAnterior = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowAnterior;
        };
    }, [showCategoryForm, categoriaParaExcluir]);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                {/* Cabeçalho */}
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold text-[var(--text)]">
                            Categorias
                        </h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de categorias. Aqui você pode gerenciar as categorias
                            cadastradas no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto p-3"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewCategory({ desc: '' });
                            setShowCategoryForm(true);
                        }}
                    >
                        Adicionar nova categoria
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
                    {filteredCategories.length === 0 && (
                        <p className="text-texto-suave">Nenhuma categoria encontrada.</p>
                    )}

                    {filteredCategories.map((categoria) => (
                        <EntityCard
                            key={categoria.id_categoria}
                            titulo={categoria.descricao ?? categoria.desc ?? 'Sem descrição'}
                            icone={Layers2}
                            onEdit={() => {
                                setEditingIndex(categoria.id_categoria);

                                setNewCategory({
                                    desc: categoria.descricao ?? categoria.desc ?? '',
                                });

                                setShowCategoryForm(true);
                            }}
                            onDelete={() => setCategoriaParaExcluir(categoria)}
                        />
                    ))}
                </div>
            </main>

            {/* Modal */}
            {showCategoryForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl border border-borda bg-superficie p-6 shadow-2xl">
                        {/* Cabeçalho */}
                        <div className="mb-2 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-texto">
                                    {editingIndex !== null
                                        ? 'Editar categoria'
                                        : 'Adicionar categoria'}
                                </h2>

                                <p className="mt-1 text-sm text-texto-suave">
                                    Preencha os dados da categoria.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharFormulario}
                                className="text-2xl text-texto-suave transition-colors hover:text-primaria"
                            >
                                ×
                            </button>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={addNewCategory} className="p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Inputs
                                    label="Descrição"
                                    className="sm:col-span-2"
                                    value={newCategory.desc}
                                    onChange={(e) =>
                                        setNewCategory({
                                            ...newCategory,
                                            desc: e.target.value,
                                        })
                                    }
                                    placeholder="Nome da categoria"
                                    required
                                />
                            </div>

                            {/* Botões */}
                            <div className="mt-6 flex justify-end gap-3 border-t border-borda pt-5">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="px-5"
                                    onClick={fecharFormulario}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    className="px-5"
                                >
                                    {editingIndex !== null
                                        ? 'Salvar alterações'
                                        : 'Cadastrar categoria'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={!!categoriaParaExcluir}
                onClose={() => setCategoriaParaExcluir(null)}
                onConfirm={deleteCategory}
                titulo="Excluir categoria"
                descricao={`Tem certeza de que deseja excluir a categoria ${categoriaParaExcluir?.descricao ?? categoriaParaExcluir?.desc ?? ''}?`}
            />
        </div>
    );
}

export default Categorias;
