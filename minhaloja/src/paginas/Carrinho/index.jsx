import "./estilos.css";
import { NUMERO_WHATSAPP_LOJISTA } from "../../configuracao";

function formatarPreco(valor) {
  return (valor / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function obterPrecoEfetivo(item) {
  return item.promoPrice ?? item.price;
}

function finalizarPeloWhatsApp(itens, totalCentavos) {
  const resumoItens = itens
    .map(
      (item) =>
        `- ${item.name} | Quantidade: ${item.quantidade} | Subtotal: ${formatarPreco(
          obterPrecoEfetivo(item) * item.quantidade
        )}`
    )
    .join("\n");
  const mensagem = [
    "Olá! Gostaria de finalizar este pedido:",
    "",
    resumoItens,
    "",
    `Total: ${formatarPreco(totalCentavos)}`,
  ].join("\n");
  const url = `https://wa.me/${NUMERO_WHATSAPP_LOJISTA}?text=${encodeURIComponent(
    mensagem
  )}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

function Carrinho({ itens, onAlterarQuantidade, onRemover }) {
  const totalItens = itens.reduce(
    (total, item) => total + item.quantidade,
    0
  );
  const totalCentavos = itens.reduce(
    (total, item) => total + obterPrecoEfetivo(item) * item.quantidade,
    0
  );

  return (
    <main className="pagina-carrinho">
      <h1>Meu carrinho</h1>

      {itens.length === 0 ? (
        <p className="carrinho-vazio">Seu carrinho está vazio.</p>
      ) : (
        <ul className="lista-carrinho">
          {itens.map((item) => (
            <li className="item-carrinho" key={item.id}>
              <img src={item.image} alt="" />
              <div className="item-carrinho__info">
                <h2>{item.name}</h2>
                <div className="item-carrinho__quantidade">
                  <span>Quantidade: {item.quantidade}</span>
                  <button
                    type="button"
                    onClick={() => onAlterarQuantidade(item.id, -1)}
                    disabled={item.quantidade <= 1}
                    aria-label={`Diminuir quantidade de ${item.name}`}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => onAlterarQuantidade(item.id, 1)}
                    disabled={item.quantidade >= item.stock}
                    aria-label={`Aumentar quantidade de ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <p>Preço unitário: {formatarPreco(obterPrecoEfetivo(item))}</p>
              </div>
              <strong className="item-carrinho__subtotal">
                {formatarPreco(obterPrecoEfetivo(item) * item.quantidade)}
              </strong>
              <button
                className="item-carrinho__remover"
                type="button"
                onClick={() => onRemover(item.id)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      <section className="resumo-carrinho" aria-label="Resumo do carrinho">
        <p>Total de itens: {totalItens}</p>
        <p>
          Valor total: <strong>{formatarPreco(totalCentavos)}</strong>
        </p>
        {itens.length > 0 && (
          <button
            className="resumo-carrinho__finalizar"
            type="button"
            onClick={() => finalizarPeloWhatsApp(itens, totalCentavos)}
          >
            Finalizar pelo WhatsApp
          </button>
        )}
      </section>
    </main>
  );
}

export default Carrinho;
