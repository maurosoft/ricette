
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
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      const initial = [INITIAL_ADMIN];
      localStorage.setItem(USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  async saveUser(user: User): Promise<void> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  async deleteUser(userId: string): Promise<void> {
    const users = await this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  async getPlans(): Promise<MembershipPlan[]> {
    const data = localStorage.getItem(PLANS_KEY);
    if (!data) {
      localStorage.setItem(PLANS_KEY, JSON.stringify(DEFAULT_PLANS));
      return DEFAULT_PLANS;
    }
    return JSON.parse(data);
  },

  async savePlans(plans: MembershipPlan[]): Promise<void> {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  },

  async login(email: string, pass: string): Promise<User | string> {
    const users = await this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    
    if (!user) return "Credenziali non valide.";
    if (!user.isActive) return "Il tuo account è disattivato. Contatta l'amministratore.";
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  getCurrentSession(): User | null {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  getExpiryDate(membership: MembershipType): number | undefined {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    
    // Recuperiamo i piani per sapere la durata esatta impostata dall'admin
    const plansStr = localStorage.getItem(PLANS_KEY);
    const plans: MembershipPlan[] = plansStr ? JSON.parse(plansStr) : DEFAULT_PLANS;
    const plan = plans.find(p => p.id === membership);
    
    if (!plan || plan.durationDays === 0) return undefined;
    return now + plan.durationDays * day;
  }
};
