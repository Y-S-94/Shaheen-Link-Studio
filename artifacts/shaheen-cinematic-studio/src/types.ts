export type Theme = 'obsidian' | 'cyberpunk' | 'royal' | 'minimal';
export type StudioFont = 'Tajawal' | 'Cairo' | 'Cinzel';
export type LinkAnimation = 'fade' | 'slide' | 'coverflow';
export type Platform =
  | 'Instagram'
  | 'Telegram'
  | 'WhatsApp'
  | 'TikTok'
  | 'Snapchat'
  | 'Facebook'
  | 'X'
  | 'YouTube'
  | 'GitHub'
  | 'LinkedIn';

export interface Profile {
  name: string;
  bio: string;
  avatarUrl: string;
  font: StudioFont;
  theme: Theme;
  animation: LinkAnimation;
}

export interface SocialLink {
  id: string;
  platform: Platform;
  title: string;
  url: string;
  icon: string;
}

export interface StudioState {
  profile: Profile;
  links: SocialLink[];
}
