'use client';

import { useState } from 'react';
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

  const handlePrevCharacter = () => {
    const newIndex = selectedCharacterIndex > 0 ? selectedCharacterIndex - 1 : teamMembers.length - 1;
    setSelectedCharacter(teamMembers[newIndex]);
    setSelectedCharacterIndex(newIndex);
  };

  const handleNextCharacter = () => {
    const newIndex = selectedCharacterIndex < teamMembers.length - 1 ? selectedCharacterIndex + 1 : 0;
    setSelectedCharacter(teamMembers[newIndex]);
    setSelectedCharacterIndex(newIndex);
  };

  const renderTeamList = () => (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleBanner}>
          <span className={styles.titleText}>Team Stay Afloat</span>
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
            <div className={styles.characterCard}>
              <Image 
                src={character.image} 
                alt={character.name}
                width={300}
                height={200}
                className={styles.characterCardImage}
              />
              <div className={styles.characterCardOverlay}>
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
            </div>
          </div>
        ))}
      </div>


    </div>
  );

  const renderCharacterDetails = () => (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.navButtons}>
          <div className={styles.navButton} onClick={handlePrevCharacter}>
            <span className={styles.buttonIcon}>◀</span>
            <span className={styles.buttonText}>Prev</span>
          </div>
          <div className={styles.characterNameBanner}>{selectedCharacter.name}</div>
          <div className={styles.navButton} onClick={handleNextCharacter}>
            <span className={styles.buttonIcon}>▶</span>
            <span className={styles.buttonText}>Next</span>
          </div>
        </div>
        <div className={styles.actionButtons}>
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

      <div className={styles.characterContent}>
        <div className={styles.characterImage}>
          <Image 
            src={selectedCharacter.image} 
            alt={selectedCharacter.name}
            width={300}
            height={300}
            className={styles.characterImage}
          />
          <div className={styles.leaderLabel}>{selectedCharacter.role}</div>
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
            <div className={styles.socialMediaLinks}>
              {selectedCharacter.socialMedia.map((social, index) => (
                <div key={index} className={styles.socialLink}>
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLinkText}
                  >
                    {social.platform} • {social.handle}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.description}>
          <p>{selectedCharacter.description}</p>
        </div>
      </div>
    </div>
  );

  const renderStatsMenu = () => (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.navButtons}>
          <div className={styles.navButton} onClick={handlePrevCharacter}>
            <span className={styles.buttonIcon}>◀</span>
            <span className={styles.buttonText}>Prev</span>
          </div>
          <div className={styles.characterNameBanner}>{selectedCharacter.name}</div>
          <div className={styles.navButton} onClick={handleNextCharacter}>
            <span className={styles.buttonIcon}>▶</span>
            <span className={styles.buttonText}>Next</span>
          </div>
        </div>
        <div className={styles.actionButtons}>
          <div className={`${styles.navButton} ${styles.statsButton}`}>
            <span className={styles.buttonIcon}>🎮</span>
            <span>Stats</span>
          </div>
          <div className={styles.navButton} onClick={handleBack}>
            <span className={styles.buttonIcon}>○</span>
            <span>Back</span>
          </div>
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
            <div className={styles.socialMediaLinks}>
              {selectedCharacter.socialMedia.map((social, index) => (
                <div key={index} className={styles.socialLink}>
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLinkText}
                  >
                    {social.platform} • {social.handle}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.socialStats}>
          <div className={styles.statsList}>
            {Object.entries(selectedCharacter.socialStats).map(([stat, data]) => (
              <div key={stat} className={styles.statItem}>
                <div className={styles.statHeader}>
                  <div className={styles.statLabel}>
                    {stat.charAt(0).toUpperCase() + stat.slice(1)} {data.maxed ? 'MAX' : data.level}
                  </div>
                  <div className={styles.statRank}>{data.rank}</div>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${(data.level / 5) * 100}%`,
                      backgroundColor: data.maxed ? '#ff1493' : '#ff69b4'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.menuContainer}>
      {currentPage === 1 && renderTeamList()}
      {currentPage === 2 && renderCharacterDetails()}
      {currentPage === 3 && renderStatsMenu()}
      

    </div>
  );
};

export default PersonaMenu; 