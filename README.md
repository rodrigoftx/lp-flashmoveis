# Catálogo de Móveis

Site catálogo de móveis com painel de administração. Os clientes navegam
pelos produtos (filtrando por categoria, cor e estoque) e finalizam a compra
pelo WhatsApp. O administrador gerencia os produtos por uma área com login.

Feito com **Vite + React**. Pronto para hospedar na **Vercel** e usar o
**Supabase** como banco de dados.

## Como rodar no seu computador

Você precisa ter o [Node.js](https://nodejs.org) instalado (versão 18 ou superior).

```bash
npm install     # instala as dependências (só na primeira vez)
npm run dev     # inicia o site em modo de desenvolvimento
```

Depois abra o endereço que aparecer no terminal (geralmente
`http://localhost:5173`).

## Como personalizar

Abra o arquivo `src/config.js` e edite:

- `nomeLoja` e `slogan` — aparecem no topo
- `whatsapp` — o número que recebe os pedidos (só dígitos: país + DDD + número)
- `endereco`, `telefone`, `horario` — aparecem no rodapé
- `instagram`, `facebook` — links das redes (deixe `''` para esconder)
- `senhaAdmin` — senha do painel (só para a versão de teste)

Para mexer nas categorias e cores dos filtros, edite `src/data/produtos.js`.

## Área do administrador

Clique em "Área do administrador" no topo. Na versão de teste:

- Usuário: `admin`
- Senha: 

Ali você adiciona, edita e exclui produtos, muda preços e liga/desliga o
estoque. Nesta versão os dados ficam salvos no próprio navegador
(localStorage). Quando conectarmos o Supabase, passarão a ficar num banco
de verdade, acessível de qualquer lugar.

## Estrutura

```
src/
  config.js            <- suas configurações (edite aqui)
  data/produtos.js     <- categorias, cores e produtos de exemplo
  lib/
    store.js           <- camada de dados (troca para Supabase depois)
    utils.js           <- formatação de preço e link do WhatsApp
  components/          <- as telas e peças do site
  App.jsx              <- junta tudo
```

## Publicar na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), clique em "Add New Project" e escolha
   o repositório.
3. A Vercel detecta que é Vite automaticamente — é só clicar em "Deploy".

Pronto: o site fica no ar, e cada alteração enviada ao GitHub é publicada
sozinha.
