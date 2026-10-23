import {
  LayoutDashboard,
  Folder,
  Shuffle,
  Brain,
  Cog,
} from 'lucide-react';

export const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/home',
    active: true,
  },
  {
    label: 'Cadastros',
    icon: Folder,
    subMenu: [
      {
        label: 'Produtos',
        subMenu: [
          { label: 'Produtos', href: '/produtos' },
          { label: 'Unidade de Medida', href: '/unidades-medida' },
          { label: 'Categorias', href: '/categorias' },
        ],
      },
      { label: 'Usuários', href: '/usuarios' },
      { label: 'Clientes', href: '/clientes' },
      { label: 'Fornecedores', href: '/fornecedores' },
    ],
  },
  {
    label: 'Movimentações',
    icon: Shuffle,
    subMenu: [
      { label: 'Movimentações de saída', href: '/movimentacao-saida' },
      { label: 'Movimentações de entrada', href: '/movimentacao-entrada' },
    ],
  },
  {
    label: 'Previsão IA',
    icon: Brain,
    subMenu: [
      { label: 'Previsão de demanda', href: '/previsao-demanda' },
      { label: 'Configurações da IA', href: '/configuracoes-ia' },
    ],
  },
  {
    label: 'Configurações',
    icon: Cog,
    href: '/configuracoes',
  },
];