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
import { AuthProps } from '../interface/props/auth';
import API from '../utils/server';

const Page: React.FC<AuthProps> = (props) => {
  const [selected_employee_roles, set_selected_employee_roles] = useState(Array<EmployeeRole>);

  const [{ data: employee_roles }, refetch_employee_roles]: [{data?: Array<EmployeeRole>}, ...any] = API.use_hook(
    props.auth,
    'employee_role'
  );

  useEffect(
    () => {
      set_selected_employee_roles(s => s.map((selected_employee_role) => {
        return employee_roles?.find((w) => w.id === selected_employee_role.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [employee_roles]
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
                (selected_employee_roles?.length === 1 ) ? 
                  <PatchWorkerRoleModalController auth={props.auth} refetch_employee_roles={refetch_employee_roles} selected_employee_roles={selected_employee_roles}/>
                  : ""
              }
              {
                (selected_employee_roles?.length > 0 ) ? 
                  <DeleteWorkerRolesModalController auth={props.auth} refetch_employee_roles={refetch_employee_roles} selected_employee_roles={selected_employee_roles}/>
                  : ""
              }
              <PutEmployeeRoleModalController auth={props.auth} refetch_employee_roles={refetch_employee_roles} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <EmployeeRolesList auth={props.auth} employee_roles={employee_roles!} on_selected_change={set_selected_employee_roles} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
