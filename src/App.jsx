import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CategoriaNav from './components/CategoriaNav.jsx'
import BannerHero from './components/BannerHero.jsx'
import Vitrine from './components/Vitrine.jsx'
import Admin from './components/Admin.jsx'
import {
  listarProdutos,
  adicionarProduto,
  atualizarProduto,
  removerProduto,
  alternarEstoque,
  alternarPromocao,
} from './lib/store.js'

export default function App() {
  const [pagina, setPagina] = useState('loja') // 'loja' | 'admin'
  const [busca, setBusca] = useState('')
  const [produtos, setProdutos] = useState([])
  const [categoriaAtiva, setCategoriaAtiva] = useState(null)
  const [subcategoriaAtiva, setSubcategoriaAtiva] = useState(null)

  const [carregando, setCarregando] = useState(true)

  function selecionarCategoria(categoriaNome, subNome) {
    setCategoriaAtiva(categoriaNome)
    setSubcategoriaAtiva(subNome)
    setBusca('')
  }

  // Recarrega a lista a partir do Supabase
  async function recarregar() {
    const lista = await listarProdutos()
    setProdutos(lista)
  }

  // Carrega os produtos ao iniciar
  useEffect(() => {
    recarregar().finally(() => setCarregando(false))
  }, [])

  const acoes = {
    adicionar: async (dados) => {
      await adicionarProduto(dados)
      await recarregar()
    },
    atualizar: async (id, dados) => {
      await atualizarProduto(id, dados)
      await recarregar()
    },
    remover: async (id) => {
      await removerProduto(id)
      await recarregar()
    },
    alternarEstoque: async (id) => {
      await alternarEstoque(id)
      await recarregar()
    },
    alternarPromocao: async (id) => {
      await alternarPromocao(id)
      await recarregar()
    },
  }

  return (
    <>
      <Header pagina={pagina} setPagina={setPagina} />

      {pagina === 'loja' ? (
        <>
          <CategoriaNav categoriaAtiva={categoriaAtiva} onSelecionar={selecionarCategoria} />
          {!categoriaAtiva && <BannerHero />}
          {carregando ? (
            <p className="vazio container">Carregando produtos...</p>
          ) : (
            <Vitrine
              produtos={produtos}
              busca={busca}
              setBusca={setBusca}
              categoriaFixa={categoriaAtiva}
              subcategoriaFixa={subcategoriaAtiva}
              aoVerTodos={() => selecionarCategoria(null, null)}
            />
          )}
        </>
      ) : (
        <Admin produtos={produtos} acoes={acoes} />
      )}

      <Footer />
    </>
  )
}
