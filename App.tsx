
import React, { useState, useEffect, useCallback } from 'react';
import { ChefHat, Loader2, User as UserIcon, Book, LogOut, Sparkles, ShieldAlert, X, Heart, PlusCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
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

const VERSION = "2.1.0-REVOLUTION";

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
        if (freshUser) setCurrentUser(freshUser);
      }
    } catch (err) {
      console.error("Sync error:", err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleGenerate = async () => {
    if (selectedIngredients.length === 0 && !customIngredients.trim()) {
      setError("Metti almeno un ingrediente, nipote!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const request: RecipeRequest = { selectedIngredients, customIngredients, mealType, courseType, peopleCount, intolerances };
      const result = await generateRecipe(request);
      
      const newRecipe = { 
        ...result, 
        id: `recipe-${Date.now()}`, 
        timestamp: Date.now() 
      };
      
      setLastRequest(request);
      setRecipe(newRecipe);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(`Intoppo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (recipeToSave: RecipeResponse) => {
    if (!currentUser) { setShowAuthModal(true); return; }
    
    const finalId = String(recipeToSave.id || `recipe-${Date.now()}`);
    const normalizedRecipe = { ...recipeToSave, id: finalId };

    const saved = currentUser.savedRecipes || [];
    if (saved.some(r => String(r.id) === finalId)) return;

    const updatedUser = { 
      ...currentUser, 
      savedRecipes: [normalizedRecipe, ...saved] 
    };

    await storageService.saveUser(updatedUser);
    storageService.updateSession(updatedUser);
    setCurrentUser(updatedUser);
    setRecipe(normalizedRecipe); // Aggiorna la vista corrente con l'ID finale
    await refreshData();
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!currentUser) return;
    
    const idToDelete = String(id);
    const updatedRecipes = (currentUser.savedRecipes || []).filter(r => String(r.id) !== idToDelete);
    
    const updatedUser = { ...currentUser, savedRecipes: updatedRecipes };
    
    await storageService.saveUser(updatedUser);
    storageService.updateSession(updatedUser);
    setCurrentUser(updatedUser);

    // Se la ricetta visualizzata è quella cancellata, chiudila
    if (recipe && String(recipe.id) === idToDelete) {
      setRecipe(null);
      setActiveTab('history');
    }
    
    await refreshData();
  };

  const apiKeyPresent = !!process.env.API_KEY && process.env.API_KEY.length > 5;

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
                </nav>
                <div className="hidden md:flex items-center gap-2 pl-4">
                   <span className="text-sm font-bold text-stone-600">Nipote {currentUser.username}</span>
                   <button onClick={() => {storageService.logout(); window.location.reload();}} className="p-2 text-stone-300 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="px-6 py-2.5 bg-nonno-600 text-white rounded-xl font-bold shadow-lg text-sm">Accedi</button>
            )}
          </div>
        </div>
      </header>

      {currentUser && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex justify-around items-center pt-3 pb-6 px-4 z-[90] md:hidden shadow-xl print:hidden">
          <button onClick={() => {setRecipe(null); setActiveTab('create')}} className={`flex flex-col items-center gap-1 ${activeTab === 'create' ? 'text-nonno-600' : 'text-stone-300'}`}>
            <PlusCircle size={28} /><span className="text-[10px] font-bold">CUCINA</span>
          </button>
          <button onClick={() => {setRecipe(null); setActiveTab('history')}} className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-nonno-600' : 'text-stone-300'}`}>
            <Book size={28} /><span className="text-[10px] font-bold">I MIEI PIATTI</span>
          </button>
        </nav>
      )}

      <main className="flex-grow max-w-5xl mx-auto px-4 py-10 w-full">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-100 p-5 rounded-[1.5rem] flex items-center justify-between text-red-700 animate-slide-up">
            <div className="flex items-center gap-3"><ShieldAlert size={24} className="shrink-0" /><p className="text-sm font-bold">{error}</p></div>
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
                   <img src="https://image.pollinations.ai/prompt/friendly%20italian%20grandpa%20chef%20smiling?width=200&height=200&nologo=true" alt="Nonno" className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-xl" />
                   <h2 className="text-4xl font-serif font-bold text-stone-800">Cosa cuciniamo oggi, Nipote {currentUser?.username || 'Caro'}?</h2>
                </div>
                <div className="grid lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2"><IngredientSelector selected={selectedIngredients} onToggle={(n) => setSelectedIngredients(prev => prev.includes(n) ? prev.filter(i => i !== n) : [...prev, n])} customIngredients={customIngredients} onCustomChange={setCustomIngredients} /></div>
                  <div className="lg:col-span-1 space-y-6">
                    <Preferences mealType={mealType} setMealType={setMealType} courseType={courseType} setCourseType={setCourseType} peopleCount={peopleCount} setPeopleCount={setPeopleCount} intolerances={intolerances} setIntolerances={setIntolerances} />
                    <button onClick={handleGenerate} disabled={loading} className={`w-full py-5 rounded-[1.8rem] text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${loading ? 'bg-stone-400' : 'bg-stone-900 hover:bg-black active:scale-95'}`}>
                      {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} {loading ? 'Cucinando...' : 'Crea Ricetta'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'history' && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8 text-center">Il Tuo Ricettario</h2>
                <History recipes={currentUser?.savedRecipes || []} onSelect={(r) => setRecipe(r)} onDelete={handleDeleteRecipe} />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-stone-100 py-12 px-6 flex flex-col items-center gap-6">
         <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-col items-center bg-stone-50 px-4 py-2 rounded-2xl border border-stone-100 min-w-[120px]">
               <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Versione</span>
               <span className="text-xs font-bold text-stone-600">{VERSION}</span>
            </div>
            <div className="flex flex-col items-center bg-stone-50 px-4 py-2 rounded-2xl border border-stone-100 min-w-[120px]">
               <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Sorgente API</span>
               <div className={`flex items-center gap-1 text-xs font-bold ${apiKeyPresent ? 'text-green-600' : 'text-red-600'}`}>
                  {apiKeyPresent ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  {apiKeyPresent ? 'COLLEGATA' : 'MANCANTE'}
               </div>
            </div>
         </div>
         <Heart size={24} className="text-red-500 animate-pulse" />
         <p className="text-stone-400 font-bold text-[10px] uppercase tracking-widest">NonnoWeb © 2025 · Fatto con amore</p>
      </footer>

      {showAuthModal && <AuthModal onLogin={async (e, p) => { const r = await storageService.login(e, p); if (typeof r === 'string') return r; setCurrentUser(r); setShowAuthModal(false); return null; }} onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default App;
