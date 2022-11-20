import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import axios from 'axios';
import React, { useMemo, useRef, useState } from 'react'
import { WorkerRole } from '../../interface/worker_role';
import { OverlayEventDetail } from '@ionic/core/components';
import { WorkerJoinedFetch } from '../../interface/worker';
import { RefetchFunction } from 'axios-hooks'

export function PatchWorkerModal(
  {selected_workers, onDismiss}: {
    selected_workers: Array<WorkerJoinedFetch>,
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const worker = selected_workers[0];
  const prevRole = useMemo(() => {return {id: worker.role_id, name: worker.role_name}}, [worker]);

  const [roles, setRoles] = React.useState(null as Array<WorkerRole> | null);
  const inputName = useRef<HTMLIonInputElement>(null);
  const inputSurname = useRef<HTMLIonInputElement>(null);
  const inputLastName = useRef<HTMLIonInputElement>(null);
  const inputEmail = useRef<HTMLIonInputElement>(null);
  const inputPhoneNumber = useRef<HTMLIonInputElement>(null);
  const inputRole = useRef<HTMLIonSelectElement>(null);

  const [errorMessage, setErrorMessage] = useState(null as string | null);

  React.useEffect(() => {
    if (inputRole.current !== null) {
      inputRole.current.value = prevRole;
    }

    axios
      .get("https://api.necrom.ru/worker_role")
      .then((response) => setRoles(response.data));
  }, [prevRole]);

  function confirm() {
    const name = inputName.current?.value;
    const surname = inputSurname.current?.value
    const last_name = inputLastName.current?.value
    const email = inputEmail.current?.value;
    const phone_number = inputPhoneNumber.current?.value;
    const input_role = inputRole.current?.value;

    if (name && surname && last_name && email && phone_number && input_role) {
      onDismiss({
        id: worker.id,
        name,
        surname,
        last_name,
        email,
        phone_number,
        role: input_role
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
          <IonTitle>Изменить Сотрудника</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              Изменить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
          <IonLabel position="stacked">Имя</IonLabel>
          <IonInput ref={inputName} type="text" placeholder="Введите имя" value={worker.name} required/>
          <IonLabel position="stacked">Фамилия</IonLabel>
          <IonInput ref={inputSurname} type="text" placeholder="Введите фамилию" value={worker.surname} required/>
          <IonLabel position="stacked">Отчество</IonLabel>
          <IonInput ref={inputLastName} type="text" placeholder="Введите отчество" value={worker.last_name} required/>
          <IonLabel position="stacked">Телефон</IonLabel>
          <IonInput ref={inputPhoneNumber} type="text" placeholder="Введите телефон" value={worker.phone_number} required/>
          <IonLabel position="stacked">Почта</IonLabel>
          <IonInput ref={inputEmail} type="text" placeholder="Введите почту" value={worker.email} required/>
          <IonLabel position="stacked" >Роль</IonLabel>
          <IonSelect ref={inputRole} placeholder="Выбрать">
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

export interface PatchWorkerModalControllerProps {
  refetch_workers: RefetchFunction<any, any>,
  selected_workers: Array<WorkerJoinedFetch>,
}

export const PatchWorkerModalController: React.FC<PatchWorkerModalControllerProps> = (props) => {
  const [present, dismiss] = useIonModal(PatchWorkerModal, {
    selected_workers: props.selected_workers,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          axios
            .patch(`https://api.necrom.ru/worker/${ev.detail.data.id}`, {
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
                header: "Данные сотрудника изменены",
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
    <IonButton routerDirection="none" color="secondary" onClick={openModal}>
      <IonLabel>Изменить сотрудника</IonLabel>
    </IonButton>
  )
}