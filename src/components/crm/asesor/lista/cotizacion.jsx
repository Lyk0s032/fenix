import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import * as actions from '../../../store/action/action';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

export default function CotizacionSeeUser(){

    const embudo = useSelector(store => store.embudo);
    const { cotizacion, loadingCotizacion } = embudo;
    console.log(cotizacion)
    const closeCotizacion = () => {

        const coti = document.querySelector("#cotizacion").classList.toggle('cotizacionActive');
        return coti;
    }
    return (
        <div className="cotizacion" id="cotizacion">
            {
                loadingCotizacion || !cotizacion ?
                <div className="containerCotizacion">
                    <div className="loading">
                        <h1>Cargando</h1>
                    </div>
                </div> 
            :
            <div className="containerCotizacion">
                <div className="topCotizacion">
                    <div className="containerTop">
                        <div className="LeftBtnAndTitle">
                            <button onClick={() => closeCotizacion()}>
                                <MdArrowBack className="icon" />
                            </button>
                            <h3>Cotización</h3>
                        </div>
                    </div>
                </div>
                <div className="bodyCotizacion">
                    <div className="containerBody">
                        <div className="topAlert">
                            <div className="containerAlert">
                                <span>{cotizacion.state}</span>
                            </div>
                        </div>
                        <div className="CotizacionDetails">
                            <div className="containerDetails">
                                <div className="business">
                                    <img src="https://www.metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                                </div>
                                <div className="dataClientAndAsesor">
                                    <div className="containerThat">
                                        <div className="asesor">
                                            <h3>{cotizacion.user ? cotizacion.user.name ? cotizacion.user.name : 'No definido' : 'no definido'}</h3>
                                            <span className="nro">Nro. {cotizacion.nro}</span><br />
                                            <span className="time">{dayjs(cotizacion.fecha.split('T')[0]).format('DD [de] MMMM [del] YYYY')}</span>
                                        </div>
                                        <div className="asesor Cl">
                                            <h3>{cotizacion.client.nombreEmpresa}</h3>
                                            <span className="nro">Nit. {cotizacion.client.nit}</span><br /> 
                                            <span className="time">{cotizacion.state}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="informationCoti">
                                    <div className="containerInformation">
                                        <div className="itemCoti">
                                            <span>
                                                Nombre de cotización
                                            </span>
                                            <h3>{cotizacion.name}</h3>
                                        </div>
                                        <div className="itemCoti">
                                            <span>
                                                Valor bruto
                                            </span>
                                            <h3 className='bruto'>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.bruto)} <span>COP</span></h3>
                                        </div>
                                        <div className="itemCoti">
                                            <span>
                                                Descuento
                                            </span>
                                            <h3 className='descuento'>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.descuento)}  <span>COP</span></h3>
                                        </div>
                                        <div className="itemCoti">
                                            <span>
                                                Iva incluido
                                            </span>
                                            <span className="iva">{cotizacion.iva ? 'Aplica' : 'No aplica'}</span>
                                        </div>

                                        <div className="itemCoti Neto">
                                            <span>
                                                Neto
                                            </span>
                                            <h3>
                                            {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.neto)} <span>COP</span>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}