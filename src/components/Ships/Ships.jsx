import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./Ships.module.css";
import ship5Img from "../../assets/ships/porta-avioes/default.png";
import ship4Img from "../../assets/ships/encouracado/default.png";
import ship3Img from "../../assets/ships/submarino/default.png";
import ship2Img from "../../assets/ships/destroier/default.png";
import ship1Img from "../../assets/ships/destroier/default.png";

const initialShips = [
  {
    id: "ship5",
    size: 5,
    name: "Porta-Aviões",
    img: ship5Img,
    top: 0,
    left: 0,
    rotation: 0,
    isDragging: false,
    isPlaced: false,
    gridX: null,
    gridY: null,
    alive: true,
    isHidden: false,
    hits: [], // Array para rastrear as coordenadas dos acertos
    isSunk: false, // Novo estado para controlar se o navio afundou
  },
  {
    id: "ship4",
    size: 4,
    name: "Encouraçado",
    img: ship4Img,
    top: 40,
    left: 0,
    rotation: 0,
    isDragging: false,
    isPlaced: false,
    gridX: null,
    gridY: null,
    alive: true,
    isHidden: false,
    hits: [],
    isSunk: false,
  },
  {
    id: "ship3",
    size: 3,
    name: "Submarino",
    img: ship3Img,
    top: 80,
    left: 0,
    rotation: 0,
    isDragging: false,
    isPlaced: false,
    gridX: null,
    gridY: null,
    alive: true,
    isHidden: false,
    hits: [],
    isSunk: false,
  },
  {
    id: "ship2",
    size: 2,
    name: "Destroier",
    img: ship2Img,
    top: 120,
    left: 0,
    rotation: 0,
    isDragging: false,
    isPlaced: false,
    gridX: null,
    gridY: null,
    alive: true,
    isHidden: false,
    hits: [],
    isSunk: false,
  },
  {
    id: "ship1",
    size: 2,
    name: "Destroier",
    img: ship1Img,
    top: 160,
    left: 0,
    rotation: 0,
    isDragging: false,
    isPlaced: false,
    gridX: null,
    gridY: null,
    alive: true,
    isHidden: false,
    hits: [],
    isSunk: false,
  },
];

const CELL_SIZE = 31.81;

const Ships = forwardRef(({ boardRef, isLocked = false, areShipsHidden = false }, ref) => {
  const [ships, setShips] = useState(
    initialShips.map((ship) => ({ ...ship, isHidden: areShipsHidden }))
  );
  const [draggingShip, setDraggingShip] = useState(null);
  const [selectedShipId, setSelectedShipId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [originalPosition, setOriginalPosition] = useState({ top: 0, left: 0 });

  // Função para verificar a sobreposição entre dois navios
  const isOverlapping = (ship1, ship2) => {
    const ship1Right = ship1.gridX + (ship1.rotation === 0 ? ship1.size : 1);
    const ship1Bottom = ship1.gridY + (ship1.rotation === 0 ? 1 : ship1.size);
    const ship2Right = ship2.gridX + (ship2.rotation === 0 ? ship2.size : 1);
    const ship2Bottom = ship2.gridY + (ship2.rotation === 0 ? 1 : ship2.size);

    // Verifica se os retângulos se interceptam
    return (
      ship1.gridX < ship2Right &&
      ship1Right > ship2.gridX &&
      ship1.gridY < ship2Bottom &&
      ship1Bottom > ship2.gridY
    );
  };

  // Função para validar se uma posição de navio é válida (limites e colisão)
  const isPositionValid = (shipToValidate, allShips) => {
    const shipCellsWidth =
      shipToValidate.rotation === 0 ? shipToValidate.size : 1;
    const shipCellsHeight =
      shipToValidate.rotation === 0 ? 1 : shipToValidate.size;

    // 1. Validação de limites do tabuleiro (grid de 10x10, índices 0-9)
    if (
      shipToValidate.gridX < 0 ||
      shipToValidate.gridY < 0 ||
      shipToValidate.gridX + shipCellsWidth > 10 ||
      shipToValidate.gridY + shipCellsHeight > 10
    ) {
      return false; // Fora dos limites
    }

    // 2. Validação de colisão
    const collision = allShips.some((otherShip) => {
      if (otherShip.id === shipToValidate.id || !otherShip.isPlaced)
        return false;
      return isOverlapping(shipToValidate, otherShip);
    });

    return !collision;
  };
  const handleMouseDown = (e, shipId) => {
    if (isLocked) return;

    if (e.button !== 0) return; // Apenas botão esquerdo

    const ship = ships.find((s) => s.id === shipId);
    if (!ship) return;

    setSelectedShipId(shipId);
    const shipElement = document.getElementById(shipId);
    const rect = shipElement.getBoundingClientRect();

    setDraggingShip(shipId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setOriginalPosition({ top: ship.top, left: ship.left });

    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isLocked) return;

      if (!draggingShip) return;

      setShips((prevShips) =>
        prevShips.map((s) =>
          s.id === draggingShip
            ? {
                ...s,
                isDragging: true,
                top: e.clientY - dragOffset.y,
                left: e.clientX - dragOffset.x,
              }
            : s
        )
      );
    },
    [draggingShip, dragOffset, isLocked]
  );

  const handleMouseUp = useCallback(() => {
    if (isLocked) return;

    if (!draggingShip) return;

    setShips((prevShips) =>
      prevShips.map((s) => {
        if (s.id === draggingShip) {
          // Lógica de '''snap-to-grid'''
          const boardElement = boardRef.current;
          if (!boardElement) {
            return { ...s, isDragging: false }; // Não faz snap se o tabuleiro não for encontrado
          }

          const boardRect = boardElement.getBoundingClientRect();

          // Posição relativa do canto superior esquerdo do navio em relação ao tabuleiro
          const shipLeft = s.left;
          const shipTop = s.top;

          // Dimensões do navio em células
          const shipCellsWidth = s.rotation === 0 ? s.size : 1;
          const shipCellsHeight = s.rotation === 0 ? 1 : s.size;

          // Dimensões do navio em pixels
          const shipPixelWidth = shipCellsWidth * CELL_SIZE;
          const shipPixelHeight = shipCellsHeight * CELL_SIZE;

          // Define a área jogável (grid 10x10), que começa após os cabeçalhos
          const playableAreaLeft = boardRect.left + CELL_SIZE;
          const playableAreaTop = boardRect.top + CELL_SIZE;
          const playableAreaRight = boardRect.left + 11 * CELL_SIZE;
          const playableAreaBottom = boardRect.top + 11 * CELL_SIZE;

          // Verifica se o navio está totalmente dentro da área jogável
          const isWithinBounds =
            shipLeft >= playableAreaLeft &&
            shipTop >= playableAreaTop &&
            shipLeft + shipPixelWidth <= playableAreaRight &&
            shipTop + shipPixelHeight <= playableAreaBottom;

          if (isWithinBounds) {
            // Posição relativa do canto do navio dentro da área de jogo (grid 10x10)
            const relativeX = shipLeft - (boardRect.left + CELL_SIZE);
            const relativeY = shipTop - (boardRect.top + CELL_SIZE);

            // Calcula a célula do grid mais próxima
            const snappedGridX = Math.round(relativeX / CELL_SIZE);
            const snappedGridY = Math.round(relativeY / CELL_SIZE);

            // Posição e dimensões do navio em coordenadas de grid
            const newShipPosition = {
              ...s,
              gridX: snappedGridX,
              gridY: snappedGridY,
            };

            // Verifica a sobreposição com outros navios já no tabuleiro
            const collision = prevShips.some((otherShip) => {
              if (otherShip.id === s.id || !otherShip.isPlaced) return false;
              return isOverlapping(newShipPosition, otherShip);
            });

            if (!collision) {
              const snappedLeft =
                snappedGridX * CELL_SIZE + CELL_SIZE;
              const snappedTop = snappedGridY * CELL_SIZE + CELL_SIZE;
              return { ...s, isDragging: false, top: snappedTop, left: snappedLeft, isPlaced: true, gridX: snappedGridX, gridY: snappedGridY };
            }
          }

          // Se estiver fora dos limites, retorna para a posição original
          return {
            ...s,
            isDragging: false,
            top: originalPosition.top,
            left: originalPosition.left,
            isPlaced: s.isPlaced,
            gridX: s.gridX,
            gridY: s.gridY,
          };
        }
        return s;
      })
    );

    setDraggingShip(null);
  }, [draggingShip, boardRef, originalPosition, isLocked]);

  const handleContextMenu = (e, shipId) => {
    if (isLocked) return;

    e.preventDefault();

    const ship = ships.find((s) => s.id === shipId);
    if (!ship || !ship.isPlaced) return;

    const newRotation = (ship.rotation + 90) % 180;
    const rotatedShip = { ...ship, rotation: newRotation };

    if (isPositionValid(rotatedShip, ships)) {
      setShips((prevShips) =>
        prevShips.map((s) => (s.id === shipId ? rotatedShip : s))
      );
    }
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (isLocked) return;

      if (!selectedShipId) return;

      const ship = ships.find((s) => s.id === selectedShipId);
      // Só permite mover com o teclado se o navio já estiver no tabuleiro.
      if (!ship || !ship.isPlaced) return;

      const direction = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      }[e.key];

      if (direction) {
        e.preventDefault();
        const newGridX = ship.gridX + direction.x;
        const newGridY = ship.gridY + direction.y;
        const newPosition = { ...ship, gridX: newGridX, gridY: newGridY };

        if (isPositionValid(newPosition, ships)) {
          // Atualiza a posição do navio se o movimento for válido
          setShips((prevShips) =>
            prevShips.map((s) => {
              if (s.id === selectedShipId) {
                const newLeft = (newGridX * CELL_SIZE) + CELL_SIZE;
                const newTop = (newGridY * CELL_SIZE) + CELL_SIZE;
                return { ...s, gridX: newGridX, gridY: newGridY, top: newTop, left: newLeft };
              }
              return s;
            })
          );
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const newRotation = (ship.rotation + 90) % 180;
        const rotatedShip = { ...ship, rotation: newRotation };

        if (isPositionValid(rotatedShip, ships)) {
          setShips((prevShips) =>
            prevShips.map((s) => (s.id === selectedShipId ? rotatedShip : s))
          );
        }
      }
    },
    [selectedShipId, ships, boardRef, isPositionValid]
  );

  const placeShipsRandomly = useCallback(() => {
    if (!boardRef.current) return;

    setShips((currentShips) => {
      const placedShips = [];
      const newShips = currentShips.map((ship) => {
        let tempShip;
        let validPositionFound = false;
        let attempts = 0;

        while (!validPositionFound && attempts < 100) {
          attempts++;

          const randomRotation = Math.random() < 0.5 ? 0 : 90;
          const shipCellsWidth = randomRotation === 0 ? ship.size : 1;
          const shipCellsHeight = randomRotation === 0 ? 1 : ship.size;

          const maxX = 10 - shipCellsWidth;
          const maxY = 10 - shipCellsHeight;

          const randomGridX = Math.floor(Math.random() * (maxX + 1));
          const randomGridY = Math.floor(Math.random() * (maxY + 1));

          tempShip = {
            ...ship,
            rotation: randomRotation,
            gridX: randomGridX,
            gridY: randomGridY,
          };

          const collision = placedShips.some((placed) =>
            isOverlapping(tempShip, placed)
          );

          if (!collision) {
            validPositionFound = true;
            const finalShip = {
              ...tempShip,
              top: randomGridY * CELL_SIZE + CELL_SIZE,
              left: randomGridX * CELL_SIZE + CELL_SIZE,
              isPlaced: true,
              isHidden: ship.isHidden, // Mantém a propriedade isHidden
            };
            placedShips.push(finalShip);
            return finalShip;
          }
        }
        return ship; // Retorna o navio original se não encontrar posição
      });
      return newShips;
    });
  }, [boardRef]);

  useImperativeHandle(ref, () => ({
    randomize: placeShipsRandomly,
    getShipPositions: () => {
      // Retorna posições e informações dos navios
      const positions = {};
      ships.forEach((ship) => {
        if (ship.isPlaced) {
          positions[ship.id] = { ...ship, cells: [] };
          for (let i = 0; i < ship.size; i++) {
            if (ship.rotation === 0) {
              // Horizontal
              positions.push({ x: ship.gridX + i, y: ship.gridY });
            } else {
              // Vertical
              positions.push({ x: ship.gridX, y: ship.gridY + i });
            }
          }
        }
      });
      return positions;
    },
    getShips: () => ships, // Expõe o estado atual dos navios
    registerHit: (x, y) => {
      let hitShipId = null;
      const newShips = ships.map(ship => {
        const isPartOfShip = ship.isPlaced && Array.from({ length: ship.size }).some((_, i) =>
          ship.rotation === 0
            ? ship.gridX + i === x && ship.gridY === y
            : ship.gridX === x && ship.gridY + i === y
        );

        if (isPartOfShip) {
          hitShipId = ship.id;
          const newHits = [...ship.hits, { x, y }];
          const isSunk = newHits.length === ship.size;
          return { ...ship, hits: newHits, isSunk: isSunk };
        }
        return ship;
      });
      setShips(newShips);
      return hitShipId; // Retorna o ID do navio atingido
    },
    revealShip: (x, y) => {
      setShips((prevShips) =>
        prevShips.map((ship) => {
          const isPartOfShip = () => {
            if (!ship.isPlaced) return false;
            for (let i = 0; i < ship.size; i++) {
              if (ship.rotation === 0) {
                if (ship.gridX + i === x && ship.gridY === y) return true;
              } else {
                if (ship.gridX === x && ship.gridY + i === y) return true;
              }
            }
            return false;
          };

          if (isPartOfShip()) {
            return { ...ship, isHidden: false };
          }
          return ship;
        })
      );
    },
  }));

  // Posiciona os navios aleatoriamente no tabuleiro ao carregar
  useEffect(() => {
    if (!isLocked) {
      placeShipsRandomly();
    }
  }, [placeShipsRandomly, isLocked]); // Executa quando o boardRef estiver disponível

  useEffect(() => {
    if (draggingShip) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    const handleGlobalKeyDown = (e) => handleKeyDown(e);
    if (selectedShipId) {
      window.addEventListener("keydown", handleGlobalKeyDown);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [
    draggingShip,
    handleMouseMove,
    handleMouseUp,
    selectedShipId,
    handleKeyDown,
    boardRef,
  ]);

  return (
    <div className={styles.ships}>
      {ships.map(
        (ship) =>
          (!ship.isHidden || ship.isSunk) && ( // Mostra o navio se não estiver escondido OU se estiver afundado
            <div
              key={ship.id}
              id={ship.id}
              className={`${styles.ship} ${
                ship.isDragging && !isLocked ? styles.dragging : ""
              } ${
                ship.id === selectedShipId && !isLocked ? styles.selected : ""
              } ${isLocked ? styles.locked : ""}`}
              style={{
                top: ship.top,
                left: ship.left,
                "--ship-size": ship.size,
                transform: `rotate(${ship.rotation}deg)`,
              }}
              onMouseDown={(e) => handleMouseDown(e, ship.id)}
              onContextMenu={(e) => handleContextMenu(e, ship.id)}
            >
              <img
                src={ship.img}
                alt={`Ship ${ship.size}`}
                className={styles.shipImage}
              />
            </div>
          )
      )}
    </div>
  );
});

export default Ships;