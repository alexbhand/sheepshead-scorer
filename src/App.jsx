import React, { useState, useEffect, useMemo, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Plus, Trash2, Users, DollarSign, History, Settings, UserPlus, X, Trophy, AlertTriangle, CheckCircle, RotateCcw, Zap, Crown, Play, BookOpen, LogOut, Club, Diamond, Hammer, Mail, Send, TrendingUp, LayoutGrid, Check, Music, Coffee, SkipForward, GripVertical, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

// --- UI Components ---

const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all ${onClick ? 'active:scale-[0.98] cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200",
    danger: "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    amber: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200",
    gold: "bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 border border-amber-400/50 shadow-lg shadow-amber-900/20",
    red: "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200"
  };
  
  const baseShadow = variant === 'secondary' || variant === 'danger' ? '' : 'shadow-md';

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        'px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95',
        variants[variant] || variants.primary,
        baseShadow,
        disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : '',
        className
      )}
    >
      {children}
    </button>
  );
};

const Toast = ({ message, show }) => (
  <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'}`}>
    <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-medium text-sm">
      <CheckCircle size={16} className="text-emerald-400" />
      {message}
    </div>
  </div>
);

// CSS 3D Quarter Stack
const QuarterStack = ({ count = 5, className = "" }) => (
  <div className={`relative w-12 h-16 ${className}`}>
    {Array.from({ length: Math.min(count, 10) }).map((_, i) => (
      <div 
        key={i}
        className="absolute w-12 h-3 rounded-[50%] border border-slate-400"
        style={{ 
          bottom: `${i * 5}px`, 
          zIndex: i,
          background: 'linear-gradient(90deg, #94a3b8 0%, #e2e8f0 30%, #cbd5e1 50%, #64748b 100%)',
          boxShadow: '0 2px 3px rgba(0,0,0,0.4)'
        }}
      ></div>
    ))}
    {/* Top Face of top coin */}
    <div 
        className="absolute w-12 h-12 rounded-full border border-slate-300 bg-slate-200 flex items-center justify-center"
        style={{ 
            bottom: `${(Math.min(count, 10) - 1) * 5}px`, 
            zIndex: count + 1,
            background: 'radial-gradient(circle at 30% 30%, #f1f5f9, #94a3b8)',
            transform: 'scaleY(0.35) translateY(-14px)',
            boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)'
        }}
    >
    </div>
  </div>
);

// Helper component for Realistic Cards
// colorClass is a whole class string on purpose: Tailwind's scanner cannot see
// an interpolated `text-${color}-600`, so those styles only existed here by
// coincidence, borrowed from unrelated usages elsewhere in the file.
const PlayingCard = ({ rank, suit, colorClass, rotate = '', Icon }) => (
  <div 
    className={`w-16 h-24 bg-white rounded-lg flex flex-col justify-between p-1.5 border border-slate-300 relative ${rotate}`}
    style={{ 
        boxShadow: '3px 4px 8px rgba(0,0,0,0.4)',
        background: 'linear-gradient(135deg, #fffcfc 0%, #f0f0f0 100%)' 
    }}
  >
    {/* Inner Border found on many cards */}
    <div className="absolute inset-1 border border-slate-200/50 rounded pointer-events-none"></div>

    {/* Top Index */}
    <div className={`${colorClass} flex flex-col items-center leading-none`}>
       <span className="text-lg font-bold font-serif">{rank}</span>
       <span className="text-[10px]">{suit}</span>
    </div>
    
    {/* Center Art */}
    <div className={`absolute inset-0 flex items-center justify-center ${colorClass}`}>
         {rank === 'Q' ? (
           <div className="relative">
             <Crown size={28} className="fill-current opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center font-serif font-black text-xl">Q</div>
           </div>
         ) : (
           <div className="relative">
             <Icon size={28} className="fill-current opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center font-serif font-black text-xl italic">J</div>
           </div>
         )}
    </div>

    {/* Bottom Index */}
    <div className={`${colorClass} flex flex-col items-center leading-none transform rotate-180`}>
       <span className="text-lg font-bold font-serif">{rank}</span>
       <span className="text-[10px]">{suit}</span>
    </div>
  </div>
);

// 3 Stylized Kings Icon
const ThreeKingsIcon = () => (
  <div className="flex -space-x-2 items-center justify-center">
    <div className="transform -rotate-12 scale-90 text-amber-600"><Crown size={20} fill="currentColor" className="opacity-80"/></div>
    <div className="z-10 -mt-2 text-amber-500"><Crown size={24} fill="currentColor"/></div>
    <div className="transform rotate-12 scale-90 text-amber-600"><Crown size={20} fill="currentColor" className="opacity-80"/></div>
  </div>
);

// --- Custom Chart Component ---
const SimpleLineChart = ({ history, players }) => {
  const chartHeight = 200;
  const chartWidth = 350;
  const padding = 20;

  // Process data: Convert change history to cumulative balances
  const dataPoints = useMemo(() => {
    const points = [{ index: 0, balances: players.reduce((acc, p) => ({...acc, [p.id]: 0}), {}) }];
    const chronHistory = [...history].reverse();
    let currentBalances = players.reduce((acc, p) => ({...acc, [p.id]: 0}), {});

    chronHistory.forEach((entry, i) => {
      const newBalances = { ...currentBalances };
      Object.entries(entry.changes).forEach(([pid, change]) => {
        newBalances[pid] = (newBalances[pid] || 0) + change;
      });
      points.push({ index: i + 1, balances: newBalances });
      currentBalances = newBalances;
    });
    return points;
  }, [history, players]);

  if (dataPoints.length < 2) return (
    <div className="h-48 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl text-sm border border-slate-100">
      Play a hand to see stats
    </div>
  );

  const allValues = dataPoints.flatMap(d => Object.values(d.balances));
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 0);
  const range = maxVal - minVal || 1;

  const getY = (val) => chartHeight - padding - ((val - minVal) / range) * (chartHeight - 2 * padding);
  const getX = (idx) => padding + (idx / (dataPoints.length - 1)) * (chartWidth - 2 * padding);

  const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#64748b'];

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
        {/* Zero Line */}
        <line x1={padding} y1={getY(0)} x2={chartWidth - padding} y2={getY(0)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
        
        {players.filter(p => p.active || dataPoints.some(d => d.balances[p.id] !== 0)).map((player, i) => {
          const pathD = dataPoints.map((pt, idx) => 
            `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(pt.balances[player.id])}`
          ).join(' ');
          
          return (
            <g key={player.id}>
              <path d={pathD} fill="none" stroke={colors[i % colors.length]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle 
                cx={getX(dataPoints.length - 1)} 
                cy={getY(dataPoints[dataPoints.length - 1].balances[player.id])} 
                r="3" 
                fill="white"
                stroke={colors[i % colors.length]}
                strokeWidth="2"
              />
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
        {players.filter(p => p.active || dataPoints.some(d => d.balances[p.id] !== 0)).map((player, i) => (
          <div key={player.id} className="flex items-center gap-1.5 text-[11px] bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i % colors.length] }}></div>
            <span className="text-slate-700 font-semibold">{player.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Game Constants & Table Helpers ---

const GAME_BASE_VALUE = 0.25;
const POT_CONTRIBUTION = 0.25;
const HAND_SIZE = 5;

// Balances are all quarters; keep them off binary-float drift.
const money = (n) => Math.round(n * 100) / 100;

// Pots used to be plain numbers. They now carry a per-player ledger of the
// antes inside them so a player who steps away can be refunded exactly.
const normalizePot = (pot, idx) => (
  typeof pot === 'number'
    ? { id: `legacy-${idx}`, value: pot, contributions: {} }
    : { id: pot.id ?? `legacy-${idx}`, value: pot.value, contributions: pot.contributions || {} }
);

const normalizePlayer = (p) => ({ away: false, skipRotation: false, ...p });

// "Player 3" is a suggestion the app made up, not a name anyone chose, so the
// field renders it as a real placeholder - the first keystroke replaces it.
// A name that was actually typed stays as a value, so tapping mid-word puts the
// caret where you tapped and you can fix a typo without retyping the lot.
const isDefaultName = (name) => /^Player \d+$/.test((name || '').trim());
const defaultNameFor = (player) => `Player ${player.id}`;

// Storage is not guaranteed. Safari can refuse it outright ("Block All
// Cookies", private browsing) and a write can be rejected on a full quota;
// a half-written or hand-edited value can also fail to parse. None of that
// should be able to take the app down, so every access goes through here.
const STORAGE_KEY = 'sheepshead_data';

const STORAGE_OK = 'ok';
const STORAGE_UNREADABLE = 'unreadable';
const STORAGE_UNWRITABLE = 'unwritable';

const readSavedGame = () => {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return { status: STORAGE_UNWRITABLE, data: null };
  }
  if (!raw) return { status: STORAGE_OK, data: null };
  try {
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.players) || data.players.length === 0) {
      return { status: STORAGE_UNREADABLE, data: null };
    }
    return { status: STORAGE_OK, data };
  } catch {
    return { status: STORAGE_UNREADABLE, data: null };
  }
};

const writeSavedGame = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
};

const clearSavedGame = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear if storage is unavailable */
  }
};

// Pot ids are React keys only; a session-local sequence keeps them unique.
let potSequence = 0;
const makePotId = (tag = '') => `pot-${Date.now().toString(36)}-${potSequence++}${tag}`;

const seatOrderFrom = (startId, list) => {
  const idx = list.findIndex(p => p.id === startId);
  return idx === -1 ? [...list] : [...list.slice(idx), ...list.slice(0, idx)];
};

const canDeal = (p) => !p.away && !p.skipRotation;

// First player seated after `currentId` who is at the table and taking deals.
const nextDealerFrom = (currentId, list) => {
  const order = seatOrderFrom(currentId, list);
  const after = [...order.slice(1), ...order.slice(0, 1)];
  const next = after.find(canDeal) || list.find(canDeal);
  return next ? next.id : currentId;
};

// Exactly HAND_SIZE players sit in each hand. The dealer sits out first, then
// the seats following them. Anyone flagged skipRotation is pulled out ahead of
// that, and anyone away is never seated at all.
const recomputeSeating = (dealerId, list) => {
  const present = list.filter(p => !p.away);
  if (present.length <= HAND_SIZE) {
    return list.map(p => ({ ...p, active: !p.away }));
  }
  const sitCount = present.length - HAND_SIZE;
  const order = seatOrderFrom(dealerId, present);
  const sitters = [];
  const take = (p) => {
    if (sitters.length < sitCount && !sitters.includes(p.id)) sitters.push(p.id);
  };
  order.filter(p => p.skipRotation).forEach(take);
  order.forEach(take);
  return list.map(p => ({ ...p, active: !p.away && !sitters.includes(p.id) }));
};

// A render error used to leave a blank white page with no way back. Catch it
// and offer the two escapes that actually work.
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen min-h-[100dvh] bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-100 p-6 space-y-4">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle size={32} />
            <h3 className="text-lg font-bold text-slate-800">Something went wrong</h3>
          </div>
          <p className="text-slate-600 text-sm">
            The app hit an unexpected error. Your saved game is still on this device -
            reloading will usually pick it back up.
          </p>
          <p className="text-[11px] font-mono text-slate-400 bg-slate-50 border border-slate-200 rounded-lg p-2 break-words">
            {String(this.state.error?.message || this.state.error)}
          </p>
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} className="w-full py-3">
              <RotateCcw size={18} /> Reload
            </Button>
            <Button
              variant="danger"
              className="w-full py-3"
              onClick={() => { clearSavedGame(); window.location.reload(); }}
            >
              <Trash2 size={18} /> Discard Saved Game & Reload
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

// --- VIEWS ---

const StartMenuView = ({ startNewGame, hasSavedGame, loadGame, setView }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] w-full relative overflow-hidden animate-in fade-in duration-200">
    {/* Background */}
    <div 
      className="absolute inset-0 z-0" 
      style={{
        backgroundColor: '#1b4d3e', 
        backgroundImage: `
          radial-gradient(circle at 50% 50%, #2f855a 0%, #1a4f3b 60%, #063c2a 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
        `,
        backgroundBlendMode: 'normal, overlay',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
      }}
    />
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(transparent 60%, rgba(0,0,0,0.4) 100%)' }}></div>

    <div className="relative z-10 mb-12 text-center space-y-8">
       <div className="flex justify-center items-end gap-6 mb-2 filter drop-shadow-2xl">
          <QuarterStack count={5} className="transform -rotate-6" />
          <div className="flex items-center justify-center relative w-32 h-24">
              <div className="absolute top-0 transform -rotate-12 -translate-x-4 transition-transform hover:-translate-y-2 duration-300">
                 <PlayingCard rank="J" suit="♦" colorClass="text-rose-600" Icon={Diamond} />
              </div>
              <div className="absolute top-0 z-10 transform rotate-6 translate-x-4 transition-transform hover:-translate-y-2 duration-300">
                 <PlayingCard rank="Q" suit="♣" colorClass="text-slate-600" Icon={Club} />
              </div>
          </div>
          <QuarterStack count={8} className="transform rotate-3" />
       </div>

       <div className="space-y-1 drop-shadow-lg">
          <div className="text-amber-300/90 font-serif tracking-[0.25em] text-xs uppercase font-bold">Shorewood</div>
          <h1 className="text-white text-5xl font-serif font-black tracking-tight" 
              style={{ 
                textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                background: 'linear-gradient(to bottom, #fff, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            Sheepshead
          </h1>
          <div className="flex items-center justify-center gap-3 opacity-90">
            <div className="h-[1px] w-8 bg-amber-400/50"></div>
            <div className="text-amber-400 font-bold tracking-[0.2em] text-[10px] uppercase">Scoring App</div>
            <div className="h-[1px] w-8 bg-amber-400/50"></div>
          </div>
       </div>
    </div>

    <div className="w-full max-w-xs space-y-4 z-10 px-6 pb-6">
      <Button onClick={startNewGame} variant="gold" className="w-full py-4 text-lg font-serif tracking-wide shadow-xl transform hover:-translate-y-0.5 transition-all">
        <Play size={18} fill="currentColor" className="opacity-80" /> NEW GAME
      </Button>
      
      {hasSavedGame && (
        <Button onClick={loadGame} className="w-full py-4 text-lg font-serif bg-white text-slate-900 hover:bg-slate-50 shadow-xl border border-slate-200">
          <RotateCcw size={18} className="opacity-70" /> CONTINUE
        </Button>
      )}
      
      <Button onClick={() => setView('rules')} className="w-full py-3 bg-emerald-900/40 backdrop-blur-md text-emerald-100 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400/50 shadow-lg font-serif text-sm">
        <BookOpen size={16} /> RULES & PAYOUTS
      </Button>
    </div>
  </div>
);

const RulesView = ({ setView }) => (
  <div className="space-y-6 pt-4 pb-20 animate-in slide-in-from-bottom-4 duration-200">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-800">Rules Reference</h2>
      <button onClick={() => setView('startMenu')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
        <X size={20} />
      </button>
    </div>
    
    <Card className="p-5 space-y-4 border-l-4 border-emerald-500">
        <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
          <Trophy size={20}/> Card Points (120 Total)
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between border-b pb-1"><span>Ace</span> <span className="font-bold">11</span></div>
          <div className="flex justify-between border-b pb-1"><span>Ten</span> <span className="font-bold">10</span></div>
          <div className="flex justify-between border-b pb-1"><span>King</span> <span className="font-bold">4</span></div>
          <div className="flex justify-between border-b pb-1"><span>Queen</span> <span className="font-bold">3</span></div>
          <div className="flex justify-between border-b pb-1"><span>Jack</span> <span className="font-bold">2</span></div>
          <div className="flex justify-between border-b pb-1 text-slate-400"><span>9, 8, 7</span> <span>0</span></div>
        </div>
      </Card>
      <Card className="p-5 space-y-4 border-l-4 border-slate-500">
         <h3 className="font-bold text-lg text-slate-800">Game Mechanics</h3>
         <ul className="space-y-2 text-sm text-slate-600">
            <li><strong className="text-slate-900">Schneider:</strong> Defense needs 31+ points to save.</li>
            <li><strong className="text-slate-900">Double on Bump:</strong> Loss points doubled (x2).</li>
            <li><strong className="text-slate-900">Pass:</strong> If no one picks, everyone pays to the pot.</li>
            <li><strong className="text-slate-900">Pot Logic:</strong> Picker wins pot 2/3 (Partner 1/3). If Picker loses, they match the pot + sitters pay.</li>
         </ul>
      </Card>
  </div>
);

const ThreeKingsLyricsModal = ({ onComplete }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
    <div className="w-full max-w-md bg-gradient-to-b from-indigo-900 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30">
      <div className="p-6 text-center space-y-6 relative">
        {/* Animated Background Stars */}
        <div className="absolute top-4 right-8 animate-pulse text-amber-200"><Crown size={12} /></div>
        <div className="absolute top-12 left-6 animate-pulse delay-75 text-amber-100"><Crown size={8} /></div>
        
        <div className="mx-auto w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-amber-500/30 animate-bounce">
           <Music size={40} className="text-amber-400" />
        </div>
        
        <h2 className="text-2xl font-serif font-bold text-amber-100">Sing Along!</h2>
        
        {/* Bouncing Ball Animation */}
        <div className="relative py-4 px-2">
           <div className="absolute top-0 left-0 w-4 h-4 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50 animate-[bounce_2s_infinite]" 
                style={{ animationName: 'lyricsBounce', animationDuration: '4s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
           ></div>
           <style>{`
             @keyframes lyricsBounce {
               0%, 100% { left: 0%; top: 0px; }
               25% { left: 25%; top: 10px; }
               50% { left: 50%; top: 0px; }
               75% { left: 75%; top: 10px; }
               90% { left: 90%; top: 0px; }
             }
           `}</style>
           
           <div className="space-y-4 font-serif text-lg leading-relaxed text-indigo-100">
             <p>
               We three kings of Orient are;<br/>
               bearing gifts we traverse afar,<br/>
               field and fountain, moor and mountain,<br/>
               following yonder star.
             </p>
             <div className="h-px w-1/2 bg-indigo-500/50 mx-auto"></div>
             <p className="font-bold text-amber-200">
               O star of wonder, star of light,<br/>
               star with royal beauty bright,<br/>
               westward leading, still proceeding,<br/>
               guide us to thy perfect light.
             </p>
           </div>
        </div>

        <Button onClick={onComplete} variant="gold" className="w-full mt-6 text-lg py-4 shadow-xl">
          Done Singing, Select Winner
        </Button>
      </div>
    </div>
  </div>
);

const ThreeKingsView = ({ presentPlayers, handleThreeKings, setView }) => (
  <div className="space-y-6 pt-4 animate-in zoom-in-95 duration-200">
    <Card className="p-6 text-center space-y-4 border-amber-100 bg-gradient-to-b from-white to-amber-50/30">
      <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-inner">
         <Crown size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">3 Kings Payout</h2>
      <p className="text-slate-500 text-sm">Select the player who has 3 Kings. Everyone else at the table pays them $0.25. Away players are not involved.</p>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        {presentPlayers.map(p => (
          <button
            key={p.id}
            onClick={() => handleThreeKings(p.id)}
            className="p-4 border rounded-xl hover:bg-amber-50 hover:border-amber-400 font-bold text-slate-700 transition-all active:scale-95 bg-white shadow-sm"
          >
            {p.name}
          </button>
        ))}
      </div>
      <Button variant="secondary" onClick={() => setView('game')} className="w-full mt-4">Cancel</Button>
    </Card>
  </div>
);

// Who is seated this hand, who is dealing, who has stepped away. Tap any
// player to swap them between playing and sitting out.
const TableCard = ({ players, presentPlayers, activePlayers, dealerId, toggleSeat, passDeal }) => {
  const awayPlayers = players.filter(p => p.away);
  const seated = activePlayers.length;
  const balanced = seated === HAND_SIZE;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">At The Table</h3>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full tracking-wide ${balanced ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
            {seated}/{HAND_SIZE} PLAYING
          </span>
          <button
            onClick={passDeal}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-full transition-colors active:scale-95"
            title="Pass the deal to the next player"
          >
            <SkipForward size={11} /> Pass Deal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {presentPlayers.map(p => (
          <button
            key={p.id}
            onClick={() => toggleSeat(p.id)}
            className={`flex items-center justify-between gap-1 px-3 py-2.5 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${p.active ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
          >
            <span className="truncate">{p.name}</span>
            <span className="flex items-center gap-1 shrink-0">
              {p.skipRotation && (
                <SkipForward size={12} className={p.active ? 'text-emerald-200' : 'text-slate-300'} />
              )}
              {dealerId === p.id && (
                <span className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center ${p.active ? 'bg-white/25 text-white' : 'bg-slate-800 text-white'}`}>
                  D
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {!balanced && (
        <p className="text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
          Tap players to {seated > HAND_SIZE ? 'sit some out' : 'seat more'} until {HAND_SIZE} are playing.
        </p>
      )}

      {awayPlayers.length > 0 && (
        <div className="flex items-start gap-2 text-[11px] text-slate-400 border-t border-slate-100 pt-2">
          <Coffee size={13} className="mt-px shrink-0" />
          <span>
            <span className="font-bold text-slate-500">Away:</span>{' '}
            {awayPlayers.map(p => p.name).join(', ')} — balances frozen, not in the pot.
          </span>
        </div>
      )}
    </Card>
  );
};

const GameView = ({ 
  activePlayers, presentPlayers, pots, totalPotValue, handlePass, 
  wageredPots, setWageredPots, pickerId, setPickerId, 
  partnerId, setPartnerId, crackState, setCrackState, outcome, setOutcome, 
  handGrade, setHandGrade, calculateScore, setView, players, dealerId,
  startThreeKings, toggleSeat, passDeal
}) => {
  const isReady = activePlayers.length === HAND_SIZE;
  const table = (
    <TableCard
      players={players}
      presentPlayers={presentPlayers}
      activePlayers={activePlayers}
      dealerId={dealerId}
      toggleSeat={toggleSeat}
      passDeal={passDeal}
    />
  );
  
  useEffect(() => {
      if (pots.length > 0 && wageredPots === 0) setWageredPots(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // The seating card stays on screen so an unbalanced table can be fixed here.
  if (!isReady) return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {table}
      <Card className="p-6 text-center space-y-3 text-slate-500">
        <Users size={40} className="mx-auto text-slate-300" />
        <h3 className="text-lg font-bold text-slate-700">Set the table to deal</h3>
        <p className="text-sm">Sheepshead needs exactly {HAND_SIZE} players in the hand.</p>
        <Button variant="secondary" onClick={() => setView('players')} className="w-full">
          Manage Players
        </Button>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4 pb-24 animate-in slide-in-from-bottom-2 duration-200">
      {/* Pot Display */}
      <Card className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white p-5 relative overflow-hidden border-none shadow-xl shadow-emerald-900/20">
        {pots.length > 0 && <div className="absolute -top-4 -right-4 text-white opacity-5"><DollarSign size={140}/></div>}
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1">
               {pots.length > 0 ? `${pots.length} ACTIVE POT${pots.length > 1 ? 'S' : ''}` : 'EMPTY POT'}
            </h2>
            <div className="text-4xl font-black flex items-center gap-1 tracking-tight">
              <span className="text-emerald-400 text-2xl">$</span>
              {totalPotValue.toFixed(2)}
            </div>
            {pots.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {pots.map((pot, idx) => (
                  <div key={pot.id ?? idx} className="bg-emerald-900/40 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-100 border border-emerald-500/30">
                    ${pot.value.toFixed(2)}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button variant="secondary" onClick={handlePass} className="bg-emerald-700/50 backdrop-blur-md text-white border border-emerald-500/30 hover:bg-emerald-600 shadow-lg text-xs py-2 px-4 h-auto">
            Pot
          </Button>
        </div>
      </Card>

      {/* Wager Control */}
      {pots.length > 0 && (
        <Card className="p-4 bg-emerald-50/50 border-emerald-100">
           <div className="flex items-center gap-4">
             <div className="flex-1">
               <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2 block">Pot Wager</label>
               <input 
                 type="range" 
                 min="1" 
                 max={pots.length} 
                 value={wageredPots} 
                 onChange={(e) => setWageredPots(parseInt(e.target.value))}
                 className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
               />
               <div className="flex justify-between text-[10px] font-bold text-emerald-600 mt-2">
                  <span>1 Pot</span>
                  <span>{pots.length} Pots</span>
               </div>
             </div>
             <div className="text-center bg-white p-2 rounded-lg shadow-sm border border-emerald-100 min-w-[60px]">
               <div className="text-xl font-black text-emerald-700">{wageredPots}</div>
               <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">Playing</div>
             </div>
           </div>
        </Card>
      )}

      {table}

      {/* Picker Selection */}
      <Card className="p-4 space-y-3">
        <div className="flex justify-between items-center">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Who Picked?</h3>
           {dealerId && <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Dealer: {players.find(p => p.id === dealerId)?.name}</span>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {activePlayers.map(p => (
            <button
              key={p.id}
              onClick={() => {
                 setPickerId(p.id);
                 if (p.id === partnerId) setPartnerId(null);
              }}
              className={`p-3 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${pickerId === p.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200' : 'bg-white text-slate-600 border-slate-100 hover:border-emerald-200'}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Partner Selection */}
      {pickerId && (
        <Card className="p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partner (Jack of Diamonds)</h3>
          <div className="grid grid-cols-3 gap-2">
            {activePlayers.map(p => (
              <button
                key={p.id}
                onClick={() => setPartnerId(p.id)}
                disabled={p.id === pickerId}
                className={`p-3 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 
                  ${p.id === pickerId ? 'opacity-20 cursor-not-allowed bg-slate-50 border-transparent' : ''}
                  ${partnerId === p.id ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200' : 'bg-white text-slate-600 border-slate-100 hover:border-amber-200'}`}
              >
                {p.name}
              </button>
            ))}
            <button
              onClick={() => setPartnerId(pickerId)}
              className={`p-3 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${partnerId === pickerId ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200' : 'bg-white text-slate-600 border-slate-100 hover:border-purple-200'}`}
            >
              Alone
            </button>
          </div>
        </Card>
      )}

      {/* Cracking Section */}
      {pickerId && (
        <Card className="p-1 bg-amber-50/50 border-amber-100 animate-in fade-in duration-200">
           <div className="flex justify-between items-center p-3">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5"><Hammer size={14}/> Crack</h3>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setCrackState(crackState === 'crack' ? 'none' : 'crack')}
                   className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 ${crackState === 'crack' || crackState === 'recrack' ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200'}`}
                 >
                   Crack (x2)
                 </button>
                 {(crackState === 'crack' || crackState === 'recrack') && (
                   <button 
                     onClick={() => setCrackState(crackState === 'recrack' ? 'crack' : 'recrack')}
                     className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 ${crackState === 'recrack' ? 'bg-purple-700 text-white border-purple-700 shadow-sm' : 'bg-white text-slate-500 border-slate-200'}`}
                   >
                     Re-Crack (x4)
                   </button>
                 )}
              </div>
           </div>
        </Card>
      )}

      {/* Results */}
      <Card className="p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Result</h3>
        <div className="flex gap-2 mb-3 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setOutcome('win')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${outcome === 'win' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Picker Win
          </button>
          <button 
            onClick={() => setOutcome('loss')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${outcome === 'loss' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Picker Loss
          </button>
        </div>

        <div className="space-y-2">
           <button onClick={() => setHandGrade('standard')} className={`w-full py-3 px-4 text-left rounded-xl border-2 flex justify-between items-center transition-all active:scale-[0.99] ${handGrade === 'standard' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'border-slate-100 text-slate-600 bg-white hover:border-slate-200'}`}>
              <span className="font-bold text-sm">Schneider</span>
              <span className="text-xs opacity-70 font-medium">
                {outcome === 'win' ? "Defenders > 30 pts" : "Pickers > 30 pts"}
              </span>
           </button>
           <button onClick={() => setHandGrade('schneider')} className={`w-full py-3 px-4 text-left rounded-xl border-2 flex justify-between items-center transition-all active:scale-[0.99] ${handGrade === 'schneider' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'border-slate-100 text-slate-600 bg-white hover:border-slate-200'}`}>
              <span className="font-bold text-sm">No Schneider (x2)</span>
              <span className="text-xs opacity-70 font-medium">
                {outcome === 'win' ? "Defenders < 31 pts" : "Pickers < 31 pts"}
              </span>
           </button>
           <button onClick={() => setHandGrade('schwarz')} className={`w-full py-3 px-4 text-left rounded-xl border-2 flex justify-between items-center transition-all active:scale-[0.99] ${handGrade === 'schwarz' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'border-slate-100 text-slate-600 bg-white hover:border-slate-200'}`}>
              <span className="font-bold text-sm">No Tricker (x3)</span>
              <span className="text-xs opacity-70 font-medium">
                {outcome === 'win' ? "Defenders 0 pts" : "Pickers 0 pts"}
              </span>
           </button>
        </div>
      </Card>

      <Button onClick={calculateScore} disabled={!pickerId || !partnerId} className="w-full py-4 text-lg shadow-xl shadow-emerald-200/50">
        Save Score
      </Button>

      {/* 3 Kings Button (Convenience) */}
      <div className="flex justify-center pt-2">
         <button onClick={startThreeKings} className="flex items-center gap-2 text-amber-600 font-bold text-sm bg-amber-50 px-6 py-3 rounded-full hover:bg-amber-100 transition-colors border border-amber-200 shadow-sm active:scale-95">
            <ThreeKingsIcon />
            <span className="ml-1">3 Kings</span>
         </button>
      </div>
    </div>
  );
};

const statusLabel = (player) => {
  if (player.away) return 'Away — balance frozen';
  if (player.skipRotation) return player.active ? 'Playing — skipping deals' : 'Sitting out — skipping deals';
  return player.active ? 'Playing' : 'Sitting out';
};

const StatsView = ({ players, history, manuallySetDealer, dealerId, updateName, toggleSkipRotation, toggleAway, potCount }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-emerald-600"/> Game Stats
        </h2>
        <SimpleLineChart history={history} players={players} />
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Scoreboard</h3>
        <div className="grid grid-cols-1 gap-2">
          {players.map(player => (
            <div key={player.id} className={`p-3 rounded-xl border shadow-sm transition-all ${player.away ? 'bg-slate-50 border-slate-200 opacity-70' : player.active ? 'bg-white border-emerald-500/30' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => manuallySetDealer(player.id)}
                    disabled={player.away}
                    className={`w-8 h-8 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors shadow-sm disabled:opacity-40 ${dealerId === player.id ? 'bg-slate-800 text-white ring-2 ring-slate-200 ring-offset-1' : 'text-slate-400 bg-white border border-slate-200 hover:text-slate-600'}`}
                    title="Set Dealer"
                  >
                    D
                  </button>
                  <div className="flex flex-col">
                    <span className={`font-bold ${player.away ? 'text-slate-500' : 'text-slate-800'}`}>{player.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{statusLabel(player)}</span>
                  </div>
                </div>
                <div className={`text-xl font-mono font-bold ${player.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {player.balance < 0 ? '-' : '+'}${Math.abs(player.balance).toFixed(2)}
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => toggleSkipRotation(player.id)}
                  disabled={player.away}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-colors active:scale-95 disabled:opacity-40 disabled:active:scale-100 ${player.skipRotation ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                >
                  <SkipForward size={12} /> {player.skipRotation ? 'Rejoin Rotation' : 'Skip Deals'}
                </button>
                <button
                  onClick={() => toggleAway(player.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-colors active:scale-95 ${player.away ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                  title={player.away
                    ? (potCount > 0 ? `Buys back in for $${(potCount * POT_CONTRIBUTION).toFixed(2)}` : 'Return to the table')
                    : 'Freeze this balance and refund their pot antes'}
                >
                  <Coffee size={12} /> {player.away ? 'Back To Table' : 'Step Away'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="pb-20">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {history.slice(0, 10).map(h => (
               <div key={h.id} className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-100 flex justify-between shadow-sm items-center">
                 <span className="font-medium text-slate-700">{h.desc}</span>
                 <span className="font-mono text-[10px] text-slate-400">{h.timestamp}</span>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Array order is the seating order, and the deal rotates through it, so it is
// directly editable: drag a row by its handle, or nudge it with the arrows on
// touch screens where a long drag is awkward.
const SeatOrderList = ({ players, dealerId, reorderPlayers, movePlayer }) => {
  const [dragId, setDragId] = useState(null);
  const containerRef = useRef(null);

  const rowIndexAt = (clientY) => {
    const rows = Array.from(containerRef.current?.children || []);
    return rows.findIndex(row => {
      const box = row.getBoundingClientRect();
      return clientY >= box.top && clientY <= box.bottom;
    });
  };

  // Tracking on window rather than via setPointerCapture: the handle is a small
  // target, and once a thumb slides off it a capture-based drag stalls. The
  // handle's touch-action:none is what stops iOS scrolling the page instead.
  useEffect(() => {
    if (dragId === null) return undefined;

    const onMove = (e) => {
      const to = rowIndexAt(e.clientY);
      const from = players.findIndex(p => p.id === dragId);
      if (to !== -1 && from !== -1 && to !== from) reorderPlayers(from, to);
    };
    const onEnd = () => setDragId(null);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
    };
  });

  return (
    <div ref={containerRef} className="space-y-2">
      {players.map((player, idx) => (
        <div
          key={player.id}
          data-seat={idx + 1}
          className={`flex items-center gap-1.5 px-1.5 py-1 rounded-xl border bg-white shadow-sm transition-shadow select-none ${dragId === player.id ? 'border-emerald-400 shadow-lg ring-2 ring-emerald-100 relative z-10' : 'border-slate-200'}`}
        >
          <div
            onPointerDown={(e) => { e.preventDefault(); setDragId(player.id); }}
            data-drag-handle=""
            className="p-3 -my-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical size={20} />
          </div>

          <span className="w-6 h-6 shrink-0 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold flex items-center justify-center">
            {idx + 1}
          </span>

          <span className={`flex-1 font-bold truncate ${player.away ? 'text-slate-400' : 'text-slate-700'}`}>
            {player.name}
          </span>

          {dealerId === player.id && (
            <span className="w-5 h-5 shrink-0 rounded-full bg-slate-800 text-white text-[9px] font-black flex items-center justify-center" title="Dealer">D</span>
          )}
          {player.away && (
            <span className="text-[9px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">Away</span>
          )}

          <div className="flex shrink-0">
            <button
              onClick={() => movePlayer(player.id, -1)}
              disabled={idx === 0}
              className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-emerald-600 active:text-emerald-700 disabled:opacity-25 transition-colors"
              title="Move up"
            >
              <ChevronUp size={20} />
            </button>
            <button
              onClick={() => movePlayer(player.id, 1)}
              disabled={idx === players.length - 1}
              className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-emerald-600 active:text-emerald-700 disabled:opacity-25 transition-colors"
              title="Move down"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const PlayersView = ({ players, addPlayer, updateName, removePlayer, requestNewGame, pots, totalPotValue, toggleAway, dealerId, reorderPlayers, movePlayer }) => {
  const [seatMode, setSeatMode] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const sendEmail = () => {
    if (!emailRecipient) return;
    
    const date = new Date().toLocaleDateString();
    const subject = encodeURIComponent(`Sheepshead Scores - ${date}`);
    
    // Away players still count in the standings — their balance is frozen,
    // not removed — so the emailed totals stay whole.
    let bodyText = "Current Standings:\n\n";
    players.forEach(p => {
        const sign = p.balance >= 0 ? '+' : '-';
        bodyText += `${p.name}: ${sign}$${Math.abs(p.balance).toFixed(2)}${p.away ? '  (away)' : ''}\n`;
    });

    const net = players.reduce((sum, p) => sum + p.balance, 0);
    bodyText += `\nTable net: ${net >= 0 ? '+' : '-'}$${Math.abs(net).toFixed(2)}\n`;

    if (pots.length > 0) {
        bodyText += `\nActive Pots: ${pots.length} ($${totalPotValue.toFixed(2)})`;
    }

    bodyText += `\n\nSent from Shorewood Sheepshead Scorer`;

    window.location.href = `mailto:${emailRecipient}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    setShowEmailForm(false);
    setEmailRecipient('');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Manage Players</h2>
        <div className="flex gap-2">
          <Button onClick={() => setSeatMode(!seatMode)} variant={seatMode ? 'primary' : 'secondary'}>
            <ArrowUpDown size={18} /> {seatMode ? 'Done' : 'Seats'}
          </Button>
          {!seatMode && (
            <Button onClick={addPlayer} disabled={players.length >= 10} variant="primary">
              <UserPlus size={18} /> Add
            </Button>
          )}
        </div>
      </div>

      {seatMode ? (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3 leading-relaxed">
            Seat order is the deal rotation. Drag a row by its handle, or use the arrows.
            Move a returning player to whichever seat they actually took.
          </p>
          <SeatOrderList
            players={players}
            dealerId={dealerId}
            reorderPlayers={reorderPlayers}
            movePlayer={movePlayer}
          />
        </div>
      ) : (
      <div className="space-y-2">
        {players.map(player => (
          <div key={player.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 flex-1">
               <div 
                 className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${player.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
               >
                 <Users size={18} />
               </div>
               <input 
                 value={isDefaultName(player.name) ? '' : player.name}
                 placeholder={isDefaultName(player.name) ? player.name : 'Name'}
                 onChange={(e) => updateName(player.id, e.target.value)}
                 onBlur={(e) => {
                   // Never leave someone nameless; fall back to their default.
                   if (!e.target.value.trim()) updateName(player.id, defaultNameFor(player));
                 }}
                 aria-label={`Player name, currently ${player.name}`}
                 autoCapitalize="words"
                 autoCorrect="off"
                 spellCheck={false}
                 className="font-medium text-slate-700 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none flex-1 text-lg placeholder:text-slate-400 placeholder:font-normal"
               />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full mr-2 uppercase tracking-wide ${player.away ? 'bg-amber-50 text-amber-700' : player.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {player.away ? 'Away' : player.active ? 'Playing' : 'Sitting'}
            </span>
            <button
              onClick={() => toggleAway(player.id)}
              title={player.away ? 'Return to the table' : 'Step away — freezes their balance'}
              className={`p-2 transition-colors ${player.away ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-400 hover:text-amber-600'}`}
            >
              <Coffee size={18} />
            </button>
            <button 
              onClick={() => removePlayer(player.id)}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      )}
      
      <div className="mt-6 p-4 bg-amber-50 rounded-xl text-amber-800 text-sm border border-amber-100">
        <p className="flex items-center gap-2 font-bold mb-1"><AlertTriangle size={16}/> Note</p>
        With 6+ at the table the dealer sits out, then the seats after them, until 5 are playing. Tap players on the game screen to change who sits. Use <strong>Step Away</strong> for someone leaving for a while — their balance freezes and their pot antes are refunded; they buy back in one quarter per live pot when they return.
      </div>
      
      <div className="border-t border-slate-200 pt-6 mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Game Actions</h3>
        
        <div className="space-y-3">
            {!showEmailForm ? (
                <Button onClick={() => setShowEmailForm(true)} variant="secondary" className="w-full justify-start border border-slate-200 bg-white">
                    <Mail size={18} className="text-slate-500"/> Email Scores
                </Button>
            ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-in zoom-in-95 duration-200">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Recipient Email</label>
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            value={emailRecipient}
                            onChange={(e) => setEmailRecipient(e.target.value)}
                            placeholder="name@example.com"
                            className="flex-1 p-3 border border-slate-300 rounded-lg text-base outline-none focus:border-emerald-500"
                        />
                        <button onClick={sendEmail} className="bg-emerald-600 text-white px-4 rounded-lg hover:bg-emerald-700">
                            <Send size={18} />
                        </button>
                    </div>
                    <button onClick={() => setShowEmailForm(false)} className="text-xs font-medium text-slate-400 hover:text-slate-600">Cancel</button>
                </div>
            )}

            <Button onClick={requestNewGame} variant="danger" className="w-full justify-start border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100">
                <LogOut size={18} /> Start New Game
            </Button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Initial Defaults
  const defaultPlayers = [
    { id: 1, name: 'Player 1', balance: 0, active: true, away: false, skipRotation: false },
    { id: 2, name: 'Player 2', balance: 0, active: true, away: false, skipRotation: false },
    { id: 3, name: 'Player 3', balance: 0, active: true, away: false, skipRotation: false },
    { id: 4, name: 'Player 4', balance: 0, active: true, away: false, skipRotation: false },
    { id: 5, name: 'Player 5', balance: 0, active: true, away: false, skipRotation: false },
  ];

  const [players, setPlayers] = useState(defaultPlayers);
  const [pots, setPots] = useState([]); 
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('startMenu'); 
  const [dealerId, setDealerId] = useState(1);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  
  // Settings / Email State
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetPreview, setResetPreview] = useState([]);
  const [playerToRemove, setPlayerToRemove] = useState(null);
  const [storageNotice, setStorageNotice] = useState(null);
  const [showKingsLyrics, setShowKingsLyrics] = useState(false);

  // Scoring State
  const [pickerId, setPickerId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [outcome, setOutcome] = useState('win'); 
  const [handGrade, setHandGrade] = useState('standard'); 
  const [wageredPots, setWageredPots] = useState(1); 
  const [crackState, setCrackState] = useState('none'); 

  // --- Toast Helper ---
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // --- Persistence & Init ---

  useEffect(() => {
    // Only advertise CONTINUE for a save that actually loads, so the button
    // can never be a dead end.
    const { status, data } = readSavedGame();
    setHasSavedGame(!!data);
    if (status === STORAGE_UNREADABLE) {
      setStorageNotice("A saved game was found but could not be read, so it has been set aside. Starting a new game will overwrite it.");
    } else if (status === STORAGE_UNWRITABLE) {
      setStorageNotice("This device is blocking stored data, so scores will not survive a refresh. Check Safari's cookie settings.");
    }
  }, []);

  // Auto-save whenever critical state changes. A rejected write must not take
  // the app down - warn once and keep playing from memory.
  useEffect(() => {
    if (view !== 'startMenu' && view !== 'rules') {
      const saved = writeSavedGame({ players, pots, history, dealerId });
      setHasSavedGame(saved);
      if (!saved) {
        setStorageNotice("Scores cannot be saved on this device - they will be lost if you refresh. Note them down before closing.");
      }
    }
  }, [players, pots, history, dealerId, view]);

  // Ensure wager defaults to 1 when entering new hand view (now 'game')
  useEffect(() => {
    if (view === 'game') {
      if (pots.length > 0 && wageredPots === 0) setWageredPots(1);
      setCrackState('none'); // Reset crack state on new hand
    }
  }, [view, pots.length, wageredPots]);

  const loadGame = () => {
    const { data } = readSavedGame();
    if (data) {
      // Saves from before away/skip flags and object pots still load cleanly.
      const loadedPlayers = (data.players || defaultPlayers).map(normalizePlayer);
      const loadedDealer = data.dealerId ?? loadedPlayers[0]?.id ?? 1;
      // A hand is only ever dealt with 5 seated, so re-derive the seating on
      // load. Saves written by the old rotation could hold a bad count.
      setPlayers(recomputeSeating(loadedDealer, loadedPlayers));
      setPots((data.pots || []).map(normalizePot));
      setHistory(data.history || []);
      setDealerId(loadedDealer);
      setView('game'); // Load into game view
    } else {
      setHasSavedGame(false);
      showToast("Saved game could not be read");
    }
  };

  // From the start menu the saved game has not been loaded into state yet, so
  // the roster to carry over has to come from storage rather than `players`.
  const savedRoster = () => {
    const { data } = readSavedGame();
    if (!data) return null;
    return { players: data.players.map(normalizePlayer), dealerId: data.dealerId };
  };

  // Same group most weeks, so a new game keeps names and seat order and only
  // zeroes the money. Away and skip-deals are tonight's business, so they clear.
  const performReset = (keepRoster) => {
    // Only a roster carried over from a real saved game is worth going straight
    // to play with; anything else still needs names typed in.
    const carried = keepRoster ? savedRoster() : null;
    const source = carried
      || (keepRoster ? { players, dealerId } : { players: defaultPlayers, dealerId: 1 });

    const roster = source.players.map(p => ({
      id: p.id,
      name: p.name,
      balance: 0,
      active: true,
      away: false,
      skipRotation: false
    }));
    const dealer = roster.some(p => p.id === source.dealerId) ? source.dealerId : roster[0].id;

    setPlayers(recomputeSeating(dealer, roster));
    setDealerId(dealer);
    setPots([]);
    setHistory([]);
    clearSavedGame();
    setHasSavedGame(false);
    // A carried-over roster needs no setup, so go straight to play.
    setView(carried ? 'game' : 'players');
    setShowResetConfirm(false);
    showToast(carried ? "New game - same players" : "New game - name your players");
  };

  const requestNewGame = () => {
    const hasData = hasSavedGame || players.some(p => p.balance !== 0) || history.length > 0;
    if (hasData) {
      setResetPreview((savedRoster() || { players }).players);
      setShowResetConfirm(true);
    } else {
      performReset(true);
    }
  };

  // --- Logic Helpers ---

  const presentPlayers = players.filter(p => !p.away);
  const activePlayers = players.filter(p => p.active && !p.away);
  const totalPotValue = pots.reduce((sum, pot) => sum + pot.value, 0);

  // Free-form seating: the 5/5 counter in TableCard is what enforces the count.
  const toggleSeat = (id) => {
    const player = players.find(p => p.id === id);
    if (!player || player.away) return;
    setPlayers(players.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  // One-off: hand the deal to the next eligible player without scoring a hand.
  const passDeal = () => {
    const nextId = nextDealerFrom(dealerId, players);
    if (nextId === dealerId) {
      showToast("No one else can take the deal");
      return;
    }
    setDealerId(nextId);
    setPlayers(recomputeSeating(nextId, players));
    showToast(`Deal passed to ${players.find(p => p.id === nextId).name}`);
  };

  const manuallySetDealer = (id) => {
    const player = players.find(p => p.id === id);
    if (!player || player.away) {
      showToast("Away players can't deal");
      return;
    }
    // Naming someone dealer necessarily puts them back in the rotation.
    const list = players.map(p => p.id === id ? { ...p, skipRotation: false } : p);
    setDealerId(id);
    setPlayers(recomputeSeating(id, list));
    showToast("Dealer Updated");
  };

  // Standing flag: rotation passes over them and they sit out first, but they
  // are still at the table and still ante.
  const toggleSkipRotation = (id) => {
    const player = players.find(p => p.id === id);
    if (!player || player.away) return;
    const list = players.map(p => p.id === id ? { ...p, skipRotation: !p.skipRotation } : p);
    const nextDealer = (!player.skipRotation && dealerId === id)
      ? nextDealerFrom(dealerId, list)
      : dealerId;
    setDealerId(nextDealer);
    setPlayers(recomputeSeating(nextDealer, list));
    showToast(player.skipRotation ? `${player.name} is back in the rotation` : `${player.name} will skip deals`);
  };

  // Stepping away freezes a balance. Anything they anted into a live pot comes
  // back to them, since they can no longer win it.
  const sendAway = (player) => {
    let refund = 0;
    const nextPots = pots
      .map(pot => {
        const amount = pot.contributions[player.id] || 0;
        if (!amount) return pot;
        refund = money(refund + amount);
        const contributions = { ...pot.contributions };
        delete contributions[player.id];
        return { ...pot, value: money(pot.value - amount), contributions };
      })
      .filter(pot => pot.value > 0);

    const changes = refund ? { [player.id]: refund } : {};
    let list = players.map(p => p.id === player.id
      ? { ...p, away: true, active: false, balance: money(p.balance + refund) }
      : p);
    const nextDealer = dealerId === player.id ? nextDealerFrom(dealerId, list) : dealerId;
    list = recomputeSeating(nextDealer, list);

    if (pickerId === player.id) setPickerId(null);
    if (partnerId === player.id) setPartnerId(null);

    commit(list, nextPots, nextDealer, changes,
      refund ? `${player.name} away (refunded $${refund.toFixed(2)})` : `${player.name} away`, false);
    showToast(refund ? `${player.name} away — $${refund.toFixed(2)} refunded` : `${player.name} is away`);
  };

  // Coming back costs a quarter into every pot currently on the table, however
  // many have piled up while they were gone.
  const returnFromAway = (player) => {
    const buyIn = money(pots.length * POT_CONTRIBUTION);
    const nextPots = pots.map(pot => ({
      ...pot,
      value: money(pot.value + POT_CONTRIBUTION),
      contributions: {
        ...pot.contributions,
        [player.id]: money((pot.contributions[player.id] || 0) + POT_CONTRIBUTION)
      }
    }));

    const changes = buyIn ? { [player.id]: -buyIn } : {};
    let list = players.map(p => p.id === player.id
      ? { ...p, away: false, balance: money(p.balance - buyIn) }
      : p);
    list = recomputeSeating(dealerId, list);

    commit(list, nextPots, dealerId, changes,
      buyIn ? `${player.name} back in (bought in $${buyIn.toFixed(2)})` : `${player.name} back in`, false);
    showToast(buyIn ? `${player.name} back in — $${buyIn.toFixed(2)} to the pot` : `${player.name} is back`);
  };

  const toggleAway = (id) => {
    const player = players.find(p => p.id === id);
    if (!player) return;
    if (player.away) returnFromAway(player);
    else sendAway(player);
  };

  // Seat order drives the deal rotation. The dealer keeps the button; only the
  // seats around them change, which is what a mid-game seat swap should do.
  const reorderPlayers = (fromIdx, toIdx) => {
    if (fromIdx === toIdx) return;
    const list = [...players];
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    setPlayers(recomputeSeating(dealerId, list));
  };

  const movePlayer = (id, delta) => {
    const idx = players.findIndex(p => p.id === id);
    const target = idx + delta;
    if (idx === -1 || target < 0 || target >= players.length) return;
    reorderPlayers(idx, target);
  };

  const addPlayer = () => {
    if (players.length >= 10) return;
    const newId = Math.max(...players.map(p => p.id), 0) + 1;
    const list = [...players, { id: newId, name: `Player ${newId}`, balance: 0, active: false, away: false, skipRotation: false }];
    setPlayers(recomputeSeating(dealerId, list));
  };

  const updateName = (id, newName) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const requestRemovePlayer = (id) => {
    const player = players.find(p => p.id === id);
    if (!player || players.length <= 1) return;
    setPlayerToRemove(player);
  };

  // Routed through commit() so undo can put them back - removing someone used
  // to be the one action in the app that could not be reversed.
  const confirmRemovePlayer = () => {
    const player = playerToRemove;
    if (!player) return;
    const remaining = players.filter(p => p.id !== player.id);
    if (remaining.length === 0) return;
    const candidate = dealerId === player.id ? nextDealerFrom(dealerId, players) : dealerId;
    const nextDealer = remaining.some(p => p.id === candidate) ? candidate : remaining[0].id;

    if (pickerId === player.id) setPickerId(null);
    if (partnerId === player.id) setPartnerId(null);

    commit(recomputeSeating(nextDealer, remaining), pots, nextDealer, {}, `Removed ${player.name}`, false);
    setPlayerToRemove(null);
    showToast(`${player.name} removed`);
  };

  const handlePass = () => {
    // Everyone at the table antes, whether or not they were dealt in. Away
    // players do not, so the pot is smaller while they are gone.
    const contributions = {};
    const changes = {};
    presentPlayers.forEach(p => {
      changes[p.id] = -POT_CONTRIBUTION;
      contributions[p.id] = POT_CONTRIBUTION;
    });
    const newPot = {
      id: makePotId(),
      value: money(presentPlayers.length * POT_CONTRIBUTION),
      contributions
    };
    applyTransaction(changes, [...pots, newPot], "Passed - Pot Added", true);
    showToast("Pot Added");
  };

  const startThreeKings = () => {
    setShowKingsLyrics(true);
  };

  const completeThreeKingsSinging = () => {
    setShowKingsLyrics(false);
    setView('kings');
  };

  const handleThreeKings = (winnerId) => {
    const changes = {};
    let total = 0;
    presentPlayers.forEach(p => {
      if (p.id !== winnerId) {
        changes[p.id] = -0.25;
        total = money(total + 0.25);
      } else {
        changes[p.id] = 0; 
      }
    });
    changes[winnerId] = total;
    applyTransaction(changes, pots, `3 Kings: ${players.find(p => p.id === winnerId).name}`, false);
    showToast("3 Kings Payout Applied");
    setView('game'); // Return to game view
  };

  const calculateScore = () => {
    if (!pickerId) return;

    // Crack Multiplier
    let crackMultiplier = 1;
    if (crackState === 'crack') crackMultiplier = 2;
    if (crackState === 'recrack') crackMultiplier = 4;

    const activeIds = activePlayers.map(p => p.id);
    const isAlone = !partnerId || pickerId === partnerId;
    const opponentIds = activeIds.filter(id => id !== pickerId && id !== partnerId);
    const changes = {};
    presentPlayers.forEach(p => changes[p.id] = 0);
    
    let desc = outcome === 'win' ? "Picker Won" : "Picker Lost";
    if (outcome === 'loss') desc += " (Bump)";
    
    if (handGrade === 'standard') desc += " (Schneider)";
    if (handGrade === 'schneider') desc += " (No Sch)";
    if (handGrade === 'schwarz') desc += " (Schw)";
    
    if (crackState === 'crack') desc += " [Cracked]";
    if (crackState === 'recrack') desc += " [Re-Cracked]";

    // Rule 6 Exception: Picker Loss + Schwarz = Picker pays all, Partner pays nothing.
    if (outcome === 'loss' && handGrade === 'schwarz') {
       const penaltyPerOpponent = 3 * GAME_BASE_VALUE * crackMultiplier; 
       opponentIds.forEach(id => changes[id] += penaltyPerOpponent);
       changes[pickerId] -= penaltyPerOpponent * opponentIds.length;
       desc += " (Rule 6: Pkr pays all)";
    } else {
        let multiplier = 1;
        if (handGrade === 'schneider') multiplier = 2; 
        if (handGrade === 'schwarz') multiplier = 3;
        if (outcome === 'loss') multiplier *= 2; 

        const scoreBase = GAME_BASE_VALUE * multiplier * crackMultiplier;

        if (outcome === 'win') {
          opponentIds.forEach(id => changes[id] -= scoreBase);
          if (isAlone) {
            changes[pickerId] += scoreBase * opponentIds.length;
          } else {
            changes[partnerId] += scoreBase;
            changes[pickerId] += scoreBase * 2;
          }
        } else {
          // Loss
          if (isAlone) {
            changes[pickerId] -= scoreBase * opponentIds.length;
            opponentIds.forEach(id => changes[id] += scoreBase);
          } else {
            changes[partnerId] -= scoreBase;
            changes[pickerId] -= scoreBase * 2;
            opponentIds.forEach(id => changes[id] += scoreBase);
          }
        }
    }

    let nextPots = [...pots];
    const sitters = presentPlayers.filter(p => !p.active);
    
    if (pots.length > 0 && wageredPots > 0) {
      const potsToPlay = pots.slice(0, wageredPots);
      const remainingPots = pots.slice(wageredPots);
      const wagerValue = potsToPlay.reduce((sum, pot) => sum + pot.value, 0);

      if (outcome === 'win') {
        desc += ` & Pot`;
        if (isAlone) {
          changes[pickerId] += wagerValue;
        } else {
          const totalQuarters = Math.round(wagerValue / 0.25);
          const partnerQuarters = Math.round(totalQuarters / 3);
          const pickerQuarters = totalQuarters - partnerQuarters;
          changes[partnerId] += partnerQuarters * 0.25;
          changes[pickerId] += pickerQuarters * 0.25;
        }
        nextPots = remainingPots;
      } else {
        desc += ` & Matched Pot`;
        const matchAmount = wagerValue; 
        
        if (isAlone) {
          changes[pickerId] -= matchAmount;
        } else {
          const totalQuarters = Math.round(matchAmount / 0.25);
          const partnerCostQuarters = Math.round(totalQuarters / 3);
          const pickerCostQuarters = totalQuarters - partnerCostQuarters;
          changes[partnerId] -= partnerCostQuarters * 0.25;
          changes[pickerId] -= pickerCostQuarters * 0.25;
        }
        
        // FIXED POT LOGIC: the matched money rides as fresh pots. It is a
        // penalty rather than an ante, so it carries no refundable ledger.
        const matchedPots = potsToPlay.map((pot, i) => ({
          id: makePotId(`m${i}`),
          value: pot.value,
          contributions: {}
        }));
        nextPots = [...pots, ...matchedPots];

        if (sitters.length > 0) {
          const last = nextPots[nextPots.length - 1];
          const contributions = { ...last.contributions };
          let sitterPenaltyTotal = 0;
          sitters.forEach(s => {
            changes[s.id] -= POT_CONTRIBUTION;
            contributions[s.id] = money((contributions[s.id] || 0) + POT_CONTRIBUTION);
            sitterPenaltyTotal = money(sitterPenaltyTotal + POT_CONTRIBUTION);
          });
          // Add sitter penalty to the last pot in the array
          nextPots[nextPots.length - 1] = {
            ...last,
            value: money(last.value + sitterPenaltyTotal),
            contributions
          };
          desc += " + Sitters";
        }
      }
    }

    applyTransaction(changes, nextPots, desc, true);
    showToast(outcome === 'win' ? "Score Saved: Picker Won" : "Score Saved: Picker Lost");
  };

  // Records the move and swaps state in. `resetHand` is off for roster changes
  // so they don't clear a half-entered hand or yank you out of the current view.
  const commit = (nextPlayers, nextPots, nextDealerId, changes, description, resetHand = true) => {
    setHistory([{
      id: Date.now(),
      desc: description,
      changes: changes,
      prevPots: pots,
      newPots: nextPots,
      prevPlayers: players,
      prevDealerId: dealerId,
      timestamp: new Date().toLocaleTimeString()
    }, ...history]);

    setPlayers(nextPlayers);
    setPots(nextPots);
    setDealerId(nextDealerId);

    if (resetHand) {
      setPickerId(null);
      setPartnerId(null);
      setOutcome('win');
      setHandGrade('standard');
      setWageredPots(1);
      setCrackState('none');
      setView('game');
    }
  };

  const applyTransaction = (changes, newPots, description, shouldRotateDealer) => {
    let nextPlayers = players.map(p => ({
      ...p,
      balance: money(p.balance + (changes[p.id] || 0))
    }));
    
    let nextDealerId = dealerId;
    if (shouldRotateDealer) {
      nextDealerId = nextDealerFrom(dealerId, nextPlayers);
      nextPlayers = recomputeSeating(nextDealerId, nextPlayers);
    }

    commit(nextPlayers, newPots, nextDealerId, changes, description);
  };

  const undoLast = () => {
    if (history.length === 0) return;
    const last = history[0];
    // Newer entries snapshot the roster, so seating, away status and the dealer
    // all roll back. Older saved entries fall back to reversing the balances.
    setPlayers(last.prevPlayers
      ? last.prevPlayers.map(normalizePlayer)
      : players.map(p => ({ ...p, balance: money(p.balance - (last.changes[p.id] || 0)) })));
    setPots((last.prevPots || []).map(normalizePot));
    if (last.prevDealerId !== undefined) setDealerId(last.prevDealerId);
    setHistory(history.slice(1));
    showToast("Last Action Undone");
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0 max-w-md mx-auto border-x border-slate-200 shadow-2xl relative">
      <Toast show={toast.show} message={toast.message} />
      
      {/* Top Bar - Hidden on Start Menu */}
      {view !== 'startMenu' && view !== 'rules' && (
        <header className="bg-white p-4 pt-[max(1rem,env(safe-area-inset-top))] flex justify-between items-center sticky top-0 z-10 border-b border-slate-100">
          <button onClick={() => setView('startMenu')} className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 hover:opacity-75">
             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">S</div>
             Sheepshead
          </button>
          <div className="flex gap-2">
             <button onClick={undoLast} disabled={history.length === 0} className="p-2 text-slate-400 hover:text-slate-800 disabled:opacity-30">
               <RotateCcw size={20} />
             </button>
             <button onClick={() => setView(view === 'players' ? 'game' : 'players')} className="p-2 text-slate-400 hover:text-emerald-600">
               <Settings size={20} />
             </button>
          </div>
        </header>
      )}

      {/* Storage trouble is silent otherwise: the game keeps working from
          memory but nothing is being persisted. */}
      {storageNotice && view !== 'startMenu' && view !== 'rules' && (
        <div className="mx-4 mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 animate-in fade-in duration-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed flex-1">{storageNotice}</p>
          <button
            onClick={() => setStorageNotice(null)}
            aria-label="Dismiss warning"
            className="p-1 -m-1 text-amber-500 hover:text-amber-700 shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4">
        {view === 'startMenu' && <StartMenuView startNewGame={requestNewGame} hasSavedGame={hasSavedGame} loadGame={loadGame} setView={setView} />}
        {view === 'rules' && <RulesView setView={setView} />}
        {/* GameView now replaces ScoreboardView + NewHandView logic for main play */}
        {view === 'game' && <GameView activePlayers={activePlayers} presentPlayers={presentPlayers} toggleSeat={toggleSeat} passDeal={passDeal} pots={pots} totalPotValue={totalPotValue} handlePass={handlePass} wageredPots={wageredPots} setWageredPots={setWageredPots} pickerId={pickerId} setPickerId={setPickerId} partnerId={partnerId} setPartnerId={setPartnerId} crackState={crackState} setCrackState={setCrackState} outcome={outcome} setOutcome={setOutcome} handGrade={handGrade} setHandGrade={setHandGrade} calculateScore={calculateScore} setView={setView} players={players} dealerId={dealerId} startThreeKings={startThreeKings} />}
        {view === 'stats' && <StatsView players={players} history={history} manuallySetDealer={manuallySetDealer} dealerId={dealerId} updateName={updateName} toggleSkipRotation={toggleSkipRotation} toggleAway={toggleAway} potCount={pots.length} />}
        {view === 'players' && <PlayersView players={players} addPlayer={addPlayer} updateName={updateName} removePlayer={requestRemovePlayer} requestNewGame={requestNewGame} pots={pots} totalPotValue={totalPotValue} toggleAway={toggleAway} dealerId={dealerId} reorderPlayers={reorderPlayers} movePlayer={movePlayer} />}
        {view === 'kings' && <ThreeKingsView presentPlayers={presentPlayers} handleThreeKings={handleThreeKings} setView={setView} />}
      </main>

      {/* New Bottom Navigation Bar */}
      {view !== 'startMenu' && view !== 'rules' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around items-center max-w-md mx-auto z-20 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
           <button onClick={() => setView('stats')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors active:scale-95 ${view === 'stats' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}>
              <TrendingUp size={20} /> <span className="text-[10px] font-bold">Stats</span>
           </button>
           <button 
              onClick={() => setView('game')}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-full -mt-8 shadow-lg transition-all hover:scale-105 active:scale-95 ${view === 'game' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white text-slate-400 border border-slate-200'}`}
            >
              <Play size={24} fill={view === 'game' ? "currentColor" : "none"} />
           </button>
           <button onClick={() => setView('players')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors active:scale-95 ${view === 'players' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}>
              <Users size={20} /> <span className="text-[10px] font-bold">Players</span>
           </button>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle size={32} />
              <h3 className="text-lg font-bold text-slate-800">Start New Game?</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Scores, pots and history are cleared. Keep tonight's roster, or start from a blank table?
            </p>

            {resetPreview.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">
                  Current roster - {resetPreview.length} players
                </div>
                <div className="text-sm font-medium text-slate-700 leading-relaxed">
                  {resetPreview.map(p => p.name).join(' \u00b7 ')}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <Button onClick={() => performReset(true)} variant="primary" className="w-full py-3">
                <Users size={18} /> Same Players
              </Button>
              <Button onClick={() => performReset(false)} variant="secondary" className="w-full py-3">
                <UserPlus size={18} /> New Roster
              </Button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-full text-sm font-medium text-slate-400 hover:text-slate-600 py-2"
              >
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Remove Player Confirmation */}
      {playerToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle size={32} />
              <h3 className="text-lg font-bold text-slate-800">Remove {playerToRemove.name}?</h3>
            </div>
            <p className="text-slate-600 text-sm">
              They are taken off the table and out of the deal rotation.
            </p>
            {playerToRemove.balance !== 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 text-xs leading-relaxed">
                <strong className="font-bold">
                  {playerToRemove.name} is {playerToRemove.balance > 0 ? 'up' : 'down'}{' '}
                  ${Math.abs(playerToRemove.balance).toFixed(2)}.
                </strong>{' '}
                Removing them drops that from the standings and the totals will no longer
                add up. Use <strong>Step Away</strong> instead to keep their score.
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <Button onClick={() => setPlayerToRemove(null)} variant="secondary" className="flex-1 py-3">
                Cancel
              </Button>
              <Button onClick={confirmRemovePlayer} variant="red" className="flex-1 py-3">
                Remove
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 text-center">This can be undone.</p>
          </Card>
        </div>
      )}

      {/* 3 Kings Lyrics Modal */}
      {showKingsLyrics && (
        <ThreeKingsLyricsModal onComplete={completeThreeKingsSinging} />
      )}

    </div>
  );
}