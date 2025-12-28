
export interface Ingredient {
  id: string;
  name: string;
  imageSeed: string;
}

export type CourseType = 'primo' | 'secondo' | 'dolce' | 'sorpresa';

export interface RecipeRequest {
  selectedIngredients: string[];
  customIngredients: string;
  mealType: 'pranzo' | 'cena';
  courseType: CourseType;
  peopleCount: number;
  intolerances: string;
}

export interface RecipeResponse {
  id?: string;
  recipeName: string;
  description: string;
  ingredientsList: string[];
  steps: string[];
  winePairing: string;
  winePairingReason: string; // Spiegazione del sommelier
  nonnoTip: string;
  prepTimeMinutes: number;
  timestamp?: number;
}

export type MembershipType = '7days' | '1month' | '1year' | 'lifetime' | 'none';

export interface MembershipPlan {
  id: MembershipType;
  name: string;
  price: string;
  durationDays: number; // 0 per lifetime
  features: string[];
  dailyRecipeLimit: number;
  paymentLink: string;
  isPopular?: boolean;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  username: string;
  role: 'admin' | 'user';
  isActive: boolean;
  membership: MembershipType;
  expiryDate?: number;
  savedRecipes: RecipeResponse[];
  dailyCount?: {
    date: string;
    count: number;
  };
}
