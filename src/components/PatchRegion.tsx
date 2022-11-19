import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import axios from 'axios';
import React, { Dispatch, useRef, useState } from 'react'
import { WorkerRole } from '../interface/worker_role';
import { OverlayEventDetail } from '@ionic/core/components';
import { WorkerJoinedFetch } from '../interface/worker';
import { RegionJoinedFetch } from '../interface/region';

export function PatchRegionModal(
  {selected_regions, onDismiss}: {
    selected_regions: Array<RegionJoinedFetch>,
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const region = selected_regions[0];
//   const prevRole = {id: worker.role_id, name: worker.role_name};

//   const [roles, setRoles] = React.useState(null as Array<WorkerRole> | null);
  const inputName = useRef<HTMLIonInputElement>(null);
  const inputCountryName = useRef<HTMLIonInputElement>(null);
//   const [inputRole, setInputRole] = useState(prevRole as WorkerRole | null);
  const [errorMessage, setErrorMessage] = useState(null as string | null);

//   React.useEffect(() => {
//     axios
//       .get("https://api.necrom.ru/worker_role")
//       .then((response) => setRoles(response.data));
//   }, []);

  function confirm() {
    const name = inputName.current?.value;
    const country_name = inputCountryName.current?.value

    if (name && country_name) {
      onDismiss({
        name,
        country_name,
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
          <IonTitle>Изменить Регион</IonTitle>
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
          <IonLabel position="stacked">Регион</IonLabel>
          <IonInput ref={inputName} type="text" placeholder="Введите Регион" value={region.name} required/>
          <IonLabel position="stacked">Страна</IonLabel>
          <IonInput ref={inputCountryName} type="text" placeholder="Введите Страна" value={region.country_name} required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export interface PatchRegionModalControllerProps {
    selected_regions: Array<RegionJoinedFetch>,
    set_selected_region: Dispatch<React.SetStateAction<Array<RegionJoinedFetch>>>
}

export const PatchRegionModalController: React.FC<PatchRegionModalControllerProps> = (props) => {
  const [present, dismiss] = useIonModal(PatchRegionModal, {
    selected_regions: props.selected_regions,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          props.set_selected_region([]);
          axios
            .patch(`https://api.necrom.ru/worker/${props.selected_regions[0].id}`, {
              name: ev.detail.data.name,
              surname: ev.detail.data.surname,
              last_name: ev.detail.data.last_name,
              email: ev.detail.data.email,
              phone_number: ev.detail.data.phone_number,
              role_id: ev.detail.data.input_role.id,
              db_user_email: "primitive_email@not.even.valid",
              db_user_password: "primitive_password",
            })
            .then((_) => {
              presentAlert({
                header: "Данные сотрудника изменены",
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
    <IonButton routerDirection="none" color="secondary" onClick={openModal}>
      <IonLabel>Изменить сотрудника</IonLabel>
    </IonButton>
  )
}