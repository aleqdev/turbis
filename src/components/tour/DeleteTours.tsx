import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';
import { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import Tour from '../../interface/tour';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import API from '../../utils/server';
import { toursR } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import { formatDate } from '../../utils/fmt';


export function DeleteToursModal(
  {onDismiss}: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const tours = useAppSelector(state => state.tours);
  const selectedTours = tours.status === "ok" ? tours.selected : [];

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              Отмена
            </IonButton>
          </IonButtons>
          <IonTitle>Удаление туров</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selectedTours, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить туры? (${selectedTours.length})`}</IonText>
        <IonList>
          {selectedTours.map((tour) => {
            return <IonItem key={tour.id}>{`- ID: ${tour.id} (с ${formatDate(tour.arrival_date)} по ${formatDate(tour.departure_date)})`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export const DeleteToursModalController: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const [present, dismiss] = useIonModal(DeleteToursModal, {
    onDismiss: (data: Array<Tour> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (auth === null) {
          return presentNoAuthAlert(presentAlert);
        }

        if (ev.detail.role === 'confirm') {
          Promise.allSettled(ev.detail.data.map(async (worker: Tour) => {
            await API
              .delete_with_auth(auth!, `tour?id=eq.${worker.id}`)
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status === "rejected" && result.reason instanceof AxiosError) {
                dispatch(toursR.fetch(auth))
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response!),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            dispatch(toursR.fetch(auth));
            presentAlert({
              header: "Туры удалены",
              buttons: ["Ок"]
            });
          })
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" color="danger" onClick={openModal}>
      <IonLabel>Удалить</IonLabel>
    </IonButton>
  )
}
