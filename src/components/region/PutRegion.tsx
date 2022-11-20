import { useIonAlert, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import axios from 'axios';
import React, { useRef, useState } from 'react'
import { WorkerRole } from '../../interface/worker_role';
import { OverlayEventDetail } from '@ionic/core/components';

export function PutWorkerModal(
  {onDismiss}: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const [roles, setRoles] = React.useState(null as Array<WorkerRole> | null);
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
      .then((response) => setRoles(response.data));
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

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              Отмена
            </IonButton>
          </IonButtons>
          <IonTitle>Создать Сотрудника</IonTitle>
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
          <IonLabel position="stacked">Имя</IonLabel>
          <IonInput ref={inputName} type="text" placeholder="Введите имя" required/>
          <IonLabel position="stacked">Фамилия</IonLabel>
          <IonInput ref={inputSurname} type="text" placeholder="Введите фамилию" required/>
          <IonLabel position="stacked">Отчество</IonLabel>
          <IonInput ref={inputLastName} type="text" placeholder="Введите отчество" required/>
          <IonLabel position="stacked">Телефон</IonLabel>
          <IonInput ref={inputPhoneNumber} type="text" placeholder="Введите телефон" required/>
          <IonLabel position="stacked">Почта</IonLabel>
          <IonInput ref={inputEmail} type="text" placeholder="Введите почту" required/>
          <IonLabel position="stacked" >Роль</IonLabel>
          <IonSelect  placeholder="Select role" onIonChange={(ev) => setInputRole(ev.target.value)}>
            {
              roles ? 
                roles.map((element) => {
                  return <IonSelectOption key={element.name} value={element}>{element.name}</IonSelectOption>
                }) :
                <IonText>Загрузка...</IonText>
            }
          </IonSelect>
        </IonItem>
      </IonContent>
    </>
  )
}

export const PutWorkerModalController: React.FC = () => {
  const [present, dismiss] = useIonModal(PutWorkerModal, {
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          axios
            .put("https://api.necrom.ru/region", {
              
              db_user_email: "primitive_email@not.even.valid",
              db_user_password: "primitive_password",
            })
            .then((_) => {
              presentAlert({
                header: "Регион добавлен",
                buttons: ["Ок"]
              });
              window.location.reload()
            })
            .catch((error) => {
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
      <IonLabel>Добавить регион</IonLabel>
    </IonButton>
  )
}