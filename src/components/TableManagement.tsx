export {}
/*
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { process_error_hint } from "../utils/process_erros_hints";
import API from "../utils/server";

export interface TableManagementParams<
  T1 extends React.Component,
  T2 extends React.Component,
  T3 extends React.Component,
  T4 extends React.Component
> {
  listComponent: T1,
  putComponent: T2,
  patchComponent: T3,
  deleteComponent: T4,
  title: string
}

export function TableManagement<
  DataTy,
  T1 extends React.Component,
  T2 extends React.Component,
  T3 extends React.Component,
  T4 extends React.Component
> (
  {
    listComponent,
    putComponent,
    patchComponent,
    deleteComponent,
    title
  }: TableManagementParams<T1, T2, T3, T4>
) {
  const [selected_items, set_selected_items] = useState(Array<DataTy>);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>{title}</IonTitle>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {listComponent}
      </IonContent>
    </IonPage>
  );
}

export type PutComponentParams<ModalParams, ModalResults, ModalState> = {
  title: string,
  successTitle: string,
  buttonTitle: string,
  requestPath: string,
  modalInit: (params: ModalParams) => ModalState,
  modalPage: (params: ModalParams, state: ModalState) => any,
  modalOnDismiss: (results: ModalResults, response: string | undefined, presentAlert: (ReturnType<typeof useIonAlert>)[0]) => undefined,
  modalConfirm: (params: ModalParams, state: ModalState) => boolean,
  modalPrepareResults: (params: ModalParams, state: ModalState) => ModalResults,
  cancelTitle?: string,
  confirmTitle?: string,
}

export function createPutComponent<Props, ModalResults, ModalState>(
  {
    title,
    buttonTitle,
    modalInit,
    modalPage,
    modalOnDismiss,
    modalConfirm,
    modalPrepareResults,
    cancelTitle,
    confirmTitle
  }: PutComponentParams<{
    onDismiss: (data?: object | null, role?: string) => void,
    props: Props
  }, ModalResults | null, ModalState>
) {
  const modal = (params: {
    onDismiss: (data?: object | null, role?: string) => void,
    props: Props
  }) => {

    const state = modalInit(params);

    function confirm() {
      if (modalConfirm(params, state)) {
        params.onDismiss(modalPrepareResults(params, state) as any, 'confirm');
      }
    }

    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => {params.onDismiss(null, "cancel")}}>
                {cancelTitle ?? "Отмена"}
              </IonButton>
            </IonButtons>
            <IonTitle>{title}</IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={confirm}>
                {confirmTitle ?? "Подтвердить"}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonItem>
            {modalPage(params, state)}
          </IonItem>
        </IonContent>
      </>
    )
  };

  return (props: Props) => {
    const [present, dismiss] = useIonModal(modal, {
      params: {
        props: props,
      },
      onDismiss: (data: object | null, role: string) => dismiss(data, role),
    });
    const [presentAlert] = useIonAlert();
  
    function openModal() {
      present({
        onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
          modalOnDismiss(ev.detail.data, ev.detail.role, presentAlert)
        },
      });
    }
  
    return (
      <IonButton routerDirection="none" onClick={openModal}>
        <IonLabel>{buttonTitle}</IonLabel>
      </IonButton>
    )
  }
}

export type ListComponentParams = {
  title: string,
  columns: {
    name: string;
    selector: string;
    sortable: boolean;
    cell?: undefined;
  }[],
  loadingComponent: () => any,
  expandableComponent?: ({ data }: { data: any }) => any,
  defaultSort?: string
}

export function createListComponent<DataTy>(
  {
    title,
    columns,
    loadingComponent,
    expandableComponent,
    defaultSort,
  }: ListComponentParams
) {
  return (props: {
    elements: Array<DataTy>,
    set_selected_elements: Dispatch<SetStateAction<Array<DataTy>>>,
    clear_selected_elements_trigger: boolean
  }) => {
    return (
      <IonList>
        {
          (props.elements === null) ?
            <IonTitle>{loadingComponent()}</IonTitle> :
            <DataTableExtensions
              columns={columns}
              data={props.elements}
              print={false}
              export={false}
              filterPlaceholder="Поиск"
            >
              <DataTable
                title={title}
                columns={columns as any}
                data={props.elements}
                defaultSortFieldId={defaultSort ?? "id"}
                onSelectedRowsChange={({selectedRows}) => props.set_selected_elements(selectedRows)}
                pagination
                selectableRows
                expandableRows={true}
                expandableRowsComponent={expandableComponent}
                clearSelectedRows={props.clear_selected_elements_trigger}
              />
            </DataTableExtensions>
        }
      </IonList>
    );
  }
}
*/