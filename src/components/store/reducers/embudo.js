import dayjs from "dayjs";
import types from "../types";

const day = dayjs();
const initialState = {
    loadingEmbudo: true,

    item: null,
    loadingItem: false,
    fuente: null,
    prospectos: null,
    loadingProspectos: false,

    contactos: null, 
    loadingContactos: false,

    visitas: null,
    loadingVisitas: false,

    cotizaciones: null,
    loadingCotizaciones: false,

    cotizacion: null,
    loadingCotizacion: false,

    aprobadas: null,
    loadingAprobadas: false,

    espera: null,
    loadingEspera: false,

    perdido: null,
    loadingPerdido: false,
    time: `${day.format('YYYY-MM-6')}`
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.GET_TIME: {
            return {
                ...state,
                time: action.payload
            }
        }
        case types.GET_ITEM: {
            return {
                ...state, 
                item: action.payload,
                loadingItem: false
            }
        }
        case types.GETTING_ITEM:{
            return {
                ...state, 
                loadingItem: action.payload
            }
        }
        case types.LOADING_EMBUDO: {
            return {
                ...state,
                loadingEmbudo: action.payload
            }
        }
        case types.GET_FUENTE: {
            return {
                ...state,
                fuente: action.payload
            }
        }
        case types.GET_PROSPECTOS:{
            return {
                ...state,
                prospectos: action.payload,
                loadingProspectos:false
            }
        }
        case types.GETTING_PROSPECTOS: {
            return {
                ...state,
                loadingProspectos: action.payload
            }
        }

        case types.GET_CONTACTOS:{
            return {
                ...state,
                contactos: action.payload,
                loadingContactos:false
            }
        }
        case types.GETTING_CONTACTOS: {
            return {
                ...state,
                loadingContactos: action.payload
            }
        }

        case types.GET_VISITAS:{
            return {
                ...state,
                visitas: action.payload,
                loadingVisitas:false
            }
        }
        case types.GETTING_VISITAS: {
            return {
                ...state,
                loadingVisitas: action.payload
            }
        }
        case types.GET_COTIZACIONES:{
            return {
                ...state,
                cotizaciones: action.payload,
                loadingCotizaciones:false
            }
        }
        case types.GETTING_COTIZACIONES: {
            return { 
                ...state,
                loadingCotizaciones: action.payload
            }
        }
        case types.GET_APROBADAS:{
            return {
                ...state,
                aprobadas: action.payload,
                loadingAprobadas:false
            }
        }
        case types.GETTING_APROBADAS: {
            return { 
                ...state,
                loadingAprobadas: action.payload
            }
        }
        case types.GET_COTIZACION:{
            return {
                ...state, 
                cotizacion: action.payload,
                loadingCotizacion: false 
            }
        }
        case types.GETTING_COTIZACION:{
            return {
                ...state, 
                loadingCotizacion: action.payload 
            }
        }
        case types.USER:{
            return {
                ...state,
                user: action.payload
            }
        }
        case types.AVATARS:{
            return  {
                ...state,
                avatars: action.payload
            }
        }
        default:
            return {...state}
    }
}