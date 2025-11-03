import OpenAI from 'openai';

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log("OpenAI API Key available:", apiKey ? "Yes (length: " + apiKey.length + ")" : "No");
  
  if (!apiKey) {
    console.warn('OPENAI_API_KEY not set, using mock AI client');
    return null;
  }
  
  try {
    return new OpenAI({ apiKey });
  } catch (error) {
    console.error("Error initializing OpenAI client:", error);
    return null;
  }
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
  if (!client) {
    console.log("No OpenAI client available, returning fallback summary");
    return {
      executiveSummary: "[FALLBACK MODE] No OpenAI API key configured. This is a placeholder summary. To get actual AI-powered summaries, please configure your OpenAI API key in the backend .env file.",
      keyTerms: ["[FALLBACK] API key not configured", "[FALLBACK] Configure OpenAI API key"],
      obligations: ["[FALLBACK] Set OPENAI_API_KEY in backend/.env"],
      risks: ["[FALLBACK] Using placeholder data instead of AI analysis"],
      recommendations: ["[FALLBACK] Add your OpenAI API key to enable AI features"]
    };
  }
  
  // Ensure we have actual document content to analyze
  if (!text || text.trim().length < 50) {
    console.log("Document text is too short or empty:", text);
    return {
      executiveSummary: "ERROR: Document appears to be empty or could not be properly extracted. Please check the file format and try again.",
      keyTerms: ["Error: Document content extraction failed"],
      obligations: ["Unable to analyze document content"],
      risks: ["Document content could not be properly processed"],
      recommendations: ["Try uploading the document in a different format (PDF, DOCX, or TXT)"]
    };
  }
  
  console.log(`Processing document with ${text.length} characters`);
  
  const model = getModel();
  
  const system = `You are a legal AI assistant that creates comprehensive summaries of legal documents for business decision-makers.

Analyze the EXACT CONTENT of the document provided and create a detailed analysis based ONLY on what's in the document.

Return a JSON object with:
- executiveSummary: A 2-3 paragraph overview of the entire document, mentioning specific details from the text
- keyTerms: An array of the most important terms and conditions found in this specific document
- obligations: What each party is specifically required to do according to this document
- risks: Potential risks or concerns highlighted in this specific document
- recommendations: Suggested actions based on the actual content of this document`;

  const user = `Create a comprehensive summary of this legal document based ONLY on its actual content:

${text.substring(0, 12000)}`; // Limit text to avoid token limits

  try {
    console.log("Making OpenAI API request for document summary...");
    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2, // Lower temperature for more factual analysis
      max_tokens: 2000 // Ensure we get a complete response
    });
    
    const content = resp.choices?.[0]?.message?.content || '{}';
    console.log("Received response from OpenAI:", content.substring(0, 100) + "...");
    
    try { 
      const parsed = JSON.parse(content);
      return {
        executiveSummary: parsed.executiveSummary || "No executive summary available.",
        keyTerms: Array.isArray(parsed.keyTerms) ? parsed.keyTerms : ["No key terms identified"],
        obligations: Array.isArray(parsed.obligations) ? parsed.obligations : ["No specific obligations identified"],
        risks: Array.isArray(parsed.risks) ? parsed.risks : ["No specific risks identified"],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ["Review with legal counsel"]
      };
    } catch (parseErr) { 
      console.warn('JSON parse error in document summary:', parseErr);
      return {
        executiveSummary: "Failed to parse AI response. The document appears to contain legal text.",
        keyTerms: ["Error parsing response"],
        obligations: ["Unable to extract obligations"],
        risks: ["Unable to identify risks"],
        recommendations: ["Review document manually"]
      };
    }
  } catch (err) {
    console.warn('OpenAI document summary error:', err?.message || err);
    // Return a fallback summary instead of throwing an error
    return {
      executiveSummary: "Unable to generate AI summary due to an error. The document appears to contain legal text.",
      keyTerms: ["Error occurred during processing"],
      obligations: ["Review document manually"],
      risks: ["Unable to assess risks automatically"],
      recommendations: ["Consult with legal counsel"]
    };
  }
}
