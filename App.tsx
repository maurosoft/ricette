
import React, { useState, useEffect, useCallback } from 'react';
import { ChefHat, Loader2, User as UserIcon, Book, LogOut, Sparkles, ShieldAlert, X, ShieldCheck, Heart, Coffee, PlusCircle } from 'lucide-react';
import IngredientSelector from './components/IngredientSelector';
import Preferences from './components/Preferences';
import RecipeCard from './components/RecipeCard';
import AuthModal from './components/AuthModal';
import MembershipModal from './components/MembershipModal';
import History from './components/History';
import AdminPanel from './components/AdminPanel';
import { generateRecipe } from './services/geminiService';
import { storageService } from './services/storageService';
import { RecipeRequest, RecipeResponse, CourseType, User } from './types';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history' | 'admin'>('create');
  
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<RecipeRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredients, setCustomIngredients] = useState('');
  const [mealType, setMealType] = useState<'pranzo' | 'cena'>('pranzo');
  const [courseType, setCourseType] = useState<CourseType>('sorpresa');
  const [peopleCount, setPeopleCount] = useState(2);
  const [intolerances, setIntolerances] = useState('');

  const refreshData = useCallback(async () => {
    try {
      const allUsers = await storageService.getUsers();
      setUsers(allUsers);
      const session = storageService.getCurrentSession();
      if (session) {
        const freshUser = allUsers.find(u => u.id === session.id);
        if (freshUser && freshUser.isActive) {
          setCurrentUser(freshUser);
        } else {
          storageService.logout();
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Errore sincronizzazione:", err);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleLogin = async (email: string, pass: string): Promise<string | null> => {
    const result = await storageService.login(email, pass);
    if (typeof result === 'string') return result;
    setCurrentUser(result);
    setShowAuthModal(false);
    return null;
  };

  const handleLogout = useCallback(() => {
    storageService.logout();
    window.location.reload();
  }, []);

  const handleAddUser = async (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email || '',
      password: userData.password || 'password123',
      username: userData.username || 'Nuovo Nipote',
      role: 'user',
      isActive: true,
      membership: userData.membership || 'none',
      savedRecipes: [],
      expiryDate: storageService.getExpiryDate(userData.membership || 'none')
    };
    
    try {
      await storageService.saveUser(newUser);
      await refreshData();
    } catch (err) {
      setError("Errore nel salvataggio del nipote.");
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const allUsers = await storageService.getUsers();
      const userToUpdate = allUsers.find(u => u.id === userId);
      if (userToUpdate) {
        const updatedUser = { ...userToUpdate, ...updates };
        if (updates.membership) {
          updatedUser.expiryDate = storageService.getExpiryDate(updates.membership);
        }
        await storageService.saveUser(updatedUser);
        await refreshData();
      }
    } catch (err) {
      setError("Impossibile aggiornare i dati.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Nipote, vuoi davvero eliminare questo utente?")) {
      await storageService.deleteUser(userId);
      await refreshData();
    }
  };

  const handleGenerate = async () => {
    if (!currentUser) {
      const freeUsed = localStorage.getItem('nonnoweb_free_used');
      if (freeUsed) {
        setError("Hai già gustato la tua ricetta gratuita! Accedi o abbonati per continuare.");
        setShowAuthModal(true);
        return;
      }
    }

    if (selectedIngredients.length === 0 && !customIngredients.trim()) {
      setError("Metti almeno un ingrediente, nipote!");
      return;
    }

    setLoading(true);
    setError(null);

    const request: RecipeRequest = { selectedIngredients, customIngredients, mealType, courseType, peopleCount, intolerances };

    try {
      const result = await generateRecipe(request);
      const recipeId = `recipe-${Date.now()}`;
      const recipeWithMeta = { ...result, id: recipeId, timestamp: Date.now() };
      setLastRequest(request);
      setRecipe(recipeWithMeta);
      
      if (currentUser) {
        const today = new Date().toISOString().split('T')[0];
        const currentDaily = currentUser.dailyCount || { date: today, count: 0 };
        const newCount = (currentDaily.date === today) ? currentDaily.count + 1 : 1;
        const updatedUser = { ...currentUser, dailyCount: { date: today, count: newCount } };
        setCurrentUser(updatedUser);
        await storageService.saveUser(updatedUser);
        storageService.updateSession(updatedUser);
      } else {
        localStorage.setItem('nonnoweb_free_used', 'true');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("C'è stato un intoppo in cucina. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (newRecipe: RecipeResponse) => {
    if (!currentUser) { setShowAuthModal(true); return; }
    
    // Assicuriamo che la ricetta abbia un ID stringa persistente
    const recipeId = String(newRecipe.id || `recipe-${Date.now()}`);
    const recipeToSave = { 
      ...newRecipe, 
      id: recipeId, 
      timestamp: newRecipe.timestamp || Date.now() 
    };

    const saved = currentUser.savedRecipes || [];
    const isAlreadySaved = saved.some(r => String(r.id) === recipeId);
    if (isAlreadySaved) return;

    const updatedRecipes = [recipeToSave, ...saved];
    const updatedUser = { ...currentUser, savedRecipes: updatedRecipes };
    
    // Aggiorniamo subito lo stato locale per reattività
    setCurrentUser(updatedUser);
    await storageService.saveUser(updatedUser);
    storageService.updateSession(updatedUser);
    
    // IMPORTANTE: Aggiorniamo la ricetta visualizzata con quella salvata (che ha l'ID corretto)
    setRecipe(recipeToSave);
    
    await refreshData();
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!currentUser) return;
    
    const idToMatch = String(recipeId);
    const updatedRecipes = (currentUser.savedRecipes || []).filter(r => String(r.id) !== idToMatch);
    
    const updatedUser = { ...currentUser, savedRecipes: updatedRecipes };
    
    // Salvataggio immediato
    setCurrentUser(updatedUser);
    await storageService.saveUser(updatedUser);
    storageService.updateSession(updatedUser);
    
    // Se la ricetta corrente è quella eliminata, resetta la vista
    if (recipe && String(recipe.id) === idToMatch) {
      setRecipe(null);
      if (activeTab === 'history') {
        // Resta nel ricettario ma rinfresca la lista
      }
    }
    
    await refreshData();
  };

  return (
    <div className="min-h-screen bg-stone-50 hex-bg flex flex-col pb-24 md:pb-0">
      <header className="bg-white/95 backdrop-blur-md border-b border-nonno-100 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setRecipe(null); setActiveTab('create')}}>
            <div className="bg-nonno-600 p-2.5 rounded-[0.9rem] text-white shadow-lg"><ChefHat size={26} /></div>
            <h1 className="text-2xl font-serif font-bold text-stone-800 tracking-tight">NonnoWeb</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <nav className="hidden md:flex items-center bg-stone-100 p-1 rounded-xl">
                  <button onClick={() => {setRecipe(null); setActiveTab('create')}} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'create' ? 'bg-white text-nonno-700 shadow-sm' : 'text-stone-400'}`}>Cucina</button>
                  <button onClick={() => {setRecipe(null); setActiveTab('history')}} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-nonno-700 shadow-sm' : 'text-stone-400'}`}>Ricettario</button>
                  {currentUser?.role === 'admin' && (
                    <button onClick={() => {setRecipe(null); setActiveTab('admin')}} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'admin' ? 'bg-white text-red-600 shadow-sm' : 'text-stone-400'}`}>Gestione</button>
                  )}
                </nav>
                <div className="hidden md:block h-8 w-[1px] bg-stone-200 mx-2"></div>
                <div className="hidden md:flex items-center gap-2">
                   <span className="text-sm font-bold text-stone-600 uppercase tracking-tighter">Nipote {currentUser.username}</span>
                   <button 
                    onClick={handleLogout} 
                    className="p-2.5 text-stone-300 hover:text-red-500 transition-colors"
                    title="Esci"
                  >
                    <LogOut size={22} />
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-nonno-600 text-white rounded-xl font-bold shadow-lg text-sm active:scale-95 transition-all"><UserIcon size={18} /> Accedi</button>
            )}
          </div>
        </div>
      </header>

      {currentUser && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex justify-around items-center pt-3 pb-6 px-4 z-[90] md:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.06)] print:hidden">
          <button onClick={() => {setRecipe(null); setActiveTab('create')}} className={`flex flex-col items-center gap-1.5 flex-1 ${activeTab === 'create' ? 'text-nonno-600' : 'text-stone-300'}`}>
            <PlusCircle size={28} />
            <span className={`text-[10px] font-bold uppercase ${activeTab === 'create' ? 'text-nonno-800' : 'text-stone-400'}`}>Nuova</span>
          </button>
          <button onClick={() => {setRecipe(null); setActiveTab('history')}} className={`flex flex-col items-center gap-1.5 flex-1 ${activeTab === 'history' ? 'text-nonno-600' : 'text-stone-300'}`}>
            <Book size={28} />
            <span className={`text-[10px] font-bold uppercase ${activeTab === 'history' ? 'text-nonno-800' : 'text-stone-400'}`}>I Miei Piatti</span>
          </button>
          {currentUser?.role === 'admin' && (
            <button onClick={() => {setRecipe(null); setActiveTab('admin')}} className={`flex flex-col items-center gap-1.5 flex-1 ${activeTab === 'admin' ? 'text-stone-600' : 'text-stone-300'}`}>
              <ShieldCheck size={28} />
              <span className={`text-[10px] font-bold uppercase ${activeTab === 'admin' ? 'text-stone-800' : 'text-stone-400'}`}>Admin</span>
            </button>
          )}
          <button onClick={handleLogout} className="flex flex-col items-center gap-1.5 flex-1 text-red-400 hover:text-red-600 transition-colors">
            <LogOut size={28} />
            <span className="text-[10px] font-bold uppercase">Esci</span>
          </button>
        </nav>
      )}

      <main className="flex-grow max-w-5xl mx-auto px-4 py-10 w-full relative">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-100 p-5 rounded-[1.5rem] flex items-center gap-4 text-red-700 animate-slide-up">
            <ShieldAlert size={24} className="shrink-0" />
            <p className="text-sm font-bold flex-1">{error}</p>
            <button onClick={() => setError(null)}><X size={20} /></button>
          </div>
        )}

        {recipe ? (
          <RecipeCard 
            recipe={recipe} 
            requestDetails={lastRequest || undefined}
            onReset={() => setRecipe(null)} 
            onSave={handleSaveRecipe}
            onDelete={handleDeleteRecipe}
            isSaved={!!currentUser?.savedRecipes?.some(r => String(r.id) === String(recipe.id))}
            isLoggedIn={!!currentUser}
          />
        ) : (
          <div className="animate-fade-in">
            {activeTab === 'create' && (
              <div className="space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-5">
                   <img src="https://image.pollinations.ai/prompt/smiling%20italian%20grandpa%20chef%20cartoon%20illustration%20warm%20colors?width=250&height=250&nologo=true" alt="Nonno" className="w-40 h-40 mx-auto rounded-full border-4 border-white shadow-xl" />
                   <h2 className="text-4xl font-serif font-bold text-stone-800">
                     Cosa cuciniamo oggi, Nipote {currentUser ? currentUser.username : 'Caro'}?
                   </h2>
                   <p className="text-stone-500 text-lg">Metti gli ingredienti sul tavolo e lascia fare al Nonno.</p>
                </div>
                <div className="grid lg:grid-cols-3 gap-10 items-start">
                  <div className="lg:col-span-2"><IngredientSelector selected={selectedIngredients} onToggle={(n) => setSelectedIngredients(prev => prev.includes(n) ? prev.filter(i => i !== n) : [...prev, n])} customIngredients={customIngredients} onCustomChange={setCustomIngredients} /></div>
                  <div className="lg:col-span-1 space-y-8">
                    <Preferences mealType={mealType} setMealType={setMealType} courseType={courseType} setCourseType={setCourseType} peopleCount={peopleCount} setPeopleCount={setPeopleCount} intolerances={intolerances} setIntolerances={setIntolerances} />
                    <button onClick={handleGenerate} disabled={loading} className={`w-full py-5 rounded-[1.8rem] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 transition-all ${loading ? 'bg-stone-400' : 'bg-stone-900 hover:bg-black active:scale-95'}`}>
                      {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} {loading ? 'Il Nonno Scrive...' : 'Crea Ricetta'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'history' && (
              <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                  <h2 className="text-4xl font-serif font-bold text-stone-800">Le Tue Ricette</h2>
                  <p className="text-stone-500 font-medium italic">Tutte le delizie create con NonnoWeb.</p>
                </div>
                <History recipes={currentUser?.savedRecipes || []} onSelect={(r) => {setRecipe(r)}} onDelete={handleDeleteRecipe} />
              </div>
            )}
            {activeTab === 'admin' && currentUser?.role === 'admin' && (
              <AdminPanel users={users} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} onLogout={() => setActiveTab('create')} />
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-stone-100 py-16 px-6 print:hidden">
        <div className="max-w-xl mx-auto text-center space-y-10">
          <div className="flex items-center justify-center gap-3 text-nonno-600 font-serif font-bold italic text-xl">
            <Heart size={26} className="fill-red-500 text-red-500 animate-pulse" /> Tradizione e Cuore
          </div>
          <p className="text-stone-500 font-medium leading-relaxed">Sostieni la cucina digitale del Nonno per sbloccare ricette illimitate e funzioni esclusive.</p>
          
          <button 
            onClick={() => setShowMembershipModal(true)} 
            className="membership-cta bg-nonno-500 text-nonno-900 px-10 py-5 rounded-[1.5rem] font-bold text-sm shadow-[0_15px_30px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <Coffee size={20} /> Piani Membership
          </button>
          
          <div className="space-y-1 pt-6">
            <p className="text-stone-300 text-[11px] font-bold uppercase tracking-[0.2em]">© 2025 NonnoWeb · Fatto con amore.</p>
          </div>
        </div>
      </footer>

      {showAuthModal && <AuthModal onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />}
      {showMembershipModal && <MembershipModal onClose={() => setShowMembershipModal(false)} onContact={() => {}} />}
    </div>
  );
};

export default App;
