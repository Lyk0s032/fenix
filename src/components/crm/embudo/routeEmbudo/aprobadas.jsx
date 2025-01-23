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
                            <h1>Cargando</h1>
                        :
                        aprobadas == 'resquest' || aprobadas == 'notrequest' || aprobadas == 404 ?
                            <h1>No hay</h1>
                        : 
                            <AprobadasCotizaciones data={aprobadas} />
                    }
                </div> 
            </div>
        </div>
    )
}