function Politicas() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050212] via-[#0b0820] to-[#0b0a1a] flex items-start justify-center py-16">
      <div className="w-full max-w-3xl px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Políticas de Privacidade</h1>
          <p className="mt-2 text-sm text-gray-400">Loguiss • Vigente desde 12 de agosto de 2026</p>
        </header>
        <main className="bg-transparent border border-white/6 rounded-lg p-8 text-left max-h-[76vh] overflow-y-auto text-gray-300">
          <p className="mb-6 leading-relaxed">
            Bem-vindo ao nosso sistema! Ao utilizar este sistema, você concorda com as seguintes políticas de privacidade:
          </p>
          <section className="mb-6">
            <h2 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">2.1 Introdução</h2>
            <p className="mt-4 text-gray-300 leading-relaxed">
              Esta Política de Privacidade descreve como o Loguiss coleta, utiliza, armazena, compartilha e protege os dados pessoais de seus usuários, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD). Ao utilizar o Sistema, o usuário concorda com as práticas descritas nesta Política.
            </p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">2.2 Dados Coletados</h3>
            <p className="mt-4 text-gray-300">Para viabilizar o funcionamento do Sistema, coletamos as seguintes categorias de dados:</p>
            <ul className="mt-3 list-disc list-inside text-gray-300 space-y-1">
              <li><strong>Dados de cadastro:</strong> nome, e-mail, senha (armazenada de forma criptografada), telefone, CPF e tipo de perfil (Administrador, Gerente, Operador);</li>
              <li><strong>Dados da empresa:</strong> razão social, CNPJ, endereço, telefone e e-mail de contato;</li>
              <li><strong>Dados operacionais:</strong> cadastros de produtos, receitas, matérias-primas, fornecedores, movimentações de estoque e demais informações inseridas pelo usuário;</li>
              <li><strong>Dados de uso e acesso:</strong> registros de login, ações na plataforma e informações técnicas (IP, navegador, dispositivo) para segurança e melhoria do Serviço;</li>
              <li><strong>Dados de pagamento:</strong> informações necessárias ao processamento de cobranças, que podem ser tratadas por processadores de pagamento terceirizados.</li>
            </ul>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">2.3 Finalidade do Tratamento</h3>
            <p className="mt-4 text-gray-300 leading-relaxed">
              Os dados coletados são utilizados para: viabilizar cadastro e autenticação; gerar relatórios, análises e previsões por IA; processar pagamentos e gerenciar assinaturas; prestar suporte; cumprir obrigações legais; e melhorar a experiência e desempenho do Sistema.
            </p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">2.4 Compartilhamento de Dados</h3>
            <p className="mt-4 text-gray-300 leading-relaxed">
              O Loguiss não vende dados pessoais. Os dados poderão ser compartilhados apenas quando necessário, por exemplo:
            </p>
            <ul className="mt-3 list-disc list-inside text-gray-300 space-y-1">
              <li>Com sistemas integrados (PDV) quando o usuário habilitar a integração;</li>
              <li>Com prestadores essenciais (hospedagem, processadores de pagamento) sob contratos de confidencialidade;</li>
              <li>Por determinação legal, judicial ou de autoridade competente.</li>
            </ul>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">2.5 Armazenamento e Segurança</h3>
            <p className="mt-4 text-gray-300 leading-relaxed">
              Os dados são armazenados em banco protegido, com medidas técnicas e administrativas (controle de acesso por perfil, criptografia de senhas) para prevenir acessos não autorizados, perda ou vazamento. Em caso de incidentes, o Loguiss agirá diligentemente e notificará usuários e autoridades quando exigido por lei.
            </p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">2.6 Direitos do Titular</h3>
            <p className="mt-4 text-gray-300 leading-relaxed">Nos termos da LGPD, o titular dos dados pode, mediante solicitação:</p>
            <ul className="mt-3 list-disc list-inside text-gray-300 space-y-1">
              <li>Confirmar existência de tratamento;</li>
              <li>Acessar os dados pessoais armazenados;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Solicitar portabilidade dos dados;</li>
              <li>Solicitar eliminação de dados tratados com consentimento (salvo hipóteses legais de retenção);</li>
              <li>Revogar consentimento a qualquer momento;</li>
              <li>Obter informação sobre compartilhamentos realizados.</li>
            </ul>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">2.7 Cookies e Rastreamento</h3>
            <p className="mt-4 text-gray-300 leading-relaxed">
              O Sistema pode usar cookies e tecnologias semelhantes para manter sessões, viabilizar funcionalidades e coletar dados estatísticos. O usuário pode gerenciar preferências de cookies nas configurações do navegador.
            </p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">2.8 Retenção e Exclusão</h3>
            <p className="mt-4 text-gray-300 leading-relaxed">
              Os dados são mantidos pelo tempo necessário às finalidades de coleta ou conforme exigido por obrigações legais. Após o término da relação contratual, os dados poderão ser eliminados ou anonimizados, salvo pelas hipóteses legais de retenção.
            </p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">2.9 Alterações na Política</h3>
            <p className="mt-4 text-gray-300 leading-relaxed">
              Esta Política poderá ser atualizada periodicamente. Alterações relevantes serão comunicadas pelo Sistema ou canais de contato cadastrados; recomenda-se a revisão periódica deste documento.
            </p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">2.10 Contato e Encarregado (DPO)</h3>
            <p className="mt-4 text-gray-300 leading-relaxed">
              Em caso de dúvidas ou para exercer direitos previstos na LGPD, contacte:
            </p>
            <p className="mt-3 text-sm text-gray-400">
              E-mails: rafaelpilonetto59@gmail.com | christian.martinkoski@gmail.com<br />
              Responsáveis: Rafael Luiz Pilonetto e Christian da Rosa Martinkoski
            </p>
          </section>
        </main>
        <footer className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <span>Última atualização: 12 de agosto de 2026</span>
          <a href="/" className="text-gray-200 hover:underline">Voltar</a>
        </footer>
      </div>
    </div>
  )

}

export default Politicas;