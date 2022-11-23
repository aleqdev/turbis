import { useIonAlert, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonModal, IonDatetime, IonTextarea } from '@ionic/react';
import axios from 'axios';
import React, { useRef, useState } from 'react'
import { EmployeeRole } from '../../interface/employee_role';
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import CurrencyInput from 'react-currency-input-field';
import { AuthProps } from '../../interface/props/auth';

/*
export function PutWorkerModal(
  {onDismiss}: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const [hotels, setHotels] = React.useState(null as Array<EmployeeRole> | null);
  const inputName = useRef<HTMLIonInputElement>(null);
  const inputSurname = useRef<HTMLIonInputElement>(null);
  const inputLastName = useRef<HTMLIonInputElement>(null);
  const inputEmail = useRef<HTMLIonInputElement>(null);
  const inputPhoneNumber = useRef<HTMLIonInputElement>(null);
  const [inputRole, setInputRole] = useState(null as WorkerRole | null);
  const [errorMessage, setErrorMessage] = useState(null as string | null);

  React.useEffect(() => {
    axios
      .get("https://api.necrom.ru/worker_role")
      .then((response) => setHotels(response.data));
  }, [])
  

  function confirm() {
    const name = inputName.current?.value;
    const surname = inputSurname.current?.value
    const last_name = inputLastName.current?.value
    const email = inputEmail.current?.value;
    const phone_number = inputPhoneNumber.current?.value;

    if (name && surname && last_name && email && phone_number && inputRole) {
      onDismiss({
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
  }

  
  const [tagInputVal, setTagInputVal] = useState("");
  function onChangeTagInput(e:any) {
    if (e.target.value.split('.')[1].length > 2) {
      e.target.value = e.target.value.split('.')[0] + '.' + e.target.value.split('.')[1].slice(0, 2)
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
          <IonTitle>Создать тур</IonTitle>
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
          <IonLabel position="stacked" >Отель</IonLabel>
          <IonSelect placeholder="Выбрать" onIonChange={(ev) => setInputRole(ev.target.value)}>
            {
              hotels ? 
                hotels.map((element) => {
                  return <IonSelectOption key={element.name} value={element}>{element.name}</IonSelectOption>
                }) :
                <IonText>Загрузка...</IonText>
            }
          </IonSelect>
          <IonDatetime presentation="date"><span slot="title">Дата заезда</span></IonDatetime>
          <IonDatetime presentation="date" ><span slot="title">Дата выезда</span></IonDatetime>
          
          <IonLabel position="stacked" >Вид питания</IonLabel>
          <IonSelect placeholder="Выбрать" onIonChange={(ev) => setInputRole(ev.target.value)}>
            <IonSelectOption key={'Без питания'} value={'Без питания'}>{'Без питания'}</IonSelectOption>
            <IonSelectOption key={'С завтраком'} value={'С завтраком'}>{'С завтраком'}</IonSelectOption>
            <IonSelectOption key={'3-х разовое'} value={'3-х разовое'}>{'3-х разовое'}</IonSelectOption>
          </IonSelect>
          {/* <IonLabel position="stacked">Фамилия</IonLabel>
          <IonInput ref={inputSurname} clearInput={true} type="text" placeholder="Введите фамилию" required/>
          <IonLabel position="stacked">Отчество</IonLabel>
          <IonInput ref={inputLastName} clearInput={true} type="text" placeholder="Введите отчество" required/>
          <IonLabel position="stacked">Телефон</IonLabel>
          <IonInput ref={inputPhoneNumber} clearInput={true} type="text" placeholder="Введите телефон" required/> */}
          {/* <IonInput type="text" value={''} onKeyPress={(event) => { if (!/[0-9.]/.test(event.key) && (event?.target as HTMLInputElement)?.value.match(/\./g)?.length == 1) { event.preventDefault();}}} onIonChange={(e) => onChangeTagInput(e)} step="0.01" placeholder="0.00"></IonInput> */}
          <CurrencyInput
            placeholder="Введите стоимость тура"
            decimalsLimit={2}
            decimalSeparator='.'
            suffix=' ₽'
            // onValueChange={(value:any, name:any) => console.log(value, name)}
          />
          <IonLabel position="stacked">Описание тура</IonLabel>
          <IonTextarea ref={inputDescription} auto-grow={true} placeholder="Введите описание" required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export interface PutWorkerModalControllerProps {
  refetch_workers: RefetchFunction<any, any>,
}

export const PutTourModalController: React.FC<PutWorkerModalControllerProps & AuthProps> = (props) => {
  const [present, dismiss] = useIonModal(PutWorkerModal, {
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          axios
            .put("https://api.necrom.ru/worker", {
              name: ev.detail.data.name,
              surname: ev.detail.data.surname,
              last_name: ev.detail.data.last_name,
              email: ev.detail.data.email,
              phone_number: ev.detail.data.phone_number,
              role_id: ev.detail.data.role.id,
              db_user_email: "primitive_email@not.even.valid",
              db_user_password: "primitive_password",
            })
            .then((_) => {
              props.refetch_workers();
              presentAlert({
                header: "Тур добавлен",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_workers();
              presentAlert({
                header: "Ошибка",
                subHeader: error.response.statusText,
                message: error.response.data,
                buttons: ["Ок"]
              });
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" onClick={openModal}>
      <IonLabel>Добавить тур</IonLabel>
    </IonButton>
  )
}
