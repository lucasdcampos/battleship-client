import { useState } from "react";
import styles from "./CosmeticsModal.module.css";

export default function CosmeticsModal({ open, onClose, cosmetics }) {
  const [tab, setTab] = useState("ICON");

  const tabs = ["ICON", "BACKGROUND", "EFFECT", "SKIN", "CARD"];
  const names = {
    ICON: "Ícones",
    BACKGROUND: "Backgrounds",
    EFFECT: "Efeitos",
    SKIN: "Skins",
    CARD: "Cards",
  };

  // ✅ Garante que sempre será array
  const safeCosmetics = Array.isArray(cosmetics)
    ? cosmetics
    : Array.from(cosmetics ?? []);

  const filtered = safeCosmetics.filter((c) => c.type === tab);

  const resolveImg = (c) => {
    if (!c.link) return "/placeholder.png";
    if (c.link.startsWith("http") || c.link.startsWith("/")) return c.link;
    return "/" + c.link;
  };

  if (!open) return null;

  return (
    <div className={styles.Overlay}>
      <div className={styles.Modal}>
        <div className={styles.Header}>
          <h2>Meus Cosméticos</h2>
          <button onClick={onClose} className={styles.Close}>X</button>
        </div>

        <div className={styles.Tabs}>
          {tabs.map((t) => (
            <button
              key={t}
              className={tab === t ? styles.ActiveTab : styles.Tab}
              onClick={() => setTab(t)}
            >
              {names[t]}
            </button>
          ))}
        </div>

        <div className={styles.Grid}>
          {filtered.length === 0 ? (
            <p className={styles.Empty}>Nenhum cosmético desse tipo.</p>
          ) : (
            filtered.map((c) => (
              <div key={c.cosmetic_id} className={styles.Item}>
                <img
                  src={resolveImg(c)}
                  alt={c.description}
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
                <span>{c.description}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
