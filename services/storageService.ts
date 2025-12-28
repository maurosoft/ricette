
import { User, RecipeResponse, MembershipType, MembershipPlan } from "../types";

const USERS_KEY = 'nonnoweb_db_users';
const PLANS_KEY = 'nonnoweb_db_plans';
const SESSION_KEY = 'nonnoweb_current_session';

const INITIAL_ADMIN: User = {
  id: 'admin-0',
  email: 'admin@nonnoweb.it',
  password: 'admin123',
  username: 'Amministratore',
  role: 'admin',
  isActive: true,
  membership: 'lifetime',
  savedRecipes: []
};

const DEFAULT_PLANS: MembershipPlan[] = [
  { id: '7days', name: 'Assaggio', price: '2€', durationDays: 7, dailyRecipeLimit: 5, features: ['Ricette illimitate', 'Salvataggio PDF', 'Consigli del Nonno'], paymentLink: '#' },
  { id: '1month', name: 'Socio', price: '5€', durationDays: 30, dailyRecipeLimit: 20, features: ['Tutto in Assaggio', 'Supporto prioritario', 'Accesso anteprime'], paymentLink: '#', isPopular: true },
  { id: '1year', name: 'Famiglia', price: '40€', durationDays: 365, dailyRecipeLimit: 100, features: ['Tutto in Socio', 'Sconto del 30%', 'Ricettario stampabile'], paymentLink: '#' },
  { id: 'lifetime', name: 'Leggenda', price: '99€', durationDays: 0, dailyRecipeLimit: 999, features: ['Accesso a vita', 'Certificato di Sostenitore', 'Nessun rinnovo'], paymentLink: '#' },
];

export const storageService = {
  async getUsers(): Promise<User[]> {
    try {
      const data = localStorage.getItem(USERS_KEY);
      if (!data) {
        const initial = [INITIAL_ADMIN];
        localStorage.setItem(USERS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Errore lettura utenti:", e);
      return [INITIAL_ADMIN];
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      const users = await this.getUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index > -1) {
        users[index] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Errore salvataggio utente:", e);
    }
  },

  updateSession(user: User): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Errore aggiornamento sessione:", e);
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      const users = await this.getUsers();
      const filtered = users.filter(u => u.id !== userId);
      localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error("Errore eliminazione utente:", e);
    }
  },

  async getPlans(): Promise<MembershipPlan[]> {
    try {
      const data = localStorage.getItem(PLANS_KEY);
      if (!data) {
        localStorage.setItem(PLANS_KEY, JSON.stringify(DEFAULT_PLANS));
        return DEFAULT_PLANS;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_PLANS;
    }
  },

  async savePlans(plans: MembershipPlan[]): Promise<void> {
    try {
      localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    } catch (e) {
      console.error("Errore salvataggio piani:", e);
    }
  },

  async login(email: string, pass: string): Promise<User | string> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
      
      if (!user) return "Credenziali non valide.";
      if (!user.isActive) return "Il tuo account è disattivato. Contatta l'amministratore.";
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    } catch (e) {
      return "Errore durante l'accesso al sistema.";
    }
  },

  getCurrentSession(): User | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  logout(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error("Errore logout:", e);
    }
  },

  getExpiryDate(membership: MembershipType): number | undefined {
    try {
      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;
      const plansStr = localStorage.getItem(PLANS_KEY);
      const plans: MembershipPlan[] = plansStr ? JSON.parse(plansStr) : DEFAULT_PLANS;
      const plan = plans.find(p => p.id === membership);
      
      if (!plan || plan.durationDays === 0) return undefined;
      return now + plan.durationDays * day;
    } catch (e) {
      return undefined;
    }
  }
};
