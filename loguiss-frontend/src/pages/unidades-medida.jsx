import { useState } from 'react';
import { toast } from 'sonner';

import { Search, Combine } from 'lucide-react';
import { SideBar } from '../components/Sidebar';
import { Button } from '../components/button'
import { Inputs } from '../components/inputs';
import { Card } from '../components/card';

function UnidadesMedida() {

    const [showUnitForm, setShowUnitForm] = useState(false);
    const [units, setUnits] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const filteredUnidades = units
        .map((unidade, index) => ({ unidade, index }))
        .filter(({ unidade }) => {
            const texto = (unidade.desc ?? unidade.descricao ?? unidade.nome ?? "").toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    const [newUnit, setNewUnit] = useState({
        desc: "",
        gramatura: "",
        unidade: "",
        fgFracionavel: false
    });

    const addNewUnit = () => {
        if (editingIndex !== null) {
            editUnit(editingIndex, newUnit);
            toast.success("Unidade de medida atualizada com sucesso!");
        } else {
            setUnits((unidadesAtuais) => [
                ...unidadesAtuais,
                newUnit,
            ]);
            toast.success("Unidade de medida cadastrada com sucesso!");
        }

        setShowUnitForm(false);
        setEditingIndex(null);
        setNewUnit({
            desc: "",
            gramatura: "",
            unidade: "",
            fgFracionavel: false
        });
    };

    const editUnit = (index, updatedUnit) => {
        setUnits((unidadesAtuais) => {
            const unidadesAtualizadas = [...unidadesAtuais];
            unidadesAtualizadas[index] = updatedUnit;
            return unidadesAtualizadas;
        });
    };

    const deleteUnit = (index) => {
        setUnits((unidadesAtuais) => {
            const unidadesAtualizadas = [...unidadesAtuais];
            unidadesAtualizadas.splice(index, 1);
            return unidadesAtualizadas;
        });
    };

    return (

        <div className="min-h-screen bg-[#050212] text-white">
            <SideBar />
            <main className="ml-72 min-h-screen p-5">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Unidades de Medida
                        </h1>
                        <p className="text-gray-400">
                            Esta é a página de unidades de medida. Aqui você pode gerenciar as unidades cadastradas no sistema.
                        </p>
                    </div>
                    <Button
                        type="button"
                        className="bg-[#4EDB4E] hover:bg-[#3CB43C] p-3 w-auto mt-2"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewUnit({
                                desc: "",
                                gramatura: "",
                                unidade: "",
                                fgFracionavel: false,
                            });
                            setShowUnitForm(true);
                        }}
                    >
                        Adicionar nova unidade de medida
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
                    {filteredUnidades.map(({ unidade, index }) => (
                        <Card
                            key={index}
                            desc={unidade.desc}
                            icon={<Combine className="h-6 w-6 mt-2 text-gray-400" />}
                            onEdit={() => {
                                setEditingIndex(index);
                                setNewUnit(unidade);
                                setShowUnitForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir esta unidade de medida?")) {
                                    deleteUnit(index);
                                    toast.success("Unidade de medida excluída com sucesso!");
                                }
                            }}
                        >
                            <p className="mt-1 text-gray-400">
                                Gramatura: {unidade.gramatura}
                            </p>
                            <p className="mt-1 text-gray-400">
                                Unidade: {unidade.unidade}
                            </p>
                            <p className="mt-1 text-gray-400">
                                Fracíonavel: {unidade.fgFracionavel ? "Sim" : "Não"}
                            </p>
                        </Card>
                    ))}
                </div>
            </main>
            {showUnitForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl rounded-lg bg-[#0d0920] p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {editingIndex !== null
                                        ? "Editar unidade de medida"
                                        : "Adicionar unidade de medida"}
                                </h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    Preencha os dados da nova unidade de medida.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowUnitForm(false)}
                                className="text-2xl text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addNewUnit();
                            }}
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium">
                                        Descrição
                                    </label>
                                    <input
                                        type="text"
                                        value={newUnit.desc}
                                        onChange={(e) =>
                                            setNewUnit({
                                                ...newUnit,
                                                desc: e.target.value
                                            })
                                        }
                                        placeholder="Nome da unidade de medida"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Gramatura
                                    </label>
                                    <input
                                        type="text"
                                        value={newUnit.gramatura}
                                        onChange={(e) =>
                                            setNewUnit({
                                                ...newUnit,
                                                gramatura: e.target.value
                                            })
                                        }
                                        placeholder="Ex: 500g"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Unidade
                                    </label>
                                    <input
                                        type="text"
                                        value={newUnit.unidade}
                                        onChange={(e) =>
                                            setNewUnit({
                                                ...newUnit,
                                                unidade: e.target.value
                                            })
                                        }
                                        placeholder="Ex: UN, KG, L"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="flex cursor-pointer items-center gap-3 rounded-lg  p-3">
                                        <input
                                            type="checkbox"
                                            checked={newUnit.fgFracionavel}
                                            onChange={(e) =>
                                                setNewUnit({
                                                    ...newUnit,
                                                    fgFracionavel: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5 accent-[#4EDB4E]"
                                        />
                                        <span>
                                            {newUnit.fgFracionavel
                                                ? "Unidade fracionável"
                                                : "Unidade não fracionável"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUnitForm(false)}
                                    className="rounded-lg bg-gray-700 px-5 py-3 font-bold text-white transition hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
                                >
                                    {editingIndex !== null
                                        ? "Salvar alterações"
                                        : "Cadastrar unidade"
                                    }
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}

export default UnidadesMedida;