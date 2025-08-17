'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tunesConfig } from '../../config/tunesConfig';
import styles from './page.module.css';

export default function TunesPage() {

  const handlePlaylistClick = (playlistUrl) => {
    window.open(playlistUrl, '_blank');
  };

  const renderPlaylistCard = (playlist, isLarge = false) => (
    <div 
      key={playlist.id}
      className={`${styles.playlistCard} ${isLarge ? styles.largeCard : ''}`}
      onClick={() => handlePlaylistClick(playlist.playlistUrl)}
    >
      <div className={styles.playlistImage}>
        <img src={playlist.imageUrl} alt={playlist.title} />
        <div className={styles.playButton}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <div className={styles.playlistInfo}>
        <h3 className={styles.playlistTitle}>{playlist.title}</h3>
        <p className={styles.playlistCreator}>{playlist.creator}</p>
        <div className={styles.playlistMeta}>
          <span>{playlist.tracks} tracks</span>
          <span>•</span>
          <span>{playlist.duration}</span>
        </div>
      </div>
    </div>
  );

  const renderGenreSection = (genreKey, genreData) => (
    <div key={genreKey} className={styles.genreSection}>
      <div className={styles.genreHeader}>
        <h2 className={styles.genreTitle}>{genreData.title}</h2>
        <p className={styles.genreDescription}>{genreData.description}</p>
      </div>
      
      {genreData.comingSoon ? (
        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>🎵</div>
          <h3>Coming Soon</h3>
          <p>We&apos;re curating the perfect playlists for {genreData.title.toLowerCase()} dancers</p>
        </div>
      ) : (
        <div className={styles.playlistGrid}>
          {genreData.playlists.map(playlist => renderPlaylistCard(playlist))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.tunesContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Tunes</h1>
          <p className={styles.pageSubtitle}>
            Curated playlists for all kinds of dance styles
          </p>
        </div>
      </div>

      {/* Playlist Feature Request */}
      <div className={styles.featureRequest}>
        <Link href="/contact" className={styles.featureRequestText}>
          Wanna feature your tunes? Hit us up!
        </Link>
      </div>

      {/* Genre Sections */}
      <div className={styles.genresContainer}>
        {Object.entries(tunesConfig.genres).map(([key, genreData]) => 
          renderGenreSection(key, genreData)
        )}
      </div>
    </div>
  );
}
