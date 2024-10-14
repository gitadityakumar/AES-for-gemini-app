// Custom Error Class for JSON Parsing Errors
class JSONParseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'JSONParseError';
    if (originalError) {
      this.stack = originalError.stack; // Preserve the original error's stack trace
    }
  }
}

/**
 * Parses the LLM response to extract a valid JSON object.
 * The function removes any extra text outside of the JSON object.
 *
 * @param llmResponse - The raw response from the LLM
 * @returns - A valid JSON object if possible, otherwise throws an error
 */
export function parseLLMResponse(llmResponse: string): object {
  try {
    // First, attempt a straightforward JSON parse
    return JSON.parse(llmResponse);
  } catch (initialError) {
    // If the first attempt fails, use a regex to extract the JSON portion
    const jsonRegex = /{[\s\S]*}/; // Matches the first JSON object in the response
    const match = llmResponse.match(jsonRegex);

    if (match) {
      try {
        // Parse the extracted JSON
        return JSON.parse(match[0]);
      } catch (jsonError) {
        //@ts-ignore
        throw new JSONParseError("Failed to parse extracted JSON.", jsonError);
      }
    }
      //@ts-ignore
    // If no match is found, throw an error
    throw new JSONParseError("No valid JSON found in LLM response.", initialError);
  }
}


