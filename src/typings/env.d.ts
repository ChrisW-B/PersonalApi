declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SOCIAL_URL: string;
      SOCIAL_ACCESS_TOKEN: string;
      SOCIAL_ID: string;
      GHOST_KEY: string;
      LASTFM_ID: string;
      LASTFM_KEY: string;
      LASTFM_SECRET: string;
    }
  }
}

export {};
