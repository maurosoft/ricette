
import React, { useState, useEffect } from 'react';
import { X, Check, Star, Zap, Heart, ShieldCheck, Loader2, ChefHat } from 'lucide-react';
import { MembershipPlan } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  onClose: () => void;
  onContact: () => void;
}

const MembershipModal: React.FC<Props> = ({ onClose, onContact }) => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      const p = await storageService.getPlans();
      setPlans(p);
      setLoading(false);
    };
    loadPlans();
  }, []);

  const getPlanIcon = (id: string) => {
    switch(id) {
      case '7days': return <Star className="text-yellow-500" />;
      case '1month': return <Zap className="text-orange-500" />;
      case '1year': return <Heart className="text-red-500" />;
      case 'lifetime': return <ShieldCheck className="text-purple-600" />;
      default: return <Star className="text-stone-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="bg-stone-50 rounded-[2rem] sm:rounded-[3rem] w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl relative animate-pop border border-white/10">
        
        {/* Pulsante di chiusura fisso */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full transition-all z-50 shadow-lg border border-stone-200"
        >
          <X size={24} className="text-stone-700" />
        </button>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {loading ? (
            <div className="h-[400px] sm:h-[600px] flex items-center justify-center">
              <Loader2 className="animate-spin text-nonno-500" size={48} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 min-h-full">
              {/* Parte Sinistra - Info */}
              <div className="lg:col-span-4 bg-stone-900 p-8 sm:p-12 text-white flex flex-col justify-center space-y-8 relative overflow-hidden">
                <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none">
                  {/* Fixed error: Added ChefHat to imports on line 2 */}
                  <ChefHat size={300} />
                </div>
                <div className="relative z-10 space-y-6">
                  <h2 className="text-4xl sm:text-5xl font-serif font-bold leading-tight">Diventa un Socio</h2>
                  <p className="text-stone-400 text-lg leading-relaxed font-medium">
                    Il Nonno cucina con amore. Sostenendo la nostra famiglia digitale, ci aiuti a mantenere vive le tradizioni italiane.
                  </p>
                  <div className="space-y-4 pt-6">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <Star className="text-nonno-500" size={24} />
                      <span className="font-bold text-base">Ricette Illimitate</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <Heart className="text-tomato-500" size={24} />
                      <span className="font-bold text-base">Supporta il Nonno</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parte Destra - Piani */}
              <div className="lg:col-span-8 p-6 sm:p-12 bg-white">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className={`relative p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 transition-all hover:translate-y-[-4px] flex flex-col h-full ${plan.isPopular ? 'border-nonno-500 bg-white shadow-xl z-10' : 'border-stone-100 bg-stone-50/50'}`}
                    >
                      {plan.isPopular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-nonno-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">CONSIGLIATO</div>
                      )}
                      
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-stone-100 p-4 rounded-2xl">{getPlanIcon(plan.id)}</div>
                        <div className="text-right">
                          <span className="block text-2xl sm:text-3xl font-black text-stone-800 leading-none">{plan.price}</span>
                          <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-1 block">{plan.durationDays === 0 ? 'Illimitata' : `${plan.durationDays} GIORNI`}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mb-6">{plan.name}</h3>
                      
                      <ul className="space-y-3 mb-8 flex-grow">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-bold text-stone-500 leading-tight">
                            <Check size={16} className="text-green-500 shrink-0 mt-0.5" /> {f}
                          </li>
                        ))}
                      </ul>
                      
                      <a 
                        href={plan.paymentLink}
                        target={plan.paymentLink !== '#' ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className={`w-full py-4 rounded-2xl font-black text-center text-sm transition-all shadow-lg active:scale-95 ${plan.isPopular ? 'bg-nonno-600 text-white hover:bg-nonno-700' : 'bg-stone-800 text-white hover:bg-black'}`}
                      >
                        SCEGLI QUESTO PIANO
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-center text-stone-400 text-[10px] mt-10 font-medium">
                  Tutti i pagamenti sono sicuri e criptati. Grazie per il tuo supporto!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipModal;
