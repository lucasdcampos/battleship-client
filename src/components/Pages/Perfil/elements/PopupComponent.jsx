import React, { useState, useEffect, useRef } from 'react';
import styles from './Popup.module.css';
import Card from '../../../Cards/Card';
import { updateUser } from '../../../../services/userService';

// Ícones SVG inline
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const PopupComponent = ({ isOpen, onClose, type = 'cards', userData }) => {
  // Definir número de slots e títulos baseado no tipo
  const slotConfig = type === 'skins' 
    ? {
        count: 5,
        titles: ['Destroyer 1', 'Destroyer 2', 'Battleship', 'AircraftCarrier', 'Submarine'],
        types: ['destroyer1', 'destroyer2', 'battleship', 'aircraftCarrier', 'submarine']
      }
    : {
        count: 3,
        titles: ['Card 1', 'Card 2', 'Card 3'],
        types: ['card1', 'card2', 'card3']
      };

  const [slots, setSlots] = useState(Array(slotConfig.count).fill(null));
  const [availableItems, setAvailableItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);

  // Função para obter o prefixo do ID (tipo do item)
  const getItemPrefix = (itemId) => {
    if (!itemId) return null;
    return itemId.charAt(0);
  };

  // Função para validar se o item é compatível com o slot
  const isItemCompatibleWithSlot = (itemId, slotIndex) => {
    const prefix = getItemPrefix(itemId);
    const slotType = slotConfig.types[slotIndex];

    if (type === 'cards') {
      // Cards sempre começam com 'C'
      return prefix === 'C';
    }

    if (type === 'skins') {
      // Validação por tipo de navio
      if (slotType === 'destroyer1' || slotType === 'destroyer2') {
        return prefix === 'F'; // Destroyer
      }
      if (slotType === 'battleship') {
        return prefix === 'G'; // Battleship
      }
      if (slotType === 'aircraftCarrier') {
        return prefix === 'H'; // AircraftCarrier
      }
      if (slotType === 'submarine') {
        return prefix === 'I'; // Submarine
      }
    }

    return false;
  };

  // Função para converter item ID em objeto com informações
  const getItemObject = (itemId) => {
    if (!itemId) return null;
    
    // Aqui você pode buscar mais informações do item se necessário
    // Por enquanto, retornamos um objeto básico
    return {
      id: itemId,
      code: itemId,
      name: itemId,
      image: itemId,
      icon: itemId
    };
  };

  // Carregar dados baseado no tipo (cards ou skins)
  useEffect(() => {
    if (isOpen && userData) {
      console.log('userData:', userData);
      
      if (type === 'cards') {
        // Carregar cards disponíveis
        const userCards = userData.availableCosmetic?.availableCards || [];
        const cardsObjects = userCards.map(cardId => getItemObject(cardId));
        setAvailableItems(cardsObjects);

        // Carregar cards equipados nos slots
        const currentCards = userData.currentCosmetic?.currentCards || [];
        const newSlots = [
          currentCards[0] ? getItemObject(currentCards[0]) : null,
          currentCards[1] ? getItemObject(currentCards[1]) : null,
          currentCards[2] ? getItemObject(currentCards[2]) : null
        ];
        setSlots(newSlots);

      } else if (type === 'skins') {
        // Carregar todas as skins disponíveis
        const allSkins = [
          ...(userData.availableShipSkins?.destroyer || []).map(id => getItemObject(id)),
          ...(userData.availableShipSkins?.battleship || []).map(id => getItemObject(id)),
          ...(userData.availableShipSkins?.aircraftCarrier || []).map(id => getItemObject(id)),
          ...(userData.availableShipSkins?.submarine || []).map(id => getItemObject(id))
        ];
        setAvailableItems(allSkins);

        // Carregar skins equipadas nos slots
        const current = userData.currentCosmetic || {};
        const newSlots = [
          current.currentDestroyer ? getItemObject(current.currentDestroyer) : null,
          null, // Destroyer 2 (pode adicionar lógica futura se necessário)
          current.currentBattleship ? getItemObject(current.currentBattleship) : null,
          current.currentAircraftCarrier ? getItemObject(current.currentAircraftCarrier) : null,
          current.currentSubmarine ? getItemObject(current.currentSubmarine) : null
        ];
        setSlots(newSlots);
      }
      
      setScrollPosition(0);
    }
  }, [isOpen, type, userData]);

  // Bloquear scroll quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDragStart = (e, item, from) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
    setDraggedItem(item);
    setDraggedFrom(from);
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    setDraggedItem(null);
    setDraggedFrom(null);
    setHoveredSlot(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnSlot = (e, slotIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem) return;

    // Validar compatibilidade do item com o slot
    const itemId = draggedItem.id || draggedItem.code;
    if (!isItemCompatibleWithSlot(itemId, slotIndex)) {
      const slotType = slotConfig.types[slotIndex];
      const prefix = getItemPrefix(itemId);
      
      let expectedType = '';
      if (type === 'cards') {
        expectedType = 'Card (C)';
      } else {
        if (slotType.includes('destroyer')) expectedType = 'Destroyer (F)';
        else if (slotType === 'battleship') expectedType = 'Battleship (G)';
        else if (slotType === 'aircraftCarrier') expectedType = 'AircraftCarrier (H)';
        else if (slotType === 'submarine') expectedType = 'Submarine (I)';
      }
      
      alert(`Item incompatível! Este slot aceita apenas ${expectedType}. O item selecionado é do tipo ${prefix}.`);
      handleDragEnd(e);
      return;
    }

    const newSlots = [...slots];
    const oldItem = newSlots[slotIndex];

    // Se o item veio de outro slot, limpar o slot anterior
    if (draggedFrom?.type === 'slot') {
      newSlots[draggedFrom.index] = null;
    }

    // Colocar o novo item no slot
    newSlots[slotIndex] = draggedItem;
    setSlots(newSlots);

    // Se havia um item no slot e o item arrastado veio da lista, retornar o antigo para a lista
    if (oldItem && draggedFrom?.type === 'available') {
      setAvailableItems(prev => [...prev, oldItem]);
    }

    // Se o item veio da lista disponível, removê-lo
    if (draggedFrom?.type === 'available') {
      setAvailableItems(prev => prev.filter(item => 
        (item.id && item.id !== draggedItem.id) || 
        (item.code && item.code !== draggedItem.code) ||
        (!item.id && !item.code && item !== draggedItem)
      ));
    }

    handleDragEnd(e);
  };

  const handleDropOnAvailable = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem || draggedFrom?.type !== 'slot') return;

    // Remover do slot e adicionar à lista disponível
    const newSlots = [...slots];
    newSlots[draggedFrom.index] = null;
    setSlots(newSlots);
    setAvailableItems(prev => [...prev, draggedItem]);

    handleDragEnd(e);
  };

  const handleRemoveFromSlot = (slotIndex) => {
    const item = slots[slotIndex];
    if (!item) return;

    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setAvailableItems(prev => [...prev, item]);
  };

  const handleSave = async () => {
    try {
      const userId = userData?.basicData?.id || "1";
      
      if (type === 'cards') {
        // Salvar configuração de cards
        const currentCards = slots.map(slot => slot ? (slot.id || slot.code) : null).filter(Boolean);
        
        // Atualizar dados localmente (sem backend por enquanto)
        if (userData.currentCosmetic) {
          userData.currentCosmetic.currentCards = currentCards;
        }
        
        console.log('Cards salvos:', currentCards);
        console.log('Dados atualizados localmente:', userData);
        
        // Tentar atualizar no backend (se disponível)
        try {
          await updateUser(userId, {
            currentCosmetic: {
              ...userData.currentCosmetic,
              currentCards: currentCards
            }
          });
        } catch (backendError) {
          console.warn('Backend não disponível, dados salvos apenas localmente:', backendError.message);
        }
        
        alert('Cards salvos com sucesso!');
        
      } else if (type === 'skins') {
        // Salvar configuração de skins
        const updateData = {
          currentDestroyer: slots[0] ? (slots[0].id || slots[0].code) : userData?.currentCosmetic?.currentDestroyer,
          currentBattleship: slots[2] ? (slots[2].id || slots[2].code) : userData?.currentCosmetic?.currentBattleship,
          currentAircraftCarrier: slots[3] ? (slots[3].id || slots[3].code) : userData?.currentCosmetic?.currentAircraftCarrier,
          currentSubmarine: slots[4] ? (slots[4].id || slots[4].code) : userData?.currentCosmetic?.currentSubmarine
        };
        
        // Atualizar dados localmente (sem backend por enquanto)
        if (userData?.currentCosmetic) {
          Object.assign(userData.currentCosmetic, updateData);
        }
        
        console.log('Skins salvas:', updateData);
        console.log('Dados atualizados localmente:', userData);
        
        // Tentar atualizar no backend (se disponível)
        try {
          await updateUser(userId, {
            currentCosmetic: {
              ...userData.currentCosmetic,
              ...updateData
            }
          });
        } catch (backendError) {
          console.warn('Backend não disponível, dados salvos apenas localmente:', backendError.message);
        }
        
        alert('Skins salvas com sucesso!');
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar configuração. Tente novamente.');
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current 
    ? scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
    : false;

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBackdrop} onClick={onClose} />
      
      <div className={styles.popupContainer}>
        {/* Header */}
        <div className={styles.popupHeader}>
          <h2 className={styles.popupTitle}>
            {type === 'cards' ? 'Cards' : 'Skins'}
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fechar"
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div className={styles.popupContent}>
          {/* Slots Section */}
          <div className={styles.slotsSection}>
            <div className={styles.slotsGrid}>
              {slots.map((item, index) => (
                <div key={index} className={styles.slotWrapper}>
                  <div className={styles.slotTitle}>{slotConfig.titles[index]}</div>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSlot(e, index)}
                    onDragEnter={() => setHoveredSlot(index)}
                    onDragLeave={() => setHoveredSlot(null)}
                    className={`${styles.slot} ${
                      hoveredSlot === index ? styles.slotHovered : ''
                    }`}
                  >
                    {item ? (
                      <div className={styles.slotContent}>
                        <button
                          onClick={() => handleRemoveFromSlot(index)}
                          className={styles.removeButton}
                          title="Remover"
                        >
                          <XIcon />
                        </button>
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, item, { type: 'slot', index })}
                          onDragEnd={handleDragEnd}
                          className={`${styles.cardWrapper} ${
                            draggedItem?.id === item.id || draggedItem?.code === item.code 
                              ? styles.dragging 
                              : ''
                          }`}
                        >
                          <Card 
                            image={item.image || item.icon} 
                            title={item.name || item.title || item.code} 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={styles.slotEmpty}>
                        <div className={styles.slotEmptyIcon}>+</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Items Section */}
          <div className={styles.availableSection}>
            <div className={styles.scrollContainer}>
              {/* Seta Esquerda */}
              {canScrollLeft && (
                <button 
                  className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
                  onClick={scrollLeft}
                  aria-label="Rolar para esquerda"
                >
                  <ChevronLeftIcon />
                </button>
              )}

              {/* Grid de Cards com Scroll */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                onDragOver={handleDragOver}
                onDrop={handleDropOnAvailable}
                className={styles.availableGrid}
              >
                {availableItems.length > 0 ? (
                  availableItems.map((item, idx) => (
                    <div
                      key={item.id || item.code || idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, { type: 'available' })}
                      onDragEnd={handleDragEnd}
                      className={`${styles.cardWrapper} ${
                        draggedItem?.id === item.id || draggedItem?.code === item.code 
                          ? styles.dragging 
                          : ''
                      }`}
                    >
                      <Card 
                        image={item.image || item.icon} 
                        title={item.name || item.title || item.code} 
                      />
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>Nenhum item disponível</p>
                  </div>
                )}
              </div>

              {/* Seta Direita */}
              {canScrollRight && (
                <button 
                  className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
                  onClick={scrollRight}
                  aria-label="Rolar para direita"
                >
                  <ChevronRightIcon />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.popupFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupComponent;