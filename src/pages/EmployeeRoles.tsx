import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React from 'react';
import { PutEmployeeRoleModalController } from '../components/employee_role/PutEmployeeRole';
import { PatchWorkerRoleModalController } from '../components/employee_role/PatchEmployeeRole';
import { EmployeeRolesList } from '../components/employee_role/EmployeeRolesList';
import { DeleteWorkerRolesModalController } from '../components/employee_role/DeleteEmployeeRoles';
import { employeeRolesR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(employeeRolesR.fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const employeeRoles = useAppSelector(state => state.employeeRoles);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Роли</IonTitle>
            <IonList>
              {
                (employeeRoles.status === "ok" && employeeRoles.selected.length === 1) ? 
                  <PatchWorkerRoleModalController/>
                  : ""
              }
              {
                (employeeRoles.status === "ok" && employeeRoles.selected.length >= 1) ? 
                  <DeleteWorkerRolesModalController/>
                  : ""
              }
              <PutEmployeeRoleModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <EmployeeRolesList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
