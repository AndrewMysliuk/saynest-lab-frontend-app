export const smallTalk1JsonSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    corrections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          original: { type: "string" },
          wrong: { type: "string" },
          properly: { type: "string" },
        },
        required: ["original", "wrong", "properly"],
      },
    },
  },
  required: ["message", "corrections"],
}

export const analyzeConversationJsonSchema = {
  type: "object",
  properties: {
    confidence: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 1, maximum: 10 },
        examples: { type: "array", items: { type: "string" } },
        suggestions: { type: "array", items: { type: "string" } },
      },
      required: ["score", "examples", "suggestions"],
    },
    coherence: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 1, maximum: 10 },
        examples: { type: "array", items: { type: "string" } },
        suggestions: { type: "array", items: { type: "string" } },
        corrected_sentence: { type: "string" },
      },
      required: ["score", "examples", "suggestions", "corrected_sentence"],
    },
    grammar: {
      type: "object",
      properties: {
        errors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              original: { type: "string" },
              highlighted: {
                type: "object",
                properties: {
                  incorrect_parts: { type: "array", items: { type: "string" } },
                  corrected_parts: { type: "array", items: { type: "string" } },
                },
                required: ["incorrect_parts", "corrected_parts"],
              },
              corrected_sentence: { type: "string" },
            },
            required: ["original", "highlighted", "corrected_sentence"],
          },
        },
        summary: { type: "string" },
      },
      required: ["errors", "summary"],
    },
    vocabulary: {
      type: "object",
      properties: {
        active_vocab: {
          type: "object",
          properties: {
            total: { type: "integer" },
            evaluation: { type: "string" },
            level_thresholds: {
              type: "object",
              properties: {
                current_level: { type: "string" },
                next_level: { type: "string" },
                current_level_words: { type: "integer" },
                next_level_threshold: { type: "integer" },
              },
              required: ["current_level", "next_level", "current_level_words", "next_level_threshold"],
            },
          },
          required: ["total", "evaluation", "level_thresholds"],
        },
        unique_words: {
          type: "object",
          properties: {
            list: { type: "array", items: { type: "string" } },
            count: { type: "integer" },
          },
          required: ["list", "count"],
        },
        rare_words: {
          type: "object",
          properties: {
            percentage: { type: "string" },
            examples: { type: "array", items: { type: "string" } },
          },
          required: ["percentage", "examples"],
        },
        frequently_used_words: {
          type: "object",
          properties: {
            percentage: { type: "string" },
            examples: { type: "array", items: { type: "string" } },
          },
          required: ["percentage", "examples"],
        },
        word_sample_by_level: {
          type: "object",
          properties: {
            A1: {
              type: "object",
              properties: {
                words: { type: "array", items: { type: "string" } },
                synonyms: { type: "array", items: { type: "string" } },
              },
              required: ["words", "synonyms"],
            },
            A2: {
              type: "object",
              properties: {
                words: { type: "array", items: { type: "string" } },
                synonyms: { type: "array", items: { type: "string" } },
              },
              required: ["words", "synonyms"],
            },
            B1: {
              type: "object",
              properties: {
                words: { type: "array", items: { type: "string" } },
                synonyms: { type: "array", items: { type: "string" } },
              },
              required: ["words", "synonyms"],
            },
            B2: {
              type: "object",
              properties: {
                words: { type: "array", items: { type: "string" } },
                synonyms: { type: "array", items: { type: "string" } },
              },
              required: ["words", "synonyms"],
            },
            C1: {
              type: "object",
              properties: {
                words: { type: "array", items: { type: "string" } },
                synonyms: { type: "array", items: { type: "string" } },
              },
              required: ["words", "synonyms"],
            },
            C2: {
              type: "object",
              properties: {
                words: { type: "array", items: { type: "string" } },
                synonyms: { type: "array", items: { type: "string" } },
              },
              required: ["words", "synonyms"],
            },
          },
          required: ["A1", "A2", "B1", "B2", "C1", "C2"],
        },
        suggestions: { type: "array", items: { type: "string" } },
      },
      required: ["active_vocab", "unique_words", "rare_words", "frequently_used_words", "word_sample_by_level", "suggestions"],
    },
  },
  required: ["confidence", "coherence", "grammar", "vocabulary"],
}

export const ieltsTest1Schema = {
  type: "object",
  properties: {
    part: {
      type: "string",
      enum: ["Part 1", "Part 2", "Part 3"],
      description: "Indicates which part of the IELTS Speaking test the response belongs to.",
    },
    question: {
      type: "string",
      description: "The exact question or prompt posed by the examiner.",
    },
    response: {
      type: "string",
      description: "The candidate's response to the given question or prompt.",
    },
    notes: {
      type: "object",
      properties: {
        timeTaken: {
          type: "number",
          description: "The amount of time (in seconds) the candidate took to respond.",
        },
        fluencyScore: {
          type: "number",
          minimum: 0,
          maximum: 9,
          description: "An optional fluency score based on the candidate's response (0-9 scale).",
        },
        coherenceScore: {
          type: "number",
          minimum: 0,
          maximum: 9,
          description: "An optional coherence score based on the candidate's response (0-9 scale).",
        },
      },
      required: ["timeTaken"],
    },
  },
  required: ["part", "question", "response"],
}
