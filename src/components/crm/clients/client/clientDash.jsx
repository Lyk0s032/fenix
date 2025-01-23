import React, { useState } from 'react';
import MonthAnalisis from './group/monthAnalisis';
import CotizacionesListClient from './group/cotizaciones';
import { useSearchParams } from 'react-router-dom';
import Year from './group/year';
import { MdOutlineModeEdit } from 'react-icons/md';

export default function ClientDash(props){
    const client = props.client;
    const [visualizar, setVisualizar] = useState('analisis');
    const [params, setParams] = useSearchParams();
    return (
        <div className="clientDash">
            <div className="containerDash">
                <div className="navTopDash">
                    <div className="containerDashTop">
                        <nav>
                            <ul>
                                <li className={visualizar == 'analisis' ? 'Active' : null} 
                                onClick={() => setVisualizar('analisis')}>
                                    <div>
                                        <span>General</span>
                                    </div>
                                </li>
                                <li className={visualizar == 'pendientes' ? 'Active' : null} 
                                onClick={() => setVisualizar('pendientes')}>
                                    <div>
                                        <span>Pendientes</span>
                                    </div>
                                </li>
                                <li className={visualizar == 'desarrollo' ? 'Active' : null} 
                                onClick={() => setVisualizar('desarrollo')}>
                                    <div>
                                        <span>Desarrollo</span>
                                    </div>
                                </li>
                                <li className={visualizar == 'year' ? 'Active' : null} 
                                onClick={() => setVisualizar('year')}>
                                    <div>
                                        <span>Últimos 12 meses</span>
                                    </div>
                                </li>
                            </ul>
                        </nav>

                        <button className='editar' onClick={() => {
                            params.set('d', 'edit');
                            setParams(params);
                        }}> 
                            <span>Editar cliente</span>
                            <MdOutlineModeEdit className="icon" />

                        </button>
                    </div>
                </div>
                <div className="resultDash">
                    {
                        !visualizar || visualizar == 'analisis' ?
                            <MonthAnalisis client={client} />
                        : visualizar == 'pendientes' ?
                            <CotizacionesListClient type={'pendientes'} cotizaciones={client.cotizacions} />
                        : visualizar == 'desarrollo' ?
                            <CotizacionesListClient type={'desarrollo'} cotizaciones={client.cotizacions}/>
                        : visualizar == 'year' ?
                            <Year cliente={client} />
                        : null
                    }
                </div>
            </div>
        </div>
    )
}