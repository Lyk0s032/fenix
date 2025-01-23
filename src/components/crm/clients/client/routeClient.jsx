import React, { useEffect } from 'react';
import ProfileFuncion from './profileClient';
import ClientDash from './clientDash';
import CotizacionSee from './cotizacion';
import EditClient from './editClient';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';

export default function RouteClient(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();

    const { id } = useParams();
    const clients = useSelector(store => store.clients);
    
    const { client, loadingClient } = clients;
    useEffect(() => { 
        dispatch(actions.axiosToGetClient(id, true));
    }, [id]) 
    return (
        loadingClient || !client ?
            <div className="loading">
                <h1>Cargando...</h1>
            </div>
        : client == 404 ?
            <div className="notFound">
                <h1>No hemos encontrado esto</h1>
            </div>
        :
        <div className="client">
            
            <div className="containerClient">
                <div className="left">
                    <ProfileFuncion client={client} />
                </div>
                <div className="right">
                    <ClientDash client={client}/>
                </div>
            </div>

            <CotizacionSee />

            { 
                params.get('d') == 'edit' ?
                    <EditClient client={client} />
                : null
            }
        </div>
    )
}


