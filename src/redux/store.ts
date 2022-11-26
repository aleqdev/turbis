import { AnyAction, configureStore } from '@reduxjs/toolkit'
import authReducer from './auth'
import employeesReducer from './employees'
import employeeRolesReducer from './employee_roles';
import clientsReducer from './clients';
import clientTypesReducer from './client_types';
import citiesReducer from './cities';
import hotelsReducer from './hotels';
import toursReducer from './tours';
import personsReducer from './persons';
import tourFeedingTypesReducer from './tour_feeding_types';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import thunk, { ThunkDispatch } from 'redux-thunk'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
    employeeRoles: employeeRolesReducer,
    clients: clientsReducer,
    clientTypes: clientTypesReducer,
    cities: citiesReducer,
    hotels: hotelsReducer,
    tours: toursReducer,
    tourFeedingTypes: tourFeedingTypesReducer,
    persons: personsReducer
  },
  middleware: [thunk]
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => ThunkDispatch<RootState, unknown, AnyAction> = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
