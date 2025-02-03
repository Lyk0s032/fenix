import axios from "axios";
import store from "../store";
import types from "../types";
import dayjs from "dayjs";



// LOGIN 
export function GET_USER(user){
    return {
        type: types.GET_USER,
        payload: user
    }
}
export function GETTING_USER(carga){
    return {
        type: types.GETTING_USER,
        payload: carga
    }
}  
export function AxiosAuthUser(token, carga){
    return function(dispatch){ 
        dispatch(GETTING_USER(carga));
        axios.get('sign/user', {  
            headers:{
                'authorization': `Bearer ${token}`
            }
        } )
        .then((res) => {
            dispatch(GET_USER(res.data.user))

        })
        .catch(err => {
            dispatch(GET_USER(null))
            window.localStorage.removeItem('loggedPeople'); 
        })
    }
    
}
// SYSTEM
// NAVEGACION

export function HandleNav(nav){
    return {
        type: types.NAVIGATION,
        payload: nav
    }
}
export function HandleNew(nav){
    return {
        type: types.NEW,
        payload: nav
    }
}

export function handleCliente(data){
    return {
        type: types.CLIENTE,
        payload: data
    }
}

export function HandleAlerta(data, type){
    return function(dispatch){
        dispatch(TypeAlerta(type))
        dispatch(MessageAlerta(data))
        
    }
    
}

export function MessageAlerta(data){
    return {
        type: types.ALERTA,
        payload: data,
    }
}
export function TypeAlerta(type){
    return {
        type: types.TYPE_ALERTA,
        payload: type
    }
}
export function getSystem(data){
    return {
        type: types.GET_SYSTEM,
        payload: data
    }
}

export function gettingSystem(carga){
    return {
        type: types.LOADING_EMBUDO,
        payload: carga
    }
}

export function axiosGetSystem(carga){
    return function(dispatch){ 
            dispatch(gettingSystem(carga))
            axios.get(`/api/prospecto/get/`)
            .then((info) => info.data)
            .then(inf => {
                return dispatch(getSystem(inf))
            })
            .catch((e) => {
                if(e.request){
                    return dispatch(getSystem('notrequest'));
                }else{
                    return dispatch(getSystem(404))
                    
                }
            });
    }
}
// FUNCIONES DEL EMBUDO
// ITEM A GESTIONAR
export function getItem(data){
    return {
        type: types.GET_ITEM,
        payload: data
    }
}
// ITEM A GESTIONAR
export function gettingItem(carga){
    return {
        type: types.GETTING_ITEM,
        payload: carga
    }
}
// FUENTE
export function getFuente(fuente){
    return {
        type: types.GET_FUENTE,
        payload: fuente
    }
}
// PROSPECTOS
export function getProspectos(data){
    return {
        type: types.GET_PROSPECTOS,
        payload: data
    }
}
export function gettingProspectos(carga){
    return {
        type: types.GETTING_PROSPECTOS,
        payload: carga
    }
}

export function axiosToGetProspectos(carga){
    return function(dispatch){ 
            dispatch(gettingProspectos(carga))
            axios.get(`/api/prospecto/getAll`)
            .then((info) => info.data)
            .then(inf => {
                return dispatch(getProspectos(inf))
            })
            .catch((e) => {
                if(e.request){
                    return dispatch(getProspectos('notrequest'));
                }else{
                    return dispatch(getProspectos(404))
                    
                }
            });
    }
}

// LLAMADAS
export function getContactos(data){
    return {
        type: types.GET_CONTACTOS,
        payload: data
    }
}
export function gettingContactos(carga){
    return {
        type: types.GETTING_CONTACTOS,
        payload: carga
    }
}

export function axiosToGetContactos(user, carga){
    return function(dispatch){ 
            dispatch(gettingContactos(carga))
            axios.get(`/api/call/get/${user}`)
            .then((info) => info.data)
            .then(inf => {
                return dispatch(getContactos(inf))
            })
            .catch((e) => {
                if(e.status == 404) dispatch(getContactos(404))
                if(e.request){
                    return dispatch(getContactos('notrequest'));
                }else{
                    return dispatch(getContactos(404))
                    
                }
            });
    }
}
export function axiosToGetCall(callId, carga){
    return function(dispatch){ 
            dispatch(gettingItem(carga))
            axios.get(`/api/call/getCall/${callId}`)
            .then((info) => info.data)
            .then(inf => {
                return dispatch(getItem(inf))
            })
            .catch((e) => {
                if(e.status == 404) dispatch(getItem(404))
                if(e.request){
                    return dispatch(getItem('notrequest'));
                }else{
                    return dispatch(getItem(404))
                    
                }
            });
    }
}
export function axiosToGetVisita(visitaIdd, carga){
    return function(dispatch){ 
            dispatch(gettingItem(carga))
            axios.get(`/api/visitas/getVisita/${visitaIdd}`)
            .then((info) => info.data)
            .then(inf => {
                return dispatch(getItem(inf))
            })
            .catch((e) => {
                if(e.status == 404) dispatch(getItem(404))
                if(e.request){
                    return dispatch(getItem('notrequest'));
                }else{
                    return dispatch(getItem(404))
                    
                }
            });
    }
}


export function axiosToGetCotizacion(cotizacionId, carga){
    return function(dispatch){ 
            dispatch(gettingCotizacion(carga))
            axios.get(`/api/cotizacion/getById/${cotizacionId}`)
            .then((info) => info.data)
            .then(inf => {
                return dispatch(getCotizacion(inf))
            })
            .catch((e) => {
                if(e.status == 404) dispatch(getCotizacion(404))
                if(e.request){
                    return dispatch(getCotizacion('notrequest'));
                }else{
                    return dispatch(getCotizacion(404))
                    
                }
            });
    }
}

// VISITAS
export function getVisitas(data){
    return {
        type: types.GET_VISITAS,
        payload: data
    }
}
export function gettingVisitas(carga){
    return {
        type: types.GETTING_CONTACTOS,
        payload: carga
    }
}

export function axiosToGetVisitas(user, carga){
    return function(dispatch){ 
        dispatch(gettingVisitas(carga))
        axios.get(`/api/visitas/get/${user}`)
        .then((info) =>  info.data)
        .then(inf => {
            return dispatch(getVisitas(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getVisitas('notrequest'));
            }else{
                return dispatch(getVisitas(404))
                
            }
        });
    }
}


// COTIZACIONES
export function getCotizaciones(data){
    return {
        type: types.GET_COTIZACIONES,
        payload: data
    }
}
export function gettingCotizaciones(carga){
    return {
        type: types.GETTING_COTIZACIONES,
        payload: carga
    }
}

export function axiosToGetCotizaciones(user, carga){
    return function(dispatch){ 
        dispatch(gettingCotizaciones(carga))
        axios.get(`api/cotizacion/getAll/${user}`)
        .then((info) => info.data)
        .then(inf => {
            return dispatch(getCotizaciones(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getCotizaciones('notrequest'));
            }else{
                return dispatch(getCotizaciones(404))
                
            }
        });
    }
}


// COTIZACIONES
export function getAprobadas(data){
    return {
        type: types.GET_APROBADAS,
        payload: data
    }
}
export function gettingAprobadas(carga){
    return {
        type: types.GETTING_APROBADAS,
        payload: carga
    }
}

export function axiosToGetAprobadas(user, carga){
    const dia = dayjs();
    const mes = dia.format('MM');
    const year = dia.format('YYYY');
    const day = dia.format('DD');

    const month = day < 6 ? mes - 1 : mes;

    return function(dispatch){ 
        dispatch(gettingAprobadas(carga))
        axios.get(`api/cotizacion/get/embudo/mes/${year}/${month}/${user}`)
        .then((info) => info.data)
        .then(inf => {
            return dispatch(getAprobadas(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getAprobadas('notrequest'));
            }else{
                return dispatch(getAprobadas(404))
                
            }
        });
    }
}

// ITEM A GESTIONAR
export function getCotizacion(data){
    return {
        type: types.GET_COTIZACION,
        payload: data
    }
}

// ITEM A GESTIONAR
export function gettingCotizacion(carga){
    return {
        type: types.GETTING_COTIZACION,
        payload: carga
    }
}

// Cargar embudo
export function AxiosGetAllEmbudo(user, carga){
    return function(dispatch){
        dispatch(axiosToGetVisitas(user, carga))
        dispatch(axiosToGetContactos(user, carga))
        dispatch(axiosToGetProspectos(carga))
        dispatch(axiosToGetCotizaciones(user,carga))
        dispatch(axiosToGetAprobadas(user,carga))

    }
    
}
export function EmbudoLoading(carga){
    return {
        type: types.LOADING_EMBUDO,
        payload: carga
    }
}


// CALENDARIO
export function getCalendar(data){
    return {
        type: types.GET_CALENDAR,
        payload: data
    }
}
export function gettingCalendar(carga){
    return {
        type: types.GETTING_CALENDAR,
        payload: carga
    }
}

export function axiosToGetCalendar(user, carga){
    return function(dispatch){ 
        dispatch(gettingCalendar(carga))
        axios.get(`api/calendario/getAll/${user}`)
        .then((info) => info.data)
        .then(inf => {
            return dispatch(getCalendar(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getCalendar('notrequest'));
            }else{
                return dispatch(getCalendar(404))
                
            }
        });
    }
}
// ITEM DE CALENDARIO
export function getItemCalendar(data){
    return {
        type: types.GET_ITEM_CALENDAR,
        payload: data
    }
}




export function getTime(data){
    return {
        type: types.GET_TIME,
        payload: data
    }
}


// CALENDARIO
export function getClient(data){
    return {
        type: types.GET_CLIENT,
        payload: data
    }
}
export function gettingClient(carga){
    return {
        type: types.GETTING_CLIENT,
        payload: carga
    }
}

export function axiosToGetClient(client, carga){
    return function(dispatch){ 
        dispatch(gettingClient(carga))
        axios.get(`api/clients/get/client/${client}`)
        .then((info) => info.data)
        .then(inf => {
            return dispatch(getClient(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getClient('notrequest'));
            }else{
                return dispatch(getClient(404))
                
            }
        });
    }
}


// CALENDARIO
export function getAsesorPanel(data){
    return {
        type: types.GET_ASESOR,
        payload: data
    }
}
export function gettingAsesor(carga){
    return {
        type: types.GETTING_ASESOR,
        payload: carga
    }
}

export function axiosToGetUser(user, carga){
    return function(dispatch){ 
        dispatch(gettingAsesor(carga))
        axios.get(`api/users/get/${user}`)
        .then((info) => info.data)
        .then(inf => {
            return dispatch(getAsesorPanel(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getAsesorPanel('notrequest'));
            }else{
                return dispatch(getAsesorPanel(404))
                
            }
        });
    }
}


// CALENDARIO
export function getAsesores(data){
    return {
        type: types.GET_ASESORES,
        payload: data
    }
}
export function gettingAsesores(carga){
    return {
        type: types.GETTING_ASESORES,
        payload: carga
    }
}

export function axiosToGetAsesores(user, carga){
    return function(dispatch){ 
        dispatch(gettingAsesores(carga)) 
        axios.get(`api/users/get/all/${user}`)
        .then((info) => info.data)
        .then(inf => {
            return dispatch(getAsesores(inf))
        })
        .catch((e) => {
            if(e.request){
                return dispatch(getAsesores('notrequest'));
            }else{
                return dispatch(getAsesores(404))
                
            }
        });
    }
}
// // MY GAMES
// export function MY_GAMES(data){
//     return {
//         type: types.MY_GAMES,
//         payload: data
//     }
// }
// export function LOADING_MY_GAMES(value){
//     return {
//         type: types.LOADING_MY_GAMES,
//         payload: value
//     }
// } 
// export function axiosToGetMyGames(countId, carga){
//     return function(dispatch){
//         dispatch(LOADING_MY_GAMES(carga))
//         axios.get(`/app/salesperson/${countId}`)
//         .then((info) => info.data)
//         .then(inf => {
//             return dispatch(MY_GAMES(inf))
//         })  
//         .catch((err) => {
//             console.log(err);
//             if(err.request.status == 404){
//                 return dispatch(MY_GAMES(404))
                
//             }else if(err.request.status == 500){
//                 return dispatch(MY_GAMES('notrequest'));
//             }else{
//                 console.log('Ninguno de los dos');
//                 return dispatch(MY_GAMES('notrequest'));

//             }
//         });
//     }
// }




// // GAMES

// export function GAMES(data){
//     return {
//         type: types.GAMES,
//         payload: data
//     }
// }
// export function LOADING_GAMES(value){
//     return {
//         type: types.LOADING_GAMES,
//         payload: value
//     }
// }
// export function GAME_FILTER(array, level){
//     const nuevo = array.filter((item) => item.nivel != level)
//     return {
//         type: types.GAME_FILTER,
//         payload: nuevo 
//     }
// }
// export function axiosToGetGames(countId, carga){
//     return function(dispatch){
//         dispatch(LOADING_GAMES(carga))
//         axios.get(`/app/games/${countId}`)
//         .then((info) => info.data)
//         .then(inf => {
//             return dispatch(GAMES(inf))
//         })
//         .catch((e) => {
//             console.log(e);
//             if(e.request){
//                 return dispatch(GAMES('notrequest'));
//             }else{
//                 return dispatch(GAMES(404))
                
//             }
//         });
//     }
// }

// // SORTEO
// export function SORTEO(data){
//     return {
//         type: types.SORTEO,
//         payload: data
//     }
// }
// export function LOADING_SORTEO(carga){
//     return {
//         type: types.LOADING_SORTEO,
//         payload: carga
//     }
// }
// export function axiosGetSorteo(sorteo, usuario, carga){
//     return function (dispatch){
//         dispatch(LOADING_SORTEO(carga))
//         axios.get(`/app/game/${sorteo}/${usuario}`)
//         .then((info) => info.data)
//         .then(inf => {
//             return dispatch(SORTEO(inf))
//         })
//         .catch((e) => {
//             if(e.request){
//                 return dispatch(SORTEO('notrequest'));
//             }else{
//                 return dispatch(SORTEO(404))
                
//             }
//         });
//     }
// }


// // OBTENER JUEGOS SUSCRITOS AL VENDEDOR
// export function SUBSCRIBED(data){
//     return {
//         type: types.SUBSCRIBED,
//         payload: data
//     }
// }
// export function LOADING_SUBSCRIBED(carga){
//     return {
//         type: types.LOADING_SUBSCRIBED,
//         payload: carga
//     }
// }

// export function axiosGetSuscribe(usuario, carga){
//     return function (dispatch){
//         dispatch(LOADING_SORTEO(carga))
//         axios.get(`/app/games/salesperson/history/${usuario}`)
//         .then((info) => info.data)
//         .then(inf => {
//             return dispatch(SUBSCRIBED(inf))
//         })
//         .catch((e) => {
//             if(e.request){
//                 return dispatch(SUBSCRIBED('notrequest'));
//             }else{
//                 return dispatch(SUBSCRIBED(404))
                
//             }
//         });
//     }
// }

// // OBTENER GAME DESDE EL VENDEDOR
// export function WINNER_GAME(data){
//     return {
//         type: types.WINNER_GAME,
//         payload: data
//     }
// }
// export function LOADING_WINNER(carga){
//     return {
//         type: types.LOADING_WINNER,
//         payload: carga
//     }
// }

// export function axiosGetWinnerGame(usuario,sorteo, carga){
//     return function (dispatch){
//         dispatch(LOADING_WINNER(carga))
//         axios.get(`/app/games/winner/${usuario}/${sorteo}`)
//         .then((info) => info.data)
//         .then(inf => {
//             return dispatch(WINNER_GAME(inf))
//         })
//         .catch((e) => {
//             if(e.request){
//                 return dispatch(WINNER_GAME('notrequest'));
//             }else{
//                 return dispatch(WINNER_GAME(404))
                
//             }
//         });
//     }
// }


// // TIQUETES 
// // OBTENER FACTURA DE TIQUETE
// export function TICKET(data){
//     return {
//         type: types.TICKET,
//         payload: data
//     }
// }
// export function LOADING_TICKET(carga){
//     return {
//         type: types.LOADING_TICKET,
//         payload: carga
//     }
// }
// // Consumimos api para obtener la factura.
// export function axiosGetTicketGame(ticket,carga){
//     return function (dispatch){
//         dispatch(LOADING_TICKET(carga))
//         axios.get(`/app/lottery/ticket/get/${ticket}`)
//         .then((info) => info.data)
//         .then(inf => {
//             console.log(inf);
//             return dispatch(TICKET(inf))
//         })
//         .catch((e) => {
//             if(e.request){
//                 return dispatch(TICKET('notrequest'));
//             }else{
//                 return dispatch(TICKET(404))
                
//             }
//         });
//     }
// }


// // PROFILE
// export function PROFILE(data){
//     return {
//         type: types.PROFILE,
//         payload: data
//     }
// }
// export function LOADING_PROFILE(carga){
//     return {
//         type: types.LOADING_PROFILE,
//         payload: carga
//     }
// }
// // Consumimos api para obtener el perfil.
// export function axiosGetProfile(usuario,carga){
//     return function (dispatch){
//         dispatch(LOADING_PROFILE(carga))
//         axios.get(`/app/money/get/${usuario}`)
//         .then((info) => info.data)
//         .then(inf => {
//             return dispatch(PROFILE(inf))
//         })
//         .catch((e) => {
//             if(e.request){
//                 return dispatch(LOADING_PROFILE('notrequest'));
//             }else{
//                 return dispatch(LOADING_PROFILE(404))
                
//             }
//         });
//     }
