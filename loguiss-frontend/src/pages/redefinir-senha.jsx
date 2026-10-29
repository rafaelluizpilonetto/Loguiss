import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Inputs } from '../components/inputs';
import { ButtonEye } from '../components/buttonEye';
import { Button } from '../components/button';
import { validarSenha } from '../utils/validacoes';

function RedefinirSenha() {

    const [senha, setSenha] = useState('');
    const [confirmar_senha, setConfirmarSenha] = useState('');

    const [senha_tocada, setSenhaTocada] = useState(false);
    const [confirmar_senha_tocada, setConfirmarSenhaTocada] = useState(false);

    const [enviar_formulario, setEnviarFormulario] = useState(false);

    const [visualizar_senha, setVisualizarSenha] = useState(false);
    const [visualizar_confirmar_senha, setVisualizarConfirmarSenha] = useState(false);

    const navigate = useNavigate();

    function validarConfirmarSenha(senha, confirmarSenha) {
        if (confirmarSenha.trim() === '') {
            return 'A confirmação da senha é obrigatória';
        }

        if (confirmarSenha !== senha) {
            return 'As senhas não coincidem';
        }

        return '';
    }

    function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);
        setSenhaTocada(true);
        setConfirmarSenhaTocada(true);

        if (
            validarSenha(senha) ||
            validarConfirmarSenha(senha, confirmar_senha)
        ) {
            return;
        }

        navigate('/login');
    }

    const erro_senha =
        (senha_tocada || enviar_formulario)
            ? validarSenha(senha)
            : '';

    const erro_confirmar_senha =
        (confirmar_senha_tocada || enviar_formulario)
            ? validarConfirmarSenha(senha, confirmar_senha)
            : '';

    return (
        <div className="bg-[#050212] h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col gap-5">
                <div className="flex w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl">
                    <aside className="hidden lg:flex w-1/2 bg-[#0D0B12] items-center justify-center">
                        <img
                            src="./images/imagem-estoque.png"
                            alt="Imagem de estoque"
                            className="w-full h-full object-cover"
                        />
                    </aside>
                    <form
                        onSubmit={formularioEnviado}
                        className="bg-[#100E14] p-10 rounded-lg w-[400px] shadow-lg"
                    >
                        <img
                            src="./images/logo.png"
                            alt="Logo da Loguiss"
                            className="w-20 h-20 mx-auto mb-4 rounded-lg"
                        />
                        <h1 className="text-2xl font-bold text-green-500 text-center mb-2">
                            Redefinir senha
                        </h1>
                        <p className="text-center text-green-500 mb-5 text-sm">
                            Digite sua nova senha e confirme para concluir a redefinição.
                        </p>
                        <div className="flex flex-col gap-4 mb-4">
                            <Inputs
                                type={visualizar_senha ? 'text' : 'password'}
                                placeholder="Nova senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                onBlur={() => setSenhaTocada(true)}
                                error={erro_senha}
                                touched={senha_tocada || enviar_formulario}
                                icon={Lock}
                                rightElement={
                                    <ButtonEye
                                        visualizar_senha={visualizar_senha}
                                        setVisualizarSenha={setVisualizarSenha}
                                    />
                                }
                            />
                            <Inputs
                                type={visualizar_confirmar_senha ? 'text' : 'password'}
                                placeholder="Confirmar nova senha"
                                value={confirmar_senha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                onBlur={() => setConfirmarSenhaTocada(true)}
                                error={erro_confirmar_senha}
                                touched={confirmar_senha_tocada || enviar_formulario}
                                icon={Lock}
                                rightElement={
                                    <ButtonEye
                                        visualizar_senha={visualizar_confirmar_senha}
                                        setVisualizarSenha={setVisualizarConfirmarSenha}
                                    />
                                }
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full p-3 mb-2 bg-[#4EDB4E] hover:bg-[#3CB43C]"
                        >
                            Redefinir senha
                        </Button>
                        <Button
                            type="button"
                            className="w-full p-3 bg-[#0B0819] hover:bg-[#170F3C] mt-3"
                            onClick={() => navigate('/login')}
                        >
                            Voltar para o login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RedefinirSenha;
