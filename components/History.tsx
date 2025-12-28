
import React from 'react';
import { RecipeResponse } from '../types';
import { Book, Trash2, Clock, Calendar } from 'lucide-react';

interface Props {
  recipes: RecipeResponse[];
  onSelect: (recipe: RecipeResponse) => void;
  onDelete: (id: string) => void;
}

const History: React.FC<Props> = ({ recipes, onSelect, onDelete }) => {
  
  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    // FONDAMENTALE: Impediamo che il click arrivi al contenitore della ricetta
    e.preventDefault();
    e.stopPropagation();
    
    if (!id) return;

    if (window.confirm(`Nipote caro, vuoi davvero buttare via la ricetta "${name}"? Il Nonno non potrà più recuperarla!`)) {
      onDelete(String(id));
    }
  };

  if (recipes.length === 0) {
    return (
      <div className="text-center py-28 bg-white/40 rounded-[3rem] border-4 border-dashed border-nonno-200 animate-fade-in">
        <div className="bg-nonno-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Book size={48} className="text-nonno-600" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-nonno-900">Ricettario ancora vuoto</h3>
        <p className="text-stone-500 mt-3 max-w-sm mx-auto font-medium">Crea la tua prima delizia con il Nonno!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-12 animate-fade-in">
      {recipes.map((recipe) => (
        <div 
          key={String(recipe.id || Math.random())}
          onClick={() => onSelect(recipe)}
          className="bg-white rounded-[2rem] p-3 shadow-sm border border-stone-100 hover:border-nonno-300 transition-all group cursor-pointer relative overflow-hidden active:scale-[0.98]"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] overflow-hidden shrink-0 shadow-sm border-2 border-white">
              <img 
                src={`https://image.pollinations.ai/prompt/gourmet food plate of ${encodeURIComponent(recipe.recipeName)}?width=400&height=400&nologo=true`} 
                alt={recipe.recipeName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="flex-1 min-w-0 pr-12">
              <h4 className="font-serif font-bold text-stone-800 text-lg sm:text-xl leading-tight mb-1 line-clamp-1">
                {recipe.recipeName}
              </h4>
              <div className="flex items-center gap-3 text-[10px] font-black tracking-wider uppercase">
                <span className="flex items-center gap-1 text-orange-500">
                  <Clock size={14} strokeWidth={3} />
                  {recipe.prepTimeMinutes} MIN
                </span>
                <span className="text-stone-400 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(recipe.timestamp || Date.now()).toLocaleDateString('it-IT')}
                </span>
              </div>
            </div>

            {/* Tasto Cestino Rosso - Priorità Massima */}
            <button 
              type="button"
              onClick={(e) => handleDeleteClick(e, String(recipe.id), recipe.recipeName)}
              className="absolute top-1/2 -translate-y-1/2 right-3 p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all z-[100] cursor-pointer"
              title="Elimina Ricetta"
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
