import { useEffect, useState } from "react";
import styles from "./Store.module.css";
import Card from "./elements/Cards/Cards";

import {
  getCosmetics,
  getUserCosmetics,
  purchaseCosmetic
} from "../../../services/storeService";

import { getMe, addCoins } from "../../../services/userService";

export default function Store() {
  const [loading, setLoading] = useState(true);
  const [cosmetics, setCosmetics] = useState([]);
  const [owned, setOwned] = useState(new Set());
  const [coins, setCoins] = useState(0);
  const [tab, setTab] = useState("ICON");
  const [processing, setProcessing] = useState(false);

  const tabsMap = {
    ICON: "Ícones",
    EFFECT: "Efeitos",
    BACKGROUND: "Backgrounds",
    SKIN: "Skins"
  };

  function resolveUrl(link) {
    if (!link) return "/placeholder.png";
    if (link.startsWith("http")) return link;
    if (link.startsWith("/")) return link;
    return `/${link}`;
  }

  useEffect(() => {
    async function load() {
      try {
        const [storeRes, userCosRes, meRes] = await Promise.all([
          getCosmetics(),
          getUserCosmetics(),
          getMe()
        ]);

        setCosmetics(storeRes.cosmetics || []);
        setOwned(new Set(userCosRes.cosmetics?.map((c) => c.cosmetic_id) || []));
        setCoins(meRes.coins ?? 0);

      } catch (err) {
        console.error("[STORE] erro:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div>Carregando Loja...</div>;

  const filtered = cosmetics.filter((c) => c.type === tab);

  async function handleBuy(c) {
    if (processing) return;
    if (owned.has(c.cosmetic_id)) return;

    if (coins < c.price) {
      alert("Você não possui Fatec Coins suficientes.");
      return;
    }

    try {
      setProcessing(true);

      await purchaseCosmetic(c.cosmetic_id);

      alert(`Você comprou: ${c.description}`);
      setOwned((prev) => new Set(prev).add(c.cosmetic_id));
      setCoins((prev) => prev - c.price);

    } catch (err) {
      const alreadyOwned =
        err.message.includes("already") ||
        err.message.includes("409");

      if (alreadyOwned) {
        setOwned((prev) => new Set(prev).add(c.cosmetic_id));
        alert("Você já possui este cosmético.");
      } else {
        alert("Erro ao comprar o item.");
      }

    } finally {
      setProcessing(false);
    }
  }

  // --------------------------
  // Comprar moedas (real money)
  // --------------------------
  const coinPacks = [
    { id: 1, amount: 500, price: "R$ 4,90" },
    { id: 2, amount: 1200, price: "R$ 9,90" },
    { id: 3, amount: 3000, price: "R$ 19,90" }
  ];

  async function handleBuyCoins(amount) {
    try {
      const res = await addCoins(amount);
      setCoins(res.coins);
      alert(`Você recebeu ${amount} Fatec Coins.`);
    } catch {
      alert("Erro ao adicionar moedas.");
    }
  }

  return (
    <div className={styles.container}>
      
      {/* Saldo */}
      <div className={styles.FC_Container}>
        <h1>
          Fatec Coins:{" "}
          <span style={{ color: "var(--tertiary-color)" }}>{coins}</span>
        </h1>
      </div>

      {/* Seção: Comprar Moedas */}
      <div className={styles.CoinPacks}>
        <h2>Comprar Moedas</h2>

        <div className={styles.PackList}>
          {coinPacks.map((p) => (
            <div key={p.id} className={styles.PackCard}>
              <h3>{p.amount} FC</h3>
              <p>{p.price}</p>
              <button onClick={() => handleBuyCoins(p.amount)}>
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.Nav_Buttons_Container}>
        <ul type="none">
          {Object.entries(tabsMap).map(([key, label]) => (
            <li
              key={key}
              style={{
                border:
                  tab === key ? "solid 3px var(--tertiary-color)" : "none"
              }}
              onClick={() => setTab(key)}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Cards */}
      <div className={styles.Cards_Container}>
        {filtered.length === 0 && <p>Não há itens nessa categoria</p>}

        {filtered.map((c) => {
          const isOwned = owned.has(c.cosmetic_id);

          return (
            <div
              key={c.cosmetic_id}
              className={isOwned ? styles.ownedCard : ""}
              style={{ position: "relative" }}
            >
              {isOwned && <div className={styles.ownedTag}>Adquirido</div>}

              <Card
                titulo={c.description}
                preco={c.price}
                imagem={resolveUrl(c.link)}
                onComprar={() => handleBuy(c)}
                onImgError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.png";
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
