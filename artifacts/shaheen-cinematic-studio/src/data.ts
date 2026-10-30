import type { Platform, SocialLink, StudioState } from './types';

export const socialPlatforms: Platform[] = [
  'Instagram', 'Telegram', 'WhatsApp', 'TikTok', 'Snapchat',
  'Facebook', 'X', 'YouTube', 'GitHub', 'LinkedIn',
];

export const platforms: Platform[] = [...socialPlatforms, 'Custom'];

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
  Custom: { title: 'My website', url: 'https://', icon: 'globe' },
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
  Custom: '#8bd5e5',
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
    colorMode: 'dark',
    animation: 'fade',
    neonBorders: false,
    neonText: false,
    floating: false,
    glowingPulse: false,
    gsapEntrance: true,
  },
  links: initialLinks,
};

export const iconChoices = ['camera', 'send', 'message', 'music', 'sparkles', 'users', 'at-sign', 'play', 'code', 'briefcase', 'globe', 'star'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function enumValue<T extends string>(value: unknown, values: readonly T[], fallback: T): T {
  return typeof value === 'string' && values.includes(value as T) ? value as T : fallback;
}

function validateAvatar(value: unknown): string {
  if (typeof value !== 'string' || value.length > 7_000_000) return defaultState.profile.avatarUrl;
  if (value.startsWith('data:image/')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? value : defaultState.profile.avatarUrl;
  } catch {
    return defaultState.profile.avatarUrl;
  }
}

export function parseStudioState(json: string): StudioState {
  const parsed: unknown = JSON.parse(json);
  if (!isRecord(parsed) || !isRecord(parsed.profile) || !Array.isArray(parsed.links)) {
    throw new Error('This file is not a Shaheen Studio configuration.');
  }

  const incoming = parsed.profile;
  const profile = {
    name: typeof incoming.name === 'string' ? incoming.name.slice(0, 32) : defaultState.profile.name,
    bio: typeof incoming.bio === 'string' ? incoming.bio.slice(0, 110) : defaultState.profile.bio,
    avatarUrl: validateAvatar(incoming.avatarUrl),
    font: enumValue(incoming.font, ['Tajawal', 'Cairo', 'Cinzel'] as const, defaultState.profile.font),
    theme: enumValue(incoming.theme, ['obsidian', 'cyberpunk', 'royal'] as const, defaultState.profile.theme),
    colorMode: enumValue(incoming.colorMode, ['dark', 'light'] as const, defaultState.profile.colorMode),
    animation: enumValue(incoming.animation, ['fade', 'slide', 'coverflow'] as const, defaultState.profile.animation),
    neonBorders: typeof incoming.neonBorders === 'boolean' ? incoming.neonBorders : defaultState.profile.neonBorders,
    neonText: typeof incoming.neonText === 'boolean' ? incoming.neonText : defaultState.profile.neonText,
    floating: typeof incoming.floating === 'boolean' ? incoming.floating : defaultState.profile.floating,
    glowingPulse: typeof incoming.glowingPulse === 'boolean' ? incoming.glowingPulse : defaultState.profile.glowingPulse,
    gsapEntrance: typeof incoming.gsapEntrance === 'boolean' ? incoming.gsapEntrance : defaultState.profile.gsapEntrance,
  };

  const ids = new Set<string>();
  const links = parsed.links.map((value, index): SocialLink => {
    if (!isRecord(value)
      || typeof value.id !== 'string'
      || typeof value.platform !== 'string'
      || !platforms.includes(value.platform as Platform)
      || typeof value.title !== 'string'
      || typeof value.url !== 'string'
      || typeof value.icon !== 'string'
      || !iconChoices.includes(value.icon)) {
      throw new Error(`Link ${index + 1} is missing a valid platform, title, URL, or icon.`);
    }
    if (ids.has(value.id)) throw new Error('Link IDs in the configuration must be unique.');
    ids.add(value.id);
    return {
      id: value.id.slice(0, 120),
      platform: value.platform as Platform,
      title: value.title.slice(0, 80),
      url: value.url.slice(0, 2048),
      icon: value.icon,
    };
  });

  return { profile, links };
}
