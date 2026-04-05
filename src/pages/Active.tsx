import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
  IonLoading,
} from '@ionic/react';
import useLogomancy from '../hooks/useLogomancy';
import WordCard from '../components/WordCard';

/**
 * Active View — vertical list of current word cards being practiced.
 * Each card shows word details, usage icons, progress, and skip.
 */
const Active: React.FC = () => {
  const {
    activeStack,
    isLoading,
    logUsage,
    skipWord,
    requiredUses,
  } = useLogomancy();

  if (isLoading) {
    return (
      <IonPage>
        <IonLoading isOpen={true} message="Loading..." />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Active Words</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Active Words</IonTitle>
          </IonToolbar>
        </IonHeader>

        {activeStack.length === 0 ? (
          <IonText color="medium">
            <p>No active words. Go to Dashboard and summon one.</p>
          </IonText>
        ) : (
          activeStack.map((aw) => (
            <WordCard
              key={aw.word.id}
              activeWord={aw}
              requiredUses={requiredUses}
              onLogUsage={logUsage}
              onSkip={skipWord}
            />
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default Active;
