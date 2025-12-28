
import React from 'react';
import { RecipeResponse } from '../types';
import { Book, Clock, ChevronRight, Trash2, Timer } from 'lucide-react';

interface Props {
  recipes: RecipeResponse[];
  onSelect: (recipe: RecipeResponse) => void;
  onDelete: (id: string) => void;
}

const History: React.FC<Props> = ({ recipes, onSelect, onDelete }) => {
  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Caro nipote, vuoi davvero eliminare la ricetta "${name}"?`)) {
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
    <div className="flex flex-col gap-5 px-1 sm:px-0 pb-10">
      {recipes.map((recipe) => (
        <div 
          key={recipe.id}
          onClick={() => onSelect(recipe)}
          className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-stone-50 hover:border-nonno-200 transition-all group cursor-pointer relative"
        >
          <div className="flex items-center gap-6">
            {/* Immagine a sinistra - Arrotondata come screenshot */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] overflow-hidden shrink-0 shadow-md">
              <img 
                src={`https://image.pollinations.ai/prompt/gourmet food plate ${encodeURIComponent(recipe.recipeName)}?width=300&height=300&nologo=true`} 
                alt={recipe.recipeName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Testi a destra - Allineamento screenshot */}
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="font-serif font-bold text-stone-900 text-lg sm:text-2xl leading-tight mb-2 line-clamp-2">
                {recipe.recipeName}
              </h4>
              <div className="flex items-center gap-4 text-[10px] sm:text-xs font-black tracking-widest uppercase">
                <span className="flex items-center gap-1.5 text-nonno-600">
                  <Timer size={16} className="text-nonno-500" strokeWidth={3} />
                  {recipe.prepTimeMinutes} MIN
                </span>
                <span className="text-stone-300 font-normal">
                  {new Date(recipe.timestamp || 0).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Azione rapida */}
            <button 
              onClick={(e) => handleDeleteClick(e, recipe.id!, recipe.recipeName)}
              className="absolute top-4 right-6 p-2 text-stone-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
