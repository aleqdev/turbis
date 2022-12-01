import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';
import { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import API from '../../utils/server';
import { tourOrdersR, useAppDispatch, useAppSelector } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import TourOrder from '../../interface/tour_order';

export function DeleteTourOrdersModal(
  {onDismiss}: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const tourOrders = useAppSelector(state => state.tourOrders);
  const selectedTourOrders = tourOrders.status === "ok" ? tourOrders.selected : [];

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              Отмена
            </IonButton>
          </IonButtons>
          <IonTitle>Удаление заказов туров</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selectedTourOrders, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить заказы? (${selectedTourOrders.length})`}</IonText>
        <IonList>
          {selectedTourOrders.map((tourOrder) => {
            return <IonItem key={tourOrder.id}>{`- ${tourOrder.client!.person!.surname} ${tourOrder.client!.person!.name} ${tourOrder.client!.person!.last_name} : ${tourOrder.tour?.hotel?.name}`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export const DeleteTourOrdersModalController: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [present, dismiss] = useIonModal(DeleteTourOrdersModal, {
    onDismiss: (data: Array<TourOrder> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          if (auth === null) {
            return presentNoAuthAlert(presentAlert);
          }
          
          Promise.allSettled(ev.detail.data.map(async (tour_order: TourOrder) => {
            await API
              .delete_with_auth(auth!, `tour_order?id=eq.${tour_order.id}`)
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status === "rejected" && result.reason instanceof AxiosError) {
                dispatch(tourOrdersR.fetch(auth));
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response!),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            dispatch(tourOrdersR.fetch(auth));
            presentAlert({
              header: "Заказы удалены",
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