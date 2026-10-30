import type { StudioState } from './types';
import { platformGlows } from './data';

const themes = {
  obsidian: { background: '#080a10', panel: 'rgba(255,255,255,.075)', ink: '#f5f0e4', accent: '#d8b665', border: 'rgba(218,185,112,.32)' },
  cyberpunk: { background: '#070a12', panel: 'rgba(7,210,255,.09)', ink: '#effaff', accent: '#13dcff', border: 'rgba(19,220,255,.45)' },
  royal: { background: '#100d09', panel: 'rgba(197,153,75,.12)', ink: '#fbf1d9', accent: '#e0b44e', border: 'rgba(224,180,78,.42)' },
  minimal: { background: '#f1f0ec', panel: 'rgba(255,255,255,.75)', ink: '#202126', accent: '#82734f', border: 'rgba(32,33,38,.18)' },
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

export function buildExportHtml(state: StudioState): string {
  const { profile, links } = state;
  const palette = themes[profile.theme];
  const safePayload = JSON.stringify({ profile, links }).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const headline = escapeHtml(profile.name || 'Your name');
  const bio = escapeHtml(profile.bio || '');
  const animationClass = profile.animation === 'slide' ? 'slide' : profile.animation === 'coverflow' ? 'coverflow' : 'fade';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="${palette.background}"><title>${headline} — links</title>
<script src="https://cdn.tailwindcss.com"></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Cinzel:wght@500;700&family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;background:${palette.background};color:${palette.ink};font-family:'${profile.font}',sans-serif;display:grid;place-items:center;padding:28px 16px;background-image:radial-gradient(ellipse at 18% 0%,${palette.accent}22,transparent 38%)}main{width:min(100%,420px);text-align:center;padding:42px 26px;border:1px solid ${palette.border};border-radius:26px;background:${palette.panel};backdrop-filter:blur(18px);box-shadow:0 28px 90px #0005}.avatar{width:92px;height:92px;object-fit:cover;border-radius:50%;border:2px solid ${palette.accent};box-shadow:0 0 32px ${palette.accent}55}h1{font:700 28px 'Cinzel',serif;letter-spacing:.12em;margin:20px 0 8px}p{opacity:.73;margin:0 auto 28px;line-height:1.7}.social{display:grid;gap:12px}.social a{display:flex;justify-content:space-between;align-items:center;text-decoration:none;color:inherit;border:1px solid ${palette.border};background:${palette.panel};border-radius:14px;padding:15px 18px;transition:transform .25s,background .25s}.social a:hover{transform:translateY(-3px);background:${palette.accent}22}.social a span:last-child{color:${palette.accent}}.fade .social a{opacity:0;filter:blur(5px)}.slide .social a{opacity:0;transform:translateY(22px)}.coverflow .social{perspective:900px}.coverflow .social a:nth-child(odd){transform:rotateY(-7deg)}.coverflow .social a:nth-child(even){transform:rotateY(7deg)}.foot{opacity:.42;font-size:10px;letter-spacing:.24em;margin-top:30px}</style></head>
<body><main class="${animationClass}"><img class="avatar" src="${escapeHtml(profile.avatarUrl)}" alt="${headline}"><h1>${headline}</h1><p>${bio}</p><div class="social" id="links"></div><div class="foot">SHAHEEN CINEMATIC STUDIO</div></main>
<script>const config=${safePayload};const glows=${JSON.stringify(platformGlows)};const holder=document.getElementById('links');config.links.forEach((link,index)=>{if(!/^https?:\\/\\//i.test(link.url))return;const a=document.createElement('a');a.href=link.url;a.target='_blank';a.rel='noopener noreferrer';a.style.boxShadow='0 0 18px '+(glows[link.platform]||'${palette.accent}')+'28';if(link.platform==='Instagram')a.style.backgroundImage='linear-gradient(115deg,rgba(254,218,117,.12),rgba(214,41,118,.12),rgba(79,91,213,.12))';a.innerHTML='<span>'+link.title.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))+'</span><span style="color:'+(glows[link.platform]||'${palette.accent}')+'">↗</span>';holder.appendChild(a)});if(window.gsap){gsap.to('.social a',{opacity:1,y:0,filter:'blur(0px)',rotateY:0,duration:.8,stagger:.11,ease:'power3.out',delay:.15})}</script></body></html>`;
}

async function inlineAvatar(state: StudioState): Promise<StudioState> {
  const avatarUrl = state.profile.avatarUrl;
  if (!avatarUrl || avatarUrl.startsWith('data:') || avatarUrl.startsWith('blob:')) return state;
  try {
    const response = await fetch(avatarUrl, { credentials: 'same-origin' });
    if (!response.ok) return state;
    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    return { ...state, profile: { ...state.profile, avatarUrl: dataUrl } };
  } catch {
    return state;
  }
}

export async function downloadExport(state: StudioState) {
  const standaloneState = await inlineAvatar(state);
  const blob = new Blob([buildExportHtml(standaloneState)], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'shaheen-cinematic-links.html';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
