
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Loja from './paginas/Loja';
import Carrinho from "./paginas/Carrinho";
import MenuNavegacao from "./componentes/ProdutoCard/MenuNavegacao";
import { useState } from "react";

function PaginaProvisoria({ titulo }) {
  return <h1>{titulo}</h1>;
}

function NaoEncontrado() {
  return (
    <main>
      <h1>404 - Página não encontrada</h1>
      <p>A página que você procura não existe.</p>
      <Link to="/">Voltar para a loja</Link>
    </main>
  );
}

export default function App() {
  const [carrinho, setCarrinho] = useState([]);
  const quantidadeItens = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  function adicionarAoCarrinho(produto) {
    if (produto.stock <= 0) {
      return;
    }

    setCarrinho((itensAtuais) => {
      const itemExistente = itensAtuais.find((item) => item.id === produto.id);

      if (itemExistente) {
        if (itemExistente.quantidade >= produto.stock) {
          return itensAtuais;
        }

        return itensAtuais.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...itensAtuais, { ...produto, quantidade: 1 }];
    });
  }

  function alterarQuantidade(produtoId, variacao) {
    setCarrinho((itensAtuais) =>
      itensAtuais.map((item) => {
        if (item.id !== produtoId) {
          return item;
        }

        const quantidade = Math.min(
          item.stock,
          Math.max(1, item.quantidade + variacao)
        );

        return { ...item, quantidade };
      })
    );
  }

  function removerDoCarrinho(produtoId) {
    setCarrinho((itensAtuais) =>
      itensAtuais.filter((item) => item.id !== produtoId)
    );
  }

  const quantidadesNoCarrinho = Object.fromEntries(
    carrinho.map((item) => [item.id, item.quantidade])
  );

  return (
    <BrowserRouter>
      <MenuNavegacao
        quantidadeCarrinho={quantidadeItens}
      />
      <header>
        <nav>
          <Link to="/">Loja</Link>{" | "}
          <Link to="/carrinho">Carrinho</Link>{" | "}
          <Link to="/admin/novo">Novo produto</Link>
        </nav>
      </header>

      <Routes>
        {/* Página inicial: loja */}
        <Route
          path="/"
          element={
            <Loja
              onAdicionarAoCarrinho={adicionarAoCarrinho}
              quantidadesNoCarrinho={quantidadesNoCarrinho}
            />
          }
        />

        {/* Detalhes do produto */}
        <Route
          path="/produtos/:id"
          element={<PaginaProvisoria titulo="Detalhes do produto" />}
        />

        {/* Carrinho */}
        <Route
          path="/carrinho"
          element={
            <Carrinho
              itens={carrinho}
              onAlterarQuantidade={alterarQuantidade}
              onRemover={removerDoCarrinho}
            />
          }
        />

        {/* Cadastro de produto */}
        <Route
          path="/admin/novo"
          element={<PaginaProvisoria titulo="Cadastrar produto" />}
        />

        {/* Edição de produto */}
        <Route
          path="/admin/:id/editar"
          element={<PaginaProvisoria titulo="Editar produto" />}
        />

        {/* Qualquer rota não definida */}
        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </BrowserRouter>
  );
}
