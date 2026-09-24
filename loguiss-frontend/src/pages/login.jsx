import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

import { validarFormatoEmail, validarSenha } from '../utils/validacoes';
import { Button } from '../components/Button';
import { ButtonEye } from '../components/ButtonEye';
import { Inputs } from '../components/Inputs';

import api_login from '../services/api.js';

function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [email_tocado, setEmailTocado] = useState(false);
    const [senha_tocada, setSenhaTocada] = useState(false);
    const [enviar_formulario, setEnviarFormulario] = useState(false);
    const [visualizar_senha, setVisualizarSenha] = useState(false);

    const navigate = useNavigate();

    async function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);

        setEmailTocado(true);
        setSenhaTocada(true);

        if (validarFormatoEmail(email) || validarSenha(senha)) {
            return;
        }
        try {
            const resposta_login = await api_login.post('/login/login', {
                email: email,
                senha: senha
            })

            if (resposta_login.status === 200) {
                localStorage.setItem("token", resposta_login.data.token)

                console.log(resposta_login)

                navigate('/home');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("senha ou usúario errado!")
            }
        }

    }

    const erro_email =
        (email_tocado || enviar_formulario)
            ? validarFormatoEmail(email)
            : "";

    const erro_senha =
        (senha_tocada || enviar_formulario)
            ? validarSenha(senha)
            : "";

    return (

        <div className="relative min-h-screen bg-[#050212] flex items-center justify-center p-6">

            <div>

                <div className="flex h-[490px] w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl">

                    <aside className="hidden lg:block w-1/2 h-full">

                        <img src="./images/imagem-estoque.png" alt="Imagem de estoque" className="w-full h-full object-cover" />

                    </aside>

                    <form onSubmit={formularioEnviado} className="w-full lg:w-1/2 h-full overflow-y-auto bg-[#100E14] p-10">

                        <img src="./images/logo.png" alt="Logo da Loguiss" className="w-20 h-20 mx-auto mb-4 rounded-lg" />

                        <h1 className="text-3xl font-bold text-green-500 text-center mb-5">Bem-vindo de volta!</h1>

                        <div className="flex items-center mb-4">

                            <Inputs
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setEmailTocado(true)}
                                error={erro_email}
                                touched={email_tocado || enviar_formulario}
                                icon={User}
                                className="rounded-lg border focus:border-[#4EDB4E] w-full"
                            />

                        </div>

                        <div className="flex items-center mb-1">

                            <Inputs
                                type={visualizar_senha ? "text" : "password"}
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                onBlur={() => setSenhaTocada(true)}
                                error={erro_senha}
                                touched={senha_tocada || enviar_formulario}
                                icon={Lock}
                                className="rounded-lg border focus:border-[#4EDB4E] w-full"
                                rightElement={
                                    <ButtonEye
                                        visualizar_senha={visualizar_senha}
                                        setVisualizarSenha={setVisualizarSenha}
                                    />
                                }
                            />

                        </div>

                        <div className="flex justify-between items-center">

                            <Button
                                type="button"
                                onClick={() => navigate('/esqueceu-senha')}
                                className="text-xs hover:underline hover:text-green-500"
                            >
                                Esqueci minha senha
                            </Button>

                        </div>

                        <Button
                            type="submit"
                            className="bg-[#4EDB4E] hover:bg-[#3CB43C] w-full p-3 mt-5">
                            Entrar
                        </Button>

                        <p className="mt-1 text-xs text-center text-gray-500">
                            <a href="/termos" className="hover:underline  hover:text-green-500">Termos de Serviço</a>
                            {" "} e {" "}
                            <a href="/politicas" className="hover:underline  hover:text-green-500">Políticas de Privacidade</a>.
                        </p>

                    </form>

                </div>

            </div>

        </div>

    )
}

export default Login;