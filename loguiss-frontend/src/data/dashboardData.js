// Dados estáticos utilizados nas telas de configurações.
import { Clock3, Crown, Gift, Package } from 'lucide-react';

export const dadosDaEmpresa = {
    nome: 'Loguiss Tecnologia LTDA',
    cnpj: '42.318.907/0001-65',
    email: 'financeiro@loguiss.com.br',
    telefone: '(11) 98765-4321',
};

export const planos = [
    {
        id: 'gratuito',
        nome: 'Plano Gratuito',
        icone: Gift,
        selo: 'OFERTA ESPECIAL',
        descricao:
            'Uma oportunidade especial para as 100 primeiras empresas cadastradas! Tenha acesso a todos os recursos do Loguiss gratuitamente durante os primeiros 6 meses.',
        rotuloPreco: 'Investimento mensal',
        preco: 'R$ 0,00',
        estilo: {
            card: 'border-primaria/40 bg-linear-to-br from-primaria/10 to-superficie hover:border-primaria',
            icone: 'bg-primaria/15',
            selo: 'bg-primaria text-sobre-primaria',
        },
    },
    {
        id: 'basico',
        nome: 'Plano Básico',
        icone: Package,
        selo: 'ESSENCIAL',
        descricao:
            'Continue utilizando as principais funcionalidades do Loguiss após o período gratuito. Tenha as ferramentas essenciais para organizar seu estoque e gerenciar sua empresa com praticidade.',
        rotuloPreco: 'Investimento mensal',
        preco: 'R$ 45,00',
        estilo: {
            card: 'bg-superficie hover:border-primaria/60',
            icone: 'bg-elevada',
            selo: 'border border-borda bg-elevada text-texto-suave',
        },
    },
    {
        id: 'premium',
        nome: 'Plano Premium',
        icone: Crown,
        selo: 'EM BREVE',
        seloIcone: Clock3,
        descricao:
            'Uma experiência ainda mais completa, com funcionalidades avançadas e benefícios exclusivos. Em desenvolvimento, com lançamento previsto após a disponibilização do MVP.',
        rotuloPreco: 'Valor previsto',
        preco: 'R$ 99,90',
        estilo: {
            card: 'border-l-texto-suave bg-fundo hover:border-primaria/40',
            icone: 'bg-elevada',
            selo: 'border border-primaria/20 bg-primaria/10 text-primaria',
        },
    },
];
