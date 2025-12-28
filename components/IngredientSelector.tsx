import React, { useState } from 'react';
import { 
  Search, Plus, Check, X, 
  Wheat, UtensilsCrossed, Croissant, CircleDot, 
  Carrot, Leaf, Flame, Salad, Sparkles, Disc,
  Egg, Drumstick, Beef, Ham, Fish, 
  Milk, CupSoda, Droplets, Triangle, Eraser, Circle
} from 'lucide-react';

interface Props {
  selected: string[];
  onToggle: (ingredient: string) => void;
  customIngredients: string;
  onCustomChange: (val: string) => void;
}

interface IngredientOption {
  id: string;
  name: string;
  imageSeed: string;
  category: 'base' | 'proteine' | 'verdure' | 'frigo' | 'condimenti';
  icon: React.ElementType;
}

const BASE_INGREDIENTS: IngredientOption[] = [
  // Base
  { id: 'pasta', name: 'Pasta', imageSeed: 'raw italian pasta spaghetti', category: 'base', icon: UtensilsCrossed },
  { id: 'rice', name: 'Riso', imageSeed: 'white rice bowl uncooked', category: 'base', icon: Disc },
  { id: 'flour', name: 'Farina', imageSeed: 'white flour powder sack', category: 'base', icon: Wheat },
  { id: 'bread', name: 'Pane', imageSeed: 'fresh bread loaf bakery', category: 'base', icon: Croissant },
  { id: 'potatoes', name: 'Patate', imageSeed: 'raw potatoes earthy', category: 'base', icon: CircleDot },

  // Verdure
  { id: 'tomato', name: 'Pomodoro', imageSeed: 'fresh red tomatoes vine', category: 'verdure', icon: Disc },
  { id: 'onion', name: 'Cipolla', imageSeed: 'yellow onion vegetable', category: 'verdure', icon: CircleDot },
  { id: 'garlic', name: 'Aglio', imageSeed: 'garlic bulbs white', category: 'verdure', icon: Sparkles },
  { id: 'carrot', name: 'Carote', imageSeed: 'fresh orange carrots', category: 'verdure', icon: Carrot },
  { id: 'zucchini', name: 'Zucchine', imageSeed: 'green zucchini fresh', category: 'verdure', icon: Leaf },
  { id: 'eggplant', name: 'Melanzane', imageSeed: 'purple eggplant vegetable', category: 'verdure', icon: Leaf },
  { id: 'salad', name: 'Insalata', imageSeed: 'fresh green salad lettuce', category: 'verdure', icon: Salad },
  { id: 'peppers', name: 'Peperoni', imageSeed: 'red and yellow bell peppers', category: 'verdure', icon: Flame },

  // Proteine
  { id: 'eggs', name: 'Uova', imageSeed: 'fresh eggs in carton', category: 'proteine', icon: Egg },
  { id: 'chicken', name: 'Pollo', imageSeed: 'raw chicken meat breast', category: 'proteine', icon: Drumstick },
  { id: 'beef', name: 'Manzo', imageSeed: 'raw beef steak meat', category: 'proteine', icon: Beef },
  { id: 'pork', name: 'Maiale', imageSeed: 'raw pork meat chop', category: 'proteine', icon: Ham },
  { id: 'fish', name: 'Pesce', imageSeed: 'fresh raw fish seafood', category: 'proteine', icon: Fish },
  { id: 'tuna', name: 'Tonno', imageSeed: 'canned tuna tin', category: 'proteine', icon: Fish },

  // Frigo & Latticini
  { id: 'milk', name: 'Latte', imageSeed: 'milk bottle fresh', category: 'frigo', icon: Milk },
  { id: 'butter', name: 'Burro', imageSeed: 'butter block yellow', category: 'frigo', icon: Eraser },
  { id: 'cheese', name: 'Formaggio', imageSeed: 'cheese block parmesan', category: 'frigo', icon: Triangle },
  { id: 'mozzarella', name: 'Mozzarella', imageSeed: 'fresh white mozzarella cheese', category: 'frigo', icon: Circle },
  { id: 'yogurt', name: 'Yogurt', imageSeed: 'white yogurt creamy', category: 'frigo', icon: CupSoda },
];

const IngredientSelector: React.FC<Props> = ({ selected, onToggle, customIngredients, onCustomChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIngredients = BASE_INGREDIENTS.filter(ing =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-nonno-200 flex items-center gap-3 sticky top-24 z-30">
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Cerca ingredienti (es. Pomodoro, Uova...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-lg focus:outline-none placeholder:text-gray-400 text-gray-700"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="bg-white/60 p-6 rounded-3xl border border-nonno-100">
        <h3 className="text-2xl font-serif text-nonno-900 mb-6 flex items-center gap-2">
          <span className="text-3xl">🍅</span> Cosa c'è in dispensa?
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredIngredients.map((ing) => {
            const isSelected = selected.includes(ing.name);
            const Icon = ing.icon;
            
            return (
              <button
                key={ing.id}
                onClick={() => onToggle(ing.name)}
                className={`
                  relative group overflow-hidden rounded-2xl transition-all duration-300 aspect-[4/3]
                  flex flex-col items-center justify-end
                  border-2
                  ${isSelected 
                    ? 'border-nonno-500 ring-4 ring-nonno-200 shadow-xl scale-[1.02]' 
                    : 'border-transparent hover:border-nonno-200 hover:shadow-lg hover:-translate-y-1 bg-white'}
                `}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={`https://image.pollinations.ai/prompt/illustration%20of%20${ing.imageSeed}%20icon%20warm%20colors%20white%20background%20minimalist?width=300&height=225&model=flux&nologo=true`}
                    alt={ing.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                    loading="lazy"
                  />
                  {/* Overlay Gradient for text readability */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-90' : 'opacity-60 group-hover:opacity-70'}`}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full p-3 text-center flex flex-col items-center gap-1">
                  <div className={`
                    p-1.5 rounded-full backdrop-blur-md transition-all duration-300
                    ${isSelected ? 'bg-nonno-500 text-white shadow-lg' : 'bg-white/20 text-white'}
                  `}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <span className={`
                    block font-bold text-lg leading-tight drop-shadow-md transition-colors
                    ${isSelected ? 'text-white scale-105' : 'text-white'}
                  `}>
                    {ing.name}
                  </span>
                </div>

                {/* Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-nonno-500 text-white p-1 rounded-full shadow-lg animate-pop z-20">
                    <Check size={16} strokeWidth={4} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {filteredIngredients.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg">Non trovo "{searchTerm}"...</p>
            <p className="text-sm">Prova ad aggiungerlo qui sotto!</p>
          </div>
        )}
      </div>

      {/* Custom Input */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-nonno-200">
        <label className="block text-nonno-800 font-bold mb-3 flex items-center gap-2 text-lg">
          <Plus className="bg-nonno-100 p-1 rounded-lg text-nonno-600" size={28} /> 
          Altro?
        </label>
        <div className="relative">
          <textarea
            value={customIngredients}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="Ho anche del tartufo, un po' di salmone affumicato e delle noci..."
            className="w-full p-4 border-2 border-dashed border-nonno-300 rounded-xl focus:border-nonno-500 focus:ring-0 focus:outline-none bg-stone-50 min-h-[80px] text-gray-700 resize-none transition-colors"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 ml-1">
          Scrivi qui qualsiasi altro ingrediente che vuoi usare.
        </p>
      </div>
    </div>
  );
};

export default IngredientSelector;