
import React from 'react';
import { RecipeResponse, RecipeRequest } from '../types';
import { 
  Wine, ChefHat, Sparkles, Printer, ArrowLeft, 
  Bookmark, BookmarkCheck, Users, Utensils, Soup, Timer as TimerIcon, Share2, Trash2
} from 'lucide-react';

interface Props {
  recipe: RecipeResponse;
  requestDetails?: RecipeRequest;
  onReset: () => void;
  onSave?: (recipe: RecipeResponse) => void;
  onDelete?: (id: string) => void;
  isSaved?: boolean;
  isLoggedIn?: boolean;
}

const RecipeCard: React.FC<Props> = ({ recipe, requestDetails, onReset, onSave, onDelete, isSaved, isLoggedIn }) => {
  
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.print();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const id = String(recipe.id || "");
    if (id && onDelete) {
      if (window.confirm(`Nipote, vuoi davvero eliminare questa ricetta per sempre?`)) {
        onDelete(id);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up pb-20 px-2 sm:px-4">
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-100 flex flex-col relative">
        <div className="relative w-full h-[300px] sm:h-[450px]">
          <img 
            src={`https://image.pollinations.ai/prompt/gourmet food photography of ${encodeURIComponent(recipe.recipeName)}?width=1200&height=800&nologo=true`} 
            alt={recipe.recipeName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4 leading-tight">{recipe.recipeName}</h1>
            <div className="flex gap-4">
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Users size={14} /> {requestDetails?.peopleCount || 2} Persone
              </span>
              <span className="bg-nonno-500 text-nonno-950 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <TimerIcon size={14} /> {recipe.prepTimeMinutes} Minuti
              </span>
            </div>
          </div>

          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-[100]">
            <button onClick={onReset} className="bg-white/95 p-3 rounded-full shadow-lg hover:bg-white active:scale-90 transition-all">
              <ArrowLeft size={22} className="text-stone-700" />
            </button>
            <div className="flex gap-3">
              {isLoggedIn && (
                <div className="flex items-center gap-2">
                  {!isSaved ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSave?.(recipe); }} 
                      className="bg-white p-3 rounded-full shadow-lg text-stone-700 hover:text-nonno-600 transition-all active:scale-90"
                    >
                      <Bookmark size={22} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-white/95 p-1.5 rounded-full shadow-xl border border-white backdrop-blur-md">
                      <div className="bg-green-600 text-white p-2.5 rounded-full shadow-inner">
                        <BookmarkCheck size={20} />
                      </div>
                      {/* TASTO ELIMINA SCHEDA */}
                      <button 
                        type="button"
                        onClick={handleDelete} 
                        className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-700 transition-all active:scale-90 shadow-md cursor-pointer z-[110]"
                        title="Elimina definitivamente"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
             <p className="text-xl sm:text-2xl text-stone-500 italic font-serif leading-relaxed">"{recipe.description}"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-stone-800 uppercase tracking-widest border-b-4 border-nonno-500 pb-2 inline-block">Dispensa</h3>
              <ul className="space-y-4">
                {recipe.ingredientsList.map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 font-bold text-stone-700">
                    <div className="w-2 h-2 rounded-full bg-nonno-500" /> {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-stone-800 uppercase tracking-widest border-b-4 border-stone-200 pb-2 inline-block">In Cucina</h3>
              <div className="space-y-8">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-5">
                    <span className="shrink-0 w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center font-bold">{idx + 1}</span>
                    <p className="text-stone-600 leading-relaxed font-medium pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-10 border-t border-stone-100">
            <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100">
              <div className="flex items-center gap-2 mb-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest"><Wine size={18} /> Sommelier</div>
              <p className="font-bold text-indigo-900 text-lg">{recipe.winePairing}</p>
              <p className="text-xs text-indigo-700/70 italic mt-2">{recipe.winePairingReason}</p>
            </div>
            <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100">
              <div className="flex items-center gap-2 mb-2 text-nonno-600 font-black text-[10px] uppercase tracking-widest"><Sparkles size={18} /> Il Segreto</div>
              <p className="text-stone-600 italic text-sm">"{recipe.nonnoTip}"</p>
            </div>
          </div>
        </div>
      </div>
      <button onClick={handlePrint} className="mt-8 w-full bg-stone-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl print:hidden">
        <Printer size={20} /> Stampa Ricetta
      </button>
    </div>
  );
};

export default RecipeCard;
