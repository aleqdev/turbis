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
import API from '../utils/server';
import { AuthProps } from '../interface/props/auth';
import Employee from '../interface/employee';

const Page: React.FC<AuthProps> = (props) => {
  const [selected_employees, set_selected_employees] = useState(Array<Employee>);
  const [clear_selection_trigger, set_clear_selection_trigger] = useState(false);

  const [{ data: employees }, refetch_employees]: [{data?: Array<Employee>}, ...any] = API.use_hook(
    props.auth,
    'employee?select=*,person(*),role:employee_role(*)'
  );

  useEffect(
    () => {
      set_selected_employees(s => s.map((selected_employee) => {
        return employees?.find((w) => w.id === selected_employee.id)
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
                  <PatchEmployeesModalController auth={props.auth} refetch_employees={refetch_employees} selected_employees={selected_employees}/>
                  : ""
              }
              {
                (selected_employees?.length > 0 ) ? 
                  <DeleteEmployeesModalController auth={props.auth} refetch_employees={refetch_employees} selected_employees={selected_employees}/>
                  : ""
              }
              <PutEmployeeModalController auth={props.auth} refetch_workers={refetch_employees} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <EmployeesList auth={props.auth} clear_selection_trigger={clear_selection_trigger} employees={employees!} on_selected_change={set_selected_employees} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
