import React, { useEffect, useRef } from 'react';
import Calendary from './routeCalendar';
import * as actions from './../../store/action/action';
import { useDispatch, useSelector,  } from 'react-redux';

export default function RouteCalendar(props){
    const user = props.user
    const dispatch = useDispatch();
    const calendary = useSelector(store => store.calendar);
    const { calendar, loadingCalendar } = calendary;

    useEffect(() => {
        dispatch(actions.axiosToGetCalendar(user.id, true))
    }, [])
    return (
            !calendar || loadingCalendar ?
                <div className="loading">
                    <div className="containerLoading">
                        <h3>Cargando</h3>
                        <span>Un momento, estamos recogiendo datos del calendario.</span>
                    </div>
                </div> 
            :
            calendar == 404 || calendar == 'notrequest' ?
            <div className="loading">
                <div className="containerLoading">
                    <h3>Ups!</h3>
                    <span>No hemos encontrado información en el calendario para mostrar</span>
                </div>
            </div>
            :
            <Calendary user={user} calendar={calendar} />
    )
}