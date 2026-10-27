import "./ProdutoCard.css";

const ProdutoCard = ({ produto, quantidadeNoCarrinho = 0, onComprar }) => {
  const esgotado = produto.stock <= 0;
  const limiteAtingido = esgotado || quantidadeNoCarrinho >= produto.stock;
  const precoFormatado = (produto.price / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="produto-card">
      {esgotado && <span className="produto-card__selo">Esgotado</span>}
      <img src={produto.image} alt={produto.name} />
      <div className="produto-info">
        <h2>{produto.name}</h2>
        <p>{produto.description}</p>

        <span className="preco">{precoFormatado}</span>
        <button
          className="produto-card__botao"
          onClick={() => {
            if (!limiteAtingido) {
              onComprar?.(produto);
            }
          }}
          type="button"
          disabled={limiteAtingido}
        >
          {esgotado ? "Indisponível" : "Comprar"}
        </button>
      </div>
    </div>
  );
};

export default ProdutoCard;