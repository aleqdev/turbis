import { AnyAction, configureStore } from '@reduxjs/toolkit'
import authReducer from './auth'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import thunk, { ThunkDispatch } from 'redux-thunk'
import { makeReducer } from './ctor/table_manageable'
import Employee from '../interface/employee'
import EmployeeRole from '../interface/employee_role'
import Client from '../interface/client'
import ClientType from '../interface/client_type'
import City from '../interface/city'
import Hotel from '../interface/hotel'
import Tour from '../interface/tour'
import TourFeedingType from '../interface/tour_feeding_type'
import Person from '../interface/person'

export const employeesR = makeReducer<Employee, string, string>("employees", "employee?select=*,person(*),role:employee_role(*)");
export const employeeRolesR = makeReducer<EmployeeRole, string, string>("employee_roles", "employee_role");
export const clientsR = makeReducer<Client, string, string>("clients", "client?select=*,person(*),type:client_type(*)");
export const clientTypesR = makeReducer<ClientType, string, string>("client_types", "client_type");
export const citiesR = makeReducer<City, string, string>("cities", "city?select=*,region(*,country(*))");
export const hotelsR = makeReducer<Hotel, string, string>("hotels", "hotel?select=*,city(*,region(*,country(*))),owner:person(*)");
export const toursR = makeReducer<Tour, string, string>("tours", "tour?select=*,hotel(*,city(*,region(*,country(*)))),feeding_type:tour_feeding_type(*)");
export const tourFeedingTypesR = makeReducer<TourFeedingType, string, string>("tour_feeding_types", "tour_feeding_type");
export const personsR = makeReducer<Person, string, string>("persons", "person");

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesR.reducer,
    employeeRoles: employeeRolesR.reducer,
    clients: clientsR.reducer,
    clientTypes: clientTypesR.reducer,
    cities: citiesR.reducer,
    hotels: hotelsR.reducer,
    tours: toursR.reducer,
    tourFeedingTypes: tourFeedingTypesR.reducer,
    persons: personsR.reducer,
  },
  middleware: [thunk]
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => ThunkDispatch<RootState, unknown, AnyAction> = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
