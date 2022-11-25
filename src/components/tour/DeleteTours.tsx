import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';
import axios, { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import { RefetchFunction } from 'axios-hooks'
import { AuthProps } from '../../interface/props/auth';
import Tour from '../../interface/tour';
import API from '../../utils/server';
import { useAppSelector } from '../../redux/store';


export function DeleteToursModal(
  {selected_tours, onDismiss}: {
    selected_tours: Array<Tour>
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
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
            <IonButton strong={true} onClick={() => {onDismiss(selected_tours, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить сотрудников? (${selected_tours.length})`}</IonText>
        <IonList>
          {selected_tours.map((tour) => {
            return <IonItem key={tour.id}>{`- ID: ${tour.id} (с ${tour.arrival_date} по ${tour.departure_date})`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export interface DeleteToursModalControllerProps {
  refetch_tours: RefetchFunction<any, any>,
  selected_tours: Array<Tour>,
}

export const DeleteToursModalController: React.FC<DeleteToursModalControllerProps> = (props) => {
  const auth = useAppSelector(state => state.auth);
  
  const [present, dismiss] = useIonModal(DeleteToursModal, {
    selected_tours: props.selected_tours,
    onDismiss: (data: Array<Tour> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          Promise.allSettled(ev.detail.data.map(async (worker: Tour) => {
            await API
              .delete_with_auth(auth!, `tour?id=eq.${worker.id}`)
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status === "rejected" && result.reason instanceof AxiosError) {
                props.refetch_tours();
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response?.data),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            props.refetch_tours();
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
