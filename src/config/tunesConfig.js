export const tunesConfig = {
  genres: {
    house: {
      title: "House",
      description: "Groovy beats and soulful rhythms",
      playlists: [
        {
          id: "house-1",
          title: "Tonight",
          creator: "Jay-R",
          imageUrl: "tunes/house-1.png",
          playlistUrl: "https://open.spotify.com/playlist/5QgwpZxU5DfHa6SIxgjaMG",
          tracks: 111,
          duration: "6hr 30m",
          featured: true
        },
      ]
    },
    hipHop: {
      title: "Hip-Hop",
      description: "Coming soon - Fresh beats and lyrical flows",
      playlists: [],
      comingSoon: true
    },
    krump: {
      title: "Krump",
      description: "Coming soon - High energy krump anthems",
      playlists: [],
      comingSoon: true
    },
    breaking: {
      title: "Breaking",
      description: "Coming soon - Classic breaking tracks",
      playlists: [],
      comingSoon: true
    },
    popping: {
      title: "Popping",
      description: "Coming soon - Funk and soul for poppers",
      playlists: [],
      comingSoon: true
    },
    locking: {
      title: "Locking",
      description: "Coming soon - Funky locking grooves",
      playlists: [],
      comingSoon: true
    },
    waacking: {
      title: "Waacking",
      description: "Coming soon - Disco and soul classics",
      playlists: [],
      comingSoon: true
    }
  },
  
  // Featured playlists for the main section
  featuredPlaylists: [
    {
      id: "featured-1",
      title: "Deep House Vibes",
      creator: "Sway Collective",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
      playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DX7KNKjOK0o75",
      tracks: 24,
      duration: "1h 23m",
      genre: "house"
    }
  ],
  
  // Recently added playlists
  recentlyAdded: [
    {
      id: "recent-1",
      title: "Chicago House Classics",
      creator: "House Legends",
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center",
      playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DX7KNKjOK0o75",
      tracks: 18,
      duration: "1h 5m",
      genre: "house"
    },
    {
      id: "recent-2",
      title: "Progressive House Journey",
      creator: "Electronic Dreams",
      imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop&crop=center",
      playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DX7KNKjOK0o75",
      tracks: 32,
      duration: "2h 15m",
      genre: "house"
    }
  ]
};

export default tunesConfig;
