import { useRef, useState } from 'react';
import { Camera, ChevronDown, ChevronUp, CircleHelp, FileDown, FileUp, Link2, Moon, Plus, Sun, Trash2, UserRound, WandSparkles } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { iconChoices, platformDefaults, platforms, socialPlatforms } from './data';
import type { Platform, Profile, SocialLink, StudioState, Theme } from './types';

const themeOptions: { value: Theme; title: string; hint: string }[] = [
  { value: 'obsidian', title: 'Obsidian Black', hint: 'Smoked glass · warm gold' },
  { value: 'cyberpunk', title: 'Cyberpunk', hint: 'Electric cyan · magenta' },
  { value: 'royal', title: 'Royal Gold', hint: 'Deep noir · polished gold' },
];

const fontOptions: { value: Profile['font']; label: string }[] = [
  { value: 'Tajawal', label: 'Tajawal · Arabic / Latin' },
  { value: 'Cairo', label: 'Cairo · Arabic / Latin' },
  { value: 'Cinzel', label: 'Cinzel · cinematic serif' },
];

interface SidebarProps {
  state: StudioState;
  onProfileChange: (patch: Partial<Profile>) => void;
  onLinksChange: (links: SocialLink[]) => void;
  onImportFile: (file: File) => void;
  onExportJson: () => void;
  importStatus: string;
}

interface ToggleControlProps {
  title: string;
  detail: string;
  checked: boolean;
  testId: string;
  onChange: (checked: boolean) => void;
}

function ToggleControl({ title, detail, checked, testId, onChange }: ToggleControlProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[.07] bg-black/20 px-3 py-2.5">
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold text-[#e7e1d5]">{title}</span>
        <span className="mt-0.5 block text-[9px] leading-4 text-[#7e838d]">{detail}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        data-testid={testId}
        className="studio-toggle shrink-0 rounded-full p-1"
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-track relative flex h-[21px] w-[40px] items-center rounded-full p-[2px]">
          <span className={`h-[15px] w-[15px] rounded-full bg-[#d8b665] shadow transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`} />
        </span>
      </button>
    </div>
  );
}

function createLinkId() {
  return `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function Sidebar({ state, onProfileChange, onLinksChange, onImportFile, onExportJson, importStatus }: SidebarProps) {
  const importRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Platform>('Instagram');
  const [templateStatus, setTemplateStatus] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customError, setCustomError] = useState('');

  const patchLink = (id: string, patch: Partial<SocialLink>) => onLinksChange(
    state.links.map((link) => link.id === id ? { ...link, ...patch } : link),
  );

  const addLink = () => {
    const used = state.links.map((link) => link.platform);
    const platform = platforms.find((option) => !used.includes(option)) ?? 'Instagram';
    const details = platformDefaults[platform];
    onLinksChange([...state.links, { id: createLinkId(), platform, ...details }]);
  };

  const loadTemplate = () => {
    const details = platformDefaults[selectedTemplate];
    onLinksChange([...state.links, { id: createLinkId(), platform: selectedTemplate, ...details }]);
    setTemplateStatus(`${selectedTemplate} template added to your links.`);
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

  const importJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onImportFile(file);
    event.target.value = '';
  };

  const addCustomLink = () => {
    setCustomError('');
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(customUrl);
    } catch {
      setCustomError('Enter a complete link beginning with https://.');
      return;
    }
    if (!customTitle.trim()) {
      setCustomError('Add a title for this service.');
      return;
    }
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      setCustomError('Use a secure https:// or http:// link.');
      return;
    }
    onLinksChange([...state.links, {
      id: createLinkId(),
      platform: 'Custom',
      title: customTitle.trim().slice(0, 80),
      url: parsedUrl.toString(),
      icon: 'globe',
    }]);
    setCustomTitle('');
    setCustomUrl('');
  };

  return (
    <aside className="glass-panel rounded-[22px] p-5 sm:p-6" data-testid="panel-editor">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#d8b665]/20 bg-[#d8b665]/[.08] text-[#d8b665]"><WandSparkles size={17} /></span>
          <div><h2 className="text-sm font-semibold tracking-wide text-[#f1ecdf]">Studio controls</h2><p className="mt-0.5 text-[10px] text-[#9699a2]">Shape your public presence</p></div>
        </div>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] tracking-[.18em] text-[#a5a9b2]">01 / 03</span>
      </div>
      <div className="gold-line mb-5 opacity-60" />

      <section aria-labelledby="profile-heading">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#e8e1d0]"><UserRound size={14} className="text-[#d8b665]" /><h3 id="profile-heading">Creator profile</h3></div>
        <div className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-black/20 p-3">
          <img src={state.profile.avatarUrl || '/shaheen-Studio.png'} alt="Current creator avatar" className="h-12 w-12 rounded-xl border border-[#d8b665]/30 object-cover" />
          <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-[#e9e3d5]">{state.profile.name || 'Your name'}</div><div className="mt-1 text-[10px] text-[#9a9ea7]">Square image · 5 MB max</div></div>
          <label className="cursor-pointer rounded-lg border border-white/10 px-2.5 py-2 text-[10px] text-[#d2cec4] transition hover:border-[#d8b665]/50 hover:text-[#e5c678]"><Camera size={13} className="mr-1.5 inline" />Change<input data-testid="input-avatar" className="sr-only" type="file" accept="image/*" onChange={uploadAvatar} /></label>
        </div>
        <div className="mt-3 space-y-3">
          <label className="block"><span className="studio-label mb-1.5 block">Avatar image URL</span><input data-testid="input-avatar-url" className="studio-input" type="url" maxLength={2048} value={state.profile.avatarUrl.startsWith('data:') ? '' : state.profile.avatarUrl} onChange={(event) => onProfileChange({ avatarUrl: event.target.value })} placeholder="Paste an image URL..." /></label>
          <label className="block"><span className="studio-label mb-1.5 block">Display name</span><input data-testid="input-profile-name" className="studio-input" value={state.profile.name} maxLength={32} onChange={(event) => onProfileChange({ name: event.target.value })} placeholder="Your name or creative alias" /></label>
          <label className="block"><span className="studio-label mb-1.5 block">Short introduction</span><textarea data-testid="input-profile-bio" className="studio-input min-h-[76px] resize-y" value={state.profile.bio} maxLength={110} onChange={(event) => onProfileChange({ bio: event.target.value })} placeholder="Tell people what you create..." /><span className="mt-1 block text-right text-[9px] text-[#8c909b]">{state.profile.bio.length} / 110</span></label>
        </div>
      </section>

      <div className="my-5 border-t border-white/[.07]" />
      <section aria-labelledby="visual-heading">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#e8e1d0]"><span className="h-1.5 w-1.5 rounded-full bg-[#d8b665]" /><h3 id="visual-heading">Visual direction</h3></div>
        <span className="studio-label mb-2 block">Display mode</span>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" data-testid="button-mode-dark" aria-pressed={state.profile.colorMode === 'dark'} onClick={() => onProfileChange({ colorMode: 'dark' })} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] transition ${state.profile.colorMode === 'dark' ? 'border-[#d8b665]/60 bg-[#d8b665]/10 text-[#f0d88e]' : 'border-white/10 bg-black/20 text-[#a0a4ad] hover:border-white/20'}`}><Moon size={13} />Dark Mode</button>
          <button type="button" data-testid="button-mode-light" aria-pressed={state.profile.colorMode === 'light'} onClick={() => onProfileChange({ colorMode: 'light' })} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] transition ${state.profile.colorMode === 'light' ? 'border-[#d8b665]/60 bg-[#d8b665]/10 text-[#f0d88e]' : 'border-white/10 bg-black/20 text-[#a0a4ad] hover:border-white/20'}`}><Sun size={13} />Light Mode</button>
        </div>
        <label className="mt-4 block"><span className="studio-label mb-2 block">Color theme</span><select data-testid="select-theme" aria-label="Color theme" className="studio-input" value={state.profile.theme} onChange={(event) => onProfileChange({ theme: event.target.value as Theme })}>{themeOptions.map((option) => <option key={option.value} value={option.value}>{option.title} — {option.hint}</option>)}</select></label>
        <label className="mt-4 block"><span className="studio-label mb-2 block">Typography</span><select data-testid="select-font" aria-label="Typography" className="studio-input" value={state.profile.font} onChange={(event) => onProfileChange({ font: event.target.value as Profile['font'] })} style={{ fontFamily: state.profile.font }}>{fontOptions.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}</select></label>
        <div className="mt-4"><span className="studio-label mb-2 block">Link transitions</span><div className="grid grid-cols-3 gap-1 rounded-xl border border-white/[.08] bg-black/20 p-1">
          {[['fade', 'Fade'], ['slide', 'Slide'], ['coverflow', '3D Coverflow']].map(([value, label]) => <button type="button" data-testid={`button-animation-${value}`} key={value} aria-pressed={state.profile.animation === value} onClick={() => onProfileChange({ animation: value as Profile['animation'] })} className={`rounded-lg px-2 py-2 text-[9px] transition ${state.profile.animation === value ? 'bg-[#d6b666]/15 text-[#e3c679]' : 'text-[#9da1aa] hover:text-[#eee8da]'}`}>{label}</button>)}
        </div></div>
      </section>

      <div className="my-5 border-t border-white/[.07]" />
      <section aria-labelledby="effects-heading">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#e8e1d0]"><WandSparkles size={14} className="text-[#55d8ef]" /><h3 id="effects-heading">Neon & cinematic effects</h3></div>
        <div className="space-y-2">
          <ToggleControl title="Glowing borders" detail="Neon edges on the profile and links" checked={state.profile.neonBorders} testId="toggle-neon-borders" onChange={(neonBorders) => onProfileChange({ neonBorders })} />
          <ToggleControl title="Glowing text" detail="Accented light around key profile text" checked={state.profile.neonText} testId="toggle-neon-text" onChange={(neonText) => onProfileChange({ neonText })} />
          <ToggleControl title="Floating elements" detail="A slow, subtle lift across the page" checked={state.profile.floating} testId="toggle-floating" onChange={(floating) => onProfileChange({ floating })} />
          <ToggleControl title="Glowing pulses" detail="A gentle animated glow on accents" checked={state.profile.glowingPulse} testId="toggle-glowing-pulses" onChange={(glowingPulse) => onProfileChange({ glowingPulse })} />
          <ToggleControl title="GSAP cinematic entrance" detail="Blur-to-focus stagger when links change" checked={state.profile.gsapEntrance} testId="toggle-gsap-entrance" onChange={(gsapEntrance) => onProfileChange({ gsapEntrance })} />
        </div>
      </section>

      <div className="my-5 border-t border-white/[.07]" />
      <section aria-labelledby="template-heading">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#e8e1d0]"><WandSparkles size={14} className="text-[#d8b665]" /><h3 id="template-heading">Ready templates</h3></div>
        <label className="block"><span className="studio-label mb-2 block">Social profile</span><select data-testid="select-template" className="studio-input" value={selectedTemplate} onChange={(event) => { setSelectedTemplate(event.target.value as Platform); setTemplateStatus(''); }}>{socialPlatforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}</select></label>
        <button type="button" data-testid="button-load-template" onClick={loadTemplate} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#d8b665]/30 bg-[#d8b665]/[.06] px-3 py-2.5 text-[10px] font-semibold text-[#e4c879] transition hover:border-[#d8b665]/60 hover:bg-[#d8b665]/[.12]"><Plus size={13} />Load social template</button>
        {templateStatus && <p role="status" className="mt-2 text-[10px] text-emerald-200">{templateStatus}</p>}
      </section>

      <div className="my-5 border-t border-white/[.07]" />
      <section aria-labelledby="links-heading">
        <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-semibold text-[#e8e1d0]"><Link2 size={14} className="text-[#d8b665]" /><h3 id="links-heading">Your links</h3><span className="rounded-full bg-white/[.07] px-1.5 py-0.5 text-[9px] text-[#b2b5bd]">{state.links.length}</span></div><button type="button" data-testid="button-add-link" onClick={addLink} className="flex items-center gap-1 rounded-lg border border-[#d8b665]/35 px-2.5 py-1.5 text-[10px] text-[#e0c478] transition hover:bg-[#d8b665]/10"><Plus size={12} />Add link</button></div>
        <div className="space-y-2">
          {state.links.map((link, index) => <div key={link.id} className="rounded-xl border border-white/[.075] bg-black/20 p-3" data-testid={`card-link-${link.id}`}>
            <div className="mb-2 flex items-center gap-2">
              <select aria-label={`Platform for link ${index + 1}`} data-testid={`select-platform-${link.id}`} className="studio-input min-w-0 flex-1 py-2 text-[11px]" value={link.platform} onChange={(event) => { const platform = event.target.value as Platform; patchLink(link.id, { platform, title: platformDefaults[platform].title, icon: platformDefaults[platform].icon }); }}>
                {platforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
              </select>
              <div className="flex shrink-0">
                <button type="button" data-testid={`button-move-up-${link.id}`} aria-label={`Move ${link.title || link.platform} up`} disabled={index === 0} onClick={() => moveLink(index, -1)} className="rounded-l-md border border-white/10 p-2 text-[#a3a7af] hover:text-[#e6c777] disabled:opacity-25"><ChevronUp size={14} /></button>
                <button type="button" data-testid={`button-move-down-${link.id}`} aria-label={`Move ${link.title || link.platform} down`} disabled={index === state.links.length - 1} onClick={() => moveLink(index, 1)} className="border-y border-r border-white/10 p-2 text-[#a3a7af] hover:text-[#e6c777] disabled:opacity-25"><ChevronDown size={14} /></button>
                <button type="button" data-testid={`button-delete-link-${link.id}`} aria-label={`Remove ${link.platform}`} onClick={() => onLinksChange(state.links.filter((item) => item.id !== link.id))} className="ml-1 rounded-md border border-white/10 p-2 text-[#a3a7af] hover:border-red-300/30 hover:text-red-300"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_112px] gap-2">
              <label><span className="sr-only">Link title</span><input data-testid={`input-link-title-${link.id}`} className="studio-input py-2 text-[10px]" value={link.title} maxLength={80} onChange={(event) => patchLink(link.id, { title: event.target.value })} placeholder="Button title" /></label>
              <label><span className="sr-only">Icon style</span><select data-testid={`select-icon-${link.id}`} aria-label="Choose link icon" className="studio-input py-2 text-[10px]" value={link.icon} onChange={(event) => patchLink(link.id, { icon: event.target.value })}>{iconChoices.map((choice) => <option key={choice} value={choice}>{choice.replace('-', ' ')}</option>)}</select></label>
            </div>
            <label className="mt-2 block"><span className="sr-only">Destination URL</span><input data-testid={`input-link-url-${link.id}`} className="studio-input py-2 text-[10px]" type="url" maxLength={2048} value={link.url} onChange={(event) => patchLink(link.id, { url: event.target.value })} placeholder="https://..." /></label>
          </div>)}
        </div>
        {state.links.length === 0 && <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center"><Link2 size={17} className="mx-auto mb-2 text-[#9398a2]" /><p className="text-xs text-[#b2b5bd]">A clean slate. Add your first link.</p></div>}
      </section>

      <div className="my-5 border-t border-white/[.07]" />
      <section aria-labelledby="other-services-heading">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#e8e1d0]"><Plus size={14} className="text-[#55d8ef]" /><h3 id="other-services-heading">Other services</h3></div>
        <div className="space-y-2">
          <label className="block"><span className="studio-label mb-1.5 block">Service title</span><input data-testid="input-custom-link-title" className="studio-input" value={customTitle} maxLength={80} onChange={(event) => setCustomTitle(event.target.value)} placeholder="Portfolio, store, booking..." /></label>
          <label className="block"><span className="studio-label mb-1.5 block">Service URL</span><input data-testid="input-custom-link-url" className="studio-input" type="url" maxLength={2048} value={customUrl} onChange={(event) => setCustomUrl(event.target.value)} placeholder="https://your-service.com" /></label>
          {customError && <p role="alert" className="text-[10px] text-rose-300">{customError}</p>}
          <button type="button" data-testid="button-add-custom-link" onClick={addCustomLink} className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-[10px] text-[#c4c8d0] transition hover:border-[#55d8ef]/40 hover:text-[#77deef]"><Plus size={13} />Add custom link</button>
        </div>
      </section>

      <div className="my-5 border-t border-white/[.07]" />
      <section aria-labelledby="configuration-heading">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#e8e1d0]"><FileDown size={14} className="text-[#d8b665]" /><h3 id="configuration-heading">Configuration file</h3></div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" data-testid="button-import-json" onClick={() => importRef.current?.click()} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-2 py-2.5 text-[10px] text-[#c5c8cf] transition hover:border-[#55d8ef]/40 hover:text-[#80e1ef]"><FileUp size={13} />Import JSON</button>
          <button type="button" data-testid="button-export-json" onClick={onExportJson} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-2 py-2.5 text-[10px] text-[#c5c8cf] transition hover:border-[#d8b665]/45 hover:text-[#e7cd84]"><FileDown size={13} />Export JSON</button>
        </div>
        <input ref={importRef} data-testid="input-import-json" className="sr-only" type="file" accept="application/json,.json" onChange={importJson} />
        {importStatus && <p data-testid="status-import-json" role="status" className={`mt-2 text-[10px] ${importStatus.toLowerCase().includes('could not') || importStatus.toLowerCase().includes('must') || importStatus.toLowerCase().includes('invalid') || importStatus.toLowerCase().includes('missing') ? 'text-rose-300' : 'text-emerald-200'}`}>{importStatus}</p>}
      </section>

      <div className="mt-5 rounded-xl border border-white/[.07] bg-white/[.025] p-3 text-[10px] leading-relaxed text-[#a0a4ad]"><CircleHelp size={13} className="mr-1.5 inline text-[#bda15c]" />Changes save automatically on this device. Create a standalone page when you are ready.</div>
    </aside>
  );
}
