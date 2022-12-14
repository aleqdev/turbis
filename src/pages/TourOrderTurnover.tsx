import { IonButtons, IonCol, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonItem, IonLabel, IonMenuButton, IonModal, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';

import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { TourOrderTurnoverR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { TourOrderTurnoverTable } from '../components/tour_order_turnover/TourOrderTurnoverTable';
import API from '../utils/server';
import { Table } from '../components/table_management/Table';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import { TourOrderTurnoverEntry } from '../interface/tour_order_turnover';
import Tour from '../interface/tour';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, ContinuousColorLegend, ContinuousSizeLegend, FlexibleXYPlot, VerticalBarSeries} from 'react-vis';
import {
  // main component
  Chart,
  // graphs
  Bars, Cloud, Dots, Labels, Lines, Pies, RadialLines, Ticks, Title,
  // wrappers
  Layer, Animate, Transform, Handlers,
  // helpers
  DropShadow, Gradient
} from 'rumble-charts';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  return <Page/>
}

const Page: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const turnover = useAppSelector(state => state.tourOrderTurnover);
  const [tours, setTours] = React.useState([] as any);
  const [date_begin, setDate_begin] = React.useState(new Date(0));
  const [date_end, setDate_end] = React.useState(new Date(8640000000000000));
  const date_begin_str = date_begin.toISOString();
  const date_end_str = date_end.toISOString();
  useEffect(() => {
    dispatch(TourOrderTurnoverR.fetch(auth!))
  }, []);
  useEffect(() => {
    const fetchEntries = API.get_with_auth(auth!, `tour?select=*,ordered:tour_order(*),selled:tour_order_purchase(people_count),hotel(*,city(*,region(*,country(*)))),feeding_type:tour_feeding_type(*)&ordered.crt_date=gte.${date_begin_str}&ordered.crt_date=lte.${date_end_str}&selled.crt_date=gte.${date_begin_str}&selled.crt_date=lte.${date_end_str}`).then((value) => {setTours((value as any).data)});
  }, [date_begin, date_end]);

  function changeFromDate(ev:any) {
    setDate_begin(new Date(ev.detail.value))
  }
  function changeEndDate(ev:any){
    setDate_end(new Date(ev.detail.value))
  }
  function sum_people_cnt(array:any){
    let value = 0; 
    array.forEach((element:any) => { value = value + element.people_count})
    return value;
  }
  const listColumns = [
    {
      name: "Тур",
      selector: "hotel.name",
      sortable: true,
      wrap: true
    },
    {
      name: "Кол-во заказов",
      selector: "ordered",
      sortable: true,
      wrap: true,
      cell: (ev:any) => `${sum_people_cnt(ev.ordered)}`
    },
    {
      name: "Кол-во продаж",
      selector: "selled",
      sortable: true,
      wrap: true,
      cell: (ev:any) => `${sum_people_cnt(ev.selled)}`
    },
  ];

  
  function getDiaram(data2:any) {
    console.log(data2)
    let dataDiagram:any = [
      0
      // {data: [1,2,3], name: 'Oleg'},
      // {data: [3,4,5], name: 'Maksim'}
    ]
    
    let ticks:any = [
      {label: 'Начало', x: 0}
      // {label: 'Mon Dec 12 2022 23:50:01 GMT+0300 (Москва, стандартное время)', x: 0}
    ]
    let ticks2:any = []
    data2.ordered.forEach((element:any, ind:any) => {
      console.log(element)
      ticks.push({label: 'Кол-во человек: ' + element.people_count.toString()+ '  ' + element.crt_date.toLocaleString("ru", {year: 'numeric',month: 'long', day: 'numeric',}), x: ind + 1})
      // ticks2.push({label: element.people_count, y: ind})
      dataDiagram.push(element.people_count)
    });
    
    return <Chart
    series={[
      {
        data: dataDiagram
      }
    ]}
    viewBox="0 0 300 150"
  >
    <Handlers
      distance="x"
      onMouseLeave={function noRefCheck(){}}
      onMouseMove={function noRefCheck(){}}
    >
      <Layer
        height="68%"
        position="middle center"
        width="100%"
      >
        < Dots label='a'/>
        <Labels
          dotStyle={{
            dominantBaseline: 'text-after-edge',
            fontFamily: 'sans-serif',
            fontSize: '0.65em',
            textAnchor: 'middle'
          }}
          label={function noRefCheck(){}}
          labelAttributes={{
            y: -2
          }}

    />
        <Lines
          colors={[
            '#007696'
          ]}
          interpolation="cardinal"
          lineAttributes={{
            strokeLinecap: 'round',
            strokeWidth: 5
          }}
          lineWidth={0}
        />
        
        <Ticks
      axis="y"
      labelAttributes={{
        x: 10
      }}
      labelStyle={{
        dominantBaseline: 'middle',
        fill: 'lightgray',
        textAnchor: 'end',
        // fill: '#000',
        fontFamily: 'sans-serif',
        fontSize: 10,
      }}
      lineLength="50%"
      lineStyle={{
        stroke: 'lightgray'
      }}
      ticks={ticks2}
      lineVisible={false}
    />
        <Ticks
          axis="x"
          labelAttributes={{
            y: '2em',
          }}
          labelStyle={{
            dominantBaseline: 'text-after-edge',
            fill: '#000',
            fontFamily: 'sans-serif',
            fontSize: 4,
            fontWeight: 'normal',
            textAnchor: 'middle'
          }}
          ticks={ticks}
        />
      </Layer>
    </Handlers>
  </Chart>
  //   return <XYPlot
  //   width={300}
  //   height={300}>
  //   <HorizontalGridLines />
  //   {/* <LineSeries
  //     data={dataDiagram} startTitle="Диаграмма 2" /> */}
  // <FlexibleXYPlot>
  //     <VerticalBarSeries data={dataDiagram} />
  // </FlexibleXYPlot>
  //   {/* <XAxis title="Дата"/>
  //   <YAxis title="Кол-во заказов"/> */}
  // </XYPlot>
  }
    
  
  const ExpandedDiagram = ({ data }: { data: any}) => {
    return (
      <IonGrid>
        <IonGrid>
          <IonRow>
            <IonCol>{'ID:'}</IonCol>
            <IonCol size='10'>{data.id}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>{'Диаграмма заказов:'}</IonCol>
            <IonCol size='10'>
              {getDiaram(data)}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonGrid>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines='none'>
            <IonTitle>Отчёт компании</IonTitle>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        { 
          (turnover.status === "ok") ? 
            <IonText>
              <h2>
                Количество полученных денежных средств на счету компании: <span style={{color: 'red'}}>{turnover.data.total_money_received}</span> рублей
              </h2>
            </IonText>
            : <IonTitle>Загрузка...</IonTitle>
        }
        <br /><br /><IonTitle>Период отчета</IonTitle>
        <IonItem lines='none'>
          <IonLabel position="stacked">Начальная дата выборки (пока дату не менять, будет показана вся информация за все время)</IonLabel>
          <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
          <IonModal keepContentsMounted={true}>
            <IonDatetime onIonChange={ev => changeFromDate(ev)} presentation='date' id="datetime"></IonDatetime>
          </IonModal>
      </IonItem>
      <IonItem lines='none'>
        <IonLabel position="stacked">Конечная дата выборки</IonLabel>
        <IonDatetimeButton datetime="datetime2"></IonDatetimeButton>
        <IonModal keepContentsMounted={true}>
          <IonDatetime onIonChange={ev => changeEndDate(ev)} presentation='date' id="datetime2"></IonDatetime>
        </IonModal>
      </IonItem>
      
      <IonList>
      {
        (tours.status === "loading") ? <IonTitle>Загрузка...</IonTitle> :
        (tours.status === "err") ? <IonTitle>Ошибка загрузки</IonTitle> :
          <DataTableExtensions
            columns={listColumns as any}
            data={tours ?? tours.data}
            print={true}
            export={true}
            exportHeaders={true}
            fileName={'Отчет об оборотах туров'}
            filterPlaceholder="Поиск"
          >
          <DataTable
            title="Сведенья об оборотах туров:"
            columns={listColumns as any}
            data={tours ?? tours.data}
            defaultSortFieldId="name"
            pagination
            highlightOnHover
            noDataComponent="Пусто"
            paginationComponentOptions={{rowsPerPageText: "Высота таблицы"}}
            expandableRows
            expandableRowsComponent={ExpandedDiagram}
          />
         </DataTableExtensions>
      }
    </IonList>
        <IonItem lines='none'>
          <span style={{color: 'gray'}}>Нажмите `Ctrl`+`R` для обновления данных</span>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
