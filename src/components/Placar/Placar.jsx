import "./Placar.css";

export default function Placar({ titulo, embarcacoes }) {
    return ( 
        <div className="placar-painel">
            <h2 className="placar-titulo">{titulo}</h2>
            <div className="placar-lista">
                {embarcacoes && embarcacoes.length > 0 ? (
                    embarcacoes.map((nome, idx) => (
                        <div className="placar-embarcacao" key={idx}>
                            {nome}
                        </div>
                    ))
                ) : (
                    <div className="placar-vazio">Nenhuma embarcação</div>
                )}
            </div>
        </div>
    );
}