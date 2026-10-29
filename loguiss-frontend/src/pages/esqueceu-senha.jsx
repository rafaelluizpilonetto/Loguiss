import { useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Inputs } from '../components/Inputs';
import { Button } from '../components/Button';
import { validarFormatoEmail } from '../utils/validacoes';

function EsqueceuSenha() {

    const [email, setEmail] = useState('');
    const [email_tocado, setEmailTocado] = useState(false);

    const [enviar_formulario, setEnviarFormulario] = useState(false);

    const [loading, setLoading] = useState(false); //para o "loading" na hora de enviar o email

    const navigate = useNavigate();

    function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);
        setEmailTocado(true);

        const erro = validarFormatoEmail(email);

        if (!erro) {
            navigate('/codigo-verificacao');
        }
    }

    const erro_email =
        (email_tocado || enviar_formulario)
            ? validarFormatoEmail(email)
            : '';

    return (

        <div className="bg-[#050212] h-screen w-screen flex items-center justify-center ">
            <div className="flex flex-col gap-5">
                <div className="flex w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl">
                    <aside className="hidden lg:flex w-1/2 bg-[#0D0B12] items-center justify-center">
                        <img src="./images/imagem-estoque.png" alt="Imagem de estoque" className="w-full h-full" />
                    </aside>
                    <form onSubmit={formularioEnviado} className="bg-[#100E14] p-10 rounded-lg w-[400px] shadow-lg">
                        <img src="./images/logo.png" alt="Logo da Loguiss" className="w-20 h-20 mx-auto mb-4 rounded-lg" />
                        <p className="text-center text-green-500 mb-5">
                            Insira seu email cadastrado para receber as instruções de redefinição de senha.
                        </p>
                        <div className="flex items-center mb-4">
                            <Inputs
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setEmailTocado(true)}
                                error={erro_email}
                                touched={email_tocado || enviar_formulario}
                                icon={User}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full p-3 mb-5 bg-[#4EDB4E] hover:bg-[#3CB43C]"
                        >
                            Verificar email
                        </Button>
                        <Button
                            type="button"
                            className="w-full p-3 bg-[#0B0819] hover:bg-[#170F3C]"
                            onClick={() => navigate('/login')}
                        >
                            Voltar para o login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EsqueceuSenha;
