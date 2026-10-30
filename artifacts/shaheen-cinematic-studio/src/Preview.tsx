import { useLayoutEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, AtSign, BriefcaseBusiness, Camera, Code2, Globe2, MessageCircle, Music2, Play, Send, Sparkles, Star, Users } from 'lucide-react';
import type { ComponentType } from 'react';
import { gsap } from 'gsap';
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { platformGlows } from './data';
import type { ColorMode, Profile, SocialLink, Theme } from './types';

const glyphs: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  camera: Camera, send: Send, message: MessageCircle, music: Music2, sparkles: Sparkles,
  users: Users, 'at-sign': AtSign, play: Play, code: Code2, briefcase: BriefcaseBusiness, globe: Globe2, star: Star,
};

interface ThemeTokens {
  bg: string;
  ink: string;
  accent: string;
  muted: string;
  border: string;
  button: string;
  ambient: string;
}

const themes: Record<Theme, Record<ColorMode, ThemeTokens>> = {
  obsidian: {
    dark: { bg: 'linear-gradient(155deg,#11151e,#080a10 68%)', ink: '#f1ecdf', accent: '#d9b769', muted: '#9699a3', border: 'rgba(218,185,112,.32)', button: 'rgba(255,255,255,.055)', ambient: 'rgba(217,183,105,.36)' },
    light: { bg: 'linear-gradient(155deg,#faf8f1,#e8e5dc 72%)', ink: '#25241f', accent: '#92743b', muted: '#67665f', border: 'rgba(146,116,59,.34)', button: 'rgba(255,255,255,.72)', ambient: 'rgba(180,145,75,.34)' },
  },
  cyberpunk: {
    dark: { bg: 'linear-gradient(155deg,#07141c,#080a12 68%)', ink: '#effaff', accent: '#18dbff', muted: '#9bb8c1', border: 'rgba(24,219,255,.38)', button: 'rgba(11,211,242,.075)', ambient: 'rgba(255,55,199,.46)' },
    light: { bg: 'linear-gradient(155deg,#f1fcff,#dceef3 72%)', ink: '#14252a', accent: '#007d9b', muted: '#53676d', border: 'rgba(0,125,155,.3)', button: 'rgba(255,255,255,.76)', ambient: 'rgba(255,55,199,.3)' },
  },
  royal: {
    dark: { bg: 'linear-gradient(155deg,#1c160c,#0b0908 68%)', ink: '#fbf0d8', accent: '#e3b747', muted: '#b2a58a', border: 'rgba(227,183,71,.42)', button: 'rgba(189,146,55,.09)', ambient: 'rgba(227,183,71,.38)' },
    light: { bg: 'linear-gradient(155deg,#faf5e9,#eee2c9 72%)', ink: '#312718', accent: '#96712a', muted: '#76674b', border: 'rgba(150,113,42,.36)', button: 'rgba(255,255,255,.7)', ambient: 'rgba(190,147,50,.34)' },
  },
};

interface PreviewProps { profile: Profile; links: SocialLink[] }

export default function Preview({ profile, links }: PreviewProps) {
  const theme = themes[profile.theme][profile.colorMode];
  const previewContentRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const linkOrder = useMemo(() => links.map((link) => link.id).join('|'), [links]);

  useLayoutEffect(() => {
    const node = previewContentRef.current;
    if (!profile.gsapEntrance || !node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        node.querySelectorAll<HTMLElement>('[data-cinematic-item]'),
        { opacity: 0, y: 18, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: .72, stagger: .075, ease: 'power3.out', clearProps: 'all' },
      );
    }, node);
    return () => context.revert();
  }, [profile.gsapEntrance, linkOrder]);

  const renderLink = (link: SocialLink, index: number) => {
    const Icon = glyphs[link.icon] ?? Globe2;
    const destination = /^https?:\/\//i.test(link.url) ? link.url : undefined;
    const glow = platformGlows[link.platform];
    const animationProps = shouldReduceMotion
      ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 } }
      : profile.animation === 'slide'
        ? { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }
        : profile.animation === 'coverflow'
          ? { initial: { opacity: 0, scale: .92 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: .94 } }
          : { initial: { opacity: 0, filter: 'blur(8px)' }, animate: { opacity: 1, filter: 'blur(0px)' }, exit: { opacity: 0, filter: 'blur(5px)' } };

    return (
      <motion.a
        key={link.id}
        {...animationProps}
        transition={{ duration: shouldReduceMotion ? 0 : .38, delay: shouldReduceMotion ? 0 : Math.min(index * .06, .3), ease: [.16, 1, .3, 1] }}
        href={destination}
        target={destination ? '_blank' : undefined}
        rel={destination ? 'noopener noreferrer' : undefined}
        aria-disabled={!destination}
        onClick={(event) => { if (!destination) event.preventDefault(); }}
        className={`link-card float-target flex min-h-[49px] w-full items-center justify-between rounded-[13px] border px-3.5 text-left no-underline ${profile.neonBorders ? 'neon-border' : ''}`}
        style={{
          borderColor: profile.neonBorders ? `${glow}a8` : theme.border,
          background: theme.button,
          color: theme.ink,
          boxShadow: profile.neonBorders ? `0 0 16px ${glow}35, inset 0 0 12px ${glow}0c` : `0 0 16px ${glow}18`,
          opacity: destination ? 1 : .55,
          transformStyle: 'preserve-3d',
        }}
        data-testid={`link-preview-${link.id}`}
        data-cinematic-item
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-[29px] w-[29px] shrink-0 place-items-center rounded-[9px] border" style={{ color: link.platform === 'Instagram' ? '#fff' : glow, borderColor: `${glow}55`, background: link.platform === 'Instagram' ? 'linear-gradient(135deg,rgba(254,218,117,.26),rgba(214,41,118,.26),rgba(79,91,213,.3))' : `${glow}18`, boxShadow: profile.glowingPulse ? `0 0 15px ${glow}52` : `0 0 13px ${glow}20` }}>
            <Icon size={15} strokeWidth={1.8} />
          </span>
          <span className="truncate text-[12px] font-semibold" style={{ textShadow: profile.neonText ? `0 0 12px ${theme.accent}9a` : undefined }}>{link.title || link.platform}</span>
        </span>
        <ArrowUpRight size={15} strokeWidth={1.7} className="shrink-0" style={{ color: glow }} />
      </motion.a>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex w-full max-w-[360px] items-center justify-between px-2">
        <div><div className="studio-label">EXPORT PREVIEW</div><div className="mt-1 text-xs text-[#e8e1d0]">index.html · link page</div></div>
        <span className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[.06] px-3 py-1.5 text-[10px] tracking-[.16em] text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_9px_#6ee7b7]" />ON AIR</span>
      </div>
      <div className={`phone-frame relative w-[min(100%,350px)] rounded-[40px] p-[9px] ${profile.neonBorders ? 'neon-phone' : ''}`} style={profile.neonBorders ? { boxShadow: `0 0 0 1px ${theme.accent}65, 0 28px 80px rgba(0,0,0,.65), 0 0 40px ${theme.accent}25, inset 0 0 0 5px rgba(255,255,255,.025)` } : undefined}>
        <div className="absolute left-1/2 top-[15px] z-10 h-[22px] w-[82px] -translate-x-1/2 rounded-full border border-white/10 bg-black/80" />
        <div className="phone-screen relative min-h-[610px] overflow-y-auto rounded-[32px] px-5 pb-7 pt-12" style={{ background: theme.bg, color: theme.ink, fontFamily: profile.font }}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-30" style={{ background: profile.theme === 'cyberpunk' ? `radial-gradient(ellipse at 15% 0%,#ff37c766,transparent 45%),radial-gradient(ellipse at 90% 8%,${theme.accent}70,transparent 48%)` : `radial-gradient(ellipse at 50% 0%,${theme.ambient},transparent 70%)` }} />
          <div ref={previewContentRef} className={`relative mx-auto flex max-w-[270px] flex-col items-center ${profile.floating ? 'float-enabled' : ''} ${profile.glowingPulse ? 'pulse-enabled' : ''}`} data-testid="preview-effects">
            <motion.div className="float-target pulse-target" initial={shouldReduceMotion ? false : { scale: .82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 170, damping: 17 }}>
              <div className="rounded-full p-[3px]" style={{ background: `linear-gradient(135deg,${theme.accent},transparent 70%)`, boxShadow: `0 0 30px ${theme.accent}27` }}>
                <img data-testid="img-preview-avatar" data-cinematic-item src={profile.avatarUrl || '/shaheen-Studio.png'} alt="Creator avatar" className="h-[88px] w-[88px] rounded-full border-[3px] object-cover" style={{ borderColor: theme.bg }} />
              </div>
            </motion.div>
            <div className="mt-5 flex items-center gap-2" data-cinematic-item>
              <h2 data-testid="text-preview-name" className={`text-[23px] font-bold tracking-[.12em] ${profile.neonText ? 'neon-text' : ''}`} style={{ fontFamily: profile.font, textShadow: profile.neonText ? `0 0 16px ${theme.accent}8c` : undefined }}>{profile.name || 'YOUR NAME'}</h2>
              <span className={`h-1.5 w-1.5 rounded-full ${profile.glowingPulse ? 'pulse-target' : ''}`} style={{ background: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }} />
            </div>
            <p data-testid="text-preview-bio" data-cinematic-item className={`mt-2 max-w-[245px] text-center text-[12px] leading-6 ${profile.neonText ? 'neon-text' : ''}`} style={{ color: theme.muted, textShadow: profile.neonText ? `0 0 10px ${theme.accent}45` : undefined }}>{profile.bio || 'Your story, one link at a time.'}</p>
            <div className="mb-5 mt-5 flex items-center gap-2" data-cinematic-item>
              <span className="h-px w-7" style={{ background: theme.border }} /><span className="text-[8px] tracking-[.34em]" style={{ color: theme.accent }}>FIND ME ELSEWHERE</span><span className="h-px w-7" style={{ background: theme.border }} />
            </div>
            {profile.animation === 'coverflow' && links.length > 1 ? (
              <Swiper data-testid="list-preview-links" modules={[EffectCoverflow]} effect="coverflow" centeredSlides slidesPerView={1.18} spaceBetween={12} grabCursor coverflowEffect={{ rotate: 18, stretch: 0, depth: 80, modifier: 1.2, slideShadows: false }} className="!w-full !overflow-visible !pb-3">
                {links.map((link, index) => <SwiperSlide key={link.id} className="!h-auto">{renderLink(link, index)}</SwiperSlide>)}
              </Swiper>
            ) : (
              <div className="w-full space-y-2.5" data-testid="list-preview-links">
                <AnimatePresence initial={false}>{links.map((link, index) => renderLink(link, index))}</AnimatePresence>
              </div>
            )}
            {links.length === 0 && <div className="mt-2 w-full rounded-xl border border-dashed p-6 text-center text-xs" style={{ borderColor: theme.border, color: theme.muted }}>Your links will appear here.</div>}
            <div className="mt-7 flex items-center gap-2 opacity-45" data-cinematic-item><span className="h-px w-5" style={{ background: theme.border }} /><span className="text-[8px] tracking-[.28em]">SHAHEEN STUDIO</span><span className="h-px w-5" style={{ background: theme.border }} /></div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[10px] tracking-[.12em] text-[#a1a4ac]"><span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d8b665]" /> PREVIEW UPDATES IN REAL TIME</div>
    </div>
  );
}
