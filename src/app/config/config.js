// Configuration file for Sway UI app
export const config = {
  // Social media links
  discord: {
    url: 'https://discord.gg/Zfk2nPrebS',
    label: 'Discord'
  },
  
  // Social media links
  social: {
    bluesky: {
      url: 'https://bsky.app/profile/osco.bsky.social',
      label: 'Bluesky'
    },
    instagram: {
      url: 'https://www.instagram.com/sway.quest',
      label: 'Instagram'
    },
    mastodon: {
      url: 'https://mastodon.social/@oscoDOTblog',
      label: 'Mastodon'
    },
    tiktok: {
      url: 'https://www.tiktok.com/@sway_xr',
      label: 'TikTok'
    },
    threads: {
      url: 'https://www.threads.net/@oscoDOTblog',
      label: 'Threads'
    },
    twitter: {
      url: 'https://twitter.com/oscoDOTblog',
      label: 'Twitter'
    },
    youtube: {
      url: 'https://www.youtube.com/@oscoDOTblog',
      label: 'YouTube'
    }
  },
  
  // App settings
  app: {
    name: 'Sway',
    version: '0.1.0'
  }
};

// Export individual social media constants for easy import
export const SOCIAL_BLUESKY = config.social.bluesky.url;
export const SOCIAL_INSTAGRAM = config.social.instagram.url;
export const SOCIAL_MASTODON = config.social.mastodon.url;
export const SOCIAL_TIKTOK = config.social.tiktok.url;
export const SOCIAL_THREADS = config.social.threads.url;
export const SOCIAL_TWITTER = config.social.twitter.url;
export const SOCIAL_YOUTUBE = config.social.youtube.url;
export const SITE_DISCORD = config.discord.url;

export default config; 