import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonLoading,
} from '@ionic/react';
import useLogomancy from '../hooks/useLogomancy';

/**
 * Dashboard — shows mastered count, active stack count,
 * and the "Summon" button when the stack has room.
 */
const Dashboard: React.FC = () => {
  const {
    masteredCount,
    activeStack,
    canSummon,
    isLoading,
    summonWord,
    maxStackSize,
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
          <IonTitle>Logomancy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Logomancy</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonText>
          <h2>Mastered: {masteredCount}</h2>
        </IonText>

        <IonText>
          <h3>
            Active Stack: {activeStack.length}/{maxStackSize}
          </h3>
        </IonText>

        {canSummon && (
          <IonButton expand="block" onClick={summonWord} id="summon-button">
            Summon New Word
          </IonButton>
        )}

        {!canSummon && (
          <IonText color="medium">
            <p>Stack is full. Master or skip a word to summon a new one.</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
