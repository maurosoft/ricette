
import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, ShieldCheck, 
  Calendar, Trash2, X, Search, Mail, Power,
  CreditCard, Link as LinkIcon, Info, List, Save, Sparkles, LogOut, ArrowLeft, Home
} from 'lucide-react';
import { User, MembershipType, MembershipPlan } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  users: User[];
  onAddUser: (user: Partial<User>) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<Props> = ({ users, onAddUser, onUpdateUser, onDeleteUser, onLogout }) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'plans'>('users');
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    username: '',
    membership: '1month' as MembershipType,
    isActive: true
  });

  useEffect(() => {
    const loadPlans = async () => {
      const p = await storageService.getPlans();
      setPlans(p);
    };
    loadPlans();
  }, []);

  const updatePlanField = (id: MembershipType, field: keyof MembershipPlan, value: any) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSaveAllPlans = async () => {
    try {
      await storageService.savePlans(plans);
      setSaveStatus("Prezzi e Piani salvati correttamente!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus("Errore fatale nel salvataggio.");
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.email && newUser.password && newUser.username) {
      onAddUser(newUser);
      setNewUser({ email: '', password: '', username: '', membership: '1month', isActive: true });
      setIsAdding(false);
    }
  };

  const filteredUsers = (users || []).filter(u => 
    u?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-2 sm:px-4">
      {/* Header Pannello con tasti navigazione e logout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-stone-100">
        <div className="flex items-center gap-5">
          <div className="bg-red-50 p-4 rounded-3xl text-red-600 shadow-inner">
            <ShieldCheck size={36} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">Ufficio di NonnoWeb</h2>
            <p className="text-stone-400 font-medium text-sm">Gestione nipoti e listino prezzi.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex bg-stone-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setActiveSubTab('users')} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${activeSubTab === 'users' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <Users size={18} /> Utenti
            </button>
            <button 
              onClick={() => setActiveSubTab('plans')} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${activeSubTab === 'plans' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <CreditCard size={18} /> Prezzi
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => { 
                // Forza un click sul logo per tornare alla cucina senza logout
                window.location.hash = ""; 
                window.scrollTo(0,0);
                onLogout(); // Qui usiamo onLogout come trigger per resettare lo stato admin in App.tsx
              }} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-stone-600 hover:bg-stone-50 transition-all text-sm"
              title="Esci dall'Admin"
            >
              <Home size={18} /> Esci
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'users' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
             <h3 className="text-xl font-serif font-bold text-stone-800">Anagrafica Nipoti</h3>
             <button onClick={() => setIsAdding(!isAdding)} className="bg-stone-800 hover:bg-black text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-sm">
               {isAdding ? <X size={18} /> : <UserPlus size={18} />} 
               {isAdding ? 'Annulla' : 'Aggiungi'}
             </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAdd} className="bg-white p-6 rounded-3xl border-2 border-stone-100 shadow-xl grid md:grid-cols-2 lg:grid-cols-5 gap-4 animate-slide-up">
              <input required placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm font-bold" />
              <input required type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm font-bold" />
              <input required type="text" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm font-bold" />
              <select value={newUser.membership} onChange={e => setNewUser({...newUser, membership: e.target.value as MembershipType})} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm font-bold">
                {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button type="submit" className="bg-green-600 text-white p-3.5 rounded-xl font-bold hover:bg-green-700 shadow-md">Crea</button>
            </form>
          )}

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
            <div className="p-6 border-b border-stone-50 flex items-center gap-4 bg-stone-50/30">
              <Search className="text-stone-300" />
              <input placeholder="Cerca nipote..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent w-full outline-none font-bold text-stone-600" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead><tr className="bg-stone-50/50 text-stone-400 uppercase text-[10px] font-black tracking-widest"><th className="px-8 py-5">Nipote</th><th className="px-8 py-5">Stato</th><th className="px-8 py-5">Piano</th><th className="px-8 py-5 text-right">Azioni</th></tr></thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-stone-50/20">
                      <td className="px-8 py-6">
                        <div className="font-bold text-stone-800 text-lg">{user.username}</div>
                        <div className="text-xs text-stone-400 font-medium">{user.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          onClick={() => onUpdateUser(user.id, { isActive: !user.isActive })} 
                          disabled={user.role === 'admin'} 
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${user.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
                        >
                          {user.isActive ? 'ATTIVO' : 'SOSPESO'}
                        </button>
                      </td>
                      <td className="px-8 py-6">
                        <select 
                          value={user.membership} 
                          onChange={e => onUpdateUser(user.id, { membership: e.target.value as MembershipType })} 
                          className="text-sm font-bold bg-stone-100 px-3 py-1.5 rounded-xl border-none outline-none"
                        >
                          {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {user.role !== 'admin' && <button onClick={() => onDeleteUser(user.id)} className="text-stone-300 hover:text-red-500 p-2 transition-all"><Trash2 size={20} /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-slide-up">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
             <div>
               <h3 className="text-2xl font-serif font-bold text-stone-800">Editor Listino Prezzi</h3>
               <p className="text-stone-400 text-sm font-medium">Modifica qui i prezzi e le offerte visualizzate dai nipoti.</p>
             </div>
             <div className="flex items-center gap-4">
                {saveStatus && <span className="text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl text-sm border border-green-100 animate-pop">{saveStatus}</span>}
                <button onClick={handleSaveAllPlans} className="bg-nonno-600 hover:bg-nonno-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-95">
                  <Save size={18} /> Salva Tutti i Piani
                </button>
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {plans.map((plan) => (
               <div key={plan.id} className="bg-white p-6 sm:p-8 rounded-[3rem] shadow-sm border border-stone-100 space-y-6 group border-t-8" style={{ borderTopColor: plan.isPopular ? '#ca8a04' : '#e7e5e4' }}>
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1"><Sparkles size={10} /> Nome Piano</label>
                      <input value={plan.name} onChange={e => updatePlanField(plan.id, 'name', e.target.value)} className="text-2xl font-serif font-bold text-stone-800 w-full bg-transparent border-b border-stone-100 outline-none focus:border-nonno-400" />
                    </div>
                    <div className="bg-stone-50 p-4 rounded-3xl border border-stone-100 text-right min-w-[130px]">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Prezzo (€)</label>
                      <input value={plan.price} onChange={e => updatePlanField(plan.id, 'price', e.target.value)} className="text-2xl font-black text-nonno-600 w-full bg-transparent text-right outline-none" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1 mb-2"><Calendar size={12} /> Durata (gg)</label>
                      <input type="number" value={plan.durationDays} onChange={e => updatePlanField(plan.id, 'durationDays', parseInt(e.target.value) || 0)} className="text-xl font-bold text-stone-700 w-full bg-transparent outline-none" />
                    </div>
                    <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1 mb-2"><List size={12} /> Limite Giornaliero</label>
                      <input type="number" value={plan.dailyRecipeLimit} onChange={e => updatePlanField(plan.id, 'dailyRecipeLimit', parseInt(e.target.value) || 0)} className="text-xl font-bold text-stone-700 w-full bg-transparent outline-none" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1"><LinkIcon size={12} /> Link Pagamento (URL)</label>
                    <input value={plan.paymentLink} onChange={e => updatePlanField(plan.id, 'paymentLink', e.target.value)} placeholder="https://www.paypal.me/..." className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-xs font-bold text-blue-600 outline-none" />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1"><Info size={12} /> Vantaggi (uno per riga)</label>
                    <textarea value={plan.features.join('\n')} onChange={e => updatePlanField(plan.id, 'features', e.target.value.split('\n'))} rows={4} className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-100 text-sm font-medium text-stone-600 outline-none resize-none leading-tight" />
                 </div>

                 <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" checked={plan.isPopular} onChange={e => updatePlanField(plan.id, 'isPopular', e.target.checked)} />
                        <div className="w-12 h-6 bg-stone-200 rounded-full peer peer-checked:bg-nonno-600 transition-colors after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6 relative"></div>
                      </div>
                      <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Piano Consigliato</span>
                    </label>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
