import { useEffect, useState } from "react";
import styles from "./Store.module.css";
import Card from "./elements/Cards/Cards";
import { getCosmetics, purchaseCosmetic } from "../../../services/storeService";

export default function Store() {
  const [loading, setLoading] = useState(true);
  const [cosmetics, setCosmetics] = useState([]);
  const [tab, setTab] = useState("ICON");
  const [processing, setProcessing] = useState(false);

  const tabsMap = {
    ICON: "Ícones",
    EFFECT: "Efeitos",
    BACKGROUND: "Backgrounds",
    SKIN: "Skins"
  };

  function resolveCosmeticUrl(link) {
    if (!link) return "/placeholder.png";
    if (link.startsWith("http")) return link;
    if (link.startsWith("/")) return link;
    return `/${link}`;
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await getCosmetics();
        setCosmetics(data.cosmetics || []);
      } catch (err) {
        console.error("[STORE] Erro ao carregar cosméticos:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Carregando Loja...</div>;

  const filtered = cosmetics.filter(c => c.type === tab);

  async function handleBuy(c) {
    if (processing) return;

    try {
      setProcessing(true);
      await purchaseCosmetic(c.cosmetic_id);

      alert(`Você comprou: ${c.description}`);

      // Remove localmente o item comprado
      setCosmetics(prev => prev.filter(x => x.cosmetic_id !== c.cosmetic_id));

    } catch (err) {
      console.error("[STORE] Erro ao comprar:", err);
      alert("Erro ao comprar o item.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.Nav_Buttons_Container}>
        <ul type="none">
          {Object.entries(tabsMap).map(([key, label]) => (
            <li
              key={key}
              style={{
                border: tab === key ? "solid 3px var(--tertiary-color)" : "none"
              }}
              onClick={() => setTab(key)}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.Cards_Container}>
        {filtered.length === 0 && <p>Não há itens nessa categoria</p>}

        {filtered.map((c) => (
          <Card
            key={c.cosmetic_id}
            titulo={c.description}
            preco={c.price}
            imagem={resolveCosmeticUrl(c.link)}
            onComprar={() => handleBuy(c)}
            onImgError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.png";
            }}
          />
        ))}
      </div>
    </div>
  );
}
