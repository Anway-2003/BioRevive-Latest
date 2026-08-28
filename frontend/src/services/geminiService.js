import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const parseJSON = (text) => {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Failed to parse Gemini JSON:", error);
    return null;
  }
};

// 🔥 1. AI Analysis (Status Aware)
export const fetchAIAnalysis = async (zoneName, zoneStatus) => {
  const prompt = `You are an expert environmental AI. Analyze the location: ${zoneName} in Maharashtra. 
  The current sensor/system status is strictly: ${zoneStatus}. 
  If status is 'Critical' or 'High', the severityScore MUST be above 75, and timeframe should be 18-36 Months.
  If status is 'Watch' or 'Safe', severityScore MUST be below 50.
  
  Return strictly ONLY a JSON object with this exact structure:
  {
    "severityScore": number (1-100),
    "healthStatus": "string (e.g. Critical Level, Moderate, Healthy)",
    "potential": "string (e.g. Optimal, Challenging)",
    "potentialScore": number (1-100),
    "timeframe": "string (e.g. 24-36 Months)",
    "confidence": number (1-100),
    "causes": [
      { "name": "Deforestation", "level": "HIGH/MED/LOW" },
      { "name": "Soil Pollution", "level": "HIGH/MED/LOW" }
    ],
    "summary": "2-3 sentences explaining the AI insight specifically addressing its ${zoneStatus} condition."
  }`;

  const result = await model.generateContent(prompt);
  return parseJSON(result.response.text());
};

// 🔥 2. Revival Plan (Status Aware)
export const fetchRevivalPlan = async (zoneName, zoneStatus) => {
  const prompt = `Create a 4-phase ecological restoration roadmap for ${zoneName}. 
  The current condition is: ${zoneStatus}. 
  If Critical/High, Phase 1 must be Aggressive Remediation taking several months. 
  If Watch/Safe, Phase 1 should be just Basic Maintenance taking 1-2 months.
  
  Return strictly ONLY a JSON array of 4 objects with this structure:
  [
    {
      "phase": 1,
      "title": "string (e.g. Soil Remediation / Basic Assessment)",
      "duration": "string (e.g. Months 1-4)",
      "tasks": ["string (task 1)", "string (task 2)"],
      "resources": [{"title": "Item name", "type": "Hardware/Material"}],
      "costs": [{"item": "Cleanup", "amount": "₹5000"}, {"item": "Total", "amount": "₹5000"}]
    }
  ]`;

  const result = await model.generateContent(prompt);
  return parseJSON(result.response.text());
};

// 🔥 3. Native Species (Status Aware)
export const fetchNativeSpecies = async (zoneName, zoneStatus) => {
  const prompt = `Recommend 4 native plant species for ecological restoration in ${zoneName}, Maharashtra. 
  The current condition is: ${zoneStatus}. 
  If Critical/High, recommend HARDY pioneer plants (e.g. Neem, Vetiver Grass, Babul) that survive extreme conditions. 
  If Watch/Safe, recommend fruit/flowering plants (e.g. Mango, Jasmine).
  
  Return strictly ONLY a JSON array of objects with this structure:
  [
    {
      "name": "Common Name",
      "scientificName": "Scientific Name",
      "category": "Trees" | "Shrubs" | "Grasses",
      "benefit": "string (e.g. High Survival in toxic soil)",
      "searchKeyword": "string (1 word to search an image, e.g. neem, vetiver, grass)"
    }
  ]`;

  const result = await model.generateContent(prompt);
  return parseJSON(result.response.text());
};

// 📸 BONUS: For Mobile App Photo Upload feature (Keep this ready for backend)
export const analyzeZonePhoto = async () => {
  // Setup code for multimodal image analysis ready for your mobile app
  const prompt = "Analyze this environmental photo. Is the soil degraded? Are plants dying? Return a JSON with severityScore and primary issues.";
  // We will integrate this in the Mobile App Upload screen!
}