import React, { useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import Pendientes from './cotizaciones/pendiente';
import EnDesarrollo from './cotizaciones/enDesarrollo';
import EnEspera from './cotizaciones/enEspera';
import { useSelector } from 'react-redux';
import EnPerdido from './cotizaciones/EnPerdidas';

export default function CotizacionesEmbudo(){
    const [params, setParams] = useSearchParams();
    const [nav, setNav] = useState(null);
 
    const embudo = useSelector(store => store.embudo);
    const { cotizaciones, loadingCotizaciones } = embudo;

    return (
        <div className="pestanaEmbudo">
            <div className="containerPestanaEmbudo">
                <div className="topPestanaCotizacion">
                    <div className="containerTopPestana">
                        <div className="topTitleAndSearch">
                            <div className="containerAndSearch">
                                <div className="titleDiv">
                                    <h1>Cotizaciones</h1>
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
                        <div className="navigationBetweenTaps">
                            <div className="containerNavCoti">
                                <nav>
                                    <ul>
                                        <li className={!nav ? 'Active' : null}
                                        onClick={() => setNav(null)}>
                                            <div>
                                                <span>Activas 
                                                {
                                                    cotizaciones == 'notrequest' || cotizaciones == 404 ? ` 0`:
                                                    cotizaciones && cotizaciones.length ? ` ${cotizaciones.filter(cl => cl.state == 'pendiente').length}` : 0
                                                }
                                                </span>
                                            </div>
                                        </li>
                                        <li className={nav == 'desarrollo' ? 'Active' : null}
                                        onClick={() => setNav('desarrollo')}>
                                            <div>
                                                <span>
                                                    Desarrollo 
                                                    {
                                                        cotizaciones == 'notrequest' || cotizaciones == 404 ? ` 0` :
                                                        cotizaciones && cotizaciones.length ? ` ${cotizaciones.filter(cl => cl.state == 'desarrollo').length}` : 0
                                                    }
                                                </span>
                                            </div>
                                        </li>
                                        <li className={nav == 'espera' ? 'Active' : null}
                                        onClick={() => setNav('espera')}>
                                            <div>
                                                <span>
                                                    Espera 
                                                    {
                                                        cotizaciones == 'notrequest' || cotizaciones == 404 ?  ` 0` :
                                                        cotizaciones && cotizaciones.length ? ` ${cotizaciones.filter(cl => cl.state == 'aplazado').length}` : 0
                                                    }
                                                </span>
                                                    
                                            </div>
                                        </li>
                                        <li className={nav == 'perdido' ? 'Active' : null}
                                        onClick={() => setNav('perdido')}>
                                            <div>
                                                <span>
                                                    Perdidas  
                                                    {
                                                        cotizaciones == 'notrequest' || cotizaciones == 404 ? ` 0` :
                                                        cotizaciones && cotizaciones.length ? ` ${cotizaciones.filter(cl => cl.state == 'perdido').length}` : 0
                                                    }
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </nav>
                                <div className="searchCoti">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="infoDataCotizacion">
                    {
                        loadingCotizaciones || !cotizaciones  ?
                            <div className="notFound">
                                <h3>Cargando cotizaciones...</h3>
                            </div>
                        :
                        cotizaciones == 'resquest' || cotizaciones == 'notrequest' || cotizaciones == 404 ?
                            <div className="notFound">
                                <h1>No hay cotizaciones para mostrar</h1>
                            </div>
                        :
                        !nav ? 
                            <Pendientes data={cotizaciones} />
                        : nav == 'desarrollo' ?
                            <EnDesarrollo data={cotizaciones}  />
                        : nav == 'espera' ? <EnEspera data={cotizaciones} /> 
                        : nav == 'perdido' ? <EnPerdido data={cotizaciones} /> : null
                    }
                </div>
            </div>
        </div>
    )
}