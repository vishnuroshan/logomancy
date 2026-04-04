/**
 * Represents a single word entry from the curated static library.
 */
export interface Word {
  /** Unique identifier for the word (lowercase, kebab-safe) */
  id: string;
  /** The vocabulary word */
  word: string;
  /** IPA phonetic transcription */
  phonetic: string;
  /** Concise definition */
  definition: string;
  /** Two example sentences demonstrating usage */
  examples: [string, string];
  /** Literary source / author attribution */
  source: string;
}

/**
 * Represents context types for the usage logger icons.
 * 💬 conversation | 📧 writing | 🛠️ work | 📦 other
 */
export enum UsageContext {
  Conversation = 'conversation',
  Writing = 'writing',
  Work = 'work',
  Other = 'other',
}

/**
 * A single recorded usage of a word.
 */
export interface UsageEntry {
  /** ISO timestamp of when the word was used */
  timestamp: string;
  /** Which context the word was used in */
  context: UsageContext;
}

/**
 * An active word currently being practiced in the stack.
 */
export interface ActiveWord {
  /** The word data from the library */
  word: Word;
  /** Recorded usages (max 5 to master) */
  usages: UsageEntry[];
  /** ISO timestamp of when the word was added to the stack */
  addedAt: string;
}

/**
 * A mastered word archived in history.
 */
export interface MasteredWord {
  /** The word ID from the library */
  wordId: string;
  /** Full timeline of usages that led to mastery */
  usages: UsageEntry[];
  /** ISO timestamp of when the word was added to the stack */
  addedAt: string;
  /** ISO timestamp of when mastery was achieved */
  masteredAt: string;
}

/**
 * Complete persisted app state stored via @ionic/storage.
 */
export interface AppState {
  /** Total number of words mastered */
  masteredCount: number;
  /** Currently active words (max 3) */
  activeStack: ActiveWord[];
  /** Archive of all mastered words with their usage timelines */
  history: MasteredWord[];
}
