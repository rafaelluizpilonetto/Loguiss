import { useState } from 'react';
import { toast } from 'sonner';

import { Search, User } from 'lucide-react';
import { formatarCPFCNPJ, formatarTelefone } from '../utils/validacoes';

import { SideBar } from '../components/Sidebar';
import { Button } from '../components/Button'
import { Inputs } from '../components/Inputs';
import { Card } from '../components/Card';

function Clientes() {

    const [showClientesForm, setShowClientesForm] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const filteredClientes = clientes
        .map((cliente, index) => ({ cliente, index }))
        .filter(({ cliente }) => {
            const texto = (cliente.desc ?? cliente.descricao ?? cliente.nome ?? "").toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    const [newCliente, setNewCliente] = useState({
        desc: "",
        email: "",
        telefone: "",
        cpf: "",
        dt_nasc: "",
        endereco: {
            rua: "",
            bairro: "",
            numero: "",
            estado: ""
        },
    });

    const addNewCliente = () => {

        setClientes((clientesAtuais) => [
            ...clientesAtuais,
            newCliente
        ]);

        setShowClientesForm(false);

        setNewCliente({
            desc: "",
            email: "",
            telefone: "",
            cpf: "", //verificar como fazer pra ser ou CPF ou CNPJ
            dt_nasc: "",
            endereco: {
                rua: "",
                bairro: "",
                numero: "",
                estado: ""
            }
        });
    };

    const editCliente = (index, updatedCliente) => {
        setClientes((clientesAtuais) => {
            const clientesAtualizados = [...clientesAtuais];
            clientesAtualizados[index] = updatedCliente;
            return clientesAtualizados;
        });
    };

    const deleteCliente = (index) => {
        setClientes((clientesAtuais) => {
            const clientesAtualizados = [...clientesAtuais];
            clientesAtualizados.splice(index, 1);
            return clientesAtualizados;
        });
    };

    return (

        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar />

            <main className="ml-72 min-h-screen p-5">

                <div className="flex items-center justify-between mb-3">

                    <div>
                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Clientes
                        </h1>

                        <p className="text-gray-400">
                            Esta é a página de clientes. Aqui você pode gerenciar os clientes cadastrados no sistema.
                        </p>

                    </div>

                    <Button
                        type="button"
                        className="bg-[#4EDB4E] hover:bg-[#3CB43C] p-3 w-auto mt-2"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewCliente({
                                desc: "",
                                email: "",
                                telefone: "",
                                cpf: "",
                                dt_nasc: "",
                                endereco: {
                                    rua: "",
                                    bairro: "",
                                    numero: "",
                                    estado: ""
                                }
                            });
                            setShowClientesForm(true);
                        }}
                    >
                        Adicionar novo cliente
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
                    {filteredClientes.map(({ cliente, index }) => (
                        <Card
                            key={index}
                            desc={cliente.desc}
                            icon={<User className="h-6 w-6 mt-2 text-gray-400" />}
                            onEdit={() => {
                                setEditingIndex(index);
                                setNewCliente(cliente);
                                setShowClientesForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir este cliente?")) {
                                    deleteCliente(index);
                                    toast.success("Cliente excluído com sucesso!");
                                }
                            }}
                        >

                            <p className="mt-1 text-gray-400">
                                Email: {cliente.email}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Telefone: {cliente.telefone}
                            </p>

                            <p className="mt-1 text-gray-400">
                                CPF | CNPJ: {cliente.cpf}
                            </p>

                        </Card>
                    ))}

                </div>

            </main>

            {showClientesForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">

                    <div className="w-full max-w-2xl rounded-lg bg-[#050210] p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {editingIndex !== null ? "Editar cliente" : "Adicionar cliente"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    {editingIndex !== null
                                        ? "Atualize os dados do cliente."
                                        : "Preencha os dados do novo cliente."}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => setShowClientesForm(false)}
                                className="text-2xl text-gray-400 hover:text-white"
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                if (editingIndex !== null) {
                                    editCliente(editingIndex, newCliente);
                                    toast.success("Cliente atualizado com sucesso!");
                                } else {
                                    addNewCliente();
                                    toast.success("Cliente cadastrado com sucesso!");
                                }

                                setEditingIndex(null);
                                setShowClientesForm(false);
                            }}
                        >


                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium">
                                        Nome do cliente
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newCliente.desc}
                                        onChange={(e) =>
                                            setNewCliente({
                                                ...newCliente,
                                                desc: e.target.value
                                            })
                                        }
                                        placeholder="Nome do cliente"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Email
                                    </label>

                                    <Inputs
                                        type="email"
                                        value={newCliente.email}
                                        onChange={(e) =>
                                            setNewCliente({
                                                ...newCliente,
                                                email: e.target.value
                                            })
                                        }
                                        placeholder="Ex: nomecliente@dominio.com"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Telefone
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newCliente.telefone}
                                        onChange={(e) => setNewCliente({ ...newCliente, telefone: formatarTelefone(e.target.value) })}
                                        placeholder="Ex: (00) 00000-0000"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        CPF | CNPJ
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newCliente.cpf}
                                        onChange={(e) => setNewCliente({ ...newCliente, cpf: formatarCPFCNPJ(e.target.value) })}
                                        placeholder="Ex: 123.456.789-00"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => setShowClientesForm(false)}
                                    className="rounded-lg bg-gray-700 px-5 py-3 font-bold text-white transition hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>

                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
                                >
                                    {editingIndex !== null ? "Salvar alterações" : "Cadastrar Cliente"}
                                </Button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>

    )
}

export default Clientes;