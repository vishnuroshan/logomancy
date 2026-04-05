import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonLabel,
  IonText,
} from '@ionic/react';
import {
  chatbubbleEllipsesOutline,
  mailOutline,
  constructOutline,
  cubeOutline,
  closeCircleOutline,
} from 'ionicons/icons';
import { ActiveWord, UsageContext } from '../models/types';

/**
 * Map each UsageContext to its icon + emoji label for display.
 */
const CONTEXT_MAP: { context: UsageContext; icon: string; label: string }[] = [
  { context: UsageContext.Conversation, icon: chatbubbleEllipsesOutline, label: '💬' },
  { context: UsageContext.Writing, icon: mailOutline, label: '📧' },
  { context: UsageContext.Work, icon: constructOutline, label: '🛠️' },
  { context: UsageContext.Other, icon: cubeOutline, label: '📦' },
];

interface WordCardProps {
  activeWord: ActiveWord;
  requiredUses: number;
  onLogUsage: (wordId: string, context: UsageContext) => void;
  onSkip: (wordId: string) => void;
}

/**
 * WordCard — displays a single active word with its details,
 * usage logging buttons, progress, and skip action.
 */
const WordCard: React.FC<WordCardProps> = ({
  activeWord,
  requiredUses,
  onLogUsage,
  onSkip,
}) => {
  const { word, usages, addedAt } = activeWord;
  const progress = usages.length;
  const addedDate = new Date(addedAt).toLocaleDateString();

  return (
    <IonCard id={`word-card-${word.id}`}>
      <IonCardHeader>
        <IonCardTitle>{word.word}</IonCardTitle>
        <IonCardSubtitle>{word.phonetic}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <IonText>
          <p><strong>Definition:</strong> {word.definition}</p>
        </IonText>

        <IonText>
          <p><strong>Examples:</strong></p>
          <ul>
            {word.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </IonText>

        <IonText color="medium">
          <p><em>Source: {word.source}</em></p>
        </IonText>

        {/* Usage logger buttons */}
        <div>
          <IonText>
            <p>
              <strong>Log usage ({progress}/{requiredUses}):</strong>
            </p>
          </IonText>
          {CONTEXT_MAP.map(({ context, icon, label }) => (
            <IonChip
              key={context}
              onClick={() => onLogUsage(word.id, context)}
              id={`log-${word.id}-${context}`}
            >
              <IonIcon icon={icon} />
              <IonLabel>{label}</IonLabel>
            </IonChip>
          ))}
        </div>

        {/* In progress since */}
        <IonText color="medium">
          <p>In progress since {addedDate}</p>
        </IonText>

        {/* Skip button */}
        <IonButton
          fill="clear"
          color="danger"
          size="small"
          onClick={() => onSkip(word.id)}
          id={`skip-${word.id}`}
        >
          <IonIcon slot="start" icon={closeCircleOutline} />
          Skip
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default WordCard;
