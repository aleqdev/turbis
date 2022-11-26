import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import React, { useMemo, useRef, useState } from 'react'
import { EmployeeRole } from '../../interface/employee_role';
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import Employee from '../../interface/employee';
import { Person } from '../../interface/person';
import { SelectWithSearchModal } from '../SelectWithSearch';
import { formatPerson } from '../../utils/fmt';
import { useAppSelector } from '../../redux/store';

export function PatchEmployeeModal(
  {auth, selected_employees, onDismiss}: AuthProps & {
    selected_employees: Array<Employee>,
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const employee = selected_employees[0];

  const [roles, setRoles] = React.useState(null as Array<EmployeeRole> | null);
  const [persons, setPersons] = React.useState(null as Array<Person> | null);
  const [inputRole, setInputRole] = useState(null as EmployeeRole | null);
  const [inputPerson, setInputPerson] = useState(null as Person | null);
  const [errorMessage, setErrorMessage] = useState(null as string | null);

  const [presentPersonChoice, dismissPersonChoice] = useIonModal(SelectWithSearchModal, {
    elements: persons,
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

  React.useEffect(() => {
    API
      .get_with_auth(auth, 'employee_role')
      .then((response: any) => setRoles(response.data));
  }, []);

  React.useEffect(() => {
    API
      .get_with_auth(auth, 'person')
      .then((response: any) => setPersons(response.data));
  }, []);

  function confirm() {
    if (inputRole && inputPerson) {
      onDismiss({
        id: employee.id,
        role: inputRole,
        person: inputPerson
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
          <IonTitle>Изменить сотрудника</IonTitle>
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
          <IonLabel position="stacked" >Контактное лицо</IonLabel>
          <IonButton disabled={persons === null} onClick={() => openPersonSelectModal()}>
            {persons === null ? "Загрузка..." : (inputPerson === null ? "Выбрать" : formatPerson(inputPerson))}
          </IonButton>
          <IonLabel position="stacked" >Роль</IonLabel>
          <IonSelect placeholder="Выбрать" onIonChange={(ev) => setInputRole(ev.target.value)}>
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

export interface PatchEmployeeModalControllerProps {
  refetch_employees: RefetchFunction<any, any>,
  selected_employees: Array<Employee>,
}

export const PatchEmployeesModalController: React.FC<PatchEmployeeModalControllerProps> = (props) => {
  const auth = useAppSelector(state => state.auth);
  
  const [present, dismiss] = useIonModal(PatchEmployeeModal, {
    auth: auth!,
    selected_employees: props.selected_employees,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          API
            .patch_with_auth(auth!, `employee?id=eq.${ev.detail.data.id}`, {
              role_id: ev.detail.data.role.id,
              person_id: ev.detail.data.person.id,
            })
            .then((_) => {
              props.refetch_employees();
              presentAlert({
                header: "Данные сотрудника изменены",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_employees();
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
      <IonLabel>Изменить сотрудника</IonLabel>
    </IonButton>
  )
}