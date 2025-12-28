
import { GoogleGenAI, Type } from "@google/genai";
import { RecipeRequest, RecipeResponse } from "../types";

export const generateRecipe = async (request: RecipeRequest): Promise<RecipeResponse> => {
  // Inizializzazione diretta come da linee guida
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const ingredients = [...request.selectedIngredients];
  if (request.customIngredients.trim()) {
    ingredients.push(request.customIngredients);
  }

  const courseInstruction = request.courseType === 'sorpresa' 
    ? "un piatto creativo dello chef" 
    : `un ${request.courseType}`;

  const prompt = `
    Sei NonnoWeb, saggio chef italiano. Crea una ricetta.
    Ingredienti: ${ingredients.join(", ")}.
    Tipo: ${courseInstruction}. 
    Pasto: ${request.mealType}.
    Persone: ${request.peopleCount}.
    Limitazioni: ${request.intolerances || "Nessuna"}.
    
    Tono: Caloroso e professionale.
    Rispondi SEMPRE in JSON seguendo lo schema.
  `;

  const recipeSchema = {
    type: Type.OBJECT,
    properties: {
      recipeName: { type: Type.STRING },
      description: { type: Type.STRING },
      ingredientsList: { type: Type.ARRAY, items: { type: Type.STRING } },
      steps: { type: Type.ARRAY, items: { type: Type.STRING } },
      winePairing: { type: Type.STRING },
      winePairingReason: { type: Type.STRING },
      nonnoTip: { type: Type.STRING },
      prepTimeMinutes: { type: Type.INTEGER }
    },
    required: ["recipeName", "description", "ingredientsList", "steps", "winePairing", "winePairingReason", "nonnoTip", "prepTimeMinutes"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("Risposta vuota dal Nonno.");
    return JSON.parse(text) as RecipeResponse;
  } catch (error: any) {
    console.error("Dettaglio Errore:", error);
    throw new Error(error.message || "Errore sconosciuto nella generazione.");
  }
};
