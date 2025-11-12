import { useEffect, useState } from "react";
import styles from "./Popup.module.css";
import { updateUserConfig } from "../../../../services/userService";
import { useUser } from "../../../../hooks/useUser";

export default function PopupComponent({ isOpen, onClose, type }) {
  const { ownedCosmetics, config, refresh } = useUser();

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    if (!config) return;

    // Seleciona automaticamente o cosmético já equipado
    if (type === "ICON") setSelected(config.enabled_icon || null);
    if (type === "BACKGROUND") setSelected(config.enabled_background || null);
    if (type === "EFFECT") setSelected(config.enabled_effect || null);
    if (type === "SKIN") setSelected(config.enabled_skin || null);
  }, [isOpen, config, type]);

  if (!isOpen) return null;

  // Filtrar cosméticos do tipo selecionado
  const items = [...ownedCosmetics].filter((c) => c.type === type);

  async function handleSave() {
    if (!selected) {
      alert("Selecione um item.");
      return;
    }

    const payload = {};

    if (type === "ICON") payload.enabled_icon = selected;
    if (type === "BACKGROUND") payload.enabled_background = selected;
    if (type === "EFFECT") payload.enabled_effect = selected;
    if (type === "SKIN") payload.enabled_skin = selected;

    await updateUserConfig(null, payload);
    await refresh();

    onClose();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2>
            {type === "ICON" && "Ícones"}
            {type === "BACKGROUND" && "Backgrounds"}
            {type === "EFFECT" && "Efeitos"}
            {type === "SKIN" && "Skins"}
          </h2>
          <button className={styles.close} onClick={onClose}>X</button>
        </div>

        <div className={styles.content}>
          {items.length === 0 && <p>Você não possui itens deste tipo.</p>}

          <div className={styles.grid}>
            {items.map((item) => (
              <div
                key={item.cosmetic_id}
                className={`${styles.item} ${
                  selected === item.link ? styles.selected : ""
                }`}
                onClick={() => setSelected(item.link)}
              >
                <img
                  src={item.link}
                  alt={item.description}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>Cancelar</button>
          <button className={styles.save} onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
