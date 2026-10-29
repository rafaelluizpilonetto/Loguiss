function Termos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050212] via-[#0b0820] to-[#0b0a1a] flex items-start justify-center py-16">
      <div className="w-full max-w-3xl px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Termos de Serviço</h1>
          <p className="mt-2 text-sm text-gray-400">Loguiss • Vigente desde 12 de agosto de 2026</p>
        </header>
        <main className="bg-transparent border border-white/6 rounded-lg p-8 text-left max-h-[76vh] overflow-y-auto">
          <p className="text-gray-300 mb-6 leading-relaxed">
            Bem-vindo ao nosso sistema! Ao utilizar este sistema, você concorda com os seguintes termos de serviço:
          </p>
          <section className="mb-6">
            <h2 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">Quem pode usar</h2>
            <p className="mt-4 text-gray-300 leading-relaxed">
              Ao acessar ou utilizar o sistema Loguiss ("Sistema", "Plataforma" ou "Serviço"), o usuário declara ter lido, compreendido e aceitado estes Termos de Uso. Caso não concorde, não utilize o Sistema.
            </p>
            <p className="mt-3 text-sm text-gray-400">Equipe responsável: Rafael Luiz Pilonetto e Christian da Rosa Martinkoski.</p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">O que oferecemos</h3>
            <ul className="mt-4 space-y-2 text-gray-300 list-disc list-inside">
              <li>Cadastro de produtos, receitas, matérias-primas e fornecedores;</li>
              <li>Controle de movimentações de estoque e gestão de produção;</li>
              <li>Previsões via IA e integrações com PDV;</li>
              <li>Relatórios e alertas para suporte à operação.</li>
            </ul>
            <p className="mt-3 text-sm text-gray-400">O Sistema é fornecido "como está" e pode ser atualizado quando necessário.</p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">Cadastro e conta</h3>
            <p className="mt-4 text-gray-300">Responsabilidade pela veracidade das informações e sigilo das credenciais. Perfis com permissões distintas; a empresa contratante responde pelos usuários vinculados.</p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">Planos e pagamento</h3>
            <p className="mt-4 text-gray-300">Períodos gratuitos podem ser oferecidos; após isso, será cobrado conforme tabela vigente.</p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">Uso adequado</h3>
            <p className="mt-4 text-gray-300">Proibido uso ilícito, engenharia reversa, ou automações não autorizadas. Violações podem resultar em suspensão ou encerramento da conta.</p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">Responsabilidades e IA</h3>
            <p className="mt-4 text-gray-300">As previsões de IA são orientativas. Integrações dependem de terceiros; o Loguiss não se responsabiliza por indisponibilidades externas.</p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-100 tracking-wide uppercase pb-3 border-b border-white/6">Legislação</h3>
            <p className="mt-4 text-gray-300">Regidos pela legislação brasileira. Foro da comarca do domicílio da empresa responsável.</p>
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

export default Termos
