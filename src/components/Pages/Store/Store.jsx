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
  const [shipSubCategory, setShipSubCategory] = useState("all"); // Estado para o submenu de navios
  const [tabs, setTabs] = useState(null);
  const [fatecCoins, setFatecCoins] = useState(0);
  const [inventory, setInventory] = useState(new Set());


  function setMarket(userID) {
    getUser(userID).then((data) => {
      setTabs({
        icons: data.market.sell_icons,
        effects: data.market.sell_effects,
        backgrounds: data.market.sell_backgrounds,
        cards: data.market.sell_cards,
        ships: data.market.sell_ships,
      });

      // Carrega o saldo e o inventário do usuário
      setFatecCoins(data.basicData.fatecCoins);

      const userInventory = new Set([
        ...(data.availableCosmetic?.availableIcons || []),
        ...(data.availableCosmetic?.availableEffects || []),
        ...(data.availableCosmetic?.availableBackgrounds || []),
        ...(data.availableCosmetic?.availableCards || []),
        ...(data.availableShipSkins?.destroyer || []),
        ...(data.availableShipSkins?.battleship || []),
        ...(data.availableShipSkins?.aircraftCarrier || []),
        ...(data.availableShipSkins?.submarine || []),
      ]);
      setInventory(userInventory);
    });
  }

  function getImagePath(code) {
    let basePath = "";

    switch (actualTab) {
      case "icons":
        basePath = "/src/assets/cosmetic/icons/";
        break;
      case "backgrounds":
        basePath = "/src/assets/cosmetic/backgrounds/";
        break;
      case "effects":
        basePath = "/src/assets/cosmetic/effects/";
        break;
      case "cards":
        basePath = "/src/assets/cosmetic/cards/";
        break;
      case "ships":
        if (code[0] === "H") {
          basePath = "/src/assets/cosmetic/ships/aircraftCarrier/";
          break;
        }
        if (code[0] === "G") {
          basePath = "/src/assets/cosmetic/ships/battleship/";
          break;
        }
        if (code[0] === "F") {
          basePath = "/src/assets/cosmetic/ships/destroyer/";
          break;
        }
        if (code[0] === "I") {
          basePath = "/src/assets/cosmetic/ships/submarine/";
          break;
        }
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

  const handleTabClick = (tab) => {
    setActualTab(tab);
    setShipSubCategory("all"); // Reseta a subcategoria ao trocar de aba
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
            onClick={() => handleTabClick("icons")}
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
            onClick={() => handleTabClick("effects")}
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
            onClick={() => handleTabClick("backgrounds")}
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
            onClick={() => handleTabClick("cards")}
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
            onClick={() => handleTabClick("ships")}
          >
            Navios
          </li>
        </ul>
      </div>
      {actualTab === "ships" && (
        <div className={styles.subCategoryBox}>
          <ul type="none" className={styles.Nav_Buttons_Container}>
            <li
              style={{
                border:
                  shipSubCategory === "aircraftCarrier"
                    ? "solid 3px var(--tertiary-color)"
                    : "none",
              }}
              onClick={() => setShipSubCategory("aircraftCarrier")}
            >
              Porta-Aviões
            </li>
            <li
              style={{
                border:
                  shipSubCategory === "battleship"
                    ? "solid 3px var(--tertiary-color)"
                    : "none",
              }}
              onClick={() => setShipSubCategory("battleship")}
            >
              Encouraçado
            </li>
            <li
              style={{
                border:
                  shipSubCategory === "submarine"
                    ? "solid 3px var(--tertiary-color)"
                    : "none",
              }}
              onClick={() => setShipSubCategory("submarine")}
            >
              Submarino
            </li>
            <li
              style={{
                border:
                  shipSubCategory === "destroyer"
                    ? "solid 3px var(--tertiary-color)"
                    : "none",
              }}
              onClick={() => setShipSubCategory("destroyer")}
            >
              Destroier
            </li>
          </ul>
        </div>
      )}
      <div className={styles.FC_Container}>
        <h1>
          Fatec Coins: {" "}
          <span style={{ color: "var(--tertiary-color)" }}>{fatecCoins}</span>
        </h1>
        <img src={fc} alt="FC" />
      </div>
      <div className={styles.Cards_Container}>
        {(() => {
          const availableItems =
            tabs && tabs[actualTab]?.filter((card) => {
                if (inventory.has(card.imagem)) {
                  return false;
                }
                if (actualTab === "ships" && shipSubCategory !== "all") {
                  const firstLetter = card.imagem[0];
                  if (shipSubCategory === 'aircraftCarrier' && firstLetter !== 'H') return false;
                  if (shipSubCategory === 'battleship' && firstLetter !== 'G') return false;
                  if (shipSubCategory === 'submarine' && firstLetter !== 'I') return false;
                  if (shipSubCategory === 'destroyer' && firstLetter !== 'F') return false;
                }
                return true;
              });

          if (availableItems && availableItems.length > 0) {
            return availableItems.map((card, index) => (
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
