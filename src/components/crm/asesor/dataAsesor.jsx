import React, { useEffect, useState } from 'react';
import Llamadas from './lista/llamadas';
import Visitas from './lista/visitas';
import CotizacionesByUser from './lista/cotizaciones';
import PendientesByUser from './lista/pendientes';
import DesarrolloByUser from './lista/desarrollo';
import * as actions from '../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import GeneralUser from '../clients/client/group/general';
import AnalisisUser from './lista/analisis';
import MetaAdd from './meta';

export default function PanelAsesor(){
    const [params, setParams] = useSearchParams();
    const [options, setOptions] = useState(null);

    const dispatch = useDispatch();
    const usuario = useSelector(store => store.usuario);
    const { asesor, loadingAsesor } = usuario;

    const [visualizar, setVisualizar] = useState(null);
    useEffect(() => {
        if(params.get('watch')){
            dispatch(actions.axiosToGetUser(params.get('watch'), true))
        }
    },[params.get('watch')])
    return (
        <div className="asesorComponent">
            {
                !params.get('watch') ?
                    <div className="notFound">
                        <h1>Selecciona un asesor</h1>
                    </div>
                :
                loadingAsesor || !asesor ?
                    <div className="notFound">
                        <h3>Cargando...</h3>
                    </div>
                :
                asesor == 404 || asesor == 'request' ?
                    <div className="notFound">
                        <h1>No encontrado</h1>
                    </div>
                :
                <div className="containerComponent">
                    <div className="topDataUser">
                        <div className="containerTop">
                            <div className="user">
                                <div className="containerUser">
                                    <div className="photo">
                                        <img src={asesor.photo} alt="" />
                                    </div>
                                    <div className="dataUser">
                                        <h3>{asesor.name}</h3> 
                                        <span className='phone'>{asesor.phone}</span><br />
                                        <span className='phone'>{asesor.email}</span><br />
                                        <span className='calle'>{asesor.direccion}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="resultMonth">
                                <button onClick={() => {
                                    params.set('meta', 'add')
                                    setParams(params);
                                }}>
                                    <span>Definir meta del mes actual</span>
                                </button>
                            </div>
                        </div>
                        <div className="navigationUserPanel">
                            <nav>
                                <ul>
                                    <li className={!visualizar ? 'Active' : null}
                                    onClick={() => setVisualizar(null)}>
                                        <div>
                                            <span>General</span>
                                        </div>
                                    </li>
                                    <li className={visualizar == 'analisis' ? 'Active' : null}
                                    onClick={() => setVisualizar('analisis')}>
                                        <div>
                                            <span>Analisís y metas</span>
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    {console.log(asesor)}
                    <div className="filterByMonth">
                        {
                            !visualizar ? 
                                <GeneralUser usuario={usuario} cotizaciones={asesor.cotizacions} />
                            :
                                <AnalisisUser usuario={asesor}/>
                        }
                        </div>
                </div>
            }
            {
                params.get('meta') == 'add' ?
                    <MetaAdd usuario={asesor} />
                : null
            }
        </div>
    )
}