import React, { useEffect } from "react";
import Nav from "./nav";
import { Route, Routes, useSearchParams } from "react-router-dom";
import RouteEmbudo from "./embudo/routeEmbudo";
import * as actions from './../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import Alerta from "./embudo/alerta";
import ModalNewFuente from "./embudo/modales/newFuente";
import ModalNewContact from "./embudo/modales/newContacto";
import Calendary from "./calendary/calendary";
import RouteCalendar from "./calendary/calendary";
import RoutesClients from "./clients/clientesRoute";
import RouteAsesor from "./asesor/routeAsesor";
import ModalSeeOnline from "./embudo/modales/newFuenteOnline";
export default function RoutePanel(props){
    const user = props.user;
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const sistema = useSelector(store => store.system);
    const { loadingSystem, system, alerta } = sistema;
    useEffect(() => {
        dispatch(actions.axiosGetSystem(true))
    }, []) 
    return (
        loadingSystem || !system ? 
            <div className="loadingPanel">
                <div className="containerLoading">
                    <h1>Accediendo...</h1>
                    <span>Estamos cargando la información básica...</span>
                </div>
            </div>
        :
        <div className="routesPanel">
            {alerta ? <Alerta /> : null}
            {params.get('add') == 'offline' ? <ModalNewFuente /> : null}
            {params.get('add') == 'contacto' ? <ModalNewContact user={user} /> : null} 
            {params.get('add') == 'online' ?  <ModalSeeOnline /> : null}

            <div className="container">
                <div className="generalNav">
                    <Nav user={user} />
                </div>
                <div className="crm">
                    <Routes>
                        <Route path="/*" element={<RouteEmbudo user={user} />} />
                        <Route path="/calendar/*" element={<RouteCalendar  user={user}/>} />
                        <Route path="/clients/*" element={<RoutesClients user={user}/>} />
                        <Route path="/asesores/*" element={<RouteAsesor user={user} />} />

                    </Routes>
                </div>
            </div>
        </div>
    )
}