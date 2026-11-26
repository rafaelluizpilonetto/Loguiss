
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { DeleteModal } from '../components/deleteModal';
import { SideBar } from '../components/sidebar';
import { Inputs } from '../components/inputs';
import { Search, Combine } from 'lucide-react';
import { EntityCard } from '../components/card';
import api from '../services/api';


function UnidadesMedida() {
    const [showUnitForm, setShowUnitForm] = useState(false);
    const [units, setUnits] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [unidadeParaExcluir, setUnidadeParaExcluir] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [newUnit, setNewUnit] = useState({
        desc: '',
        gramatura: '',
        unidade: '',
        fgFracionavel: false
    });

    // LISTAR UNIDADES
    async function unit_api() {
        try {
            setLoading(true);

            const response = await api.get('/unidade_medida/list_unidade_medida');

            const unidades = response.data.unidades ?? [];

            setUnits(unidades.map((unidade) => ({
                ...unidade,
                desc: unidade.descrunidade,
                unidade: unidade.nomenclatura,
                fgFracionavel: unidade.is_fracionado === 'T'
            })));

        } catch (error) {
            toast.error(
                error.response?.data?.MSG ||
                'Erro ao carregar unidades de medida!'
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        unit_api();
    }, []);

    // FILTRAR UNIDADES
    const filteredUnidades = units.filter((unidade) => {
        const texto = (unidade.desc ?? '').toLowerCase();

        return texto.includes(appliedSearch.toLowerCase());
    });

    // LIMPAR FORMULÁRIO
    function resetForm() {
        setNewUnit({
            desc: '',
            gramatura: '',
            unidade: '',
            fgFracionavel: false
        });

        setEditingIndex(null);
    }

    // CADASTRAR OU EDITAR
    async function addNewUnit() {
        try {
            setSaving(true);

            const dados = {
                descrunidade: newUnit.desc.trim(),
                gramatura: newUnit.gramatura.trim() || null,
                nomenclatura: newUnit.unidade.trim(),
                is_fracionado: newUnit.fgFracionavel ? 'T' : 'F'
            };

            if (editingIndex !== null) {
                const response = await api.patch(
                    `/unidade_medida/edit_unidade_medida/${editingIndex}`,
                    dados
                );

                toast.success(
                    response.data.MSG || 'Unidade atualizada com sucesso!'
                );
            } else {
                const response = await api.post(
                    '/unidade_medida/create_unidade_medida',
                    dados
                );

                toast.success(
                    response.data.MSG || 'Unidade cadastrada com sucesso!'
                );
            }

            setShowUnitForm(false);
            resetForm();

            await unit_api();

        } catch (error) {
            toast.error(
                error.response?.data?.MSG ||
                'Erro ao salvar unidade de medida!'
            );
        } finally {
            setSaving(false);
        }
    }

    // DESATIVAR UNIDADE
    async function deleteUnit() {
        if (!unidadeParaExcluir) return;

        try {
            const response = await api.delete(
                `/unidade_medida/delete_unidade_medida/${unidadeParaExcluir.id_unidade}`
            );

            toast.success(
                response.data.MSG || 'Unidade desativada com sucesso!'
            );

            setUnits((listaAtual) =>
                listaAtual.filter(
                    (unidade) => unidade.id_unidade !== unidadeParaExcluir.id_unidade
                )
            );

        } catch (error) {
            toast.error(
                error.response?.data?.MSG ||
                'Erro ao desativar unidade de medida!'
            );

            throw error;
        }
    }

    useEffect(() => {
        if (!showUnitForm && !unidadeParaExcluir) return;

        const overflowAnterior = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowAnterior;
        };
    }, [showUnitForm, unidadeParaExcluir]);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 mt-2 text-3xl font-bold text-[var(--text)]">
                            Unidades de Medida
                        </h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de unidades de medida. Aqui você pode gerenciar as
                            unidades cadastradas no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto p-3"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewUnit({
                                desc: '',
                                gramatura: '',
                                unidade: '',
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
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            setAppliedSearch(searchTerm.trim());
                        }
                    }}
                    className="mt-5 w-1/2"
                    icon={Search}
                />

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUnidades.length === 0 && !loading && (
                        <p className="text-texto-suave">
                            Nenhuma unidade de medida encontrada.
                        </p>
                    )}

                    {!loading && filteredUnidades.map((unidade) => (
                        <EntityCard
                            key={unidade.id_unidade}
                            titulo={unidade.desc}
                            icone={Combine}
                            onEdit={() => {
                                setEditingIndex(unidade.id_unidade);

                                setNewUnit({
                                    desc: unidade.descrunidade,
                                    gramatura: unidade.gramatura ?? '',
                                    unidade: unidade.nomenclatura,
                                    fgFracionavel: unidade.is_fracionado === 'T'
                                });

                                setShowUnitForm(true);
                            }}
                            onDelete={() => setUnidadeParaExcluir(unidade)}
                        >
                            <p className="mt-1 text-[var(--text-secondary)]">
                                Gramatura: {unidade.gramatura || 'Não informada'}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Unidade: {unidade.nomenclatura}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Fracionável: {unidade.fgFracionavel ? 'Sim' : 'Não'}
                            </p>
                        </EntityCard>
                    ))}
                </div>
            </main>

            {showUnitForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl border border-borda bg-superficie p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-texto">
                                    {editingIndex !== null
                                        ? 'Editar unidade de medida'
                                        : 'Adicionar unidade de medida'}
                                </h2>

                                <p className="mt-1 text-sm text-texto-suave">
                                    Preencha os dados da nova unidade de medida.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowUnitForm(false)}
                                aria-label="Fechar"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-texto-suave transition-colors hover:bg-[#292929] hover:text-primaria"
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
                                <Inputs
                                    label="Descrição"
                                    className="sm:col-span-2"
                                    value={newUnit.desc}
                                    onChange={(e) =>
                                        setNewUnit({
                                            ...newUnit,
                                            desc: e.target.value
                                        })
                                    }
                                    placeholder="Nome da unidade de medida"
                                    required
                                />

                                <Inputs
                                    label="Gramatura"
                                    value={newUnit.gramatura}
                                    onChange={(e) =>
                                        setNewUnit({
                                            ...newUnit,
                                            gramatura: e.target.value
                                        })
                                    }
                                    placeholder="Ex: 500g"
                                />

                                <Inputs
                                    label="Unidade"
                                    value={newUnit.unidade}
                                    onChange={(e) =>
                                        setNewUnit({
                                            ...newUnit,
                                            unidade: e.target.value
                                        })
                                    }
                                    placeholder="Ex: UN, KG, L"
                                    required
                                />

                                <div>
                                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-borda bg-elevada/50 p-3 transition-colors hover:border-primaria/40">
                                        <input
                                            type="checkbox"
                                            checked={newUnit.fgFracionavel}
                                            onChange={(e) =>
                                                setNewUnit({
                                                    ...newUnit,
                                                    fgFracionavel: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5 accent-primaria"
                                        />

                                        <span className="text-sm text-texto">
                                            {newUnit.fgFracionavel
                                                ? 'Unidade fracionável'
                                                : 'Unidade não fracionável'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-borda pt-5">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="px-5"
                                    onClick={() => setShowUnitForm(false)}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={saving}
                                    loading={saving}
                                    className="px-5"
                                >
                                    {saving
                                        ? 'Salvando...'
                                        : editingIndex !== null
                                            ? 'Salvar alterações'
                                            : 'Cadastrar unidade'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={!!unidadeParaExcluir}
                onClose={() => setUnidadeParaExcluir(null)}
                onConfirm={deleteUnit}
                titulo="Excluir unidade de medida"
                descricao={`Tem certeza de que deseja excluir a unidade ${unidadeParaExcluir?.desc}?`}
            />
        </div>
    );
}

export default UnidadesMedida;
