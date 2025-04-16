import React, { useEffect, useRef } from 'react';
import Calendary from './routeCalendar';
import * as actions from './../../store/action/action';
import { useDispatch, useSelector,  } from 'react-redux';

export default function RouteCalendar(props){
    const user = props.user
    const dispatch = useDispatch();
    const calendary = useSelector(store => store.calendar);
    const usuarios = useSelector(store => store.usuario)
    const { calendar, loadingCalendar } = calendary;
    
    const changeAsesor = async (user) => {
        dispatch(actions.axiosToGetCalendar(user, false))
    }
    useEffect(() => {
        dispatch(actions.axiosToGetCalendar(user.id, true))
            dispatch(actions.axiosToGetAsesores(user.id, true)) 
    
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
            <div className="divAllCalendary">
                <div className="filterUser">
                    {
                        user == 'lider' ? 
                        <select name="" id="" onChange={(e) => {
                            dispatch(actions.axiosToGetCalendar(e.target.value, false))
                        }}>
                            <option value={user.id}>Mi calendario</option>
                            {
                                usuarios.asesores && usuarios.asesores.length ?
                                    usuarios.asesores.map((us, i) => {
                                        return (
                                            <option value={us.id}>{`${us.name} ${us.lastName}`}</option>
                                        )
                                    })
                                : null
                            }

                        </select>
                        :
                        <select name="" id="" onChange={(e) => {
                            changeAsesor(e.target.value)
                        }}>
                            {
                                user.rango == 'lider' ?
                                <option value="">Selecciona asesor</option>
                                :null
                            }
                            {
                                usuarios.asesores && usuarios.asesores.map((u, i) => {
                                    return (
                                        <option value={u.id}>{u.name} {u.lastName}</option>
                                    )
                                })
                            }
                        </select>
                    }
                </div>
                <Calendary user={user} calendar={calendar} />
            </div>
    )
}