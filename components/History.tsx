
import React from 'react';
import { RecipeResponse } from '../types';
import { Book, Trash2, Timer } from 'lucide-react';

interface Props {
  recipes: RecipeResponse[];
  onSelect: (recipe: RecipeResponse) => void;
  onDelete: (id: string) => void;
}

const History: React.FC<Props> = ({ recipes, onSelect, onDelete }) => {
  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Nipote caro, vuoi davvero eliminare la ricetta "${name}"? Non potrò più recuperarla!`)) {
      onDelete(id);
    }
  };

  if (recipes.length === 0) {
    return (
      <div className="text-center py-28 bg-white/40 rounded-[3rem] border-4 border-dashed border-nonno-200 animate-fade-in">
        <div className="bg-nonno-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Book size={56} className="text-nonno-600" />
        </div>
        <h3 className="text-3xl font-serif font-bold text-nonno-900">Ricettario ancora vuoto</h3>
        <p className="text-stone-500 mt-4 max-w-sm mx-auto text-lg leading-relaxed">Crea la tua prima delizia con il Nonno!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-1 sm:px-0 pb-12 animate-fade-in">
      {recipes.map((recipe) => (
        <div 
          key={recipe.id}
          onClick={() => onSelect(recipe)}
          className="bg-white rounded-[2.2rem] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-stone-50 hover:border-nonno-200 transition-all group cursor-pointer relative"
        >
          <div className="flex items-center gap-5 sm:gap-8">
            {/* Miniatura a sinistra - Come da screenshot */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[1.8rem] overflow-hidden shrink-0 shadow-md bg-stone-100 border-2 border-white">
              <img 
                src={`https://image.pollinations.ai/prompt/gourmet food plate ${encodeURIComponent(recipe.recipeName)}?width=400&height=400&nologo=true`} 
                alt={recipe.recipeName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Testi a destra - Allineamento perfetto */}
            <div className="flex-1 min-w-0 pr-12">
              <h4 className="font-serif font-bold text-stone-900 text-lg sm:text-2xl leading-tight mb-2 line-clamp-2">
                {recipe.recipeName}
              </h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs font-black tracking-widest uppercase">
                <span className="flex items-center gap-1.5 text-nonno-500">
                  <Timer size={16} strokeWidth={3} />
                  {recipe.prepTimeMinutes} MIN
                </span>
                <span className="text-stone-300 font-bold">
                  {new Date(recipe.timestamp || Date.now()).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Pulsante Cancella - Sempre visibile, rosso brillante */}
            <button 
              onClick={(e) => handleDeleteClick(e, recipe.id!, recipe.recipeName)}
              className="absolute top-1/2 -translate-y-1/2 right-4 p-3 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
              title="Elimina"
            >
              <Trash2 size={22} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
