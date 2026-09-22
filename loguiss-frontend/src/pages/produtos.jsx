import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Search, Package } from 'lucide-react';

import { SideBar } from '../components/Sidebar';
import { Button } from '../components/Button'
import { Inputs } from '../components/Inputs';
import { Card } from '../components/Card';

import api_produto from '../services/api_produto';
import api_fornecedor from '../services/api_fornecedor';
import api_categoria from '../services/api_categoria';
import api_unidade from '../services/api_unidades';

function Produtos() {

    const [showProductForm, setShowProductForm] = useState(false);
    const [fornecedores, setFornecedores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [mostrarFornecedores, setMostrarFornecedores] = useState(false);
    const [mostrarCategorias, setMostrarCategorias] = useState(false);
    const [mostrarUnidades, setMostrarUnidades] = useState(false);
    const [mostrarProdutos, setMostrarProdutos] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const filteredProducts = products
        .map((produto, index) => ({ produto, index }))
        .filter(({ produto }) => {
            const texto = (produto.desc ?? produto.descricao ?? produto.nome ?? "").toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    const [newProduct, setNewProduct] = useState({
        desc: "",
        categoria: "",
        minimo: "",
        unidade: "",
        valor: "",
        quantidade_estoque: "15", //como o usuário não pode digitar nesse campo, o valor informado vai ser o referente a tabela estoque, que é movimentada por saídas e entradas.
        fornecedor: "",
        dt_entrada: "",
        prazo_saida: "",
        fgTipoProducao: false,
        receita: null
    });

    const [newReceita, setNewReceita] = useState({
        nome: "",
        margemPerda: "",
        quantidadePerdida: "",
        quantidadeProduzida: "",
        ingredientes: [
            {
                produto: "",
                quantidade: "",
                unidade: ""
            }
        ],
    });

    const produto_api = async () => {
        const produtos = await api_produto.get('/list_produtos')
        setProducts(produtos.data.produtos)
        console.log(produtos)
    }
    const fornecedor_api = async () => {
        const fornecedores = await api_fornecedor.get('/list_fornecedor');
        setFornecedores(fornecedores.data.fornecedores)

    }
    const categoria_api = async () => {
        const categorias = await api_categoria.get('/list_categorias');
        setCategorias(categorias.data.categorias)
        console.log(categorias.data.categorias)
        // console.log(categorias)
    }
    const unidade_api = async () => {
        const unidades = await api_unidade.get('/list_unidade_medida');
        setUnidades(unidades.data.unidades)
    }

    useEffect(() => {
        produto_api();
        fornecedor_api();
        categoria_api();
        unidade_api();
    }, [])

    const editProduct = (index, updatedProduct) => {
        setProducts((produtosAtuais) => {
            const produtosAtualizados = [...produtosAtuais];
            produtosAtualizados[index] = updatedProduct;
            return produtosAtualizados;
        });
    };

    const deleteProduct = (index) => {
        setProducts((produtosAtuais) => {
            const produtosAtualizados = [...produtosAtuais];
            produtosAtualizados.splice(index, 1);
            return produtosAtualizados;
        });
    };

    return (

        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar />

            <main className="ml-72 min-h-screen p-5">

                <div className="flex items-center justify-between mb-3">

                    <div> 

                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Produtos
                        </h1>

                        <p className="text-gray-400">
                            Esta é a página de produtos. Aqui você pode gerenciar os produtos cadastrados no sistema.
                        </p>

                    </div>

                    <Button
                        type="button"
                        className="bg-[#4EDB4E] hover:bg-[#3CB43C] p-3 w-auto mt-2"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewProduct({
                                desc: "",
                                categoria: "",
                                minimo: "",
                                unidade: "",
                                valor: "",
                                quantidade_estoque: "15",
                                fornecedor: "",
                                dt_entrada: "",
                                prazo_saida: "",
                                fgTipoProducao: false,
                                receita: null
                            });
                            setShowProductForm(true);
                        }}
                    >
                        Adicionar novo produto
                    </Button>

                </div>

                <div className="flex items-center justify-between">

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

                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map(({ produto, id_produto }) => (
                        <Card
                            key={id_produto}
                            desc={produto.descricao}
                            icon={<Package className="h-6 w-6 mt-2 text-gray-400" />}
                            onEdit={() => {
                                setEditingIndex(id_produto);
                                setNewProduct(produto);
                                setShowProductForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir este produto?")) {
                                    deleteProduct(id_produto);
                                    toast.success("Produto excluído com sucesso!");
                                }
                            }}
                        >
                            <h2 className="text-xl font-bold">
                                {produto.descricao}
                            </h2>

                            <p className="mt-2 text-gray-400">
                                Categoria: {produto.categorias[0]?.categoria?.descricao || "Sem categoria"}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Quantidade: {produto.estoque?.quantidade || "sem quantidade"}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Valor: R$ {produto.valor}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Fornecedor: {produto.fornecedores[0]?.fornecedor.nome || "Sem fornecedor!"}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Produto Produção:{" "}
                                {produto.fgTipoProducao ? "Sim" : "Não"}
                            </p>

                        </Card>
                    ))}

                </div>

            </main>

            {showProductForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">

                    <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-[#050210] p-6 shadow-2xl">

                        <div className="mb-6 flex shrink-0 items-center justify-between">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {editingIndex !== null ? "Editar produto" : "Adicionar produto"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    {editingIndex !== null
                                        ? "Atualize os dados do produto."
                                        : "Preencha os dados do novo produto."}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => setShowProductForm(false)}
                                className="text-2xl text-gray-400 hover:text-white"
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="flex min-h-0 flex-1 flex-col"
                            onSubmit={(e) => {
                                e.preventDefault();

                                const produtoParaSalvar = {
                                    ...newProduct,
                                    receita: newProduct.fgTipoProducao ? newReceita : null,
                                };

                                if (editingIndex !== null) {
                                    editProduct(editingIndex, produtoParaSalvar);
                                    toast.success("Produto atualizado com sucesso!");
                                } else {
                                    setProducts((produtosAtuais) => [
                                        ...produtosAtuais,
                                        produtoParaSalvar,
                                    ]);
                                    toast.success("Produto cadastrado com sucesso!");
                                }

                                setEditingIndex(null);
                                setShowProductForm(false);
                            }}
                        >

                            <div className="min-h-0 flex-1 overflow-y-auto pr-2">

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <div className="sm:col-span-2">

                                        <label className="mb-1 block text-sm font-medium">
                                            Descrição
                                        </label>

                                        <input
                                            type="text"
                                            value={newProduct.desc}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    desc: e.target.value
                                                })
                                            }
                                            placeholder="Nome do produto"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                            required
                                        />

                                    </div>

                                    <div className="relative">
                                        <label className="mb-1 block text-sm font-medium">
                                            Categoria
                                        </label>

                                        <input
                                            type="text"
                                            value={newProduct.categoria}
                                            onChange={(e) => {
                                                setMostrarCategorias(true);
                                                setNewProduct({
                                                    ...newProduct,
                                                    categoria: e.target.value,
                                                    id_categoria: null
                                                });
                                            }}
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-2 text-white"
                                        />

                                        {mostrarCategorias && newProduct.categoria && (
                                            <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-700 bg-[#15102b] shadow-lg">
                                                {categorias
                                                    .filter((categoria) =>
                                                        categoria.descricao
                                                            .toLowerCase()
                                                            .includes(newProduct.categoria.toLowerCase())
                                                    )
                                                    .map((categoria) => (
                                                        <button
                                                            type="button"
                                                            key={categoria.id_categoria}
                                                            onClick={() => {
                                                                setNewProduct({
                                                                    ...newProduct,
                                                                    categoria: categoria.descricao,
                                                                    id_categoria: categoria.id_categoria
                                                                });

                                                                setMostrarCategorias(false);
                                                            }}
                                                            className="block w-full px-3 py-2 text-left text-white hover:bg-[#241b45]"
                                                        >
                                                            {categoria.descricao}
                                                        </button>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <label className="mb-1 block text-sm font-medium">
                                            Unidade de medida
                                        </label>

                                        <input
                                            type="text"
                                            value={newProduct.unidade}
                                            onChange={(e) => {
                                                setMostrarUnidades(true);

                                                setNewProduct({
                                                    ...newProduct,
                                                    unidade: e.target.value,
                                                    id_unidade_medida: null
                                                });
                                            }}
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-2 text-white"
                                        />

                                        {mostrarUnidades && newProduct.unidade && (
                                            <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-700 bg-[#15102b] shadow-lg">
                                                {unidades
                                                    .filter((unidade) =>
                                                        `${unidade.descrunidade} ${unidade.nomenclatura}`
                                                            .toLowerCase()
                                                            .includes(newProduct.unidade.toLowerCase())
                                                    )
                                                    .map((unidade) => (
                                                        <button
                                                            type="button"
                                                            key={unidade.id_unidade}
                                                            onClick={() => {
                                                                setNewProduct({
                                                                    ...newProduct,
                                                                    unidade: unidade.nomenclatura,
                                                                    id_unidade_medida: unidade.id_unidade
                                                                });

                                                                setMostrarUnidades(false);
                                                            }}
                                                            className="block w-full px-3 py-2 text-left text-white hover:bg-[#241b45]"
                                                        >
                                                            {unidade.descrunidade} - {unidade.nomenclatura}
                                                        </button>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                    <div>

                                        <label className="mb-1 block text-sm font-medium">
                                            Estoque mínimo
                                        </label>

                                        <input
                                            type="number"
                                            value={newProduct.minimo}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    minimo: e.target.value
                                                })
                                            }
                                            placeholder="0"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-1 block text-sm font-medium">
                                            Quantidade
                                        </label>

                                        <input
                                            type="number"
                                            value={newProduct.quantidade_estoque}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    quantidade_estoque: e.target.value
                                                })
                                            }
                                            placeholder="0"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E] cursor-not-allowed"
                                            disabled
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-1 block text-sm font-medium">
                                            Valor
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newProduct.valor}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    valor: e.target.value
                                                })
                                            }
                                            placeholder="0,00"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                            required
                                        />

                                    </div>

                                    <div className="relative">
                                        <label className="mb-1 block text-sm font-medium">
                                            Fornecedor
                                        </label>

                                        <input
                                            type="text"
                                            value={newProduct.fornecedor}
                                            onChange={(e) => {
                                                setMostrarFornecedores(true);

                                                setNewProduct({
                                                    ...newProduct,
                                                    fornecedor: e.target.value,
                                                    id_fornecedor: null
                                                });
                                            }}
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-2 text-white"
                                        />

                                        {mostrarFornecedores && newProduct.fornecedor && (
                                            <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-700 bg-[#15102b] shadow-lg">
                                                {fornecedores
                                                    .filter((fornecedor) =>
                                                        fornecedor.nome
                                                            .toLowerCase()
                                                            .includes(newProduct.fornecedor.toLowerCase())
                                                    )
                                                    .map((fornecedor) => (
                                                        <button
                                                            type="button"
                                                            key={fornecedor.id_fornecedor}
                                                            onClick={() => {
                                                                setNewProduct({
                                                                    ...newProduct,
                                                                    fornecedor: fornecedor.nome,
                                                                    id_fornecedor: fornecedor.id_fornecedor
                                                                });

                                                                setMostrarFornecedores(false);
                                                            }}
                                                            className="block w-full px-3 py-2 text-left text-white hover:bg-[#241b45]"
                                                        >
                                                            {fornecedor.nome}
                                                        </button>
                                                    ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>

                                        <label className="mb-1 block text-sm font-medium">
                                            Data de entrada
                                        </label>

                                        <input
                                            type="date"
                                            value={newProduct.dt_entrada}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    dt_entrada: e.target.value
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                            required
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-1 block text-sm font-medium">
                                            Prazo de saída
                                        </label>

                                        <input
                                            type="date"
                                            value={newProduct.prazo_saida}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    prazo_saida: e.target.value
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        />

                                    </div>

                                    <div>

                                        <label className="flex cursor-pointer items-center gap-3 rounded-lg  p-3">

                                            <input
                                                type="checkbox"
                                                checked={newProduct.fgTipoProducao}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        fgTipoProducao: e.target.checked,
                                                    })
                                                }
                                                className="h-5 w-5 accent-[#4EDB4E]"
                                            />

                                            <span>
                                                {newProduct.fgTipoProducao
                                                    ? "Produto Produção"
                                                    : "Produto Normal"}
                                            </span>

                                        </label>

                                    </div>

                                    <div className="sm:col-span-2">

                                        {newProduct.fgTipoProducao && (
                                            <div className="sm:col-span-2 rounded-lg border border-gray-700 p-4">
                                                <h3 className="mb-4 text-lg font-bold">
                                                    Receita
                                                </h3>

                                                {/* Nome da receita */}
                                                <input
                                                    type="text"
                                                    placeholder="Nome da receita"
                                                    value={newReceita.nome}
                                                    onChange={(e) =>
                                                        setNewReceita({
                                                            ...newReceita,
                                                            nome: e.target.value,
                                                        })
                                                    }
                                                    className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                    required
                                                />

                                                {/* Margem de perda */}
                                                <input
                                                    type="number"
                                                    placeholder="Margem de perda (%)"
                                                    value={newReceita.margemPerda}
                                                    onChange={(e) =>
                                                        setNewReceita({
                                                            ...newReceita,
                                                            margemPerda: e.target.value,
                                                        })
                                                    }
                                                    className="mt-3 w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                />

                                                {/* Quantidade produzida */}
                                                <input
                                                    type="number"
                                                    placeholder="Quantidade produzida"
                                                    value={newReceita.quantidadeProduzida}
                                                    onChange={(e) =>
                                                        setNewReceita({
                                                            ...newReceita,
                                                            quantidadeProduzida: e.target.value,
                                                        })
                                                    }
                                                    className="mt-3 w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                    required
                                                />

                                                {/* Quantidade perdida, validar se vai precisar mesmo desse campo */}
                                                <input
                                                    type="number"
                                                    placeholder="Quantidade perdida"
                                                    value={newReceita.quantidadePerdida}
                                                    onChange={(e) =>
                                                        setNewReceita({
                                                            ...newReceita,
                                                            quantidadePerdida: e.target.value,
                                                        })
                                                    }
                                                    className="mt-3 w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                />

                                                {/* Produtos / Ingredientes */}
                                                <div className="mt-5">
                                                    <h4 className="mb-3 text-md font-semibold">
                                                        Produtos utilizados
                                                    </h4>

                                                    {newReceita.ingredientes.map((ingrediente, index) => (
                                                        <div
                                                            key={index}
                                                            className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-4"
                                                        >
                                                            <div className="relative flex-1 min-w-0">
                                                            <input
                                                                type="text"
                                                                placeholder="Produto"
                                                                value={ingrediente.produto}
                                                                onChange={(e) => {
                                                                const ingredientes = [...newReceita.ingredientes];
                                                                ingredientes[index].produto = e.target.value;
                                                                ingredientes[index].id_produto = null;
                                                                setMostrarProdutos(true);

                                                                setNewReceita({
                                                                    ...newReceita,
                                                                    ingredientes,
                                                                });
                                                                }}
                                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                                required
                                                            />

                                                            {mostrarProdutos && ingrediente.produto && (
                                                                <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-700 bg-[#15102b] shadow-lg">
                                                                {products
                                                                    .filter((produto) =>
                                                                    produto.descricao
                                                                        .toLowerCase()
                                                                        .includes(ingrediente.produto.toLowerCase())
                                                                    )
                                                                    .map((produto) => (
                                                                    <button
                                                                        type="button"
                                                                        key={produto.id_produto}
                                                                        onClick={() => {
                                                                        const ingredientes = [...newReceita.ingredientes];
                                                                        setMostrarProdutos(false);
                                                                        ingredientes[index].produto = produto.descricao;
                                                                        ingredientes[index].id_produto = produto.id_produto;

                                                                        setNewReceita({
                                                                            ...newReceita,
                                                                            ingredientes,
                                                                        });
                                                                        }}
                                                                        className="block w-full px-3 py-2 text-left text-white hover:bg-[#241b45]"
                                                                    >
                                                                        {produto.descricao}
                                                                    </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            </div>

                                                            <input
                                                            type="number"
                                                            placeholder="Quantidade"
                                                            value={ingrediente.quantidade}
                                                            onChange={(e) => {
                                                                const ingredientes = [...newReceita.ingredientes];
                                                                ingredientes[index].quantidade = e.target.value;

                                                                setNewReceita({
                                                                ...newReceita,
                                                                ingredientes,
                                                                });
                                                            }}
                                                            className="rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                            required
                                                            />

                                                            <select
                                                            value={ingrediente.id_unidade || ""}
                                                            onChange={(e) => {
                                                                const ingredientes = [...newReceita.ingredientes];
                                                                ingredientes[index].id_unidade = Number(e.target.value);

                                                                setNewReceita({
                                                                ...newReceita,
                                                                ingredientes,
                                                                });
                                                            }}
                                                            className="rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                            required
                                                            >
                                                            <option value="">Unidade</option>

                                                            {unidades.map((unidade) => (
                                                                <option key={unidade.id_unidade} value={unidade.id_unidade}>
                                                                {unidade.descrunidade} - {unidade.nomenclatura}
                                                                </option>
                                                            ))}
                                                            </select>

                                                            <button
                                                            type="button"
                                                            onClick={() => {
                                                                const ingredientes = newReceita.ingredientes.filter((_, i) => i !== index);
                                                                setNewReceita({
                                                                ...newReceita,
                                                                ingredientes,
                                                                });
                                                            }}
                                                            className="rounded-lg border border-red-700 px-4 py-2 text-red-400 hover:bg-red-950"
                                                            >
                                                            Remover
                                                            </button>
                                                        </div>
                                                        ))}

                                                    {/* Adicionar produto */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setNewReceita({
                                                                ...newReceita,
                                                                ingredientes: [
                                                                    ...newReceita.ingredientes,
                                                                    {
                                                                        produto: "",
                                                                        quantidade: "",
                                                                        unidade: "",
                                                                    },
                                                                ],
                                                            })
                                                        }
                                                        className="mt-2 rounded-lg border border-gray-700 px-4 py-2 hover:bg-gray-800"
                                                    >
                                                        + Adicionar produto
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                            </div>

                            <div className="mt-4 flex shrink-0 justify-end gap-3">

                                <div className="mt-1 flex justify-end gap-3">

                                    <button
                                        type="button"
                                        onClick={() => setShowProductForm(false)}
                                        className="rounded-lg bg-gray-700 px-5 py-3 font-bold text-white transition hover:bg-gray-600"
                                    >
                                        Cancelar
                                    </button>

                                    <Button
                                        type="submit"
                                        className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
                                    >
                                        {editingIndex !== null ? "Salvar alterações" : "Cadastrar produto"}
                                    </Button>

                                </div>
                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>

    )
}

export default Produtos;