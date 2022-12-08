import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import { hotelsR, useAppDispatch, useAppSelector } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import { tourOrderPaymentTypesR, tourOrdersR } from '../../redux/store';
import Hotel from '../../interface/hotel';
import { SelectWithSearchModal } from '../SelectWithSearch';
import Tour from '../../interface/tour';
import TourOrder from '../../interface/tour_order';
import Person from '../../interface/person';

export function PutTourOrderPaymentModal(
  {auth, onDismiss}: AuthProps & {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const inputName = useRef<HTMLIonInputElement>(null);
  const [inputHotel, setInputHotel] = React.useState(null as TourOrder | null);
  const [hotels, tourFeedingTypes] = useAppSelector(state => [state.tourOrders, state.tourFeedingTypes]);
  const [errorMessage, setErrorMessage] = useState(null as string | null);
  const dispatch = useAppDispatch();
  function confirm() {
    const name = inputName.current?.value!;

    if (name) {
      onDismiss({
        name: name,
        money_received: inputHotel?.cost,
        tour_order_id: inputHotel?.id
      }, 'confirm');
    } else {
      setErrorMessage("Не все поля заполнены!")
    }
  }

  const [presentHotelChoice, dismissHotelChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const hotels = useAppSelector(state => state.tourOrders)
      return hotels.status === "ok" ? hotels.data : null
    },
    title: "Выберите заказ",
    formatter: (e: TourOrder) => `Заказ №${e.group_id} ${e.cost} руб. <${e!.payment_type!.name}> ${Person.format(e.client?.person!)}`,
    sorter: (e: TourOrder, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value + e.group_id + e!.cost!
          // +e.name.toLowerCase().includes(element) + 10 * +(e.name.toLowerCase() === element) + 
          // +e.city!.name.toLowerCase().includes(element) + 10 * +(e.city!.name.toLowerCase() === element)
      }, 0);
    },
    keyer: (e: TourOrder) => e.id,
    onDismiss: (data: object | null, role: string) => dismissHotelChoice(data, role),
  });

  function openHotelSelectModal() {
    presentHotelChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setInputHotel(ev.detail.data.value);
        }
      },
    });
  }

  useEffect(() => {
    dispatch(tourOrdersR.fetch(auth));
  }, []);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              Отмена
            </IonButton>
          </IonButtons>
          <IonTitle>Зарегистрировать оплату тура</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              Зарегистрировать
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
          <IonLabel position="stacked" >Заказ тура</IonLabel>
          <IonButton disabled={hotels === null} onClick={() => openHotelSelectModal()}>
            {hotels === null ? "Загрузка..." : (inputHotel === null ? "Выбрать" : `Заказ №${inputHotel.group_id} <${inputHotel.payment_type?.name}> ${Person.format(inputHotel.client?.person!)}`)}
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Сумма оплаты</IonLabel>
          <IonInput ref={inputName} value={inputHotel?.cost} disabled={true} type="text" placeholder="= 0 р" required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export const PutTourOrderPaymentModalController: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const [present, dismiss] = useIonModal(PutTourOrderPaymentModal, {
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          if (auth === null) {
            return presentNoAuthAlert(presentAlert);
          }
          console.log(ev.detail.data)
          API
            .post_with_auth(auth!, `tour_order_payment`, {
              tour_order_id: ev.detail.data.tour_order_id,
              money_received: ev.detail.data.money_received
            })
            .then((_) => {
              presentAlert({
                header: "Данные об оплате тура добавлены",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              presentAlert({
                header: "Ошибка",
                subHeader: error.response.statusText,
                message: process_error_hint(error.response),
                buttons: ["Ок"]
              });
            })
            .finally(() => {
              dispatch(tourOrderPaymentTypesR.fetch(auth))
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" onClick={openModal}>
      <IonLabel>Зарегистрировать оплату заказа тура</IonLabel>
    </IonButton>
  )
}