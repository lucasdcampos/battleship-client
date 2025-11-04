import Card from "./elements/Cards/Cards";
import defaultCosmeticImg from "../../../assets/development/fc.png";
import styles from "./Store.module.css";
import fc from "../../../assets/development/fc.png";
// import { updateUser } from "../../../services/userService";
import { getCosmetics, purchaseCosmetic } from "../../../services/storeService";
import { useAuth } from "../../../user/useAuth";
import { useState, useEffect } from "react";

export default function Store() {
  const { user, loading, setUserAtt, userAtt } = useAuth();
  const [actualTab, setActualTab] = useState("icons");
  const [cosmetics, setCosmetics] = useState([]);
  const [fatecCoins, setFatecCoins] = useState(0);
  const [inventory, setInventory] = useState(new Set());

  async function setMarket() {
    // Usa o usuário do contexto
    const data = user;
    setFatecCoins(data?.basicData?.fatecCoins || data?.coins || 0);
    const userInventory = new Set([
      ...(data?.availableCosmetic?.availableIcons || []),
      ...(data?.availableCosmetic?.availableEffects || []),
      ...(data?.availableCosmetic?.availableBackgrounds || []),
      ...(data?.availableCosmetic?.availableCards || []),
      ...(data?.availableShipSkins?.destroyer || []),
      ...(data?.availableShipSkins?.battleship || []),
      ...(data?.availableShipSkins?.aircraftCarrier || []),
      ...(data?.availableShipSkins?.submarine || []),
    ]);
    setInventory(userInventory);
    // Busca cosméticos da loja
    try {
      const res = await getCosmetics();
      setCosmetics(res.cosmetics || []);
    } catch {
      setCosmetics([]);
    }
  }

  const handleBuy = async (product) => {
    // Validação: id do cosmético
    if (!product?.imagem && !product?.cosmetic_id) {
      alert("ID do cosmético inválido.");
      return;
    }
    const cosmeticId = product.imagem || product.cosmetic_id;
    // Validação: já possui
    if (inventory.has(cosmeticId)) {
      alert("Você já possui este item.");
      return;
    }
    // Validação: saldo
    const productPrice = parseInt(product.preco, 10);
    if (fatecCoins < productPrice) {
      alert("Saldo insuficiente para realizar a compra.");
      return;
    }
    try {
      // Chama a API de compra
  await purchaseCosmetic(cosmeticId);
      // Atualiza inventário local
      setInventory(prev => new Set(prev).add(cosmeticId));
      // Atualiza saldo local (diminui pelo preço do item)
      setFatecCoins(prev => prev - productPrice);
      // Atualiza contexto global
      setUserAtt(prev => !prev);
      alert(`Você comprou ${product.titulo} por ${productPrice} Fatec Coins!`);
    } catch (error) {
      alert("Ocorreu um erro durante a compra. Tente novamente.");
      console.error("Erro na compra:", error);
      setMarket();
    }
  };

  useEffect(() => {
    if (!loading && user) {
      setMarket();
    }
    // eslint-disable-next-line
  }, [loading, userAtt]);

  if (loading) {
    return <div className={styles.container}>Carregando Loja...</div>;
  }

  // Renderização normal da loja
  return (
    <div className={styles.container}>
      <div className={styles.Nav_Buttons_Container}>
        <ul type="none">
          <li
            style={{
              border:
                actualTab === "icons"
                  ? "solid 3px var(--tertiary-color)"
                  : "none",
            }}
            onClick={() => setActualTab("icons")}
          >
            Ícones
          </li>
          <li
            style={{
              border:
                actualTab === "effects"
                  ? "solid 3px var(--tertiary-color)"
                  : "none",
            }}
            onClick={() => setActualTab("effects")}
          >
            Efeitos
          </li>
          <li
            style={{
              border:
                actualTab === "backgrounds"
                  ? "solid 3px var(--tertiary-color)"
                  : "none",
            }}
            onClick={() => setActualTab("backgrounds")}
          >
            Backgrounds
          </li>
          <li
            style={{
              border:
                actualTab === "cards"
                  ? "solid 3px var(--tertiary-color)"
                  : "none",
            }}
            onClick={() => setActualTab("cards")}
          >
            Cards
          </li>
          <li
            style={{
              border:
                actualTab === "ships"
                  ? "solid 3px var(--tertiary-color)"
                  : "none",
            }}
            onClick={() => setActualTab("ships")}
          >
            Navios
          </li>
        </ul>
      </div>
      <div className={styles.FC_Container}>
        <h1>
          Fatec Coins: {" "}
          <span style={{ color: "var(--tertiary-color)" }}>{fatecCoins}</span>
        </h1>
        <img src={fc} alt="FC" />
      </div>
      <div className={styles.Cards_Container}>
        {(() => {
          // Mapeia a aba para o type do backend
          const tabTypeMap = {
            icons: "ICON",
            backgrounds: "BACKGROUND",
            effects: "EFFECT",
            cards: "CARD",
            ships: "SKIN"
          };
          const backendType = tabTypeMap[actualTab];
          const filtered = cosmetics.filter(
            (item) => item.type === backendType && !inventory.has(item.cosmetic_id)
          );
          if (filtered.length > 0) {
            return filtered.map((item) => (
              <Card
                key={item.cosmetic_id}
                titulo={item.description}
                preco={item.price}
                imagem={item.link || defaultCosmeticImg}
                onComprar={() => handleBuy({
                  ...item,
                  imagem: item.cosmetic_id, // para controle de inventário
                  titulo: item.description,
                  preco: item.price
                })}
                onImgError={e => { e.target.onerror = null; e.target.src = defaultCosmeticImg; }}
              />
            ));
          } else {
            return <p>Não há itens disponíveis nessa categoria</p>;
          }
        })()}
      </div>
    </div>
  );
}
