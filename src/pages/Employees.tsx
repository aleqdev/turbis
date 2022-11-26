import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { PutEmployeeModalController } from '../components/employee/PutEmployee';
import { PatchEmployeesModalController } from '../components/employee/PatchEmployee';
import { DeleteEmployeesModalController } from '../components/employee/DeleteEmployees';
import { EmployeesList } from '../components/employee/EmployeesList';
import Employee from '../interface/employee';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetch } from '../redux/employees';
import NoAuth from '../components/composite/no_auth';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const employees = useAppSelector(state => state.employees);

  const [selected_employees, set_selected_employees] = useState(Array<Employee>);
  const [clear_selection_trigger, set_clear_selection_trigger] = useState(false);

  useEffect(
    () => {
      if (employees.status !== "ok") {
        return;
      }

      set_selected_employees(s => s.map((selected_employee) => {
        return employees.data.find((w) => w.id === selected_employee.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [employees]
  );

  useEffect(
    () => {
      set_clear_selection_trigger(s => !s);
    },
    [employees]
  )
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Сотрудники</IonTitle>
            <IonList>
              {
                (selected_employees?.length === 1 ) ? 
                  <PatchEmployeesModalController selected_employees={selected_employees}/>
                  : ""
              }
              {
                (selected_employees?.length > 0 ) ? 
                  <DeleteEmployeesModalController selected_employees={selected_employees}/>
                  : ""
              }
              <PutEmployeeModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <EmployeesList clear_selection_trigger={clear_selection_trigger} on_selected_change={set_selected_employees} />
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
