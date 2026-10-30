import type { Platform, SocialLink, StudioState } from './types';

export const platforms: Platform[] = [
  'Instagram', 'Telegram', 'WhatsApp', 'TikTok', 'Snapchat',
  'Facebook', 'X', 'YouTube', 'GitHub', 'LinkedIn',
];

export const platformDefaults: Record<Platform, { title: string; url: string; icon: string }> = {
  Instagram: { title: 'Instagram', url: 'https://instagram.com/', icon: 'camera' },
  Telegram: { title: 'Telegram', url: 'https://t.me/', icon: 'send' },
  WhatsApp: { title: 'WhatsApp', url: 'https://wa.me/', icon: 'message' },
  TikTok: { title: 'TikTok', url: 'https://tiktok.com/@', icon: 'music' },
  Snapchat: { title: 'Snapchat', url: 'https://snapchat.com/add/', icon: 'sparkles' },
  Facebook: { title: 'Facebook', url: 'https://facebook.com/', icon: 'users' },
  X: { title: 'X', url: 'https://x.com/', icon: 'at-sign' },
  YouTube: { title: 'YouTube', url: 'https://youtube.com/@', icon: 'play' },
  GitHub: { title: 'GitHub', url: 'https://github.com/', icon: 'code' },
  LinkedIn: { title: 'LinkedIn', url: 'https://linkedin.com/in/', icon: 'briefcase' },
};

export const platformGlows: Record<Platform, string> = {
  Instagram: '#e1306c',
  Telegram: '#2aabee',
  WhatsApp: '#25d366',
  TikTok: '#25f4ee',
  Snapchat: '#fffc00',
  Facebook: '#1877f2',
  X: '#f5f5f5',
  YouTube: '#ff0033',
  GitHub: '#f0f6fc',
  LinkedIn: '#0a66c2',
};

const initialLinks: SocialLink[] = [
  { id: 'instagram', platform: 'Instagram', ...platformDefaults.Instagram },
  { id: 'telegram', platform: 'Telegram', ...platformDefaults.Telegram },
  { id: 'whatsapp', platform: 'WhatsApp', ...platformDefaults.WhatsApp },
  { id: 'tiktok', platform: 'TikTok', ...platformDefaults.TikTok },
  { id: 'snapchat', platform: 'Snapchat', ...platformDefaults.Snapchat },
  { id: 'x', platform: 'X', ...platformDefaults.X },
  { id: 'youtube', platform: 'YouTube', ...platformDefaults.YouTube },
  { id: 'linkedin', platform: 'LinkedIn', ...platformDefaults.LinkedIn },
];

export const defaultState: StudioState = {
  profile: {
    name: 'SHAHEEN',
    bio: 'Cinematic stories. Made to be remembered.',
    avatarUrl: '/shaheen-Studio.png',
    font: 'Tajawal',
    theme: 'obsidian',
    animation: 'fade',
  },
  links: initialLinks,
};

export const iconChoices = ['camera', 'send', 'message', 'music', 'sparkles', 'users', 'at-sign', 'play', 'code', 'briefcase', 'globe', 'star'];
