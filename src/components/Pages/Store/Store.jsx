import Card from "./elements/Cards/Cards";
import defaultCosmeticImg from "../../../assets/development/fc.png";
import styles from "./Store.module.css";
import fc from "../../../assets/development/fc.png";
import { updateUser } from "../../../services/userService";
import { getCosmetics } from "../../../services/storeService";
import { useAuth } from "../../../user/useAuth";
import { useState, useEffect } from "react";

export default function Store() {
  const { user, loading, setUserAtt, refreshUser, userAtt } = useAuth();
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
    const productPrice = parseInt(product.preco, 10);

    // a) Validação de saldo
    if (fatecCoins < productPrice) {
      alert("Saldo insuficiente para realizar a compra.");
      return;
    }

    try {
      // d) Desconto do saldo
      const newCoinsValue = fatecCoins - productPrice;
      const coinsUpdate = { basicData: { fatecCoins: newCoinsValue } };
      await updateUser(null, coinsUpdate); // null para /me/

      // b) Aquisição do item
      await refreshUser(); // Atualiza o contexto global
      const userData = user; // Usa o contexto atualizado
      let updatePayload = {};

      if (actualTab === "ships") {
        let shipType;
        if (product.imagem[0] === "H") shipType = "aircraftCarrier";
        else if (product.imagem[0] === "G") shipType = "battleship";
        else if (product.imagem[0] === "F") shipType = "destroyer";
        else if (product.imagem[0] === "I") shipType = "submarine";

        const currentShipSkins = userData?.availableShipSkins?.[shipType] || [];
        updatePayload.availableShipSkins = {
          ...userData?.availableShipSkins,
          [shipType]: [...currentShipSkins, product.imagem],
        };
      } else {
        const cosmeticTypeKey = "available" + actualTab.charAt(0).toUpperCase() + actualTab.slice(1);
        const currentCosmetics =
          userData?.availableCosmetic?.[cosmeticTypeKey] || [];
        updatePayload.availableCosmetic = {
          ...userData?.availableCosmetic,
          [cosmeticTypeKey]: [...currentCosmetics, product.imagem],
        };
      }

      await updateUser(null, updatePayload); // null para /me/

      // c) Desabilitação na Loja (atualizando o estado local)
      setFatecCoins(newCoinsValue);
      setInventory(prevInventory => new Set(prevInventory).add(product.imagem));

      // Atualiza o contexto de autenticação para refletir as mudanças em outros componentes
      setUserAtt(prev => !prev);

      alert(`Você comprou ${product.titulo} por ${productPrice} Fatec Coins!`);
    } catch (error) {
      alert("Ocorreu um erro durante a compra. Tente novamente.");
      console.error("Erro na compra:", error);
      // Se der erro, recarrega os dados para garantir consistência
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
