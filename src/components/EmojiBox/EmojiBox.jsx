import React from 'react';
import styles from './EmojiBox.module.css';

// Em um cenário real, os emojis viriam de uma configuração ou do backend.
// Por enquanto, vamos usar os ícones e efeitos que já temos como exemplo.
const emojis = [
    { id: 'laugh', static: '/src/assets/icons/perfil_icon.png', animated: '/src/assets/effects/explosion.gif' },
    // Adicione mais emojis aqui conforme necessário
    // { id: 'cry', static: '/path/to/cry_static.png', animated: '/path/to/cry_animated.gif' },
];

const EmojiBox = ({ onEmojiSelect }) => {
    const handleEmojiClick = (emoji) => {
        if (onEmojiSelect) {
            onEmojiSelect(emoji);
        }
    };

    return (
        <div className={styles.emojiBoxContainer}>
            {emojis.map((emoji) => (
                <button
                    key={emoji.id}
                    className={styles.emojiButton}
                    onClick={() => handleEmojiClick(emoji)}
                >
                    <img src={emoji.static} alt={emoji.id} className={styles.emojiIcon} />
                </button>
            ))}
        </div>
    );
};

export default EmojiBox;