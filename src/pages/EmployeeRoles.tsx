import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { EmployeeRole } from '../interface/employee_role';
import { PutEmployeeRoleModalController } from '../components/employee_role/PutEmployeeRole';
import { PatchWorkerRoleModalController } from '../components/employee_role/PatchEmployeeRole';
import { EmployeeRolesList } from '../components/employee_role/EmployeeRolesList';
import { DeleteWorkerRolesModalController } from '../components/employee_role/DeleteEmployeeRoles';
import { useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { fetch } from '../redux/employee_roles';

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
  const employeeRoles = useAppSelector(state => state.employeeRoles);

  const [selectedEmployeeRoles, setSelectedEmployeeRoles] = useState(Array<EmployeeRole>);

  useEffect(
    () => {
      if (employeeRoles.status !== "ok") {
        return
      }

      setSelectedEmployeeRoles(s => s.map((selected_employee_role) => {
        return employeeRoles.data.find((w) => w.id === selected_employee_role.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [employeeRoles]
  );
  
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
                (selectedEmployeeRoles?.length === 1 ) ? 
                  <PatchWorkerRoleModalController selected_employee_roles={selectedEmployeeRoles}/>
                  : ""
              }
              {
                (selectedEmployeeRoles?.length > 0 ) ? 
                  <DeleteWorkerRolesModalController selected_employee_roles={selectedEmployeeRoles}/>
                  : ""
              }
              <PutEmployeeRoleModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <EmployeeRolesList on_selected_change={setSelectedEmployeeRoles} />
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
