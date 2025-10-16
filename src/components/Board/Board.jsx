import React, { forwardRef } from 'react';
import styles from './Board.module.css';

const Board = forwardRef(({ children, onCellClick, shots = [] }, ref) => {
    const rows = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const cols = ['0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const getCellClassName = (index, shot) => {
        let classNames = [styles.cell];
        switch (index) {
            case 0:
                classNames.push(styles['left-top']);
                break;
            case 10:
                classNames.push(styles['right-top']);
                break;
            case 110:
                classNames.push(styles['left-bottom']);
                break;
            case 120:
                classNames.push(styles['right-bottom']);
                break;
        }
        if (shot) {
            classNames.push(shot.isHit ? styles.hit : styles.miss);
        }
        return classNames.join(' ');
    };

    const getCellContent = (index, shot) => {
        if (index === 0) return '';
        if (index < 11) return cols[index];
        if (index % 11 === 0) return rows[Math.floor(index / 11)];
        if (shot) return 'X';
        return '';
    };

  const handleCellClick = (i) => {
        if (!onCellClick) return;

        const x = (i % 11) - 1;
        const y = Math.floor(i / 11) - 1;

        // Ignora cliques nos cabeçalhos
        if (x < 0 || y < 0) return;

        onCellClick(x, y);
    };
  
    return(
        <div className={styles.board}>
            <div className={styles["board-background"]}>                <div className={styles["board-table"]} ref={ref}>
                    {[...Array(121)].map((_, i) => {
                        const x = (i % 11) - 1;
                        const y = Math.floor(i / 11) - 1;
                        let shot = shots.find(s => s.x === x && s.y === y);

                        // Verifica se a célula está ocupada por um navio afundado
                        if (children && children.props && children.props.ref && children.props.ref.current) {
                            const ships = children.props.ref.current.getShips();
                            const isOccupiedBySunkShip = ships.some(ship => {
                                if (!ship.isSunk) return false;
                                return Array.from({ length: ship.size }).some((_, partIndex) => {
                                    const partX = ship.rotation === 0 ? ship.gridX + partIndex : ship.gridX;
                                    const partY = ship.rotation === 0 ? ship.gridY : ship.gridY + partIndex;
                                    return partX === x && partY === y;
                                });
                            });

                            if (isOccupiedBySunkShip) {
                                shot = null; // Remove o tiro para não renderizar o efeito
                            }
                        }

                        return (
                            <div key={i} className={getCellClassName(i, shot)} onClick={() => handleCellClick(i)}>
                                {getCellContent(i, shot)}
                                {shot && shot.isHit ? (
                                    <div className={styles.explosion}></div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
            {children}        </div>
    )
});

export default Board;