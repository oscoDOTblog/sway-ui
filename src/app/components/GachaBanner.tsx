import styles from './GachaBanner.module.css';

const GachaBanner = () => {
  return (
    <div className={styles.container}>
      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.navLeft}>
          <button className={styles.navButton}>
            <span className={styles.backArrow}>←</span>
          </button>
          <button className={styles.navButton}>
            <span className={styles.homeIcon}>🏠</span>
          </button>
          <button className={styles.exchangeButton}>
            <span className={styles.diamondIcon}>💎</span>
            <span className={styles.newBadge}>New</span>
          </button>
          <button className={styles.shopButton}>
            <span className={styles.giftIcon}>🎁</span>
          </button>
        </div>
        <div className={styles.currency}>
          <div className={styles.currencyItem}>
            <span className={styles.diamondIcon}>💎</span>
            <span className={styles.currencyValue}>0</span>
            <button className={styles.plusButton}>+</button>
          </div>
          <div className={styles.currencyItem}>
            <span className={styles.diamondIcon}>💎</span>
            <span className={styles.currencyValue}>955</span>
            <button className={styles.plusButton}>+</button>
          </div>
          <div className={styles.currencyItem}>
            <span className={styles.cardIcon}>🃏</span>
            <span className={styles.currencyValue}>2</span>
            <button className={styles.plusButton}>+</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Side - Dream Pick Banners */}
        <div className={styles.dreamPickSection}>
          <div className={styles.dreamPickBanner}>
            <div className={styles.dreamPickCharacter} style={{backgroundColor: '#ff4444'}}>
              <span className={styles.characterIcon}>👤</span>
            </div>
            <span className={styles.dreamPickLabel}>Dream Pick</span>
          </div>
          <div className={styles.dreamPickBanner}>
            <div className={styles.dreamPickCharacter} style={{backgroundColor: '#4444ff'}}>
              <span className={styles.characterIcon}>👤</span>
            </div>
            <span className={styles.dreamPickLabel}>Dream Pick</span>
          </div>
          <div className={styles.dreamPickBanner}>
            <div className={styles.dreamPickCharacter} style={{backgroundColor: '#ffaa00'}}>
              <span className={styles.weaponIcon}>⚔️</span>
            </div>
            <span className={styles.dreamPickLabel}>Dream Pick</span>
          </div>
          <div className={styles.dreamPickBanner}>
            <div className={styles.dreamPickCharacter} style={{backgroundColor: '#4444ff'}}>
              <span className={styles.weaponIcon}>🗡️</span>
            </div>
            <span className={styles.dreamPickLabel}>Dream Pick</span>
          </div>
          <div className={styles.smallCharacter}>
            <span className={styles.hornedCharacter}>👹</span>
          </div>
        </div>

        {/* Main Banner Area */}
        <div className={styles.mainBanner}>
          <div className={styles.bannerBackground}>
            <div className={styles.roboticFigure}></div>
            <div className={styles.geometricPatterns}></div>
          </div>
          
          <div className={styles.eventTitle}>
            <div className={styles.greenBanner}>Most Wanted Phantom Idol Contracts</div>
            <div className={styles.mainTitle}>VIRTUAL NETIZEN</div>
          </div>

          <div className={styles.featuredCharacter}>
            <div className={styles.characterImage}>
              <div className={styles.characterHair}></div>
              <div className={styles.characterFace}></div>
              <div className={styles.characterOutfit}></div>
              <div className={styles.characterWeapons}>
                <div className={styles.weaponLeft}></div>
                <div className={styles.weaponRight}></div>
              </div>
            </div>
            <div className={styles.characterInfo}>
              <div className={styles.characterName}>Bur Yui</div>
              <div className={styles.characterStars}>★★★★</div>
            </div>
          </div>

          <div className={styles.characterDescription}>
            5★ Phantom Thief Yui is in the Most Wanted lineup! Press [Info] for more details.
          </div>

          <div className={styles.otherCharacters}>
            <div className={styles.otherCharacter} style={{backgroundColor: '#ffff00'}}></div>
            <div className={styles.otherCharacter} style={{backgroundColor: '#ffff00'}}></div>
            <div className={styles.otherCharacter} style={{backgroundColor: '#000000'}}></div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        <div className={styles.rateUpBanner}>
          <span className={styles.starIcon}>⭐</span>
          <span className={styles.rateUpText}>Rate Up!</span>
        </div>
        
        <div className={styles.timeLeft}>
          Time Left: 9 d 0 h 11 m
        </div>
        
        <div className={styles.pitySystem}>
          <span className={styles.pityCount}>68/80</span>
          <span className={styles.pityText}>Guaranteed to get a 5★ within 80 draws!</span>
        </div>
      </div>

      {/* Draw Buttons */}
      <div className={styles.drawButtons}>
        <button className={styles.singleDraw}>
          <span className={styles.cardIcon}>🃏</span>
          <span className={styles.drawText}>x1</span>
          <span className={styles.drawCost}>Sign 1</span>
        </button>
        <button className={styles.tenDraw}>
          <span className={styles.cardIcon}>🃏</span>
          <span className={styles.drawText}>x10</span>
          <span className={styles.drawCost}>Sign 10</span>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navButtons}>
        <button className={styles.navButton}>
          <span className={styles.infoIcon}>ℹ️</span>
          <span className={styles.buttonText}>Info</span>
        </button>
        <button className={styles.navButton}>
          <span className={styles.historyIcon}>📜</span>
          <span className={styles.buttonText}>History</span>
        </button>
        <button className={styles.navButton}>
          <span className={styles.ratesIcon}>📄</span>
          <span className={styles.buttonText}>Contract Rates</span>
        </button>
      </div>

      {/* Player ID */}
      <div className={styles.playerId}>
        ID:60002840017
      </div>
    </div>
  );
};

export default GachaBanner; 