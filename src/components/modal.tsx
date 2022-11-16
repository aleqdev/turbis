import './ExploreContainer.css';
import { IonButtons, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSplitPane, IonText, IonButton, IonModal, IonInput, IonContent } from '@ionic/react';
import {
  IonItem,
  IonLabel,
  IonList,
  IonMenuToggle,
} from '@ionic/react';
import { useParams } from 'react-router';
import { useRef, useState } from 'react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';

interface ContainerProps {
    id: number;
    manager: string;
    place: string;
    phone: string;
    description: string;
  }

const Modal: React.FC<ContainerProps> = ({ id, manager,  place, phone, description}) => {
    const { name } = useParams<{ name: string; }>();
    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<HTMLIonInputElement>(null);
    console.log(id)
  const [message, setMessage] = useState(
    'This modal example uses triggers to automatically open a modal when the button is clicked.'
  );

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      setMessage(`Hello, ${ev.detail.data}!`);
    }
  }
  return (
    <div className="modal">
        <IonModal trigger={"open-modal" + id} onWillDismiss={(ev) => onWillDismiss(ev)} ref={modal}>
                <IonHeader>
                  <IonToolbar>
                    <IonButtons slot="start">
                      <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>Change Hotel</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => confirm()} strong={true}>Save</IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent class="ion-padding">
                  <IonItem>
                    <IonLabel position="stacked">Manager</IonLabel>
                    <IonInput type="text" placeholder="Manager..." value={manager}></IonInput>
                    <IonLabel position="stacked">Place</IonLabel>
                    <IonInput type="text" placeholder="Place..." value={place}></IonInput>
                    <IonLabel position="stacked">Phone</IonLabel>
                    <IonInput type="text" placeholder="Phone..." value={phone}></IonInput>
                    <IonLabel position="stacked">Description</IonLabel>
                    <IonInput type="text" placeholder="Description..." value={description}></IonInput>
                  </IonItem>
                </IonContent>
              </IonModal>
    </div>
  );
};

export default Modal;






