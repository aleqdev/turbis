import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import React, { useRef, useState } from 'react'
import { EmployeeRole } from '../../interface/employee_role';
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import { useAppSelector } from '../../redux/store';

export function PatchEmployeeRoleModal(
  {selected_employee_roles, onDismiss}: {
    selected_employee_roles: Array<EmployeeRole>,
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const employee_role = selected_employee_roles[0];

  const inputName = useRef<HTMLIonInputElement>(null);

  const [errorMessage, setErrorMessage] = useState(null as string | null);

  function confirm() {
    const name = inputName.current?.value;

    if (name) {
      onDismiss({
        id: employee_role.id,
        name,
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
          <IonTitle>Изменить Роль</IonTitle>
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
          <IonLabel position="stacked">Название</IonLabel>
          <IonInput ref={inputName} type="text" placeholder="Введите название" value={employee_role.name} required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export interface PatchWorkerRoleModalControllerProps {
  refetch_employee_roles: RefetchFunction<any, any>,
  selected_employee_roles: Array<EmployeeRole>,
}

export const PatchWorkerRoleModalController: React.FC<PatchWorkerRoleModalControllerProps> = (props) => {
  const auth = useAppSelector(state => state.auth);
  
  const [present, dismiss] = useIonModal(PatchEmployeeRoleModal, {
    selected_employee_roles: props.selected_employee_roles,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          API
            .patch_with_auth(auth!, `employee_role?id=eq.${ev.detail.data.id}`, {
              name: ev.detail.data.name,
            })
            .then((_) => {
              props.refetch_employee_roles();
              presentAlert({
                header: "Данные роли изменены",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_employee_roles();
              presentAlert({
                header: "Ошибка",
                subHeader: error.response.statusText,
                message: process_error_hint(error.response),
                buttons: ["Ок"]
              });
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" color="secondary" onClick={openModal}>
      <IonLabel>Изменить роль</IonLabel>
    </IonButton>
  )
}