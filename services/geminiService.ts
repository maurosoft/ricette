
import { GoogleGenAI, Type } from "@google/genai";
import { RecipeRequest, RecipeResponse } from "../types";

export const generateRecipe = async (request: RecipeRequest): Promise<RecipeResponse> => {
  const key = process.env.API_KEY;
  
  if (!key || key.length < 5) {
    throw new Error("API_KEY mancante o non valida nel sistema.");
  }

  const ai = new GoogleGenAI({ apiKey: key });
  
  const ingredients = [...request.selectedIngredients];
  if (request.customIngredients.trim()) {
    ingredients.push(request.customIngredients);
  }

  const courseInstruction = request.courseType === 'sorpresa' 
    ? "un piatto creativo basato sugli ingredienti" 
    : `assolutamente un ${request.courseType}`;

  const prompt = `
    Sei NonnoWeb, un saggio chef italiano con anni di esperienza. 
    Crea una ricetta deliziosa usando questi ingredienti: ${ingredients.join(", ")}.
    Tipo piatto: ${courseInstruction}. 
    Pasto: ${request.mealType}.
    Persone: ${request.peopleCount}.
    Restrizioni: ${request.intolerances || "Nessuna"}.
    
    Il tono deve essere caloroso, come un nonno che insegna al nipote. 
    L'abbinamento vino deve essere un vino italiano specifico (es. Chianti, Vermentino, ecc.) con spiegazione.
    Il consiglio segreto deve essere un trucco da chef esperto.
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
    if (!text) throw new Error("Il Nonno ha avuto un vuoto di memoria (Risposta vuota).");
    return JSON.parse(text) as RecipeResponse;
  } catch (error: any) {
    console.error("Errore Gemini:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("La chiave API non è valida. Controlla le impostazioni di Vercel.");
    }
    throw new Error(`Il Nonno ha bruciato il soffritto: ${error.message || "Errore sconosciuto"}`);
  }
};
