import { useState, useEffect, useCallback } from 'react';
import { getStorage } from '../storage/ionicStorage';
import {
  AppState,
  ActiveWord,
  MasteredWord,
  UsageContext,
  UsageEntry,
  Word,
} from '../models/types';
import wordsLibrary from '../data/words.json';

/** Storage keys — using an enum prevents magic strings. */
enum StorageKey {
  MasteredCount = 'mastered_count',
  ActiveStack = 'active_stack',
  History = 'history',
}

/** Maximum number of words allowed in the active stack. */
const MAX_STACK_SIZE = 3;
/** Number of usages required to master a word. */
const REQUIRED_USES = 5;

/** Default empty state for first-time users. */
const DEFAULT_STATE: AppState = {
  masteredCount: 0,
  activeStack: [],
  history: [],
};

/**
 * useLogomancy — the single source of truth for all app state.
 *
 * Responsibilities:
 * - Loads persisted state from @ionic/storage on mount.
 * - Exposes actions: summonWord, logUsage, skipWord.
 * - Syncs every mutation back to storage immediately.
 * - Enforces the 3-word stack limit and the 5-use mastery rule.
 *
 * @returns The current AppState, loading flag, and action functions.
 */
const useLogomancy = () => {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load persisted state on mount ────────────────────────────────
  useEffect(() => {
    const loadState = async () => {
      try {
        const storage = await getStorage();
        const [masteredCount, activeStack, history] = await Promise.all([
          storage.get(StorageKey.MasteredCount),
          storage.get(StorageKey.ActiveStack),
          storage.get(StorageKey.History),
        ]);

        setState({
          masteredCount: masteredCount ?? 0,
          activeStack: activeStack ?? [],
          history: history ?? [],
        });
      } catch (error) {
        // Storage read failed — fall back to defaults.
        // A toast should be triggered by the consuming component.
        console.error('Failed to load state from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // ── Persist helper — writes a partial state update to storage ───
  const persist = useCallback(async (partial: Partial<AppState>) => {
    try {
      const storage = await getStorage();
      const writes: Promise<void>[] = [];

      if (partial.masteredCount !== undefined) {
        writes.push(storage.set(StorageKey.MasteredCount, partial.masteredCount));
      }
      if (partial.activeStack !== undefined) {
        writes.push(storage.set(StorageKey.ActiveStack, partial.activeStack));
      }
      if (partial.history !== undefined) {
        writes.push(storage.set(StorageKey.History, partial.history));
      }

      await Promise.all(writes);
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  }, []);

  // ── summonWord — add a random word from the library to the stack ─
  const summonWord = useCallback(async () => {
    setState((prev) => {
      if (prev.activeStack.length >= MAX_STACK_SIZE) {
        return prev;
      }

      // Build a set of word IDs already in use (active + mastered).
      const usedIds = new Set<string>([
        ...prev.activeStack.map((aw) => aw.word.id),
        ...prev.history.map((mw) => mw.wordId),
      ]);

      const available = (wordsLibrary as Word[]).filter(
        (w) => !usedIds.has(w.id)
      );

      if (available.length === 0) {
        return prev;
      }

      const randomWord = available[Math.floor(Math.random() * available.length)];

      const newActive: ActiveWord = {
        word: randomWord,
        usages: [],
        addedAt: new Date().toISOString(),
      };

      const nextStack = [...prev.activeStack, newActive];
      const next: AppState = { ...prev, activeStack: nextStack };

      // Fire-and-forget persist — state is already updated optimistically.
      persist({ activeStack: nextStack });

      return next;
    });
  }, [persist]);

  // ── logUsage — record a usage against an active word ─────────────
  const logUsage = useCallback(
    async (wordId: string, context: UsageContext) => {
      setState((prev) => {
        const idx = prev.activeStack.findIndex((aw) => aw.word.id === wordId);
        if (idx === -1) return prev;

        const entry: UsageEntry = {
          timestamp: new Date().toISOString(),
          context,
        };

        const updatedWord: ActiveWord = {
          ...prev.activeStack[idx],
          usages: [...prev.activeStack[idx].usages, entry],
        };

        // Check if the word has reached mastery.
        if (updatedWord.usages.length >= REQUIRED_USES) {
          const mastered: MasteredWord = {
            wordId: updatedWord.word.id,
            usages: updatedWord.usages,
            addedAt: updatedWord.addedAt,
            masteredAt: new Date().toISOString(),
          };

          const nextStack = prev.activeStack.filter((_, i) => i !== idx);
          const nextHistory = [...prev.history, mastered];
          const nextCount = prev.masteredCount + 1;

          const next: AppState = {
            masteredCount: nextCount,
            activeStack: nextStack,
            history: nextHistory,
          };

          persist(next);
          return next;
        }

        // Not yet mastered — just update the usage list.
        const nextStack = prev.activeStack.map((aw, i) =>
          i === idx ? updatedWord : aw
        );

        const next: AppState = { ...prev, activeStack: nextStack };
        persist({ activeStack: nextStack });

        return next;
      });
    },
    [persist]
  );

  // ── skipWord — remove a word from the stack, resetting progress ──
  const skipWord = useCallback(
    async (wordId: string) => {
      setState((prev) => {
        const nextStack = prev.activeStack.filter(
          (aw) => aw.word.id !== wordId
        );

        if (nextStack.length === prev.activeStack.length) {
          return prev; // Word not found — no-op.
        }

        const next: AppState = { ...prev, activeStack: nextStack };
        persist({ activeStack: nextStack });

        return next;
      });
    },
    [persist]
  );

  return {
    /** Current app state */
    ...state,
    /** True while loading persisted state from storage */
    isLoading,
    /** Whether the stack has room for another word */
    canSummon: state.activeStack.length < MAX_STACK_SIZE,
    /** Add a random word from the library to the active stack */
    summonWord,
    /** Record a usage of an active word in a given context */
    logUsage,
    /** Remove a word from the active stack (resets its progress) */
    skipWord,
    /** Constants exposed for UI display */
    maxStackSize: MAX_STACK_SIZE,
    requiredUses: REQUIRED_USES,
  };
};

export default useLogomancy;
