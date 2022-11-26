import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';
import { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import API from '../../utils/server';
import Employee from '../../interface/employee';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { fetch } from '../../redux/employees';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';

export function DeleteEmployeesModal(
  {selected_employees, onDismiss}: {
    selected_employees: Array<Employee>
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
          <IonTitle>Удаление Сотрудников</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selected_employees, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить сотрудников? (${selected_employees.length})`}</IonText>
        <IonList>
          {selected_employees.map((employee) => {
            return <IonItem key={employee.id}>{`- ${employee.person!.surname} ${employee.person!.name} ${employee.person!.last_name}`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export interface DeleteEmployeesModalControllerProps {
  selected_employees: Array<Employee>,
}

export const DeleteEmployeesModalController: React.FC<DeleteEmployeesModalControllerProps> = (props) => {
  const auth = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();
  
  const [present, dismiss] = useIonModal(DeleteEmployeesModal, {
    selected_employees: props.selected_employees,
    onDismiss: (data: Array<Employee> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          if (auth === null) {
            return presentNoAuthAlert(presentAlert);
          }

          Promise.allSettled(ev.detail.data.map(async (employee: Employee) => {
            await API
              .delete_with_auth(auth, `employee?id=eq.${employee.id}`)
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
              header: "Сотрудники удалены",
              buttons: ["Ок"]
            });
          })
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