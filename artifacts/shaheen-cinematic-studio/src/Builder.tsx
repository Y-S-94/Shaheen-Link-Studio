import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownToLine, ExternalLink, Film, Menu, RotateCcw, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import Preview from './Preview';
import Sidebar from './Sidebar';
import { defaultState } from './data';
import { downloadExport } from './exportHtml';
import type { Profile, SocialLink, StudioState } from './types';

const STORAGE_KEY = 'shaheen-cinematic-studio-v1';

function restoreState(): StudioState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    const parsed = JSON.parse(stored) as Partial<StudioState>;
    if (!parsed.profile || !Array.isArray(parsed.links)) return defaultState;
    return {
      profile: { ...defaultState.profile, ...parsed.profile, avatarUrl: parsed.profile.avatarUrl || '/shaheen-Studio.png' },
      links: parsed.links,
    };
  } catch {
    return defaultState;
  }
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    let width = 0; let height = 0; let frame = 0;
    const pointer = { x: -1000, y: -1000 };
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = width * ratio; canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles.length = 0;
      const count = Math.min(72, Math.round(width * height / 16000));
      for (let index = 0; index < count; index += 1) particles.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2, radius: .6 + Math.random() * 1.4, alpha: .15 + Math.random() * .45 });
    };
    const move = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top; };
    const draw = () => {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        const dx = pointer.x - particle.x; const dy = pointer.y - particle.y; const distance = Math.hypot(dx, dy);
        if (distance < 95 && distance > 0) { particle.vx -= dx / distance * .0025; particle.vy -= dy / distance * .0025; }
        particle.vx = Math.max(-.55, Math.min(.55, particle.vx * .995)); particle.vy = Math.max(-.55, Math.min(.55, particle.vy * .995));
        particle.x += particle.vx; particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        context.beginPath(); context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); context.fillStyle = `rgba(216,184,111,${particle.alpha})`; context.fill();
        particles.slice(index + 1).forEach((other) => { const distanceBetween = Math.hypot(other.x - particle.x, other.y - particle.y); if (distanceBetween < 84) { context.beginPath(); context.moveTo(particle.x, particle.y); context.lineTo(other.x, other.y); context.strokeStyle = `rgba(94,185,209,${.095 * (1 - distanceBetween / 84)})`; context.lineWidth = .6; context.stroke(); } });
      });
      frame = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize); canvas.addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); canvas.removeEventListener('pointermove', move); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-auto absolute inset-0 h-full w-full opacity-55" />;
}

export default function Builder() {
  const [state, setState] = useState<StudioState>(restoreState);
  const [saved, setSaved] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); setSaved(true); } catch { setSaved(true); }
    }, 240);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [state]);

  useEffect(() => {
    const node = introRef.current;
    if (!node) return;
    const context = gsap.context(() => {
      gsap.fromTo(node.querySelectorAll<HTMLElement>('[data-intro]'), { opacity: 0, y: 16, filter: 'blur(7px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8, stagger: .09, ease: 'power3.out', clearProps: 'all' });
    }, node);
    return () => context.revert();
  }, []);

  const updateProfile = (patch: Partial<Profile>) => setState((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
  const updateLinks = (links: SocialLink[]) => setState((current) => ({ ...current, links }));
  const handleExport = () => downloadExport(state);
  const resetStudio = () => {
    if (window.confirm('Reset the studio to the original Shaheen setup?')) setState(defaultState);
  };

  return (
    <div className="studio-shell grain min-h-[100dvh] text-[#eee9dc]">
      <div className="ambient left-[-14rem] top-[-20rem]" /><div className="ambient right-[-24rem] top-[32rem]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden"><ParticleField /></div>
      <div ref={introRef} className="relative z-[1] mx-auto max-w-[1500px] px-4 pb-10 sm:px-7 lg:px-10">
        <header data-intro className="flex min-h-[82px] items-center justify-between border-b border-white/[.075]">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#d8b665]/35 shadow-[0_0_24px_rgba(216,182,101,.12)]"><img src="/shaheen-Studio.png" alt="Shaheen Cinematic Studio" className="h-full w-full object-cover" /></div>
            <div><div className="font-[Cinzel] text-[12px] font-semibold tracking-[.19em] text-[#e4d4ad]">SHAHEEN</div><div className="mt-0.5 text-[8px] tracking-[.31em] text-[#777c87]">CINEMATIC PAGE STUDIO</div></div>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <span className="flex items-center gap-2 text-[10px] tracking-[.08em] text-[#7f838d]"><span className={`h-1.5 w-1.5 rounded-full ${saved ? 'bg-emerald-300' : 'animate-pulse bg-amber-300'}`} />{saved ? 'ALL CHANGES SAVED' : 'SAVING CHANGES'}</span>
            <button data-testid="button-reset" onClick={resetStudio} className="flex items-center gap-2 text-[10px] text-[#838791] transition hover:text-[#d9c27f]"><RotateCcw size={13} />Reset studio</button>
              <button data-testid="button-export" onClick={handleExport} className="gold-button flex items-center gap-2 rounded-lg px-4 py-2.5 text-[10px] font-bold tracking-[.12em]"><ArrowDownToLine size={14} />EXPORT index.html</button>
          </div>
          <button data-testid="button-mobile-menu" aria-label="Open actions" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg border border-white/10 p-2 text-[#c7bd9f] md:hidden"><Menu size={17} /></button>
        </header>
        <AnimatePresence>{menuOpen && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="glass-panel absolute right-4 top-[70px] z-20 flex gap-3 rounded-xl p-3 md:hidden"><button data-testid="button-export-mobile" onClick={() => { handleExport(); setMenuOpen(false); }} className="gold-button flex items-center gap-2 rounded-lg px-3 py-2 text-[10px]"><ArrowDownToLine size={13} />Export index.html</button><button onClick={resetStudio} className="flex items-center gap-2 px-2 text-[10px] text-[#aaa]"><RotateCcw size={13} />Reset</button></motion.div>}</AnimatePresence>
        <main className="pt-7">
          <section data-intro className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div className="max-w-[590px]">
              <div className="mb-3 flex items-center gap-2 text-[9px] font-semibold tracking-[.26em] text-[#d6b665]"><span className="h-px w-7 bg-[#d6b665]/60" />YOUR DIGITAL PREMIERE</div>
              <h1 className="font-[Cinzel] text-[clamp(27px,4vw,43px)] leading-[1.18] tracking-[.015em] text-[#f3eee1]">Every story deserves<br className="hidden sm:block" /> a <span className="text-[#d8b665]">beautiful entrance.</span></h1>
              <p className="mt-3 max-w-[480px] text-[12px] leading-6 text-[#8c909a]">Compose a cinematic home for everything you create. Shape the frame, arrange your links, and watch it come to life.</p>
            </div>
            <div className="flex items-center gap-2">
              <a href="#live-preview" className="flex items-center gap-2 px-2 py-2 text-[10px] text-[#8c909a] hover:text-[#dfc477]"><ExternalLink size={13} />Preview</a>
            </div>
          </section>
          <div className="mb-4 flex items-center gap-2" data-intro><Film size={14} className="text-[#d8b665]" /><span className="text-[10px] tracking-[.16em] text-[#a7a8ae]">PRODUCTION DESK</span><span className="h-px flex-1 bg-gradient-to-r from-[#d8b665]/20 to-transparent" /><span className="font-mono text-[9px] text-[#5e626d]">SCENE 01 — PROFILE</span></div>
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(335px,430px)]">
            <div id="live-preview" data-intro className="glass-panel rounded-[22px] px-4 py-5 sm:px-6 sm:py-6 xl:sticky xl:top-5">
              <div className="mb-4 flex items-center justify-between"><div><div className="flex items-center gap-2"><Sparkles size={14} className="text-[#d8b665]" /><h2 className="text-xs font-semibold tracking-wide text-[#e7e1d4]">The live frame</h2></div><p className="mt-1 text-[9px] text-[#727782]">Your page, exactly as visitors will see it</p></div><div className="flex items-center gap-1.5 text-[9px] text-[#8f949d]"><span className="h-1.5 w-1.5 rounded-full bg-[#60d5ad]" /> LIVE</div></div>
              <Preview profile={state.profile} links={state.links} />
            </div>
            <div data-intro><Sidebar state={state} onProfileChange={updateProfile} onLinksChange={updateLinks} /></div>
          </div>
          <footer data-intro className="mt-7 flex flex-col items-center justify-between gap-2 border-t border-white/[.07] pt-4 text-[9px] tracking-[.12em] text-[#5e626c] sm:flex-row"><span>© 2025 SHAHEEN CINEMATIC STUDIO</span><span className="flex items-center gap-2"><span className="h-px w-4 bg-[#d8b665]/40" />BUILT FOR YOUR NEXT CHAPTER<span className="h-px w-4 bg-[#d8b665]/40" /></span></footer>
        </main>
      </div>
    </div>
  );
}
