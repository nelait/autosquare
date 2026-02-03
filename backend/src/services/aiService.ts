// AI Service - OpenAI and Vertex AI Integration
import OpenAI from 'openai';
import type { Problem, RepairProcedure, Recall } from '../types/index.js';
import { config } from '../config/index.js';
import { getSecret, SecretNames } from '../config/secrets.js';

let openaiClient: OpenAI | null = null;

async function getOpenAIClient(): Promise<OpenAI> {
    if (!openaiClient) {
        const apiKey = await getSecret(SecretNames.OPENAI_API_KEY);
        openaiClient = new OpenAI({ apiKey });
    }
    return openaiClient;
}

export const aiService = {
    async analyzeSymptoms(
        symptoms: string,
        vehicleInfo?: {
            year?: number;
            make?: string;
            model?: string;
            engine?: string;
            mileage?: number;
        },
        recalls?: Recall[]
    ): Promise<Problem[]> {
        const vehicleContext = vehicleInfo
            ? `Vehicle: ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}
         Engine: ${vehicleInfo.engine || 'Unknown'}
         Mileage: ${vehicleInfo.mileage || 'Unknown'} miles`
            : 'Vehicle information not provided';

        // Build recall context if available
        let recallContext = '';
        if (recalls && recalls.length > 0) {
            recallContext = `\n\nKNOWN RECALLS FOR THIS VEHICLE (${recalls.length} open recalls):
${recalls.map((r, i) => `${i + 1}. [${r.campaignNumber}] ${r.component}: ${r.summary.substring(0, 200)}...
   Risk: ${r.consequence?.substring(0, 100) || 'Not specified'}...`).join('\n')}

IMPORTANT: If the reported symptoms could be related to any of these recalls, prioritize that as a possible cause and mention the recall campaign number.`;
        }

        const systemPrompt = `You are an expert automotive diagnostic AI assistant. Analyze vehicle symptoms and provide detailed diagnostic information.

${recallContext ? 'You have access to real NHTSA recall data for this specific vehicle. Use this information to provide more accurate diagnoses.' : ''}

For each potential problem identified, provide:
1. Problem name
2. Description
3. Severity (critical, high, moderate, or low)
4. Confidence percentage (0-100)
5. Common symptoms
6. Diagnostic steps
7. Estimated repair cost range (min and max in USD)
8. Estimated repair time
9. If related to a recall, include the campaign number

Respond ONLY with valid JSON in this exact format:
{
  "problems": [
    {
      "id": "unique-id",
      "name": "Problem Name",
      "description": "Detailed description",
      "severity": "high",
      "confidence": 85,
      "symptoms": ["symptom1", "symptom2"],
      "diagnosticSteps": ["step1", "step2"],
      "estimatedCost": {"min": 100, "max": 500},
      "estimatedTime": "1-2 hours",
      "recallCampaign": "24V051000 (optional - only if related to a recall)"
    }
  ]
}

Provide 2-5 most likely problems, ranked by confidence. Be specific and accurate.`;

        const userPrompt = `${vehicleContext}${recallContext}

Customer reported symptoms: "${symptoms}"

Analyze these symptoms and identify the most likely problems with this vehicle. If any symptoms match known recalls, prioritize those as potential causes.`;

        if (config.aiProvider === 'openai') {
            const client = await getOpenAIClient();

            const response = await client.chat.completions.create({
                model: config.openaiModel,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.7,
                max_tokens: 2000,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('Empty response from AI');
            }

            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from AI');
            }

            const result = JSON.parse(jsonMatch[0]);
            return (result.problems || []).map((p: Problem, i: number) => ({
                ...p,
                id: p.id || `ai-${Date.now()}-${i}`,
                source: 'openai' as const,
            }));
        } else {
            // TODO: Implement Vertex AI
            throw new Error('Vertex AI not yet implemented');
        }
    },

    async getRepairProcedure(
        problemName: string,
        problemDescription: string,
        vehicleInfo?: {
            year?: number;
            make?: string;
            model?: string;
            engine?: string;
        }
    ): Promise<RepairProcedure> {
        const vehicleContext = vehicleInfo
            ? `Vehicle: ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}
         Engine: ${vehicleInfo.engine || 'Unknown'}`
            : 'General automotive repair';

        const systemPrompt = `You are an expert automotive repair technician. Provide detailed repair procedures for vehicle problems.

Respond ONLY with valid JSON in this exact format:
{
  "title": "Repair Procedure Title",
  "difficulty": "Beginner|Intermediate|Advanced|Professional",
  "estimatedTime": "X-Y hours",
  "tools": ["tool1", "tool2"],
  "parts": [
    {
      "name": "Part Name",
      "partNumber": "XXX-XXX-XXX",
      "avgPrice": 99.99,
      "link": "https://www.rockauto.com"
    }
  ],
  "steps": ["Step 1 description", "Step 2 description"],
  "safetyWarnings": ["Warning 1", "Warning 2"],
  "tips": ["Helpful tip 1", "Helpful tip 2"]
}

Be specific, accurate, and prioritize safety. Include actual common part numbers when possible.`;

        const userPrompt = `${vehicleContext}

Problem: ${problemName}
Description: ${problemDescription}

Provide a detailed repair procedure for fixing this problem.`;

        if (config.aiProvider === 'openai') {
            const client = await getOpenAIClient();

            const response = await client.chat.completions.create({
                model: config.openaiModel,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.7,
                max_tokens: 2000,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('Empty response from AI');
            }

            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from AI');
            }

            return JSON.parse(jsonMatch[0]);
        } else {
            // TODO: Implement Vertex AI
            throw new Error('Vertex AI not yet implemented');
        }
    },
};
