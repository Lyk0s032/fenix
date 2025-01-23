import types from "../types";

const initialState = {
    game: null
}

const games = (state = initialState, action) =>{
    switch(action.type){
        case types.A:{
            return {
                ...state,
                game:action.payload
            }
        }
    }
}
export default games;