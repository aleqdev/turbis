import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React from 'react';
import { PutEmployeeModalController } from '../components/employee/PutEmployee';
import { PatchEmployeesModalController } from '../components/employee/PatchEmployee';
import { DeleteEmployeesModalController } from '../components/employee/DeleteEmployees';
import { EmployeesList } from '../components/employee/EmployeesList';;
import { employeesR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(employeesR.fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const employees = useAppSelector(state => state.employees);
  
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
                (employees.status === "ok" && employees.selected.length === 1) ? 
                  <PatchEmployeesModalController/>
                  : ""
              }
              {
                (employees.status === "ok" && employees.selected.length >= 1) ? 
                  <DeleteEmployeesModalController/>
                  : ""
              }
              <PutEmployeeModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <EmployeesList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
