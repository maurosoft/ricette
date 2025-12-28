
import React from 'react';
import { RecipeResponse, RecipeRequest } from '../types';
import { 
  Wine, ChefHat, Sparkles, Printer, ArrowLeft, 
  Bookmark, BookmarkCheck, Users, Utensils, Soup, Timer as TimerIcon, Share2
} from 'lucide-react';

interface Props {
  recipe: RecipeResponse;
  requestDetails?: RecipeRequest;
  onReset: () => void;
  onSave?: (recipe: RecipeResponse) => void;
  isSaved?: boolean;
  isLoggedIn?: boolean;
}

const RecipeCard: React.FC<Props> = ({ recipe, requestDetails, onReset, onSave, isSaved, isLoggedIn }) => {
  
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.print();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareUrl = window.location.href;
    const shareData = {
      title: `NonnoWeb - ${recipe.recipeName}`,
      text: `Nipote, guarda questa ricetta deliziosa: ${recipe.recipeName}`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share non supportato');
      }
    } catch (err) {
      // Fallback: Copia negli appunti
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Nipote caro, ho copiato il link della ricetta negli appunti per te! Incollalo dove vuoi.");
      } catch (copyErr) {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert("Link copiato! Invialo pure ai tuoi amici.");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up pb-20 px-2 sm:px-4">
      <div 
        id="printable-recipe-content" 
        className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-100 flex flex-col print:shadow-none print:border-none print:rounded-none"
      >
        <div className="relative w-full h-[250px] sm:h-[400px] print:h-[250px]">
          <img 
            src={`https://image.pollinations.ai/prompt/professional food photography of ${encodeURIComponent(recipe.recipeName)}, gourmet style?width=1200&height=800&nologo=true`} 
            alt={recipe.recipeName}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent print:hidden"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white print:text-stone-900 print:static print:p-6">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 print:text-3xl leading-tight">
              {recipe.recipeName}
            </h1>
            <div className="flex flex-wrap gap-3 print:hidden">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Users size={14} className="inline mr-2" /> {requestDetails?.peopleCount || 2} Persone
              </span>
              <span className="bg-nonno-500 text-nonno-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <TimerIcon size={14} className="inline mr-2" /> {recipe.prepTimeMinutes} Minuti
              </span>
            </div>
          </div>

          <div className="absolute top-6 left-6 right-6 flex justify-between items-start print:hidden">
            <button onClick={onReset} className="bg-white/95 p-3 rounded-full shadow-lg hover:bg-white active:scale-90 transition-all">
              <ArrowLeft size={20} className="text-stone-700" />
            </button>
            <div className="flex gap-2">
              <button onClick={handleShare} className="bg-white/95 p-3 rounded-full shadow-lg hover:bg-white active:scale-90 transition-all">
                <Share2 size={20} className="text-stone-700" />
              </button>
              {isLoggedIn && onSave && (
                <button 
                  onClick={() => onSave(recipe)} 
                  className={`p-3 rounded-full font-bold shadow-lg transition-all active:scale-90 border-2 ${isSaved ? 'bg-nonno-600 text-white border-nonno-600' : 'bg-white/95 border-white text-stone-700'}`}
                >
                  {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-12 space-y-12 bg-white">
          <div className="text-center max-w-2xl mx-auto space-y-4">
             <div className="w-16 h-16 bg-nonno-50 rounded-full flex items-center justify-center mx-auto border border-nonno-100">
                <ChefHat className="text-nonno-500" size={32} />
             </div>
             <p className="text-xl sm:text-2xl text-stone-600 italic font-serif leading-relaxed px-4">
               "{recipe.description}"
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Utensils className="text-nonno-500" size={24} />
                  <h3 className="text-xl font-serif font-bold text-stone-800 uppercase tracking-widest">Dispensa</h3>
                </div>
                <div className="h-2 w-full bg-nonno-500 rounded-full" />
              </div>
              <ul className="space-y-3">
                {recipe.ingredientsList.map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-nonno-500 shrink-0" />
                    <span className="text-base font-bold text-stone-700">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Soup className="text-stone-300" size={24} />
                  <h3 className="text-xl font-serif font-bold text-stone-800 uppercase tracking-widest">In Cucina</h3>
                </div>
                <div className="h-2 w-full bg-stone-200 rounded-full" />
              </div>
              <div className="space-y-8">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-5 items-start">
                    <div className="shrink-0 w-11 h-11 bg-stone-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                      {idx + 1}
                    </div>
                    <p className="text-stone-700 leading-relaxed text-base pt-1 font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-stone-100">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-2">
                <Wine className="text-indigo-600" size={24} />
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Il Sommelier</h4>
              </div>
              <p className="text-lg font-bold text-indigo-900">{recipe.winePairing}</p>
              <p className="text-xs text-indigo-800/70 italic mt-2">{recipe.winePairingReason}</p>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-nonno-600" size={24} />
                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Il Segreto</h4>
              </div>
              <p className="text-stone-700 italic text-sm leading-relaxed">"{recipe.nonnoTip}"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-4 right-4 flex gap-3 print:hidden md:max-w-md md:mx-auto z-[80] no-print">
        <button 
          onClick={onReset} 
          className="flex-1 bg-white text-stone-600 py-4 rounded-2xl font-black text-xs uppercase shadow-2xl border border-stone-200 active:scale-95 transition-all"
        >
          Indietro
        </button>
        <button 
          onClick={handlePrint} 
          className="flex-[2] bg-stone-900 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-stone-800 hover:bg-black"
        >
          <Printer size={18} /> STAMPA RICETTA
        </button>
        <button 
          onClick={handleShare} 
          className="bg-nonno-600 text-white p-4 rounded-2xl font-black shadow-2xl active:scale-95 transition-all border border-nonno-600 hover:bg-nonno-700"
        >
          <Share2 size={24} />
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
