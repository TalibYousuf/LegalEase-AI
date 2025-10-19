import OpenAI from 'openai';

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}
function getModel() {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini';
}

export async function extractClausesAI(text) {
  const client = getOpenAIClient();
  if (!client) return null;
  const model = getModel();
  const system = 'You are a legal AI. Extract key clauses from contracts. Return strict JSON with key "clauses" as an array where each item has: type, text, riskLevel (low|medium|high), summary.';
  const user = `Extract clauses from the following document. Only return JSON.\n\n${text}`;
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
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.clauses)) return parsed.clauses;
      return null;
    } catch {
      return null;
    }
  } catch (err) {
    console.warn('OpenAI extract error:', err?.message || err);
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
    return null;
  }
}

export async function summarizeClauseAI(clauseText) {
  const client = getOpenAIClient();
  if (!client) return null;
  const model = getModel();
  const system = 'You are a legal AI. Summarize clauses in plain English. Return strict JSON { summary: string }.';
  const user = `Summarize this clause:\n\n${clauseText}`;
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
    console.warn('OpenAI summarize error:', err?.message || err);
    return null;
  }
}
