import React from 'react';
import styles from './EmojiBox.module.css';

// Importando as imagens estáticas e animadas
import smileStatic from '../../assets/emojis/static/smile.svg';
import smileAnimated from '../../assets/emojis/animated/smile.gif';
import laughStatic from '../../assets/emojis/static/laugh.svg';
import laughAnimated from '../../assets/emojis/animated/laugh.gif';
import surprisedStatic from '../../assets/emojis/static/surprised.svg';
import surprisedAnimated from '../../assets/emojis/animated/surprised.gif';
import rageStatic from '../../assets/emojis/static/rage.svg';
import rageAnimated from '../../assets/emojis/animated/rage.gif';
import fireStatic from '../../assets/emojis/static/fire.svg';
import fireAnimated from '../../assets/emojis/animated/fire.gif';
import likeStatic from '../../assets/emojis/static/like.svg';
import likeAnimated from '../../assets/emojis/animated/like.gif';

// Lista de emojis usando as imagens importadas
const emojis = [
    { id: 'smile', static: smileStatic, animated: smileAnimated },
    { id: 'laugh', static: laughStatic, animated: laughAnimated },
    { id: 'surprised', static: surprisedStatic, animated: surprisedAnimated },
    { id: 'rage', static: rageStatic, animated: rageAnimated },
    { id: 'fire', static: fireStatic, animated: fireAnimated },
    { id: 'like', static: likeStatic, animated: likeAnimated },
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