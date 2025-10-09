import React, { useEffect, useState } from 'react';
import styles from './EmojiAnimation.module.css';

const EmojiAnimation = ({ emoji, onAnimationEnd }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (emoji) {
            setVisible(true);
            // Define um timer para esconder a animação após 3 segundos
            const timer = setTimeout(() => {
                setVisible(false);
                if (onAnimationEnd) {
                    onAnimationEnd(); // Limpa o estado no componente pai
                }
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [emoji, onAnimationEnd]);

    if (!visible || !emoji) return null;

    return <img src={emoji.animated} alt="Emoji Animation" className={styles.animatedEmoji} />;
};

export default EmojiAnimation;