import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import { citiesR, clientsR, personsR, tourOrderPaymentTypesR, tourOrderPurchasesR, toursR, useAppDispatch, useAppSelector } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import { tourOrdersR } from '../../redux/store';
import { SelectWithSearchModal } from '../SelectWithSearch';
import TourOrder from '../../interface/tour_order';
import Person from '../../interface/person';
import Client from '../../interface/client';
import TourOrderPaymentType from '../../interface/tour_order_payment_type';
import Tour from '../../interface/tour';
import { isNaturalNumber } from '../../utils/checks';
import { DatabaseAuth } from '../../interface/database_auth';

export function PutTourOrderPurchaseModal(
  {auth, onDismiss}: AuthProps & {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const [tourOrderPaymentTypes, persons, tours] = useAppSelector(state => [state.tourOrderPaymentTypes, state.persons, state.tours]);
  const dispatch = useAppDispatch();

  const [inputPaymentType, setInputPaymentType] = useState(null as TourOrderPaymentType | null);
  const [inputClient, setInputClient] = useState(null as Client | null);
  const [inputPeopleCount, setInputPeopleCount] = useState(0 as number);
  const [inputTourPrice, setInputTourPrice] = useState(0 as number | null);
  const [inputTour, setInputTour] = useState(null as Tour | null);
  const [inputReservationsConfirmed, setInputReservationsConfirmed] = useState(false);
  const [inputTourOrder, setInputTourOrder] = useState(null as TourOrder | null);

  const [totalCost, setTotalCost] = useState(null as number | null);
  const [errorMessage, setErrorMessage] = useState(null as string | null);
  
  const [presentClientChoice, dismissClientChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const clients = useAppSelector(state => state.clients)
      return clients.status === "ok" ? clients.data : null
    },
    title: "Выберите клиента",
    formatter: Client.format,
    sorter: (e: Client, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value + 
          +e.person!.name.toLowerCase().includes(element) + 10 * +(e.person!.name.toLowerCase() === element) + 
          +e.person!.surname.toLowerCase().includes(element) + 10 * +(e.person!.surname.toLowerCase() === element) +
          +e.person!.last_name.toLowerCase().includes(element) + 10 * +(e.person!.last_name.toLowerCase() === element);
      }, 0);
    },
    keyer: (e: Client) => e.id,
    onDismiss: (data: object | null, role: string) => dismissClientChoice(data, role),
  });

  const [presentPaymentTypeChoice, dismissPaymentTypeChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const tourOrderPaymentTypes = useAppSelector(state => state.tourOrderPaymentTypes)
      return tourOrderPaymentTypes.status === "ok" ? tourOrderPaymentTypes.data : null
    },
    title: "Выберите тип оплаты",
    formatter: TourOrderPaymentType.format,
    sorter: (e: TourOrderPaymentType, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value + 
          +e.name.toLowerCase().includes(element) + 10 * +(e.name.toLowerCase() === element)
      }, 0);
    },
    keyer: (e: TourOrderPaymentType) => e.id,
    onDismiss: (data: object | null, role: string) => dismissPaymentTypeChoice(data, role),
  });

  function openPaymentTypeSelectModal() {
    presentPaymentTypeChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setInputPaymentType(ev.detail.data.value);
        }
      },
    });
  }

  function openPersonSelectModal() {
    presentClientChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setInputClient(ev.detail.data.value);
        }
      },
    });
  }

  useEffect(() => {
    dispatch(clientsR.fetch(auth));
    dispatch(personsR.fetch(auth));
    dispatch(toursR.fetch(auth));
    dispatch(citiesR.fetch(auth));
    dispatch(tourOrderPaymentTypesR.fetch(auth));
    dispatch(tourOrdersR.fetch(auth));
  }, []);

  function confirm() {
    if (inputPaymentType && inputClient && inputTourOrder) {
      onDismiss({
        client_id: inputClient.id,
        payment_type_id: inputPaymentType.id,
        tour_id: inputTour!.id,
        price: inputTourPrice,
        people_count: inputPeopleCount,
        group_id: 1,
        reservations_confirmed: inputReservationsConfirmed,
        tour_order: inputTourOrder
      }, 'confirm');
    } else {
      setErrorMessage("Не все поля заполнены!")
    }
  }

  const tourOrders = useAppSelector(state => state.tourOrders);

  const [presentTourOrderChoice, dismissTourOrderChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const toursOrders = useAppSelector(state => state.tourOrders)
      return toursOrders.status === "ok" ? toursOrders.data : null
    },
    title: "Выберите заказ",
    formatter: (e: TourOrder) => `Заказ №${e.group_id} ${e.cost} руб. <${e!.payment_type!.name}> ${Person.format(e.client?.person!)}`,
    sorter: (e: TourOrder, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return +
          +e.tour!.hotel!.name.toLowerCase().includes(element) + 10 * +(e.tour!.hotel!.name.toLowerCase() === element) + 
          +e.tour!.hotel!.city!.name.toLowerCase().includes(element) + 10 * +(e.tour!.hotel!.city!.name.toLowerCase() === element)
      }, 0);
    },
    keyer: (e: TourOrder) => e.id,
    onDismiss: (data: object | null, role: string) => dismissTourOrderChoice(data, role),
  });

  const [presentTourChoice, dismissTourChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const tour = useAppSelector(state => state.tours)
      return tour.status === "ok" ? tour.data : null
    },
    title: "Выберите тур",
    formatter: Tour.format,
    sorter: (e: Tour, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value +
          +e.hotel!.name!.toLowerCase().includes(element) + 
          +e.hotel!.city!.name!.toLowerCase().includes(element) +
          +e.price!.toString().toLowerCase().includes(element);
      }, 0);
    },
    keyer: (e: Tour) => e.id,
    onDismiss: (data: object | null, role: string) => dismissTourChoice(data, role),
  });

  function openTourSelectModal() {
    presentTourChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setInputTour(ev.detail.data.value);
        }
      },
    });
  }

  function openTourOrderSelectModal() {
    presentTourOrderChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          const order: TourOrder = ev.detail.data.value;
          setInputTour(order.tour!);
          setInputPeopleCount(order.people_count);
          setInputTourPrice(order.price);
          setInputClient(order.client!);
          setInputPaymentType(order.payment_type!);
          setInputReservationsConfirmed(false);
          setInputTourOrder(order);
        }
      },
    });
  }

  useEffect(() => {
    if (inputTour !== null) {
      setInputTourPrice(inputTour.price);
    }
  }, [inputTour]);

  useEffect(() => {
    if (inputTourPrice !== null && isNaturalNumber(inputPeopleCount)) {
      setTotalCost(Number((inputTourPrice * inputPeopleCount).toFixed(2)));
    }
  }, [inputTourPrice, inputPeopleCount]);

  function handlePeopleCountChange(text: string) {
    if (isNaturalNumber(text)) {
      setInputPeopleCount(Number(text))
    } else {
      setInputPeopleCount(Math.floor(Number(text)))
      setErrorMessage("Кол-во человек должно быть натуральным значением!");
    }
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              Отмена
            </IonButton>
          </IonButtons>
          <IonItem lines='none'>
            <IonTitle>Продажа заказа</IonTitle>
            <IonButton disabled={tourOrders === null} onClick={() => openTourOrderSelectModal()}>
              {tourOrders === null ? "Загрузка..." : "Заполнить"}
            </IonButton>
          </IonItem>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              Зарегистрировать
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
      <IonItem lines='none'>
          {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
          <IonLabel position="stacked">Клиент</IonLabel>
          <IonButton disabled={persons === null} onClick={() => openPersonSelectModal()}>
            {persons === null ? "Загрузка..." : (inputClient === null ? "Выбрать" : Client.format(inputClient))}
          </IonButton>
          <IonLabel position="stacked">Вид оплаты</IonLabel>
          <IonButton disabled={tourOrderPaymentTypes === null} onClick={() => openPaymentTypeSelectModal()}>
            {tourOrderPaymentTypes === null ? "Загрузка..." : (inputPaymentType === null ? "Выбрать" : TourOrderPaymentType.format(inputPaymentType))}
          </IonButton>
        </IonItem>
        <IonItem lines='none'>
            {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
            <IonLabel position="stacked">Тур: </IonLabel>
              <IonButton disabled={tours === null} onClick={() => openTourSelectModal()}>
                {tours === null ? "Загрузка..." : (inputTour === null ? "Выбрать" : Tour.format(inputTour))}
              </IonButton>
            <IonLabel position="stacked" >Цена (в рублях)</IonLabel><br/>
            <IonInput type="number" value={inputTourPrice} onIonChange={((event) =>{setInputTourPrice(Number(event.detail.value))})}/>
            <IonLabel position="stacked" >Кол-во человек</IonLabel><br/>
            <IonInput type="number" inputmode="numeric" value={inputPeopleCount} onIonChange={(event) =>{handlePeopleCountChange(event.detail.value!)}}/>
            <IonLabel position="stacked" >Общая стоимость</IonLabel><br/>
            <IonInput value={totalCost === null ? "" : `= ${totalCost}₽`} disabled/>
        </IonItem>
        <IonItem lines='none'>
          <IonCheckbox slot="start" onIonChange={(ev) => setInputReservationsConfirmed(ev.detail.checked)}></IonCheckbox>
          <IonLabel>Бронь номеров подтверждена в отеле</IonLabel>
        </IonItem>
      </IonContent>
    </>
  )
}

export const PutTourOrderPurchaseModalController: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(tourOrdersR.fetch(auth as DatabaseAuth));
  }, []);
  
  const [present, dismiss] = useIonModal(PutTourOrderPurchaseModal, {
    auth,
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
          API
            .post_with_auth(auth!, `tour_order_purchase`, {
              client_id: ev.detail.data.client_id,
              payment_type_id: ev.detail.data.payment_type_id,
              tour_id: ev.detail.data.tour_id,
              price: ev.detail.data.price,
              people_count: ev.detail.data.people_count,
              group_id: ev.detail.data.group_id,
              reservations_confirmed: ev.detail.data.reservations_confirmed
            })
            .then(async (_) => {
              await API
                .patch_with_auth(auth!, `tour_order?id=eq.${ev.detail.data.tour_order.id}`, {
                  status: ev.detail.data.tour_order.status === "only-selled" ? "completed" : "only-purchased"
                })
            })
            .then((_) => {
              presentAlert({
                header: "Данные о продаже тура добавлены",
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
              dispatch(tourOrderPurchasesR.fetch(auth))
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" onClick={openModal}>
      <IonLabel>Зарегистрировать продажу заказа тура</IonLabel>
    </IonButton>
  )
}