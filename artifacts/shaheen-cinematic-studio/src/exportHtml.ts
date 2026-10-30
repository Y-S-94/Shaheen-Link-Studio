import type { StudioState } from './types';
import { platformGlows } from './data';

interface ExportPalette {
  background: string;
  panel: string;
  ink: string;
  accent: string;
  muted: string;
  border: string;
}

const themes: Record<StudioState['profile']['theme'], Record<StudioState['profile']['colorMode'], ExportPalette>> = {
  obsidian: {
    dark: { background: '#080a10', panel: 'rgba(255,255,255,.075)', ink: '#f5f0e4', accent: '#d8b665', muted: '#b0ad9f', border: 'rgba(218,185,112,.32)' },
    light: { background: '#f1eee5', panel: 'rgba(255,255,255,.72)', ink: '#25241f', accent: '#92743b', muted: '#67665f', border: 'rgba(146,116,59,.34)' },
  },
  cyberpunk: {
    dark: { background: '#070a12', panel: 'rgba(7,210,255,.09)', ink: '#effaff', accent: '#13dcff', muted: '#a4c0c7', border: 'rgba(19,220,255,.45)' },
    light: { background: '#e8f6f9', panel: 'rgba(255,255,255,.78)', ink: '#14252a', accent: '#007d9b', muted: '#53676d', border: 'rgba(0,125,155,.3)' },
  },
  royal: {
    dark: { background: '#100d09', panel: 'rgba(197,153,75,.12)', ink: '#fbf1d9', accent: '#e0b44e', muted: '#c0b394', border: 'rgba(224,180,78,.42)' },
    light: { background: '#f3ead7', panel: 'rgba(255,255,255,.72)', ink: '#312718', accent: '#96712a', muted: '#76674b', border: 'rgba(150,113,42,.36)' },
  },
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

export function buildExportHtml(state: StudioState): string {
  const { profile, links } = state;
  const palette = themes[profile.theme][profile.colorMode];
  const safePayload = JSON.stringify({ profile, links })
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  const headline = escapeHtml(profile.name || 'Your name');
  const bio = escapeHtml(profile.bio || '');
  const bodyClasses = [
    profile.animation,
    profile.colorMode,
    profile.neonBorders ? 'neon-borders' : '',
    profile.neonText ? 'neon-text' : '',
    profile.floating ? 'floating' : '',
    profile.glowingPulse ? 'pulse-enabled' : '',
    profile.gsapEntrance ? 'gsap-enabled' : '',
  ].filter(Boolean).join(' ');
  const themeColor = palette.background;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="${themeColor}"><meta name="description" content="${escapeHtml(profile.bio || `${profile.name}'s links`)}"><title>${headline} — links</title>
<script src="https://cdn.tailwindcss.com"></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Cinzel:wght@500;700&family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}html{color-scheme:${profile.colorMode}}body{margin:0;min-height:100vh;background:${palette.background};color:${palette.ink};font-family:'${profile.font}',sans-serif;display:grid;place-items:center;padding:28px 16px;background-image:radial-gradient(ellipse at 18% 0%,${palette.accent}22,transparent 38%)}
main{width:min(100%,420px);text-align:center;padding:42px 26px;border:1px solid ${palette.border};border-radius:26px;background:${palette.panel};backdrop-filter:blur(18px);box-shadow:0 28px 90px #0005}
.avatar-wrap{display:inline-flex;padding:3px;border-radius:50%;background:linear-gradient(135deg,${palette.accent},transparent 70%)}.avatar{display:block;width:92px;height:92px;object-fit:cover;border-radius:50%;border:2px solid ${palette.background};box-shadow:0 0 32px ${palette.accent}55}
h1{font:700 28px '${profile.font}',sans-serif;letter-spacing:.08em;margin:20px 0 8px}p{color:${palette.muted};margin:0 auto 28px;line-height:1.7}.social{display:grid;gap:12px}.social a{display:flex;justify-content:space-between;align-items:center;text-decoration:none;color:inherit;border:1px solid ${palette.border};background:${palette.panel};border-radius:14px;padding:15px 18px;transition:transform .25s cubic-bezier(.16,1,.3,1),background .25s,box-shadow .25s}
.social a:hover{transform:translateY(-3px);background:${palette.accent}22}.social a span:last-child{color:${palette.accent}}.foot{opacity:.55;font-size:10px;letter-spacing:.24em;margin-top:30px}
.neon-borders main{border-color:${palette.accent}99;box-shadow:0 0 36px ${palette.accent}22,0 28px 90px #0005}.neon-text h1,.neon-text p{ text-shadow:0 0 14px ${palette.accent}6a}
.pulse-enabled .avatar-wrap,.pulse-enabled .social a{animation:softPulse 3.4s ease-in-out infinite}.pulse-enabled .social a:nth-child(2n){animation-delay:1.2s}
.floating .avatar-wrap{animation:float 5.5s ease-in-out infinite}.floating .social a:nth-child(2n){animation:float 5s ease-in-out infinite reverse}.floating .social a:nth-child(2n+1){animation:float 6s ease-in-out infinite}
.fade:not(.gsap-enabled) .social a{animation:enterFade .65s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--enter-delay)}.slide:not(.gsap-enabled) .social a{animation:enterSlide .65s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--enter-delay)}.coverflow:not(.gsap-enabled) .social a{animation:enterCover .75s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--enter-delay)}
.coverflow .social{perspective:900px}.coverflow .social a:nth-child(odd){transform:rotateY(-7deg)}.coverflow .social a:nth-child(even){transform:rotateY(7deg)}
@keyframes enterFade{from{opacity:0;filter:blur(7px)}to{opacity:1;filter:blur(0)}}@keyframes enterSlide{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}@keyframes enterCover{from{opacity:0;transform:translateY(14px) rotateY(16deg)}to{opacity:1;transform:translateY(0) rotateY(0)}}@keyframes float{0%,100%{translate:0 0}50%{translate:0 -5px}}@keyframes softPulse{0%,100%{box-shadow:0 0 16px ${palette.accent}20}50%{box-shadow:0 0 28px ${palette.accent}55}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
</style></head>
<body class="${bodyClasses}"><main><div class="avatar-wrap"><img class="avatar" src="${escapeHtml(profile.avatarUrl)}" alt="${headline}"></div><h1>${headline}</h1><p>${bio}</p><div class="social" id="links"></div><div class="foot">SHAHEEN CINEMATIC STUDIO</div></main>
<script>
const config=${safePayload};const glows=${JSON.stringify(platformGlows)};const holder=document.getElementById('links');
config.links.forEach((link,index)=>{if(!/^https?:\\/\\//i.test(link.url))return;const a=document.createElement('a');a.href=link.url;a.target='_blank';a.rel='noopener noreferrer';a.style.setProperty('--enter-delay',Math.min(index*75,450)+'ms');const glow=glows[link.platform]||'${palette.accent}';a.style.boxShadow=config.profile.neonBorders?'0 0 20px '+glow+'42':'0 0 18px '+glow+'24';if(config.profile.neonBorders)a.style.borderColor=glow+'aa';if(link.platform==='Instagram')a.style.backgroundImage='linear-gradient(115deg,rgba(254,218,117,.12),rgba(214,41,118,.12),rgba(79,91,213,.12))';const label=document.createElement('span');label.textContent=link.title||link.platform;const arrow=document.createElement('span');arrow.textContent='↗';arrow.style.color=glow;a.append(label,arrow);holder.appendChild(a)});
if(window.gsap&&config.profile.gsapEntrance){const start=config.profile.animation==='slide'?{y:22,filter:'blur(5px)'}:config.profile.animation==='coverflow'?{y:12,rotateY:14,filter:'blur(3px)'}:{filter:'blur(7px)'};gsap.fromTo('#links a',{opacity:0,...start},{opacity:1,y:0,rotateY:0,filter:'blur(0px)',duration:.75,stagger:.1,ease:'power3.out',clearProps:'all',delay:.12})}
</script></body></html>`;
}

async function inlineAvatar(state: StudioState): Promise<StudioState> {
  const avatarUrl = state.profile.avatarUrl || '/shaheen-Studio.png';
  const stateWithAvatar = avatarUrl === state.profile.avatarUrl
    ? state
    : { ...state, profile: { ...state.profile, avatarUrl } };
  if (avatarUrl.startsWith('data:') || avatarUrl.startsWith('blob:')) return stateWithAvatar;
  try {
    const response = await fetch(avatarUrl, { credentials: 'same-origin' });
    if (!response.ok) return stateWithAvatar;
    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    return { ...stateWithAvatar, profile: { ...stateWithAvatar.profile, avatarUrl: dataUrl } };
  } catch {
    return stateWithAvatar;
  }
}

function downloadFile(content: string, mimeType: string, filename: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadExport(state: StudioState) {
  const standaloneState = await inlineAvatar(state);
  downloadFile(buildExportHtml(standaloneState), 'text/html;charset=utf-8', 'index.html');
}

export function downloadJsonExport(state: StudioState) {
  const payload = {
    format: 'shaheen-cinematic-studio',
    version: 1,
    profile: state.profile,
    links: state.links,
  };
  downloadFile(`${JSON.stringify(payload, null, 2)}\n`, 'application/json;charset=utf-8', 'shaheen-cinematic-studio.json');
}
