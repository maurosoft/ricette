import React from 'react';
import { Sun, Moon, Users, AlertCircle, Soup, UtensilsCrossed, Cake, Sparkles } from 'lucide-react';
import { CourseType } from '../types';

interface Props {
  mealType: 'pranzo' | 'cena';
  setMealType: (type: 'pranzo' | 'cena') => void;
  courseType: CourseType;
  setCourseType: (type: CourseType) => void;
  peopleCount: number;
  setPeopleCount: (count: number) => void;
  intolerances: string;
  setIntolerances: (val: string) => void;
}

const Preferences: React.FC<Props> = ({ 
  mealType, setMealType, 
  courseType, setCourseType,
  peopleCount, setPeopleCount, 
  intolerances, setIntolerances 
}) => {
  return (
    <div className="space-y-8 bg-white/60 p-6 rounded-2xl border border-nonno-200">
      <h3 className="text-2xl font-serif text-nonno-900 mb-4 flex items-center gap-2">
        <span className="text-3xl">🍽️</span> I Dettagli
      </h3>

      {/* Meal Type */}
      <div>
        <label className="block text-nonno-800 font-bold mb-3">Quando si mangia?</label>
        <div className="flex gap-3">
          <button
            onClick={() => setMealType('pranzo')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all border-2
              ${mealType === 'pranzo' 
                ? 'bg-yellow-100 border-yellow-400 text-yellow-800 shadow-md' 
                : 'bg-white border-gray-200 hover:border-yellow-200 text-gray-600'}`}
          >
            <Sun size={20} className={mealType === 'pranzo' ? 'text-yellow-600' : ''} />
            <span className="font-bold">Pranzo</span>
          </button>
          <button
            onClick={() => setMealType('cena')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all border-2
              ${mealType === 'cena' 
                ? 'bg-indigo-100 border-indigo-400 text-indigo-800 shadow-md' 
                : 'bg-white border-gray-200 hover:border-indigo-200 text-gray-600'}`}
          >
            <Moon size={20} className={mealType === 'cena' ? 'text-indigo-600' : ''} />
            <span className="font-bold">Cena</span>
          </button>
        </div>
      </div>

      {/* Course Type */}
      <div>
        <label className="block text-nonno-800 font-bold mb-3">Cosa prepariamo?</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCourseType('primo')}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all border-2
              ${courseType === 'primo' 
                ? 'bg-orange-100 border-orange-400 text-orange-800 shadow-md' 
                : 'bg-white border-gray-200 hover:border-orange-200 text-gray-600'}`}
          >
            <Soup size={20} />
            <span className="font-bold">Primo</span>
          </button>
          <button
            onClick={() => setCourseType('secondo')}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all border-2
              ${courseType === 'secondo' 
                ? 'bg-red-100 border-red-400 text-red-800 shadow-md' 
                : 'bg-white border-gray-200 hover:border-red-200 text-gray-600'}`}
          >
            <UtensilsCrossed size={20} />
            <span className="font-bold">Secondo</span>
          </button>
          <button
            onClick={() => setCourseType('dolce')}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all border-2
              ${courseType === 'dolce' 
                ? 'bg-pink-100 border-pink-400 text-pink-800 shadow-md' 
                : 'bg-white border-gray-200 hover:border-pink-200 text-gray-600'}`}
          >
            <Cake size={20} />
            <span className="font-bold">Dolce</span>
          </button>
          <button
            onClick={() => setCourseType('sorpresa')}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all border-2
              ${courseType === 'sorpresa' 
                ? 'bg-purple-100 border-purple-400 text-purple-800 shadow-md' 
                : 'bg-white border-gray-200 hover:border-purple-200 text-gray-600'}`}
          >
            <Sparkles size={20} />
            <span className="font-bold">Sorpresa</span>
          </button>
        </div>
      </div>

      {/* People Count */}
      <div>
        <label className="block text-nonno-800 font-bold mb-3">Per quante persone?</label>
        <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl px-4 py-2 h-[52px]">
          <Users className="text-gray-400 mr-3" />
          <input
            type="number"
            min="1"
            max="20"
            value={peopleCount}
            onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
            className="w-full text-lg font-bold text-gray-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Intolerances */}
      <div>
        <label className="block text-nonno-800 font-bold mb-2 flex items-center gap-2">
           <AlertCircle size={20} className="text-tomato-500" /> Allergie o Intolleranze?
        </label>
        <textarea
          value={intolerances}
          onChange={(e) => setIntolerances(e.target.value)}
          placeholder="Es. Celiachia, Lattosio, Niente frutta a guscio..."
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-tomato-500 focus:outline-none bg-stone-50 h-24 resize-none"
        />
      </div>
    </div>
  );
};

export default Preferences;