
import React, { useState } from 'react';
import { X, Lock, Mail, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { User } from '../types';

interface Props {
  // Updated to Promise<string | null> to correctly match handleLogin in App.tsx
  onLogin: (email: string, pass: string) => Promise<string | null>; 
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fix: Made handleSubmit async to correctly await the onLogin Promise
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email.trim() && password.trim()) {
      setIsSubmitting(true);
      try {
        const loginError = await onLogin(email.trim(), password.trim());
        if (loginError) {
          setError(loginError);
        }
      } catch (err) {
        setError("Errore durante l'accesso. Riprova.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setError("Inserisci tutte le credenziali.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-pop border border-white/20">
        <div className="bg-nonno-600 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <Lock size={32} />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold">Area Riservata</h2>
              <p className="text-white/80 mt-1">Accedi per gustare le ricette del Nonno</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm border border-red-100 animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-500 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@esempio.it"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-nonno-500 focus:outline-none transition-all text-gray-700"
                autoFocus
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-500 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-nonno-500 focus:outline-none transition-all text-gray-700"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-nonno-600 hover:bg-nonno-700 text-white font-bold rounded-2xl shadow-lg shadow-nonno-100 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            Accedi in Cucina
          </button>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-400">Non hai un account? Contatta l'amministratore.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
