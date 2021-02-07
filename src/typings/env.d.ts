declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TWITTER_CONSUMER_KEY: string;
      TWITTER_CONSUMER_SECRET: string;
      TWITTER_ACCESS_KEY: string;
      TWITTER_ACCESS_SECRET: string;
      GHOST_KEY: string;
      LASTFM_ID: string;
      LASTFM_KEY: string;
      LASTFM_SECRET: string;
      GITHUB_TOKEN: string;
    }
  }
}

export {};
