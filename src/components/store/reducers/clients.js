import types from "../types";

const initialState = {
    // Calendario
    client: null,
    loadingClient: false, 
    
}

export default function (state = initialState, action) {
    switch (action.type) {
        // OBTENER TODO EL CALENDARIO
        case types.GET_CLIENT:{
            return {
                ...state,
                client: action.payload,
                loadingClient:false
            }
        }

        case types.GETTING_CLIENT:{
            return {
                ...state,
                loadingClient:action.payload
            }
        }

        
        default:
            return {...state}
    }
}