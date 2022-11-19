import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import axios, { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import { RefetchFunction } from 'axios-hooks'
import { HotelJoinedFetch } from '../../interface/hotel';

export function DeleteHotelsModal(
  {selected_hotels, onDismiss}: {
    selected_hotels: Array<HotelJoinedFetch>
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
          <IonTitle>Удаление Отелей</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selected_hotels, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить отели? (${selected_hotels.length})`}</IonText>
        <IonList>
          {selected_hotels.map((hotel) => {
            return <IonItem key={hotel.id}>{`- ${hotel.name} в городе ${hotel.city_name} (${hotel.region_name})`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export interface DeleteHotelsModalControllerProps {
  refetch_hotels: RefetchFunction<any, any>,
  selected_hotels: Array<HotelJoinedFetch>,
}

export const DeleteHotelsModalController: React.FC<DeleteHotelsModalControllerProps> = (props) => {
  const [present, dismiss] = useIonModal(DeleteHotelsModal, {
    selected_hotels: props.selected_hotels,
    onDismiss: (data: Array<HotelJoinedFetch> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          Promise.allSettled(ev.detail.data.map(async (hotel: HotelJoinedFetch) => {
            await axios
              .delete(`https://api.necrom.ru/hotel/${hotel.id}`, {data: {
                db_user_email: "primitive_email@not.even.valid",
                db_user_password: "primitive_password",
              }})
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status == "rejected" && result.reason instanceof AxiosError) {
                props.refetch_hotels();
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response?.data),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            props.refetch_hotels();
            presentAlert({
              header: "Отели удалены",
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