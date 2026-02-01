import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, DollarSign, History, Settings, UserPlus, X, Trophy, AlertTriangle, CheckCircle, RotateCcw, Zap, Crown, Play, BookOpen, LogOut, Club, Diamond, Hammer, Mail, Send } from 'lucide-react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800",
    danger: "bg-rose-100 hover:bg-rose-200 text-rose-700",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    amber: "bg-amber-500 hover:bg-amber-600 text-white",
    gold: "bg-amber-400 hover:bg-amber-500 text-amber-950 border border-amber-300 shadow-lg shadow-amber-900/20",
    red: "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200"
  };
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${variants[variant] || variants.primary} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// CSS 3D Quarter Stack
const QuarterStack = ({ count = 5, className = "" }) => (
  <div className={`relative w-12 h-16 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
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
            bottom: `${(count - 1) * 5}px`, 
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
const PlayingCard = ({ rank, suit, color, rotate, Icon }) => (
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
    <div className={`text-${color}-600 flex flex-col items-center leading-none`}>
       <span className="text-lg font-bold font-serif">{rank}</span>
       <span className="text-[10px]">{suit}</span>
    </div>
    
    {/* Center Art */}
    <div className={`absolute inset-0 flex items-center justify-center text-${color}-600`}>
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
    <div className={`text-${color}-600 flex flex-col items-center leading-none transform rotate-180`}>
       <span className="text-lg font-bold font-serif">{rank}</span>
       <span className="text-[10px]">{suit}</span>
    </div>
  </div>
);

export default function App() {
  // Initial Defaults
  const defaultPlayers = [
    { id: 1, name: 'Player 1', balance: 0, active: true },
    { id: 2, name: 'Player 2', balance: 0, active: true },
    { id: 3, name: 'Player 3', balance: 0, active: true },
    { id: 4, name: 'Player 4', balance: 0, active: true },
    { id: 5, name: 'Player 5', balance: 0, active: true },
  ];

  const [players, setPlayers] = useState(defaultPlayers);
  const [pots, setPots] = useState([]); 
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('startMenu'); // startMenu, rules, scoreboard, newHand, players, kings
  const [dealerId, setDealerId] = useState(1);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  
  // Settings / Email State
  const [emailRecipient, setEmailRecipient] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Game Settings
  const GAME_BASE_VALUE = 0.25; 
  const POT_CONTRIBUTION = 0.25;
  
  // Scoring State
  const [pickerId, setPickerId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [outcome, setOutcome] = useState('win'); 
  const [handGrade, setHandGrade] = useState('standard'); 
  const [wageredPots, setWageredPots] = useState(1); 
  const [crackState, setCrackState] = useState('none'); // 'none', 'crack', 'recrack'

  // --- Persistence & Init ---

  useEffect(() => {
    const saved = localStorage.getItem('sheepshead_data');
    if (saved) {
      setHasSavedGame(true);
    }
  }, []);

  // Auto-save whenever critical state changes
  useEffect(() => {
    if (view !== 'startMenu' && view !== 'rules') {
      const data = { players, pots, history, dealerId };
      localStorage.setItem('sheepshead_data', JSON.stringify(data));
      setHasSavedGame(true);
    }
  }, [players, pots, history, dealerId, view]);

  // Ensure wager defaults to 1 when entering new hand view
  useEffect(() => {
    if (view === 'newHand') {
      if (pots.length > 0 && wageredPots === 0) setWageredPots(1);
      setCrackState('none'); // Reset crack state on new hand
    }
  }, [view, pots.length, wageredPots]);

  const loadGame = () => {
    const saved = localStorage.getItem('sheepshead_data');
    if (saved) {
      const data = JSON.parse(saved);
      setPlayers(data.players);
      setPots(data.pots);
      setHistory(data.history);
      setDealerId(data.dealerId);
      setView('scoreboard');
    }
  };

  const performReset = () => {
    setPlayers(defaultPlayers);
    setPots([]);
    setHistory([]);
    setDealerId(1);
    localStorage.removeItem('sheepshead_data');
    setHasSavedGame(false);
    setView('players');
    setShowResetConfirm(false);
  };

  const requestNewGame = () => {
    const hasData = hasSavedGame || players.some(p => p.balance !== 0) || history.length > 0;
    if (hasData) {
      setShowResetConfirm(true);
    } else {
      performReset();
    }
  };

  const sendEmail = () => {
    if (!emailRecipient) return;
    
    const date = new Date().toLocaleDateString();
    const subject = encodeURIComponent(`Sheepshead Scores - ${date}`);
    
    let bodyText = "Current Standings:\n\n";
    players.forEach(p => {
        const sign = p.balance >= 0 ? '+' : '-';
        bodyText += `${p.name}: ${sign}$${Math.abs(p.balance).toFixed(2)}\n`;
    });
    
    if (pots.length > 0) {
        bodyText += `\nActive Pots: ${pots.length} ($${totalPotValue.toFixed(2)})`;
    }

    bodyText += `\n\nSent from Shorewood Sheepshead Scorer`;

    window.location.href = `mailto:${emailRecipient}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    setShowEmailForm(false);
    setEmailRecipient('');
  };

  // --- Logic Helpers ---

  const activePlayers = players.filter(p => p.active);
  const sitters = players.filter(p => !p.active);
  const totalPotValue = pots.reduce((a, b) => a + b, 0);

  const updateDealerAndActiveState = (newDealerId, currentPlayers) => {
    if (currentPlayers.length <= 5) {
      return { newDealerId, newPlayers: currentPlayers };
    }
    let newPlayers = [...currentPlayers];
    if (newPlayers.length === 6) {
      newPlayers = newPlayers.map(p => ({
        ...p,
        active: p.id !== newDealerId
      }));
    } else {
      const oldDealerId = dealerId;
      newPlayers = newPlayers.map(p => {
        if (p.id === newDealerId) return { ...p, active: false };
        if (p.id === oldDealerId) return { ...p, active: true };
        return p;
      });
    }
    return { newDealerId, newPlayers };
  };

  const manuallySetDealer = (id) => {
    const { newDealerId, newPlayers } = updateDealerAndActiveState(id, players);
    setDealerId(newDealerId);
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    if (players.length >= 10) return;
    const newId = Math.max(...players.map(p => p.id), 0) + 1;
    setPlayers([...players, { id: newId, name: `Player ${newId}`, balance: 0, active: activePlayers.length < 5 }]);
  };

  const updateName = (id, newName) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const removePlayer = (id) => {
    const remaining = players.filter(p => p.id !== id);
    setPlayers(remaining);
    if (dealerId === id && remaining.length > 0) {
      setDealerId(remaining[0].id);
    }
  };

  const handlePass = () => {
    const potValue = players.length * POT_CONTRIBUTION;
    const changes = {};
    players.forEach(p => changes[p.id] = -POT_CONTRIBUTION);
    const newPots = [...pots, potValue];
    applyTransaction(changes, newPots, "Passed - Pot Added", true);
  };

  const handleThreeKings = (winnerId) => {
    const changes = {};
    let total = 0;
    players.forEach(p => {
      if (p.id !== winnerId) {
        changes[p.id] = -0.25;
        total += 0.25;
      } else {
        changes[p.id] = 0; 
      }
    });
    changes[winnerId] = total;
    applyTransaction(changes, pots, `3 Kings: ${players.find(p => p.id === winnerId).name}`, false);
    setView('scoreboard');
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
    players.forEach(p => changes[p.id] = 0);
    
    let desc = outcome === 'win' ? "Picker Won" : "Picker Lost";
    if (outcome === 'loss') desc += " (Bump)";
    
    if (handGrade === 'standard') desc += " (Schneider)";
    if (handGrade === 'schneider') desc += " (No Sch)";
    if (handGrade === 'schwarz') desc += " (Schw)";
    
    if (crackState === 'crack') desc += " [Cracked]";
    if (crackState === 'recrack') desc += " [Re-Cracked]";

    // Rule 6 Exception: Picker Loss + Schwarz = Picker pays all, Partner pays nothing.
    // 3 points per opponent.
    if (outcome === 'loss' && handGrade === 'schwarz') {
       // Rule 6: "Picker loses 9 points... opposition receive 3 points"
       // 3 points = $0.75
       // Apply crack multiplier if needed (Standard rules usually double everything on crack)
       const penaltyPerOpponent = 3 * GAME_BASE_VALUE * crackMultiplier; 
       
       opponentIds.forEach(id => changes[id] += penaltyPerOpponent);
       changes[pickerId] -= penaltyPerOpponent * opponentIds.length;
       // Partner changes remain 0
       
       if (isAlone) {
          // If alone, behavior is same as above basically, but no partner to exempt
       }
       
       desc += " (Rule 6: Pkr pays all)";

    } else {
        // Standard Scoring Logic (Rules 1-5)
        let multiplier = 1;
        if (handGrade === 'schneider') multiplier = 2; // Old "No Schneider"
        if (handGrade === 'schwarz') multiplier = 3;

        // Double on the Bump (Loss) for Standard and Schneider
        // (Rule 2 & 4)
        if (outcome === 'loss') {
            multiplier *= 2; 
        }

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
    
    if (pots.length > 0 && wageredPots > 0) {
      const potsToPlay = pots.slice(0, wageredPots);
      const remainingPots = pots.slice(wageredPots);
      const wagerValue = potsToPlay.reduce((a,b) => a+b, 0);

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
        const matchAmount = wagerValue; // Crack typically does not double the pot match amount
        
        if (isAlone) {
          changes[pickerId] -= matchAmount;
        } else {
          const totalQuarters = Math.round(matchAmount / 0.25);
          const partnerCostQuarters = Math.round(totalQuarters / 3);
          const pickerCostQuarters = totalQuarters - partnerCostQuarters;
          changes[partnerId] -= partnerCostQuarters * 0.25;
          changes[pickerId] -= pickerCostQuarters * 0.25;
        }
        nextPots = [...pots, matchAmount];

        if (sitters.length > 0) {
          let sitterPenaltyTotal = 0;
          sitters.forEach(s => {
            changes[s.id] -= POT_CONTRIBUTION;
            sitterPenaltyTotal += POT_CONTRIBUTION;
          });
          nextPots[nextPots.length - 1] += sitterPenaltyTotal;
          desc += " + Sitters";
        }
      }
    }

    applyTransaction(changes, nextPots, desc, true);
  };

  const applyTransaction = (changes, newPots, description, shouldRotateDealer) => {
    let nextPlayers = players.map(p => ({
      ...p,
      balance: p.balance + (changes[p.id] || 0)
    }));
    
    let nextDealerId = dealerId;
    if (shouldRotateDealer) {
      const currentIndex = players.findIndex(p => p.id === dealerId);
      const nextIndex = (currentIndex + 1) % players.length;
      nextDealerId = players[nextIndex].id;
      const updateResult = updateDealerAndActiveState(nextDealerId, nextPlayers);
      nextPlayers = updateResult.newPlayers;
      nextDealerId = updateResult.newDealerId;
    }
    
    setHistory([{
      id: Date.now(),
      desc: description,
      changes: changes,
      prevPots: pots,
      newPots: newPots,
      timestamp: new Date().toLocaleTimeString()
    }, ...history]);

    setPlayers(nextPlayers);
    setPots(newPots);
    setDealerId(nextDealerId);
    
    setPickerId(null);
    setPartnerId(null);
    setOutcome('win');
    setHandGrade('standard');
    setWageredPots(1);
    setCrackState('none');
    
    setView('scoreboard');
  };

  const undoLast = () => {
    if (history.length === 0) return;
    const last = history[0];
    const rest = history.slice(1);
    const newPlayers = players.map(p => ({
      ...p,
      balance: p.balance - (last.changes[p.id] || 0)
    }));
    setPlayers(newPlayers);
    setPots(last.prevPots);
    setHistory(rest);
  };

  // --- VIEWS ---

  const StartMenuView = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full relative overflow-hidden">
      {/* Green Felt Background */}
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
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(transparent 60%, rgba(0,0,0,0.4) 100%)'
      }}></div>

      {/* Main Branding Area */}
      <div className="relative z-10 mb-10 text-center space-y-6">
         
         <div className="flex justify-center items-end gap-6 mb-2">
            <QuarterStack count={5} className="transform -rotate-6" />
            
            {/* Cards Fan */}
            <div className="flex items-center justify-center relative w-32 h-24">
                <div className="absolute top-0 transform -rotate-12 -translate-x-4 transition-transform hover:-translate-y-2 duration-300">
                   <PlayingCard rank="J" suit="♦" color="rose" Icon={Diamond} />
                </div>
                <div className="absolute top-0 z-10 transform rotate-6 translate-x-4 transition-transform hover:-translate-y-2 duration-300">
                   <PlayingCard rank="Q" suit="♣" color="slate" Icon={Club} />
                </div>
            </div>

            <QuarterStack count={8} className="transform rotate-3" />
         </div>

         {/* Typography */}
         <div className="space-y-1 drop-shadow-lg">
            <div className="text-amber-300/80 font-serif tracking-[0.2em] text-sm uppercase font-bold">Shorewood</div>
            <h1 className="text-white text-5xl font-serif font-black tracking-tight" 
                style={{ 
                  textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  background: 'linear-gradient(to bottom, #fff, #e2e8f0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
              Sheepshead
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-amber-400/50"></div>
              <div className="text-amber-400 font-bold tracking-[0.2em] text-xs uppercase">Scoring</div>
              <div className="h-[1px] w-12 bg-amber-400/50"></div>
            </div>
         </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-xs space-y-4 z-10 px-6 pb-6">
        <Button onClick={requestNewGame} variant="gold" className="w-full py-4 text-lg font-serif tracking-wide shadow-xl transform hover:-translate-y-0.5 transition-all">
          <Play size={18} fill="currentColor" className="opacity-80" /> NEW GAME
        </Button>
        
        {hasSavedGame && (
          <Button onClick={loadGame} className="w-full py-4 text-lg font-serif bg-white text-slate-900 hover:bg-slate-100 shadow-xl border border-slate-300">
            <RotateCcw size={18} className="opacity-70" /> CONTINUE
          </Button>
        )}
        
        <Button onClick={() => setView('rules')} className="w-full py-3 bg-emerald-900/40 backdrop-blur-sm text-emerald-100 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400/50 shadow-lg font-serif text-sm">
          <BookOpen size={16} /> RULES & PAYOUTS
        </Button>
      </div>
    </div>
  );

  const RulesView = () => (
    <div className="space-y-6 pt-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Rules Reference</h2>
        <button onClick={() => setView('startMenu')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
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

      <Card className="p-5 space-y-4 border-l-4 border-amber-500">
        <h3 className="font-bold text-lg text-amber-800 flex items-center gap-2">
          <Crown size={20}/> Trump Rank
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm font-medium text-slate-700">
          <li>Queen of Clubs ♣</li>
          <li>Queen of Spades ♠</li>
          <li>Queen of Hearts ♥</li>
          <li>Queen of Diamonds ♦</li>
          <li>Jack of Clubs ♣</li>
          <li>Jack of Spades ♠</li>
          <li>Jack of Hearts ♥</li>
          <li>Jack of Diamonds ♦ (Partner)</li>
          <li>Diamonds (A, 10, K, 9, 8, 7)</li>
        </ol>
      </Card>

      <Card className="p-5 space-y-4 border-l-4 border-slate-500">
         <h3 className="font-bold text-lg text-slate-800">Game Mechanics</h3>
         <ul className="space-y-2 text-sm text-slate-600">
            <li><strong className="text-slate-900">Schneider:</strong> Defense needs 31+ points to save.</li>
            <li><strong className="text-slate-900">Double on Bump:</strong> Loss points doubled (x2).</li>
            <li><strong className="text-slate-900">Leaster:</strong> If no one picks, everyone pays to the pot.</li>
            <li><strong className="text-slate-900">Pot Logic:</strong> Picker wins pot 2/3 (Partner 1/3). If Picker loses, they match the pot + sitters pay.</li>
         </ul>
      </Card>
    </div>
  );

  const ThreeKingsView = () => (
    <div className="space-y-6 pt-4">
      <Card className="p-6 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
           <Crown size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">3 Kings Payout</h2>
        <p className="text-slate-500 text-sm">Select the player who has 3 Kings. Everyone else will pay them $0.25.</p>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => handleThreeKings(p.id)}
              className="p-3 border rounded-lg hover:bg-amber-50 hover:border-amber-400 font-bold text-slate-700 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
        <Button variant="secondary" onClick={() => setView('scoreboard')} className="w-full mt-4">Cancel</Button>
      </Card>
    </div>
  );

  const ScoreboardView = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white p-6 relative overflow-hidden">
        {pots.length > 0 && <div className="absolute top-0 right-0 p-2 opacity-10"><DollarSign size={120}/></div>}
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-emerald-200 text-sm font-medium uppercase tracking-wider mb-1">
               {pots.length > 0 ? `${pots.length} Active Pot${pots.length > 1 ? 's' : ''}` : 'Empty Pot'}
            </h2>
            <div className="text-4xl font-bold flex items-center gap-1">
              <DollarSign size={28} className="text-emerald-400" />
              {totalPotValue.toFixed(2)}
            </div>
            {pots.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {pots.map((val, idx) => (
                  <div key={idx} className="bg-emerald-700/50 px-2 py-0.5 rounded text-[10px] text-emerald-100 border border-emerald-600">
                    ${val.toFixed(2)}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button variant="secondary" onClick={handlePass} className="bg-emerald-700 text-white border-0 hover:bg-emerald-600 shadow-lg">
            Pass (All Pay)
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        {players.map(player => (
          <div key={player.id} className={`flex items-center justify-between p-3 rounded-xl border-l-4 shadow-sm transition-all ${player.active ? 'bg-white border-emerald-500' : 'bg-slate-50 border-slate-300 opacity-75'}`}>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => manuallySetDealer(player.id)}
                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors shadow-sm ${dealerId === player.id ? 'bg-slate-800 text-white ring-2 ring-slate-200' : 'text-slate-400 bg-slate-100 hover:text-slate-600 border border-slate-200'}`}
                title="Set Dealer"
              >
                D
              </button>
              <div className="flex flex-col">
                <input 
                    className={`font-bold bg-transparent outline-none w-32 ${player.active ? 'text-slate-800' : 'text-slate-500'}`}
                    value={player.name}
                    onChange={(e) => updateName(player.id, e.target.value)}
                />
                {!player.active && <span className="text-xs text-slate-400">Sitting (Dealer)</span>}
              </div>
            </div>
            <div className={`text-xl font-mono font-bold ${player.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {player.balance < 0 ? '-' : '+'}${Math.abs(player.balance).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
         <button onClick={() => setView('kings')} className="flex items-center gap-2 text-amber-600 font-bold text-sm bg-amber-50 px-4 py-2 rounded-full hover:bg-amber-100 transition-colors border border-amber-200">
            <Zap size={16} fill="currentColor" /> 3 Kings Payout
         </button>
      </div>

      <div className="h-20" /> 
    </div>
  );

  const NewHandView = () => {
    const isReady = activePlayers.length === 5;
    
    // Pot Wager init logic moved to App useEffect

    if (!isReady) return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
        <Users size={48} className="mb-4 text-slate-300" />
        <h3 className="text-lg font-bold text-slate-700">Invalid Player Count</h3>
        <p className="mb-6">You need exactly 5 active players.</p>
        <p className="text-sm text-slate-400">Current Dealer: {players.find(p=>p.id===dealerId)?.name}</p>
        <Button onClick={() => setView('scoreboard')}>Back to Scoreboard</Button>
      </div>
    );

    return (
      <div className="space-y-4">
        {pots.length > 0 && (
          <Card className="p-4 bg-emerald-50 border border-emerald-100">
             <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Pot Wager</h3>
             <div className="flex items-center gap-4">
               <div className="flex-1">
                 <input 
                   type="range" 
                   min="1" 
                   max={pots.length} 
                   value={wageredPots} 
                   onChange={(e) => setWageredPots(parseInt(e.target.value))}
                   className="w-full accent-emerald-600 cursor-pointer"
                 />
                 <div className="flex justify-between text-xs text-emerald-600 mt-1 font-bold">
                    <span>1 Pot</span>
                    <span>{pots.length} Pots</span>
                 </div>
               </div>
               <div className="text-center bg-white p-2 rounded shadow-sm min-w-[80px]">
                 <div className="text-2xl font-bold text-emerald-700">{wageredPots}</div>
                 <div className="text-[10px] text-emerald-500 uppercase">Playing For</div>
               </div>
             </div>
          </Card>
        )}

        <Card className="p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Who Picked?</h3>
          <div className="grid grid-cols-3 gap-2">
            {activePlayers.map(p => (
              <button
                key={p.id}
                onClick={() => {
                   setPickerId(p.id);
                   if (p.id === partnerId) setPartnerId(null);
                }}
                className={`p-2 rounded-lg text-sm font-bold border transition-all ${pickerId === p.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </Card>

        {pickerId && (
          <Card className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partner (Jack of Diamonds)</h3>
            <div className="grid grid-cols-3 gap-2">
              {activePlayers.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPartnerId(p.id)}
                  disabled={p.id === pickerId}
                  className={`p-2 rounded-lg text-sm font-bold border transition-all 
                    ${p.id === pickerId ? 'opacity-25 cursor-not-allowed bg-slate-100' : ''}
                    ${partnerId === p.id ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400'}`}
                >
                  {p.name}
                </button>
              ))}
              <button
                onClick={() => setPartnerId(pickerId)}
                className={`p-2 rounded-lg text-sm font-bold border transition-all ${partnerId === pickerId ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-400'}`}
              >
                Alone
              </button>
            </div>
          </Card>
        )}

        {/* Cracking Section */}
        {pickerId && (
          <Card className="p-4 bg-amber-50 border border-amber-100">
             <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1"><Hammer size={12}/> Crack (Double Stakes)</h3>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setCrackState(crackState === 'crack' ? 'none' : 'crack')}
                     className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${crackState === 'crack' || crackState === 'recrack' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-500 border-slate-300'}`}
                   >
                     Crack (x2)
                   </button>
                   {(crackState === 'crack' || crackState === 'recrack') && (
                     <button 
                       onClick={() => setCrackState(crackState === 'recrack' ? 'crack' : 'recrack')}
                       className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${crackState === 'recrack' ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-slate-500 border-slate-300'}`}
                     >
                       Re-Crack (x4)
                     </button>
                   )}
                </div>
             </div>
          </Card>
        )}

        <Card className="p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Result</h3>
          
          <div className="flex gap-2 mb-3">
            <button 
              onClick={() => setOutcome('win')}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border ${outcome === 'win' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-400'}`}
            >
              Picker Win
            </button>
            <button 
              onClick={() => setOutcome('loss')}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border ${outcome === 'loss' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-slate-200 text-slate-400'}`}
            >
              Picker Loss
            </button>
          </div>

          <div className="space-y-2">
             <button onClick={() => setHandGrade('standard')} className={`w-full py-2 px-3 text-left rounded border flex justify-between items-center ${handGrade === 'standard' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600'}`}>
                <span className="font-bold text-sm">Schneider</span>
                <span className="text-xs opacity-70">
                  {outcome === 'win' ? "Defenders > 30 pts" : "Pickers > 30 pts"}
                </span>
             </button>
             <button onClick={() => setHandGrade('schneider')} className={`w-full py-2 px-3 text-left rounded border flex justify-between items-center ${handGrade === 'schneider' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600'}`}>
                <span className="font-bold text-sm">No Schneider (x2)</span>
                <span className="text-xs opacity-70">
                  {outcome === 'win' ? "Defenders < 31 pts" : "Pickers < 31 pts"}
                </span>
             </button>
             <button onClick={() => setHandGrade('schwarz')} className={`w-full py-2 px-3 text-left rounded border flex justify-between items-center ${handGrade === 'schwarz' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600'}`}>
                <span className="font-bold text-sm">Schwarz (x3)</span>
                <span className="text-xs opacity-70">
                  {outcome === 'win' ? "Defenders 0 pts" : "Pickers 0 pts"}
                </span>
             </button>
          </div>
        </Card>

        <Button onClick={calculateScore} disabled={!pickerId || !partnerId} className="w-full py-4 text-lg shadow-xl shadow-emerald-200">
          Save Score
        </Button>
      </div>
    );
  };

  const PlayersView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Manage Players</h2>
        <Button onClick={addPlayer} disabled={players.length >= 10} variant="primary">
          <UserPlus size={18} /> Add
        </Button>
      </div>
      
      <div className="space-y-2">
        {players.map(player => (
          <div key={player.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 flex-1">
               {/* Disabled manual active toggling here to prevent conflict with dealer rotation, 
                   but could re-enable if user needs to swap players manually without dealer logic */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${player.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
              >
                <Users size={16} />
              </div>
              <input 
                value={player.name}
                onChange={(e) => updateName(player.id, e.target.value)}
                className="font-medium text-slate-700 bg-transparent border-b border-transparent focus:border-emerald-500 outline-none flex-1"
              />
            </div>
            {players.length > 5 && (
               <span className={`text-xs px-2 py-1 rounded-full mr-2 ${player.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                 {player.active ? 'Playing' : 'Sitting'}
               </span>
            )}
            <button 
              onClick={() => removePlayer(player.id)}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-amber-50 rounded-lg text-amber-800 text-sm">
        <p className="flex items-center gap-2 font-bold mb-1"><AlertTriangle size={16}/> Note</p>
        For games with 6+ players, the dealer automatically sits out. You can manually set the Dealer on the scoreboard to rotate players.
      </div>
      
      <div className="border-t border-slate-200 pt-6 mt-2">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Game Actions</h3>
        
        <div className="space-y-3">
            {!showEmailForm ? (
                <Button onClick={() => setShowEmailForm(true)} variant="secondary" className="w-full justify-start border border-slate-300">
                    <Mail size={18} className="text-slate-500"/> Email Scores
                </Button>
            ) : (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-500">Recipient Email</label>
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            value={emailRecipient}
                            onChange={(e) => setEmailRecipient(e.target.value)}
                            placeholder="name@example.com"
                            className="flex-1 p-2 border border-slate-300 rounded text-sm outline-none focus:border-emerald-500"
                        />
                        <button onClick={sendEmail} className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700">
                            <Send size={18} />
                        </button>
                    </div>
                    <button onClick={() => setShowEmailForm(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                </div>
            )}

            <Button onClick={requestNewGame} variant="danger" className="w-full justify-start border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100">
                <LogOut size={18} /> Start New Game
            </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0 max-w-md mx-auto border-x border-slate-200 shadow-2xl relative">
      
      {/* Top Bar - Hidden on Start Menu */}
      {view !== 'startMenu' && view !== 'rules' && (
        <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 border-b border-slate-100">
          <button onClick={() => setView('startMenu')} className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 hover:opacity-75">
             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">S</div>
             Sheepshead
          </button>
          <div className="flex gap-2">
             <button onClick={undoLast} disabled={history.length === 0} className="p-2 text-slate-400 hover:text-slate-800 disabled:opacity-30">
               <RotateCcw size={20} />
             </button>
             <button onClick={() => setView(view === 'players' ? 'scoreboard' : 'players')} className="p-2 text-slate-400 hover:text-emerald-600">
               <Settings size={20} />
             </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="p-4">
        {view === 'startMenu' && StartMenuView()}
        {view === 'rules' && RulesView()}
        {view === 'scoreboard' && ScoreboardView()}
        {view === 'players' && PlayersView()}
        {view === 'newHand' && NewHandView()}
        {view === 'kings' && ThreeKingsView()}
      </main>

      {/* History Feed (Only on scoreboard) */}
      {view === 'scoreboard' && history.length > 0 && (
        <div className="px-4 pb-20">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">History</h3>
          <div className="space-y-2">
            {history.slice(0, 5).map(h => (
               <div key={h.id} className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-100 flex justify-between">
                 <span>{h.desc}</span>
                 <span className="font-mono">{h.timestamp}</span>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation / Action Bar */}
      {view !== 'startMenu' && view !== 'rules' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-around items-center max-w-md mx-auto z-20">
          {view === 'newHand' ? (
            <Button variant="secondary" onClick={() => setView('scoreboard')} className="w-full">Cancel</Button>
          ) : (
             view === 'kings' ? null : (
              <>
                 <button onClick={() => setView('scoreboard')} className={`flex flex-col items-center gap-1 text-xs font-medium ${view === 'scoreboard' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <History size={24} /> Scoreboard
                 </button>
                 <button 
                    onClick={() => setView('newHand')}
                    className="bg-emerald-600 text-white w-14 h-14 rounded-full shadow-lg shadow-emerald-200 flex items-center justify-center -mt-8 hover:scale-105 transition-transform"
                  >
                    <Plus size={28} />
                 </button>
                 <button onClick={() => setView('players')} className={`flex flex-col items-center gap-1 text-xs font-medium ${view === 'players' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <Users size={24} /> Players
                 </button>
              </>
             )
          )}
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle size={32} />
              <h3 className="text-lg font-bold text-slate-800">Start New Game?</h3>
            </div>
            <p className="text-slate-600">
              Are you sure you want to reset? All current scores and history will be lost permanently.
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowResetConfirm(false)} variant="secondary" className="flex-1">
                Cancel
              </Button>
              <Button onClick={performReset} variant="danger" className="flex-1">
                Yes, Reset
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}