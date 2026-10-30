import { Camera, Check, ChevronDown, ChevronUp, CircleHelp, Link2, Plus, Trash2, UserRound, WandSparkles } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { iconChoices, platformDefaults, platforms } from './data';
import type { Profile, SocialLink, StudioState, Theme } from './types';

const themeOptions: { value: Theme; title: string; detail: string; colors: string[] }[] = [
  { value: 'obsidian', title: 'Obsidian Dark', detail: 'The signature noir', colors: ['#0a0c12', '#d9b769'] },
  { value: 'cyberpunk', title: 'Neon Cyberpunk', detail: 'Electric after-hours', colors: ['#081219', '#18dbff'] },
  { value: 'royal', title: 'Royal Gold', detail: 'Warm cinematic glow', colors: ['#171108', '#e3b747'] },
  { value: 'minimal', title: 'Minimal Light', detail: 'A quieter frame', colors: ['#eeede8', '#81704a'] },
];

const fontOptions: { value: Profile['font']; label: string; sample: string }[] = [
  { value: 'Tajawal', label: 'Tajawal', sample: 'Aa' },
  { value: 'Cairo', label: 'Cairo', sample: 'Aa' },
  { value: 'Cinzel', label: 'Cinzel', sample: 'Aa' },
];

interface SidebarProps {
  state: StudioState;
  onProfileChange: (patch: Partial<Profile>) => void;
  onLinksChange: (links: SocialLink[]) => void;
}

export default function Sidebar({ state, onProfileChange, onLinksChange }: SidebarProps) {
  const patchLink = (id: string, patch: Partial<SocialLink>) => onLinksChange(state.links.map((link) => link.id === id ? { ...link, ...patch } : link));
  const addLink = () => {
    const used = state.links.map((link) => link.platform);
    const platform = platforms.find((option) => !used.includes(option)) ?? 'Instagram';
    const details = platformDefaults[platform];
    onLinksChange([...state.links, { id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, platform, ...details }]);
  };
  const moveLink = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= state.links.length) return;
    const reordered = [...state.links];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    onLinksChange(reordered);
  };
  const uploadAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      window.alert('Choose an image file under 5 MB.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onProfileChange({ avatarUrl: String(reader.result) });
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <aside className="glass-panel rounded-[22px] p-5 sm:p-6" data-testid="panel-editor">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl border border-[#d8b665]/20 bg-[#d8b665]/[.08] text-[#d8b665]"><WandSparkles size={17} /></span><div><h2 className="text-sm font-semibold tracking-wide text-[#f1ecdf]">Studio controls</h2><p className="mt-0.5 text-[10px] text-[#757984]">Shape your public presence</p></div></div>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] tracking-[.18em] text-[#8e929c]">01 / 03</span>
      </div>
      <div className="gold-line mb-5 opacity-60" />
      <section>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#e8e1d0]"><UserRound size={14} className="text-[#d8b665]" /> Creator profile</div>
        <div className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-black/20 p-3">
          <img src={state.profile.avatarUrl || '/shaheen-Studio.png'} alt="Current creator avatar" className="h-12 w-12 rounded-xl border border-[#d8b665]/30 object-cover" />
          <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-[#e9e3d5]">{state.profile.name || 'Your name'}</div><div className="mt-1 text-[10px] text-[#747985]">Square image · 5 MB max</div></div>
          <label className="cursor-pointer rounded-lg border border-white/10 px-2.5 py-2 text-[10px] text-[#c9c5bc] transition hover:border-[#d8b665]/50 hover:text-[#e5c678]"><Camera size={13} className="mr-1.5 inline" />Change<input data-testid="input-avatar" className="sr-only" type="file" accept="image/*" onChange={uploadAvatar} /></label>
        </div>
        <div className="mt-3 space-y-3">
          <label className="block"><span className="studio-label mb-1.5 block">Avatar image URL</span><input data-testid="input-avatar-url" className="studio-input" type="url" maxLength={2048} value={state.profile.avatarUrl.startsWith('data:') ? '' : state.profile.avatarUrl} onChange={(event) => onProfileChange({ avatarUrl: event.target.value })} placeholder="Paste an image URL..." /></label>
          <label className="block"><span className="studio-label mb-1.5 block">Display name</span><input data-testid="input-profile-name" className="studio-input" value={state.profile.name} maxLength={32} onChange={(event) => onProfileChange({ name: event.target.value })} placeholder="Your name or creative alias" /></label>
          <label className="block"><span className="studio-label mb-1.5 block">Short introduction</span><textarea data-testid="input-profile-bio" className="studio-input min-h-[76px] resize-y" value={state.profile.bio} maxLength={110} onChange={(event) => onProfileChange({ bio: event.target.value })} placeholder="Tell people what you create..." /><span className="mt-1 block text-right text-[9px] text-[#626671]">{state.profile.bio.length} / 110</span></label>
        </div>
      </section>
      <div className="my-5 border-t border-white/[.07]" />
      <section>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#e8e1d0]"><span className="h-1.5 w-1.5 rounded-full bg-[#d8b665]" /> Visual direction</div>
        <div className="grid grid-cols-2 gap-2">
          {themeOptions.map((option) => <button data-testid={`button-theme-${option.value}`} key={option.value} onClick={() => onProfileChange({ theme: option.value })} className={`relative overflow-hidden rounded-xl border p-2.5 text-left transition duration-300 ${state.profile.theme === option.value ? 'border-[#d8b665]/75 bg-[#d8b665]/[.075]' : 'border-white/[.08] bg-black/20 hover:border-white/20'}`}><span className="mb-2 flex gap-1"><i className="h-3 w-3 rounded-full border border-white/10" style={{ background: option.colors[0] }} /><i className="h-3 w-3 rounded-full" style={{ background: option.colors[1] }} /></span><span className="block text-[10px] font-semibold text-[#e6e0d4]">{option.title}</span><span className="mt-0.5 block text-[9px] text-[#737782]">{option.detail}</span>{state.profile.theme === option.value && <Check size={13} className="absolute right-2.5 top-2.5 text-[#dfc173]" />}</button>)}
        </div>
        <label className="mt-4 block"><span className="studio-label mb-2 block">Typography</span><select data-testid="select-font" aria-label="Typography" className="studio-input" value={state.profile.font} onChange={(event) => onProfileChange({ font: event.target.value as Profile['font'] })} style={{ fontFamily: state.profile.font }}>{fontOptions.map((font) => <option key={font.value} value={font.value}>{font.sample} — {font.label}</option>)}</select></label>
        <div className="mt-4"><span className="studio-label mb-2 block">Link entrance</span><div className="grid grid-cols-3 gap-1 rounded-xl border border-white/[.08] bg-black/20 p-1">
          {[['fade', 'Fade & Blur'], ['slide', 'Slide Up'], ['coverflow', '3D Coverflow']].map(([value, label]) => <button data-testid={`button-animation-${value}`} key={value} onClick={() => onProfileChange({ animation: value as Profile['animation'] })} className={`rounded-lg px-2 py-2 text-[9px] transition ${state.profile.animation === value ? 'bg-[#d6b666]/15 text-[#e3c679]' : 'text-[#828690] hover:text-[#eee8da]'}`}>{label}</button>)}
        </div></div>
      </section>
      <div className="my-5 border-t border-white/[.07]" />
      <section>
        <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-semibold text-[#e8e1d0]"><Link2 size={14} className="text-[#d8b665]" /> Your links <span className="rounded-full bg-white/[.07] px-1.5 py-0.5 text-[9px] text-[#999da6]">{state.links.length}</span></div><button data-testid="button-add-link" onClick={addLink} className="flex items-center gap-1 rounded-lg border border-[#d8b665]/35 px-2.5 py-1.5 text-[10px] text-[#e0c478] transition hover:bg-[#d8b665]/10"><Plus size={12} />Add link</button></div>
        <div className="space-y-2">
          {state.links.map((link, index) => <div key={link.id} className="rounded-xl border border-white/[.075] bg-black/20 p-3" data-testid={`card-link-${link.id}`}>
            <div className="mb-2 flex items-center gap-2">
              <select aria-label={`Platform for link ${index + 1}`} data-testid={`select-platform-${link.id}`} className="studio-input min-w-0 flex-1 py-2 text-[11px]" value={link.platform} onChange={(event) => { const platform = event.target.value as SocialLink['platform']; patchLink(link.id, { platform, title: platformDefaults[platform].title, icon: platformDefaults[platform].icon }); }}>
                {platforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
              </select>
              <div className="flex shrink-0">
                <button data-testid={`button-move-up-${link.id}`} aria-label="Move link up" disabled={index === 0} onClick={() => moveLink(index, -1)} className="rounded-l-md border border-white/10 p-2 text-[#888d97] hover:text-[#e6c777] disabled:opacity-25"><ChevronUp size={14} /></button>
                <button data-testid={`button-move-down-${link.id}`} aria-label="Move link down" disabled={index === state.links.length - 1} onClick={() => moveLink(index, 1)} className="border-y border-r border-white/10 p-2 text-[#888d97] hover:text-[#e6c777] disabled:opacity-25"><ChevronDown size={14} /></button>
                <button data-testid={`button-delete-link-${link.id}`} aria-label={`Remove ${link.platform}`} onClick={() => onLinksChange(state.links.filter((item) => item.id !== link.id))} className="ml-1 rounded-md border border-white/10 p-2 text-[#858994] hover:border-red-300/30 hover:text-red-300"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_112px] gap-2">
              <label><span className="sr-only">Link title</span><input data-testid={`input-link-title-${link.id}`} className="studio-input py-2 text-[10px]" value={link.title} onChange={(event) => patchLink(link.id, { title: event.target.value })} placeholder="Button title" /></label>
              <label><span className="sr-only">Icon style</span><select data-testid={`select-icon-${link.id}`} aria-label="Choose link icon" className="studio-input py-2 text-[10px]" value={link.icon} onChange={(event) => patchLink(link.id, { icon: event.target.value })}>{iconChoices.map((choice) => <option key={choice} value={choice}>{choice.replace('-', ' ')}</option>)}</select></label>
            </div>
            <label className="mt-2 block"><span className="sr-only">Destination URL</span><input data-testid={`input-link-url-${link.id}`} className="studio-input py-2 text-[10px]" type="url" value={link.url} onChange={(event) => patchLink(link.id, { url: event.target.value })} placeholder="https://..." /></label>
          </div>)}
        </div>
        {state.links.length === 0 && <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center"><Link2 size={17} className="mx-auto mb-2 text-[#777c86]" /><p className="text-xs text-[#999da6]">A clean slate. Add your first link.</p></div>}
      </section>
      <div className="mt-5 rounded-xl border border-white/[.07] bg-white/[.025] p-3 text-[10px] leading-relaxed text-[#747984]"><CircleHelp size={13} className="mr-1.5 inline text-[#bda15c]" />Changes save automatically on this device. Export a standalone page when you are ready.</div>
    </aside>
  );
}
