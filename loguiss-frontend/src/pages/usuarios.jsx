
import { Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { ButtonEye } from '../components/buttonEye';
import { DeleteModal } from '../components/deleteModal';
import { EntityCard } from '../components/card';
import { Inputs } from '../components/inputs';
import { SideBar } from '../components/sidebar';
import api from '../services/api';
import { formatarCPFCNPJ, formatarTelefone, validarCPF } from '../utils/validacoes';

const USUARIO_VAZIO = {
    desc: '',
    email: '',
    senha: '',
    confirm_senha: '',
    telefone: '',
    cpf: '',
    tipo_usuario: '',
};

const TIPOS_USUARIO = [
    { value: '', label: 'Selecione' },
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Operador', label: 'Operador' },
    { value: 'Gerente', label: 'Gerente' },
];

const normalizarTipoUsuario = (valor) => {
    if (!valor) return '';
    const limpo = String(valor).trim().toLowerCase();
    const match = TIPOS_USUARIO.find((item) => item.value.toLowerCase() === limpo);
    return match ? match.value : String(valor).trim();
};

function Usuarios() {
    const [showUsuariosForm, setShowUsuariosForm] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

    const [visualizar_senha, setVisualizarSenha] = useState(false);
    const [visualizar_confirmar_senha, setVisualizarConfirmarSenha] = useState(false);

    const [newUsuario, setNewUsuario] = useState(USUARIO_VAZIO);

    const editando = editingIndex !== null;

    const filteredUsuarios = (usuarios ?? []).filter((usuario) => {
        const texto = (
            usuario.desc ??
            usuario.descricao ??
            usuario.nome_usuario ??
            usuario.nome ??
            ''
        ).toLowerCase();

        return texto.includes(appliedSearch.toLowerCase());
    });

    // Listar usuários
    const user_api = async () => {
        try {
            const response = await api.get('/user/list_user');
            setUsuarios(response.data.users ?? []);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error.response?.data || error);
            toast.error('Erro ao carregar usuários!');
        }
    };

    useEffect(() => {
        user_api();
    }, []);

    // Bloqueia a rolagem da página enquanto algum modal está aberto
    useEffect(() => {
        if (!showUsuariosForm && !usuarioParaExcluir) return;

        const overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowAnterior;
        };
    }, [showUsuariosForm, usuarioParaExcluir]);

    // Limpar formulário
    const resetUsuario = () => {
        setNewUsuario(USUARIO_VAZIO);
        setEditingIndex(null);
        setVisualizarSenha(false);
        setVisualizarConfirmarSenha(false);
    };

    const abrirCadastro = () => {
        resetUsuario();
        setShowUsuariosForm(true);
    };

    const abrirEdicao = (usuario) => {
        resetUsuario();
        setEditingIndex(usuario.id_user);

        const tipoAtual = usuario.tipo_user ?? usuario.tipo_usuario ?? '';

        setNewUsuario({
            desc: usuario.nome_usuario ?? '',
            email: usuario.email ?? '',
            senha: '',
            confirm_senha: '',
            telefone: usuario.telefone ?? '',
            cpf: usuario.cpf ?? '',
            tipo_usuario: normalizarTipoUsuario(tipoAtual),
        });

        setShowUsuariosForm(true);
    };

    const fecharFormulario = () => {
        setShowUsuariosForm(false);
        resetUsuario();
    };

    const alterarCampo = (campo, valor) => {
        setNewUsuario((atual) => ({ ...atual, [campo]: valor }));
    };

    // Na edição, a senha só é enviada se tiver sido preenchida
    const montarPayload = () => {
        const dados = {
            nome: newUsuario.desc,
            email: newUsuario.email,
            telefone: newUsuario.telefone,
            cpf: newUsuario.cpf,
            tipo_user: newUsuario.tipo_usuario,
        };

        if (newUsuario.senha) {
            dados.senha = newUsuario.senha;
            dados.confirmar_senha = newUsuario.confirm_senha;
        }

        return dados;
    };

    // Adicionar usuário
    const addNewUsuario = async () => {
        try {
            const response = await api.post('/user/create_user', {
                nome: newUsuario.desc,
                email: newUsuario.email,
                senha: newUsuario.senha,
                confirmar_senha: newUsuario.confirm_senha,
                telefone: newUsuario.telefone,
                cpf: newUsuario.cpf,
                tipo_user: newUsuario.tipo_usuario,
            });

            toast.success(response.data.MSG || 'Usuário cadastrado com sucesso!');

            fecharFormulario();
            await user_api();
        } catch (error) {
            console.error(error.response?.data || error);
            toast.error(error.response?.data?.MSG || 'Erro ao cadastrar usuário.');
        }
    };

    // Editar usuário
    const editUsuario = async () => {
        try {
            const response = await api.patch(
                `/user/edit_user/${editingIndex}`,
                montarPayload(),
            );

            toast.success(response.data.MSG || 'Usuário atualizado com sucesso!');

            fecharFormulario();
            await user_api();
        } catch (error) {
            console.error(error.response?.data || error);
            toast.error(error.response?.data?.MSG || 'Erro ao editar usuário.');
        }
    };

    // Excluir usuário
    const deleteUsuario = async () => {
        if (!usuarioParaExcluir) return;

        try {
            const response = await api.delete(
                `/user/delete_user/${usuarioParaExcluir.id_user}`
            );

            setUsuarios((listaAtual) =>
                listaAtual.filter(
                    (usuario) => usuario.id_user !== usuarioParaExcluir.id_user
                )
            );

            toast.success(response.data?.MSG || 'Usuário excluído com sucesso!');
        } catch (error) {
            console.error(error.response?.data || error);
            toast.error(error.response?.data?.MSG || 'Erro ao excluir usuário!');
            throw error;
        }
    };

    const salvarUsuario = async (e) => {
        e.preventDefault();

        if (!validarCPF(newUsuario.cpf)) {
            toast.error('CPF inválido. Confira o número informado.');
            return;
        }

        // Senha é obrigatória só no cadastro
        if (!editando && (!newUsuario.senha || !newUsuario.confirm_senha)) {
            toast.error('Preencha a senha e a confirmação.');
            return;
        }

        // Se a senha foi informada (cadastro ou troca na edição), precisa coincidir
        if (newUsuario.senha !== newUsuario.confirm_senha) {
            toast.error('As senhas não coincidem.');
            return;
        }

        if (editando) {
            await editUsuario();
        } else {
            await addNewUsuario();
        }
    };

    return (
        <div className="min-h-screen bg-fundo text-texto">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                {/* Cabeçalho */}
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold text-texto">Usuários</h1>

                        <p className="text-texto-suave">
                            Esta é a página de usuários. Aqui você pode gerenciar os usuários
                            cadastrados no sistema.
                        </p>
                    </div>

                    <Button type="button" className="mt-2 w-auto p-3" onClick={abrirCadastro}>
                        Adicionar novo usuário
                    </Button>
                </div>

                {/* Pesquisa */}
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

                {/* Cards */}
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUsuarios.length === 0 && (
                        <p className="text-texto-suave">Nenhum usuário encontrado.</p>
                    )}

                    {filteredUsuarios.map((usuario) => (
                        <EntityCard
                            key={usuario.id_user}
                            titulo={usuario.nome_usuario}
                            icone={User}
                            onEdit={() => abrirEdicao(usuario)}
                            onDelete={() => setUsuarioParaExcluir(usuario)}
                        >
                            <p className="mt-1 text-texto-suave">Email: {usuario.email}</p>

                            <p className="mt-1 text-texto-suave">Telefone: {usuario.telefone}</p>

                            <p className="mt-1 text-texto-suave">CPF: {usuario.cpf}</p>

                            <p className="mt-1 text-texto-suave">
                                Tipo de usuário: {usuario.tipo_user}
                            </p>
                        </EntityCard>
                    ))}
                </div>
            </main>

            {/* Modal */}
            {showUsuariosForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={editando ? 'Editar usuário' : 'Adicionar usuário'}
                        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-borda bg-superficie p-6 shadow-2xl"
                    >
                        {/* Cabeçalho do modal */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-texto">
                                    {editando ? 'Editar usuário' : 'Adicionar usuário'}
                                </h2>

                                <p className="mt-1 text-sm text-texto-suave">
                                    {editando
                                        ? 'Atualize os dados do usuário.'
                                        : 'Preencha os dados do novo usuário.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharFormulario}
                                aria-label="Fechar"
                                className="text-2xl text-texto-suave transition-colors hover:text-primaria"
                            >
                                ×
                            </button>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={salvarUsuario}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Inputs
                                    label="Nome do usuário"
                                    className="sm:col-span-2"
                                    value={newUsuario.desc}
                                    onChange={(e) => alterarCampo('desc', e.target.value)}
                                    placeholder="Nome do usuário"
                                    required
                                />

                                <Inputs
                                    label="Email"
                                    type="email"
                                    value={newUsuario.email}
                                    onChange={(e) => alterarCampo('email', e.target.value)}
                                    placeholder="Ex: nomeusuario@dominio.com"
                                    className="w-full"
                                    required
                                />

                                <Inputs
                                    label="Telefone"
                                    type="text"
                                    value={newUsuario.telefone}
                                    onChange={(e) =>
                                        alterarCampo('telefone', formatarTelefone(e.target.value))
                                    }
                                    placeholder="Ex: (00) 00000-0000"
                                    className="w-full"
                                    required
                                />

                                <Inputs
                                    label="CPF"
                                    type="text"
                                    value={newUsuario.cpf}
                                    onChange={(e) =>
                                        alterarCampo('cpf', formatarCPFCNPJ(e.target.value))
                                    }
                                    placeholder="Ex: 123.456.789-00"
                                    className="w-full"
                                    required
                                />

                                <Inputs
                                    label="Tipo de usuário"
                                    type="select"
                                    value={newUsuario.tipo_usuario}
                                    onChange={(e) => alterarCampo('tipo_usuario', e.target.value)}
                                    options={TIPOS_USUARIO}
                                    className="w-full"
                                    required
                                />

                                <Inputs
                                    label="Senha"
                                    type={visualizar_senha ? 'text' : 'password'}
                                    placeholder={editando ? 'Deixe em branco para manter' : 'Senha'}
                                    value={newUsuario.senha}
                                    onChange={(e) => alterarCampo('senha', e.target.value)}
                                    className="w-full"
                                    autoComplete="new-password"
                                    rightElement={
                                        <ButtonEye
                                            isOpen={visualizar_senha}
                                            onToggle={() => setVisualizarSenha((v) => !v)}
                                        />
                                    }
                                    required={!editando}
                                />

                                <Inputs
                                    label="Confirmar senha"
                                    type={visualizar_confirmar_senha ? 'text' : 'password'}
                                    placeholder={
                                        editando ? 'Deixe em branco para manter' : 'Confirmar senha'
                                    }
                                    value={newUsuario.confirm_senha}
                                    onChange={(e) => alterarCampo('confirm_senha', e.target.value)}
                                    className="w-full"
                                    autoComplete="new-password"
                                    rightElement={
                                        <ButtonEye
                                            isOpen={visualizar_confirmar_senha}
                                            onToggle={() => setVisualizarConfirmarSenha((v) => !v)}
                                        />
                                    }
                                    required={!editando}
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

                                <Button type="submit" className="px-5">
                                    {editando ? 'Salvar alterações' : 'Cadastrar usuário'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={!!usuarioParaExcluir}
                onClose={() => setUsuarioParaExcluir(null)}
                onConfirm={deleteUsuario}
                titulo="Excluir usuário"
                descricao={`Tem certeza de que deseja excluir o usuário ${usuarioParaExcluir?.nome_usuario ?? ''}?`}
            />
        </div>
    );
}

export default Usuarios;
