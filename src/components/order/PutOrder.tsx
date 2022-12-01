import { useIonAlert, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonModal, IonGrid, IonRow, IonCol, IonList } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API, { get_with_auth } from '../../utils/server';
import { SelectWithSearchModal } from '../SelectWithSearch';
import Client from '../../interface/client';
import { formatClient, formatPerson } from '../../utils/fmt';
import ClientType from '../../interface/client_type';
import { citiesR, toursR, useAppDispatch, useAppSelector } from '../../redux/store';
import { clientsR, clientTypesR, personsR } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import Person from '../../interface/person';
import Tour from '../../interface/tour';
import CurrencyInput from 'react-currency-input-field';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css'
import Hotel from '../../interface/hotel';
import { SelectModal } from './SelectModal';
//import { createPutComponent } from '../TableManagement';

export function PutOrderModal(
  {auth, onDismiss}: AuthProps & {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const [clientTypes, persons] = useAppSelector(state => [state.clientTypes, state.persons]);
  const dispatch = useAppDispatch();

  const [inputType, setInputType] = useState(null as ClientType | null);
  const [inputPerson, setInputPerson] = useState(null as Person | null);
  const [errorMessage, setErrorMessage] = useState(null as string | null);
  const [inputAllSum, setInputAllSum] = useState(0)
  const [toursAll, setToursAll] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [presentPersonChoice, dismissPersonChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const persons = useAppSelector(state => state.persons)
      return persons.status === "ok" ? persons.data : null
    },
    title: "Выберите контактное лицо",
    formatter: formatPerson,
    sorter: (e: Person, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value + 
          +e.name.toLowerCase().includes(element) + 10 * +(e.name.toLowerCase() === element) + 
          +e.surname.toLowerCase().includes(element) + 10 * +(e.surname.toLowerCase() === element) +
          +e.last_name.toLowerCase().includes(element) + 10 * +(e.last_name.toLowerCase() === element);
      }, 0);
    },
    keyer: (e: Person) => e.id,
    onDismiss: (data: object | null, role: string) => dismissPersonChoice(data, role),
  });

  function openPersonSelectModal() {
    presentPersonChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setInputPerson(ev.detail.data.value);
        }
      },
    });
  }

  useEffect(() => {
    dispatch(clientTypesR.fetch(auth));
    dispatch(personsR.fetch(auth));
    dispatch(toursR.fetch(auth))
    dispatch(citiesR.fetch(auth));
  }, []);

  function confirm() {
    if (inputType && inputPerson) {
      onDismiss({
        person: inputPerson,
        type: inputType
      }, 'confirm');
    } else {
      setErrorMessage("Не все поля заполнены!")
    }
  }

  
  // const listColumns:any = [
  //   {
  //     name: "ID",
  //     selector: "id",
  //     sortable: true,
  //     wrap: true
  //   },
  //   {
  //     name: "Описание тура",
  //     selector: "tour",
  //     sortable: true,
  //     wrap: true,
  //     cell: (e: Tour) => <h6 className='desc_tour'>{e.description.slice(0, 50)}...</h6>
  //   },
  //   {
  //     name: "Цена",
  //     selector: "price",
  //     sortable: true,
  //     wrap: true,
  //     // cell: (e: Tour) => `${e.cost}`
  //   },
  //   {
  //     name: "Кол-во человек",
  //     selector: "people_count",
  //     sortable: true,
  //     wrap: true
  //   },
  //   {
  //     name: "Стоимость",
  //     selector: "cost",
  //     sortable: true,
  //     wrap: true,
  //     cell: (e: any) => `${e.price * e.people_count} руб.`
  //   },
  // ];
  
  // const ExpandedTour = ({ data }: { data: any}) => {
  //   return (
  //     <IonGrid>
  //       <IonGrid>
  //         <IonRow>
  //           <IonCol>{'ID:'}</IonCol>
  //           <IonCol size='10'>{data.id}</IonCol>
  //         </IonRow>
  //         <IonRow>
  //           <IonCol>{'Отель тура:'}</IonCol>
  //           <IonCol size='10'>{data.hotel}</IonCol>
  //         </IonRow>
  //         <IonRow>
  //           <IonCol>{'Описание тура:'}</IonCol>
  //           <IonCol size='10'>{data.description}</IonCol>
  //         </IonRow>
  //         <IonRow>
  //           <IonCol>{'Общая стоимость:'}</IonCol>
  //           <IonCol size='10'>{`${data.price * data.people_count} руб.`}</IonCol>
  //         </IonRow>
  //       </IonGrid>
  //     </IonGrid>
  //   );
  // }

  const [inputTourOrder, setInputTourOrder] = React.useState(null);
  const [presentHotelChoice, dismissHotelChoice] = useIonModal(SelectModal, {
    acquirer: () => {
      const tours = useAppSelector(state => state.tours)
      return tours.status === "ok" ? tours.data : null
    },
    title: "Добавить тур для заказа",
    formatter: (e: Tour) => `Тур от отеля ${e.hotel?.name} Стоимость: ${e.cost} руб.`,
    keyer: (e: Tour) => e.id,
    onDismiss: (data: object | null, role: string) => dismissHotelChoice(data, role),
  });


  function openTourOrderSelectModal() {
    presentHotelChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          console.log(ev.detail)
          setInputAllSum(inputAllSum + Number(ev.detail.data.totalCost2))
          // setInputTourOrder(ev.detail.data);
        }
      },
    });
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
          <IonTitle>Добавить заказ</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              Создать
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
          <IonLabel position="stacked" >Клиент</IonLabel>
          <IonButton disabled={persons === null} onClick={() => openPersonSelectModal()}>
            {persons === null ? "Загрузка..." : (inputPerson === null ? "Выбрать" : formatPerson(inputPerson))}
          </IonButton>
          <IonLabel position="stacked" >Вид оплаты</IonLabel>
          <IonSelect interfaceOptions={{
            header: 'Вид оплаты',
            message: 'Выберите предпочтительный вид оплаты',
            translucent: true,
          }} placeholder="Выбрать" onIonChange={(ev) => setInputType(ev.target.value)}>
                <IonSelectOption key={"Предоплата"} value={"Предоплата"}>{"Предоплата"}</IonSelectOption>
                <IonSelectOption key={"Кредит"} value={"Кредит"}>{"Кредит"}</IonSelectOption>
          </IonSelect>
          <IonList>
              <IonButton routerDirection="none" onClick={() => openTourOrderSelectModal()}>
                Добавить тур для заказа
              </IonButton>
              {
                (selectedRows.length !== 0) ? 
                <IonButton color='danger' routerDirection="none" >
                    Удалить
                </IonButton> : ""
              }
          </IonList>
      
        </IonItem>
        <IonItem>
          <IonLabel position="stacked" >Общая стоимость заказа.</IonLabel>
          <CurrencyInput suffix="₽" disabled value={inputAllSum}></CurrencyInput>
        </IonItem>
      </IonContent>
    </>
  )
}

export const PutOrderModalController: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [present, dismiss] = useIonModal(PutOrderModal, {
    auth: auth!,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    console.log('good');
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          if (auth === null) {
            return presentNoAuthAlert(presentAlert);
          }
          
          API
            .post_with_auth(auth!, 'client', {
              person_id: ev.detail.data.person.id,
              type_id: ev.detail.data.type.id
            })
            .then((_) => {
              presentAlert({
                header: "Заказ добавлен",
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
              dispatch(clientsR.fetch(auth));
            });
        } 
        
      },
    });
  }

  return (
    <IonButton routerDirection="none" onClick={openModal}>
      <IonLabel>Добавить заказ</IonLabel>
    </IonButton>
  )
}