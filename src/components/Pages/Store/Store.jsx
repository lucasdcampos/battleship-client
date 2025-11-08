import { useEffect, useState } from "react";
import styles from "./Store.module.css";
import Card from "./elements/Cards/Cards";
import { getCosmetics } from "../../../services/storeService";

export default function Store() {
  const [loading, setLoading] = useState(true);
  const [cosmetics, setCosmetics] = useState([]);
  const [tab, setTab] = useState("ICON");

  const tabsMap = {
    ICON: "Ícones",
    EFFECT: "Efeitos",
    BACKGROUND: "Backgrounds",
    SKIN: "Skins"
  };

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
            imagem={c.link}
            onComprar={() => alert(`Comprar ${c.description}`)}
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
