import { useIonAlert, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonModal, IonGrid, IonRow, IonCol } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import { SelectWithSearchModal } from '../SelectWithSearch';
import Client from '../../interface/client';
import { formatClient, formatPerson } from '../../utils/fmt';
import ClientType from '../../interface/client_type';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { clientsR, clientTypesR, personsR } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import Person from '../../interface/person';
import Tour from '../../interface/tour';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css'
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

  
  const listColumns:any = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
      wrap: true
    },
    {
      name: "Описание тура",
      selector: "tour",
      sortable: true,
      wrap: true,
      cell: (e: Tour) => <h6 className='desc_tour'>{e.description.slice(0, 50)}...</h6>
    },
    {
      name: "Цена",
      selector: "price",
      sortable: true,
      wrap: true,
      // cell: (e: Tour) => `${e.cost}`
    },
    {
      name: "Кол-во человек",
      selector: "people_count",
      sortable: true,
      wrap: true
    },
    {
      name: "Стоимость",
      selector: "cost",
      sortable: true,
      wrap: true,
      cell: (e: any) => `${e.price * e.people_count} руб.`
    },
  ];

  function selectRowsCallback(ev:any){
    console.log(ev)
  }
  
  const ExpandedTour = ({ data }: { data: any}) => {
    return (
      <IonGrid>
        <IonGrid>
          <IonRow>
            <IonCol>{'ID:'}</IonCol>
            <IonCol size='10'>{data.id}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>{'Отель тура:'}</IonCol>
            <IonCol size='10'>{data.hotel}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>{'Описание тура:'}</IonCol>
            <IonCol size='10'>{data.description}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>{'Общая стоимость:'}</IonCol>
            <IonCol size='10'>{`${data.price * data.people_count} руб.`}</IonCol>
          </IonRow>
        </IonGrid>
      </IonGrid>
    );
  }
  const data:any = [
    {id:1, hotel: 'Palazzo 4*', description: 'Путешествовать экономно — легко. Отель «Гостиница Ковров» расположен в Коврове. Этот отель находится в самом центре города. Перед сном есть возможность прогуляться вдоль главных достопримечательностей. Рядом с отелем — Борисоглебский собор, Церковь Бориса и Глеба и Свято-Васильевский Монастырь.В отеле Время вспомнить о хлебе насущном! Для гостей работает ресторан. Кафе отеля — удобное место для перекуса.', price: 10000, people_count: 2}
  ]
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
          
          <IonButton routerDirection="none" >
            Добавить тур для заказа
          </IonButton>
          <DataTable
            title={'Список туров для заказа'}
            columns={listColumns}
            data={data}
            defaultSortFieldId="name"
            onSelectedRowsChange={(ev) => selectRowsCallback(ev)}
            pagination
            selectableRows
            highlightOnHover
            // clearSelectedRows={clearSelectedRowsTrigger}
            noDataComponent="Пусто"
            paginationComponentOptions={{rowsPerPageText: "Высота таблицы"}}
            expandableRows
            expandableRowsComponent={ExpandedTour}
          />
      
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

/*
const PutE = createPutComponent<AuthProps, unknown, unknown>(
  {
    title: "Добавить сотрудника",
    successTitle: "Сотрудник добавлен",
    buttonTitle: "Добавить сотрудника",
    requestPath: "employee",
    modalInit: (params) => {
      const [roles, setRoles] = React.useState(null as Array<EmployeeRole> | null);
      const inputName = useRef<HTMLIonInputElement>(null);
      const inputSurname = useRef<HTMLIonInputElement>(null);
      const inputLastName = useRef<HTMLIonInputElement>(null);
      const inputEmail = useRef<HTMLIonInputElement>(null);
      const inputPhoneNumber = useRef<HTMLIonInputElement>(null);
      const [inputRole, setInputRole] = useState(null as EmployeeRole | null);
      const [errorMessage, setErrorMessage] = useState(null as string | null);

      React.useEffect(() => {
        API
          .get_with_auth(params.props.auth, 'employee_role')
          .then((response: any) => setRoles(response.data));
      }, []);

      return 
    },
    modalPage: () => {},
    modalOnDismiss: (results: any, response: string | undefined) => undefined,
    modalConfirm: (params: any, state: void) => {
      const name = inputName.current?.value;
      const surname = inputSurname.current?.value
      const last_name = inputLastName.current?.value
      const email = inputEmail.current?.value;
      const phone_number = inputPhoneNumber.current?.value;

      if (name && surname && last_name && email && phone_number && inputRole) {
        params.onDismiss({
          name,
          surname,
          last_name,
          email,
          phone_number,
          role: inputRole
        }, 'confirm');
      } else {
        setErrorMessage("Не все поля заполнены!")
      }
    },
    modalPrepareResults: (params) => {

    }
  }
)*/