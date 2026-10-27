

import { useEffect, useState } from "react";
import ProdutoCard from "../../componentes/ProdutoCard";
import "./estilos.css";

const API_URL = "http://192.168.100.217:3000/products";

function Loja({ onAdicionarAoCarrinho, quantidadesNoCarrinho }) {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os produtos.");
        }

        const dados = await resposta.json();
        setProdutos(dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    buscarProdutos();
  }, []);

  if (carregando) {
    return <p className="mensagem">Carregando produtos...</p>;
  }

  if (erro) {
    return <p className="mensagem erro">{erro}</p>;
  }

  return (
    <main className="loja">
      <h1>Nossa Loja</h1>

      {produtos.length === 0 ? (
        <p className="mensagem">Nenhum produto encontrado.</p>
      ) : (
        <div className="grade-produtos">
          {produtos.map((produto) => (
            <ProdutoCard
              key={produto.id}
              produto={produto}
              quantidadeNoCarrinho={quantidadesNoCarrinho[produto.id] ?? 0}
              onComprar={onAdicionarAoCarrinho}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Loja;
