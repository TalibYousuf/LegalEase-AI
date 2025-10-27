import OpenAI from 'openai';

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export function getModel() {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini';
}

export async function extractClausesAI(text) {
  const client = getOpenAIClient();
  if (!client) return null;
  const model = getModel();
  
  const system = `You are a legal AI assistant specializing in contract analysis. Extract key clauses from legal documents and assess their risk levels.

Return a JSON object with a "clauses" array. Each clause should have:
- type: The clause category (e.g., "Payment Terms", "Termination", "Confidentiality", "Liability", "Intellectual Property", "Force Majeure", "Governing Law")
- text: The actual clause text (truncated to 500 characters if longer)
- riskLevel: "low", "medium", or "high" based on potential legal/financial risk
- summary: A brief plain-English explanation of what this clause means
- confidence: A number 0-1 indicating how confident you are in this extraction

Focus on clauses that are most important for business decision-making.`;

  const user = `Extract key clauses from this legal document. Pay special attention to:
1. Payment terms and amounts
2. Termination conditions
3. Liability limitations
4. Confidentiality obligations
5. Intellectual property rights
6. Force majeure provisions
7. Governing law and jurisdiction

Document text:
${text.substring(0, 8000)}`; // Limit text to avoid token limits

  try {
    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3 // Lower temperature for more consistent legal analysis
    });
    
    const content = resp.choices?.[0]?.message?.content || '{}';
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.clauses)) {
        // Validate and clean the clauses
        return parsed.clauses.map(clause => ({
          type: clause.type || 'Unknown Clause',
          text: clause.text || '',
          riskLevel: ['low', 'medium', 'high'].includes(clause.riskLevel) ? clause.riskLevel : 'medium',
          summary: clause.summary || '',
          confidence: typeof clause.confidence === 'number' ? Math.max(0, Math.min(1, clause.confidence)) : 0.8
        }));
      }
      return null;
    } catch (parseErr) {
      console.warn('JSON parse error:', parseErr);
      return null;
    }
  } catch (err) {
    console.warn('OpenAI extract error:', err?.message || err);
    // Check for token exhaustion errors
    if (err?.message?.includes('rate_limit') || 
        err?.message?.includes('token') || 
        err?.message?.includes('capacity') ||
        err?.message?.includes('quota')) {
      throw new Error('Error from OpenAI as token finished');
    }
    return null;
  }
}

export async function compareClauseAI(clauseText, standardText) {
  const client = getOpenAIClient();
  if (!client) return null;
  const model = getModel();
  const system = 'You are a legal AI. Compare clauses and assess risk. Return strict JSON with: assessment, differences, riskLevel (low|medium|high), suggestedRewrite.';
  const user = `Compare the clause to the standard.\n\nClause:\n${clauseText}\n\nStandard:\n${standardText}`;
  try {
    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      response_format: { type: 'json_object' }
    });
    const content = resp.choices?.[0]?.message?.content || '{}';
    try { return JSON.parse(content); } catch { return null; }
  } catch (err) {
    console.warn('OpenAI compare error:', err?.message || err);
    // Check for token exhaustion errors
    if (err?.message?.includes('rate_limit') || 
        err?.message?.includes('token') || 
        err?.message?.includes('capacity') ||
        err?.message?.includes('quota')) {
      throw new Error('Error from OpenAI as token finished');
    }
    return null;
  }
}

export async function summarizeClauseAI(clauseText) {
  const client = getOpenAIClient();
  if (!client) return null;
  const model = getModel();
  
  const system = `You are a legal AI assistant that explains complex legal language in simple, business-friendly terms. 

Return a JSON object with:
- summary: A clear, concise explanation of what this clause means in plain English (2-3 sentences max)
- keyPoints: An array of 2-4 bullet points highlighting the most important aspects
- riskFactors: Any potential risks or concerns a business should be aware of
- actionItems: Any actions or decisions the business needs to make regarding this clause`;

  const user = `Explain this legal clause in simple terms that a business owner can understand:

${clauseText}`;

  try {
    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    });
    
    const content = resp.choices?.[0]?.message?.content || '{}';
    try { 
      const parsed = JSON.parse(content);
      return {
        summary: parsed.summary || 'Unable to summarize this clause.',
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        riskFactors: Array.isArray(parsed.riskFactors) ? parsed.riskFactors : [],
        actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : []
      };
    } catch { 
      return { 
        summary: 'Unable to parse AI response.',
        keyPoints: [],
        riskFactors: [],
        actionItems: []
      };
    }
  } catch (err) {
    console.warn('OpenAI summarize error:', err?.message || err);
    // Check for token exhaustion errors
    if (err?.message?.includes('rate_limit') || 
        err?.message?.includes('token') || 
        err?.message?.includes('capacity') ||
        err?.message?.includes('quota')) {
      throw new Error('Error from OpenAI as token finished');
    }
    return null;
  }
}

// New function for comprehensive document summarization
export async function generateDocumentSummaryAI(text) {
  const client = getOpenAIClient();
  if (!client) return null;
  const model = getModel();
  
  const system = `You are a legal AI assistant that creates comprehensive summaries of legal documents for business decision-makers.

Return a JSON object with:
- executiveSummary: A 2-3 paragraph overview of the entire document
- keyTerms: An array of the most important terms and conditions
- obligations: What each party is required to do
- risks: Potential risks or concerns to highlight
- recommendations: Suggested actions or areas to review with legal counsel`;

  const user = `Create a comprehensive summary of this legal document for business stakeholders:

${text.substring(0, 12000)}`; // Limit text to avoid token limits

  try {
    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    });
    
    const content = resp.choices?.[0]?.message?.content || '{}';
    try { 
      return JSON.parse(content);
    } catch { 
      return null;
    }
  } catch (err) {
    console.warn('OpenAI document summary error:', err?.message || err);
    // Check for token exhaustion errors
    if (err?.message?.includes('rate_limit') || 
        err?.message?.includes('token') || 
        err?.message?.includes('capacity') ||
        err?.message?.includes('quota')) {
      throw new Error('Error from OpenAI as token finished');
    }
    return null;
  }
}
