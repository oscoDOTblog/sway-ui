'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { teamMembers } from '../data/team';
import styles from './PersonaMenu.module.css';

const PersonaMenu = () => {
  const [currentPage, setCurrentPage] = useState(1); // 1: Team List, 2: Character Details, 3: Stats
  const [selectedCharacter, setSelectedCharacter] = useState(teamMembers[0]);
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);

  const handleCharacterSelect = (character, index) => {
    setSelectedCharacter(character);
    setSelectedCharacterIndex(index);
    setCurrentPage(2);
  };

  const handleStatsView = () => {
    setCurrentPage(3);
  };

  const handleBack = () => {
    if (currentPage === 3) {
      setCurrentPage(2);
    } else if (currentPage === 2) {
      setCurrentPage(1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (currentPage === 1) {
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            setSelectedCharacterIndex(prev => 
              prev > 0 ? prev - 1 : teamMembers.length - 1
            );
            break;
          case 'ArrowDown':
            event.preventDefault();
            setSelectedCharacterIndex(prev => 
              prev < teamMembers.length - 1 ? prev + 1 : 0
            );
            break;
          case 'Enter':
            event.preventDefault();
            handleCharacterSelect(teamMembers[selectedCharacterIndex], selectedCharacterIndex);
            break;
          case 'Escape':
            event.preventDefault();
            setCurrentPage(1);
            break;
        }
      } else if (currentPage === 2) {
        switch (event.key) {
          case 's':
          case 'S':
            event.preventDefault();
            handleStatsView();
            break;
          case 'Escape':
            event.preventDefault();
            handleBack();
            break;
        }
      } else if (currentPage === 3) {
        switch (event.key) {
          case 'Escape':
            event.preventDefault();
            handleBack();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, selectedCharacterIndex, handleCharacterSelect, handleStatsView, handleBack]);

  const renderTeamList = () => (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleBanner}>
          <span className={styles.titleText}>The Phantoms</span>
        </div>
        <div className={styles.navButtons}>
          <div className={styles.navButton}>
            <span className={styles.buttonIcon}>L1</span>
            <span className={styles.buttonText}>Stats</span>
          </div>
          <div className={styles.navButton}>
            <span className={styles.buttonIcon}>R1</span>
            <span className={styles.buttonText}>Tactics</span>
          </div>
        </div>
      </div>

      <div className={styles.characterList}>
        {teamMembers.map((character, index) => (
          <div
            key={character.id}
            className={`${styles.characterItem} ${index === selectedCharacterIndex ? styles.selected : ''}`}
            onClick={() => handleCharacterSelect(character, index)}
          >
            <div className={styles.roleLabel}>{character.role}</div>
            <div className={styles.characterInfo}>
              <div className={styles.characterName}>{character.name}</div>
              <div className={styles.characterStats}>
                <span className={styles.level}>LV {character.level}</span>
                <span className={styles.hp}>HP {character.hp}</span>
                <span className={styles.sp}>SP {character.sp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.commandSection}>
        <div className={styles.commandText}>COMMAND</div>
        <div className={styles.promptText}>Whose stats do you want to view?</div>
        <div className={styles.commandButtons}>
          <div className={styles.commandButton}>
            <span className={styles.buttonIcon}>□</span>
            <span>Party</span>
          </div>
          <div className={styles.commandButton}>
            <span className={styles.buttonIcon}>○</span>
            <span>Back</span>
          </div>
          <div className={styles.commandButton}>
            <span className={styles.buttonIcon}>×</span>
            <span>Stats</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCharacterDetails = () => (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.navButtons}>
          <div className={styles.navButton}>
            <span className={styles.buttonIcon}>L1</span>
          </div>
          <div className={styles.characterNameBanner}>{selectedCharacter.name}</div>
          <div className={styles.navButton}>
            <span className={styles.buttonIcon}>R1</span>
          </div>
        </div>
        <div className={styles.screenTitle}>
          <span>Social Stats</span>
          <span className={styles.controllerIcon}>🎮</span>
        </div>
      </div>

      <div className={styles.characterContent}>
        <div className={styles.characterImage}>
          <Image 
            src={selectedCharacter.image} 
            alt={selectedCharacter.name}
            width={300}
            height={300}
            className={styles.characterImage}
          />
          <div className={styles.leaderLabel}>LEADER</div>
        </div>

        <div className={styles.characterStats}>
          <div className={styles.levelBlock}>
            <div className={styles.levelText}>Lv {selectedCharacter.level}</div>
            <div className={styles.nextLevel}>NEXTLEVEL {selectedCharacter.nextLevelExp}</div>
            <div className={styles.hpBar}>HP {selectedCharacter.hp}/{selectedCharacter.maxHp}</div>
            <div className={styles.spBar}>SP {selectedCharacter.sp}/{selectedCharacter.maxSp}</div>
          </div>

          <div className={styles.personaBlock}>
            <div className={styles.personaInfo}>
              <span className={styles.personaArcana}>{selectedCharacter.persona.arcana}</span>
              <span className={styles.personaLevel}>Lv {selectedCharacter.persona.level}</span>
              <span className={styles.personaName}>{selectedCharacter.persona.name}</span>
            </div>
            <div className={styles.combatStats}>
              <div>Melee Atk • {selectedCharacter.stats.meleeAtk}</div>
              <div>Ranged Atk • {selectedCharacter.stats.rangedAtk} × {selectedCharacter.stats.maxAmmo}</div>
              <div>Ammo {selectedCharacter.stats.ammo}/{selectedCharacter.stats.maxAmmo}</div>
              <div>Defense • {selectedCharacter.stats.defense}</div>
            </div>
          </div>
        </div>

        <div className={styles.description}>
          <p>{selectedCharacter.description}</p>
        </div>
      </div>

      <div className={styles.totalExp}>
        <span>TOTAL EXP</span>
        <span className={styles.expValue}>{selectedCharacter.exp.toLocaleString()}</span>
      </div>

      <div className={styles.navigationButtons}>
        <div className={styles.navButton} onClick={handleStatsView}>
          <span className={styles.buttonIcon}>○</span>
          <span>Stats</span>
        </div>
        <div className={styles.navButton} onClick={handleBack}>
          <span className={styles.buttonIcon}>○</span>
          <span>Back</span>
        </div>
      </div>
    </div>
  );

  const renderStatsMenu = () => (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.navButtons}>
          <div className={styles.navButton}>
            <span className={styles.buttonIcon}>L1</span>
          </div>
          <div className={styles.characterNameBanner}>{selectedCharacter.name}</div>
          <div className={styles.navButton}>
            <span className={styles.buttonIcon}>R1</span>
          </div>
        </div>
        <div className={styles.screenTitle}>
          <span>Stats</span>
          <span className={styles.controllerIcon}>🎮</span>
        </div>
      </div>

      <div className={styles.statsContent}>
        <div className={styles.characterStats}>
          <div className={styles.levelBlock}>
            <div className={styles.levelText}>Lv {selectedCharacter.level}</div>
            <div className={styles.nextLevel}>NEXTLEVEL {selectedCharacter.nextLevelExp}</div>
            <div className={styles.hpBar}>HP {selectedCharacter.hp}/{selectedCharacter.maxHp}</div>
            <div className={styles.spBar}>SP {selectedCharacter.sp}/{selectedCharacter.maxSp}</div>
          </div>

          <div className={styles.personaBlock}>
            <div className={styles.personaInfo}>
              <span className={styles.personaArcana}>{selectedCharacter.persona.arcana}</span>
              <span className={styles.personaLevel}>Lv {selectedCharacter.persona.level}</span>
              <span className={styles.personaName}>{selectedCharacter.persona.name}</span>
            </div>
            <div className={styles.combatStats}>
              <div>Melee Atk • {selectedCharacter.stats.meleeAtk}</div>
              <div>Ranged Atk • {selectedCharacter.stats.rangedAtk}</div>
              <div>Defense • {selectedCharacter.stats.defense}</div>
            </div>
          </div>
        </div>

        <div className={styles.socialStats}>
          <div className={styles.statsStar}>
            {Object.entries(selectedCharacter.socialStats).map(([stat, data]) => (
              <div key={stat} className={`${styles.statItem} ${styles[`stat${stat.charAt(0).toUpperCase() + stat.slice(1)}`]}`}>
                <div className={styles.statLabel}>
                  {stat.charAt(0).toUpperCase() + stat.slice(1)} {data.maxed ? 'MAX' : data.level}
                </div>
                <div className={styles.statRank}>{data.rank}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.navigationButtons}>
        <div className={styles.navButton} onClick={handleBack}>
          <span className={styles.buttonIcon}>○</span>
          <span>Back</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.menuContainer}>
      {currentPage === 1 && renderTeamList()}
      {currentPage === 2 && renderCharacterDetails()}
      {currentPage === 3 && renderStatsMenu()}
      
      {/* Instructions overlay */}
      <div className={styles.instructions}>
        <div className={styles.instructionText}>
          {currentPage === 1 && "Use ↑↓ arrows to navigate, Enter to select, Esc to go back"}
          {currentPage === 2 && "Press 'S' for Stats, Esc to go back"}
          {currentPage === 3 && "Press Esc to go back"}
        </div>
      </div>
    </div>
  );
};

export default PersonaMenu; 