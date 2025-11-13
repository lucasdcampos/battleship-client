import { useEffect, useState, useRef } from "react";
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

  const carouselRef = useRef(null); // Ref direta no wrapper do carrossel

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
        setOwned(new Set(userCosRes.cosmetics?.map(c => c.cosmetic_id) || []));
        setCoins(meRes.coins ?? 0);
      } catch (err) {
        console.error("[STORE] Erro ao carregar:", err);
        alert("Erro ao carregar a loja. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className={styles.container} style={{ minHeight: "60vh", justifyContent: "center" }}>
        <p>Carregando Loja...</p>
      </div>
    );
  }

  const filtered = cosmetics.filter(c => c.type === tab);

  const handleBuy = async (c) => {
    if (processing || owned.has(c.cosmetic_id)) return;
    if (coins < c.price) {
      alert("Você não possui Fatec Coins suficientes.");
      return;
    }

    try {
      setProcessing(true);
      await purchaseCosmetic(c.cosmetic_id);
      alert(`Você comprou: ${c.description}`);
      setOwned(prev => new Set(prev).add(c.cosmetic_id));
      setCoins(prev => prev - c.price);
    } catch (err) {
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("already") || msg.includes("409") || err.status === 409) {
        setOwned(prev => new Set(prev).add(c.cosmetic_id));
        alert("Você já possui este cosmético.");
      } else {
        alert("Erro ao comprar o item. Tente novamente.");
      }
    } finally {
      setProcessing(false);
    }
  };

  const coinPacks = [
    { id: 1, amount: 500, price: "R$ 4,90" },
    { id: 2, amount: 1200, price: "R$ 9,90" },
    { id: 3, amount: 3000, price: "R$ 19,90" }
  ];

  const handleBuyCoins = async (amount) => {
    if (processing) return;
    try {
      setProcessing(true);
      const res = await addCoins(amount);
      setCoins(res.coins);
      alert(`Você recebeu ${amount} Fatec Coins.`);
    } catch {
      alert("Erro ao comprar moedas.");
    } finally {
      setProcessing(false);
    }
  };

  const scrollByAmount = (delta) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: delta,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className={styles.container}>
      {/* Saldo */}
      <div className={styles.FC_Container}>
        ⚓ Fatec Coins: <span style={{ color: "var(--tertiary-color)" }}>{coins}</span>
      </div>

      {/* Comprar Moedas */}
      <div className={styles.CoinPacks}>
        <div className={styles.PackList}>
          {coinPacks.map(p => (
            <div key={p.id} className={styles.PackCard}>
              <h3>{p.amount} FC</h3>
              <p>{p.price}</p>
              <button
                onClick={() => handleBuyCoins(p.amount)}
                disabled={processing}
              >
                {processing ? "⋯" : "Comprar"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.Nav_Buttons_Container}>
        <ul>
          {Object.entries(tabsMap).map(([key, label]) => (
            <li
              key={key}
              aria-selected={tab === key}
              onClick={() => !processing && setTab(key)}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Carrossel */}
      <div className={styles.Carousel_Container}>
        <button
          className={`${styles.Carousel_Button} ${styles.prev}`}
          onClick={() => scrollByAmount(-240)}
          aria-label="Anterior"
          disabled={processing}
        >
          ‹
        </button>

        <div ref={carouselRef} className={styles.Carousel_Wrapper}>
          {filtered.length === 0 ? (
            <div style={{
              padding: "30px 20px",
              color: "#aaa",
              textAlign: "center",
              minWidth: "100%"
            }}>
              Nenhum item disponível nesta categoria.
            </div>
          ) : (
            filtered.map(c => {
              const isOwned = owned.has(c.cosmetic_id);
              return (
                <div
                  key={c.cosmetic_id}
                  className={`${styles.Card_Wrapper} ${isOwned ? styles.ownedCard : ""}`}
                >
                  {isOwned && <div className={styles.ownedTag}>Adquirido</div>}
                  <Card
                    titulo={c.description}
                    preco={c.price}
                    imagem={resolveUrl(c.link)}
                    onComprar={() => handleBuy(c)}
                    onImgError={e => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png";
                    }}
                  />
                </div>
              );
            })
          )}
        </div>

        <button
          className={`${styles.Carousel_Button} ${styles.next}`}
          onClick={() => scrollByAmount(240)}
          aria-label="Próximo"
          disabled={processing}
        >
          ›
        </button>
      </div>
    </div>
  );
}