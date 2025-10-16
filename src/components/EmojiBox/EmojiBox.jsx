import React from 'react';
import styles from './EmojiBox.module.css';

// Em um cenário real, os emojis viriam de uma configuração ou do backend.
// Por enquanto, vamos usar os ícones e efeitos que já temos como exemplo.
const emojis = [
    { id: 'smile', static: './src/assets/emojis/static/smile.svg', animated: './src/assets/emojis/animated/smile.gif' }, // Exemplo existente
    { id: 'laugh', static: './src/assets/emojis/static/laugh.svg', animated: './src/assets/emojis/animated/laugh.gif' },
    { id: 'surprised', static: './src/assets/emojis/static/surprised.svg', animated: './src/assets/emojis/animated/surprised.gif' }, // Usando assets de exemplo
    { id: 'rage', static: './src/assets/emojis/static/rage.svg', animated: './src/assets/emojis/animated/rage.gif' }, // Usando assets de exemplo
    { id: 'fire', static: './src/assets/emojis/static/fire.svg', animated: './src/assets/emojis/animated/fire.gif' }, // Usando assets de exemplo
    { id: 'like', static: './src/assets/emojis/static/like.svg', animated: './src/assets/emojis/animated/like.gif' }, // Novo ícone de exemplo
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