import { XMLValidator } from 'fast-xml-parser';

export interface ParsedResponse {
  manifest: string;
  questions: string[];
}

/**
 * Parses the AI response into manifest and question files
 * @param response The raw response from the LLM
 * @returns Parsed manifest and question contents
 */
export function parseAiResponse(response: string): ParsedResponse {
  // Clean up response - remove markdown code blocks if present
  const cleanResponse = response.replace(/```xml\s*|\s*```/g, '').trim();
  
  // Split by the separator
  const chunks = cleanResponse.split(/\s*---\s*/);
  
  // Find the manifest (usually contains "manifest" in the XML)
  const manifestIndex = chunks.findIndex(chunk => 
    chunk.includes('<manifest') || 
    chunk.includes('imsmanifest')
  );
  
  // If manifest isn't found, assume first chunk is the manifest
  const manifest = manifestIndex >= 0 ? chunks[manifestIndex] : chunks[0];
  
  // Get questions (everything except the manifest)
  const questions = chunks
    .filter((_, index) => index !== (manifestIndex >= 0 ? manifestIndex : 0))
    .map(q => q.trim())
    .filter(q => q.length > 0 && q.includes('<assessmentItem'));
    
  // Validate XML (basic check)
  const validateManifest = XMLValidator.validate(manifest);
  if (validateManifest !== true) {
    console.warn('Manifest XML validation failed:', validateManifest);
  }
  
  questions.forEach((q, i) => {
    const validateQuestion = XMLValidator.validate(q);
    if (validateQuestion !== true) {
      console.warn(`Question ${i+1} XML validation failed:`, validateQuestion);
    }
  });
  
  return {
    manifest,
    questions
  };
}