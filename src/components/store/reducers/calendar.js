import types from "../types";

const initialState = {
    // Calendario
    calendar: null,
    loadingCalendar: false, 
    
    itemCalendar: null,
    loadingItemCalendar:null,

}

export default function (state = initialState, action) {
    switch (action.type) {
        // OBTENER TODO EL CALENDARIO
        case types.GET_CALENDAR:{
            return {
                ...state,
                calendar: action.payload,
                loadingCalendar:false
            }
        }

        case types.GETTING_CALENDAR:{
            return {
                ...state,
                loadingCalendar:action.payload
            }
        }
        // NAVEGACION PANEL IZQUIERDO
        case types.GET_ITEM_CALENDAR:{
            return {
                ...state,
                itemCalendar: action.payload
            }
        }
        
        default:
            return {...state}
    }
}