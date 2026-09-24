import { useState } from 'react';
import { toast } from 'sonner';

import { Search, Layers2 } from 'lucide-react';
import { SideBar } from '../components/Sidebar';
import { Button } from '../components/Button'
import { Inputs } from '../components/Inputs';
import { Card } from '../components/Card';

import api from '../services/api';

function Categorias() {

    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const filteredCategories = categories
        .map((categoria, index) => ({ categoria, index }))
        .filter(({ categoria }) => {
            const texto = (categoria.desc ?? "").toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    const [newCategory, setNewCategory] = useState({
        desc: "",
    });

    const addNewCategory = async () => {
        if (editingIndex !== null) {
            editCategory(editingIndex, newCategory);
            toast.success("Categoria atualizada com sucesso!");
        } else {
            setCategories((categoriasAtuais) => [
                ...categoriasAtuais,
                newCategory,
            ]);
            toast.success("Categoria cadastrada com sucesso!");
        }

        const create_categoria = await api.post('/categoria/create_categoria', {
            descricao: newCategory.desc
        })
        categoria_api();
        setShowCategoryForm(false);
        setEditingIndex(null);
        setNewCategory({ desc: "" });
    };

    const editCategory = (index, updatedCategory) => {
        setCategories((categoriasAtuais) => {
            const categoriasAtualizadas = [...categoriasAtuais];
            categoriasAtualizadas[index] = updatedCategory;
            return categoriasAtualizadas;
        });
    };

    const deleteCategory = (index) => {
        setCategories((categoriasAtuais) => {
            const categoriasAtualizadas = [...categoriasAtuais];
            categoriasAtualizadas.splice(index, 1);
            return categoriasAtualizadas;
        });
    };

    const categoria_api = async () => {
        const categorias = await api.get('/categoria/list_categorias')
        setCategories(categorias.data.categorias)
    }

    useState(() => {
        categoria_api();
    }, [])

    return (

        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar />

            <main className="ml-72 min-h-screen p-5">

                <div className="flex items-center justify-between mb-3">

                    <div>
                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Categorias
                        </h1>

                        <p className="text-gray-400">
                            Esta é a página de categorias. Aqui você pode gerenciar as categorias cadastradas no sistema.
                        </p>

                    </div>

                    <Button
                        type="button"
                        className="bg-[#4EDB4E] hover:bg-[#3CB43C] p-3 w-auto mt-2"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewCategory({ desc: "" });
                            setShowCategoryForm(true);
                        }}
                    >
                        Adicionar nova categoria
                    </Button>

                </div>

                <Inputs
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            setAppliedSearch(searchTerm.trim());
                        }
                    }}
                    className="mt-5 w-1/2 rounded-lg border bg-[#15102b] p-3 focus:border-[#4EDB4E]"
                    icon={Search}
                />

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCategories.map(({ categoria, index }) => (
                        <Card
                            key={index}
                            desc={categoria.desc}
                            icon={<Layers2 className="h-6 w-6 mt-2 text-gray-400" />}
                            onEdit={() => {
                                setEditingIndex(index);
                                setNewCategory(categoria);
                                setShowCategoryForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir esta categoria?")) {
                                    deleteCategory(index);
                                    toast.success("Categoria excluída com sucesso!");
                                }
                            }}
                        >
                            <h2 className="text-xl font-bold">
                                {categoria.descricao || "Sem Descrição"}
                            </h2>

                        </Card>
                    ))}

                </div>

            </main>

            {showCategoryForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

                    <div className="w-full max-w-2xl rounded-lg bg-[#0d0920] p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {editingIndex !== null ? "Editar categoria" : "Adicionar categoria"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    Preencha os dados da nova categoria.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCategoryForm(false)}
                                className="text-2xl text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addNewCategory();
                            }}
                        >

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="sm:col-span-2">
                                    
                                    <label className="mb-1 block text-sm font-medium">
                                        Descrição
                                    </label>

                                    <input
                                        type="text"
                                        value={newCategory.desc}
                                        onChange={(e) =>
                                            setNewCategory({
                                                ...newCategory,
                                                desc: e.target.value
                                            })
                                        }
                                        placeholder="Nome da categoria"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => setShowCategoryForm(false)}
                                    className="rounded-lg bg-gray-700 px-5 py-3 font-bold text-white transition hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>

                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
                                >
                                    {editingIndex !== null ? "Salvar alterações" : "Cadastrar categoria"}
                                </Button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>

    )
}

export default Categorias;