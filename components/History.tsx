
import React from 'react';
import { RecipeResponse } from '../types';
import { Book, Trash2, Clock, Calendar } from 'lucide-react';

interface Props {
  recipes: RecipeResponse[];
  onSelect: (recipe: RecipeResponse) => void;
  onDelete: (id: string) => void;
}

const History: React.FC<Props> = ({ recipes, onSelect, onDelete }) => {
  
  const handleDeleteAction = (e: React.MouseEvent, recipe: RecipeResponse) => {
    // BLOCCO TOTALE PROPAGAZIONE
    e.preventDefault();
    e.stopPropagation();
    
    const id = String(recipe.id || "");
    if (!id) return;

    if (window.confirm(`Nipote, vuoi davvero eliminare "${recipe.recipeName}"?`)) {
      onDelete(id);
    }
  };

  if (recipes.length === 0) {
    return (
      <div className="text-center py-20 bg-stone-100/50 rounded-[2rem] border-2 border-dashed border-stone-200">
        <Book size={48} className="text-stone-300 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-bold text-stone-800">Ancora nessuna ricetta</h3>
        <p className="text-stone-500 text-sm">Crea qualcosa di delizioso con il Nonno!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 animate-fade-in">
      {recipes.map((recipe) => (
        <div 
          key={String(recipe.id)}
          onClick={() => onSelect(recipe)}
          className="group relative bg-white rounded-3xl p-4 shadow-sm border border-stone-100 hover:border-nonno-300 transition-all cursor-pointer flex items-center gap-4 overflow-hidden"
        >
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
            <img 
              src={`https://image.pollinations.ai/prompt/gourmet ${encodeURIComponent(recipe.recipeName)}?width=200&height=200&nologo=true`} 
              alt={recipe.recipeName}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h4 className="font-serif font-bold text-stone-800 text-lg line-clamp-1">{recipe.recipeName}</h4>
            <div className="flex items-center gap-3 text-[10px] font-black text-stone-400 uppercase mt-1">
              <span className="flex items-center gap-1"><Clock size={12} /> {recipe.prepTimeMinutes} MIN</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(recipe.timestamp || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          {/* TASTO ELIMINA PROTETTO */}
          <button 
            type="button"
            onClick={(e) => handleDeleteAction(e, recipe)}
            className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all z-[50] relative pointer-events-auto"
            title="Elimina"
          >
            <Trash2 size={22} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default History;
