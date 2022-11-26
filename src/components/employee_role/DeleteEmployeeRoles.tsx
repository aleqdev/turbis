import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';
import { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import { EmployeeRole } from '../../interface/employee_role';
import API from '../../utils/server';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import { fetch } from '../../redux/employee_roles';

export function DeleteEmployeeRolesModal(
  {selected_employee_roles, onDismiss}: {
    selected_employee_roles: Array<EmployeeRole>
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
          <IonTitle>Удаление Ролей</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selected_employee_roles, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить роли? (${selected_employee_roles.length})`}</IonText>
        <IonList>
          {selected_employee_roles.map((role) => {
            return <IonItem key={role.id}>{`- ${role.name}`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export interface DeleteWorkerRolesModalControllerProps {
  selected_employee_roles: Array<EmployeeRole>,
}

export const DeleteWorkerRolesModalController: React.FC<DeleteWorkerRolesModalControllerProps> = (props) => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const [present, dismiss] = useIonModal(DeleteEmployeeRolesModal, {
    selected_employee_roles: props.selected_employee_roles,
    onDismiss: (data: Array<EmployeeRole> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          if (auth === null) {
            return presentNoAuthAlert(presentAlert);
          }

          Promise.allSettled(ev.detail.data.map(async (role: EmployeeRole) => {
            await API
              .delete_with_auth(auth, `employee_role?id=eq.${role.id}`)
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status === "rejected" && result.reason instanceof AxiosError) {
                dispatch(fetch(auth));
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response!),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            dispatch(fetch(auth));
            presentAlert({
              header: "Роли удалены",
              buttons: ["Ок"]
            });
          });
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