
import { GoogleGenAI, Type } from "@google/genai";
import { RecipeRequest, RecipeResponse } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING, description: "Il nome creativo e italiano della ricetta" },
    description: { type: Type.STRING, description: "Una breve descrizione appetitosa" },
    ingredientsList: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista completa degli ingredienti con quantità stimate"
    },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Passaggi passo dopo passo per cucinare"
    },
    winePairing: { type: Type.STRING, description: "Il nome del vino specifico consigliato" },
    winePairingReason: { type: Type.STRING, description: "Spiega in modo affettuoso perché questo vino si sposa perfettamente con i sapori del piatto" },
    nonnoTip: { type: Type.STRING, description: "Un consiglio segreto o un detto saggio di NonnoWeb" },
    prepTimeMinutes: { type: Type.INTEGER, description: "Tempo di preparazione stimato in minuti" }
  },
  required: ["recipeName", "description", "ingredientsList", "steps", "winePairing", "winePairingReason", "nonnoTip", "prepTimeMinutes"],
};

export const generateRecipe = async (request: RecipeRequest): Promise<RecipeResponse> => {
  const ai = getAI();
  const ingredients = [...request.selectedIngredients];
  if (request.customIngredients.trim()) {
    ingredients.push(request.customIngredients);
  }

  const courseInstruction = request.courseType === 'sorpresa' 
    ? "un piatto che stia bene con gli ingredienti" 
    : `assolutamente un ${request.courseType}`;

  const prompt = `
    Sei NonnoWeb, un anziano cuoco italiano saggio, caldo e accogliente. 
    Parla come un nonno affettuoso ma esperto sommelier e chef.
    
    Crea una ricetta basata su questi ingredienti: ${ingredients.join(", ")}.
    Richiesta: Devi creare ${courseInstruction}. 
    È per un ${request.mealType} per ${request.peopleCount} persone.
    Allergie/Intolleranze: ${request.intolerances || "Nessuna"}.
    
    Nel suggerire il vino (winePairing), sii specifico (es. Chianti Classico Riserva, non solo 'Vino Rosso').
    Nella winePairingReason, descrivi le note del vino e perché bilanciano gli ingredienti scelti.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.7, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("Nessuna risposta generata.");
    return JSON.parse(text) as RecipeResponse;
  } catch (error) {
    console.error("Errore generazione:", error);
    throw error;
  }
};
