// ============================================================
//  DADOS FIXOS DO CATÁLOGO
//  Categorias e cores usadas nos filtros e formulários.
//  Os PRODUTOS em si agora vêm do banco (Supabase) — veja src/lib/store.js.
// ============================================================

// Categorias e subcategorias (baseadas no site de referência).
// Você pode adicionar/remover à vontade.
export const CATEGORIAS = [
  { nome: 'Sofá', subs: ['Sofá Cama', '2 Lugares', '3 Lugares', 'Sofá de Canto', 'Poltrona'] },
  { nome: 'Guarda Roupa', subs: ['Cômoda', 'Casal', 'Solteiro'] },
  { nome: 'Painel e Rack', subs: ['Estante e Home', 'Painel', 'Rack', 'Rack com Painel'] },
  { nome: 'Cama e Colchão', subs: ['Base Box', 'Cama de Casal', 'Cama de Solteiro', 'Colchão'] },
  { nome: 'Mesa e Cadeira', subs: ['Cadeira', 'Mesa', 'Mesa de Centro', 'Escrivaninha'] },
  { nome: 'Cozinha', subs: ['Aéreo', 'Armário', 'Balcão', 'Conjunto Completo'] },
  { nome: 'Outros', subs: ['Aparador', 'Cabeceira', 'Decoração', 'Sapateira'] },
]

// Cores disponíveis (para o filtro)
export const CORES = ['Branco', 'Off White', 'Bege', 'Marrom', 'Naturale', 'Canela', 'Cinza', 'Preto']
