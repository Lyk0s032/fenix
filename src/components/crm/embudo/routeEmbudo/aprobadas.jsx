import React, { useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import Pendientes from './cotizaciones/pendiente';
import EnDesarrollo from './cotizaciones/enDesarrollo';
import EnEspera from './cotizaciones/enEspera';
import { useSelector } from 'react-redux';
import AprobadasCotizaciones from './cotizaciones/aprobadas';

export default function AprobadasEmbudo(){
    const [params, setParams] = useSearchParams();
    const [nav, setNav] = useState(null);

    const embudo = useSelector(store => store.embudo);
    const { aprobadas, loadingAprobadas } = embudo;
    return (
        <div className="pestanaEmbudo">
            <div className="containerPestanaEmbudo">
                <div className="topPestanaCotizacion">
                    <div className="containerTopPestana">
                        <div className="topTitleAndSearch">
                            <div className="containerAndSearch">
                                <div className="titleDiv">
                                    <h1>Cotizaciones aprobadas</h1>
                                </div>
                                {/* <div className="searchDiv">
                                    <input type="text" placeholder='Buscar cotización' />

                                    <button>
                                        <BsPlus className="icon" />
                                    </button>
                                    <button>
                                        <MdDeleteOutline  className="icon Delete" />
                                    </button>
                                </div> */}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="infoDataCotizacion">
                    {
                        !aprobadas || loadingAprobadas ?
                            <div className="notFound">
                                <h3>Cargando...</h3>
                            </div>
                        :
                        aprobadas == 'resquest' || aprobadas == 'notrequest' || aprobadas == 404 ?
                        <div className="notFound">
                            <h1>No hay cotizaciones aprobadas para mostrar</h1>
                        </div>
                        : 
                            <AprobadasCotizaciones data={aprobadas} />
                    }
                </div> 
            </div>
        </div>
    )
}