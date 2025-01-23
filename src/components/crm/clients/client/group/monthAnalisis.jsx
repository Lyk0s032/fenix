import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';

export default function MonthAnalisis(props){
    const client = props.client;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(null);
    const dispatch = useDispatch();
    const closeCotizacion = () => {
        const coti = document.querySelector("#cotizacion").classList.toggle('cotizacionActive');
        return coti;
    }

    const day = dayjs().format('YYYY-MM-DD');
    const [time, setTime] = useState(day)
    const moveTime = async (type) => {
        if(type == 'less'){
            let nuevaFecha = dayjs(time).subtract(1, 'month').format('YYYY-MM-DD')
            setTime(nuevaFecha)
        }else{
            let nuevaFecha = dayjs(time).add(1, 'month').format('YYYY-MM-DD')
            setTime(nuevaFecha)
        }
    }

    const callDataByMonth = async () => {
        setLoading(true);
        const consult = await axios.get(`/api/clients/get/byMonth/${dayjs(time).format('YYYY')}/${dayjs(time).format('MM')}/${client.id}`)
        .then((res) => {
            setData(res.data)
            setLoading(false);

        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            setData(404)
        })
    }

    useEffect(() => {
        callDataByMonth()
    }, [time])
    return (
        <div className="monthAnalisis">
            <div className="containerMonth">
                <div className="parallaxOne">
                    <div className="containerParallax">
                        <div className="leftGraph">
                            <div className="containerLeftGraph">
                                <div className="topFilter">
                                    <div className="navTopThisMonth">
                                        <nav>
                                            <ul>
                                                <li className={!type ? 'Active' : null} onClick={() => {
                                                    setType(null)
                                                }} >
                                                    <div>
                                                        <span>Aprobadas 
                                                            {
                                                                ` ${data && data.aprobadas && data.aprobadas.cotizaciones ? data.aprobadas.cotizaciones.length : 0}`
                                                            }
                                                        </span>
                                                    </div>
                                                </li>
                                                <li className={type == 'lost' ? 'Active' : null} onClick={() => {
                                                    setType('lost')
                                                }}>
                                                    <div>
                                                        <span>Perdidas 
                                                            {
                                                                ` ${data && data.perdidas  && data.perdidas.cotizaciones? data.perdidas.cotizaciones.length : 0}`
                                                            }
                                                        </span>
                                                    </div> 
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div className="scrollTable">
                                    {
                                        loading || !data ?
                                            <div className="containerScroll">
                                                <div className="loading">
                                                    <h1>Cargando...</h1>
                                                </div>
                                            </div>
                                            :
                                        !type ?
                                            <div className="containerScroll">
                                                <table>
                                                    <tbody>
                                                    {
                                                        data.aprobadas && data.aprobadas.cotizaciones && data.aprobadas.cotizaciones.length ?
                                                                data.aprobadas.cotizaciones.map((aprobada, i) => {
                                                                    return (
                                                                        <tr onClick={() => {
                                                                            dispatch(actions.getCotizacion(aprobada))
                                                                            closeCotizacion()
                                                                        }}>
                                                                            <td className='titleTd' key={i+1}>
                                                                                <div className="title">
                                                                                    <h3>{aprobada.name}</h3>
                                                                                    <h4>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(aprobada.neto)}<span> COP</span></h4>
                                                                                    <span>{dayjs(aprobada.fechaAprobada).format('DD [de] MMMM [del] YYYY')}</span>
                                                                                </div>
                                                                            </td>
                                                                            
                                                                            <td>
                                                                                <div className="nro">
                                                                                    <span>Nro.</span>
                                                                                    <h3>{aprobada.nro}</h3>
                                                                                </div>
                                                                            </td>
                                                                        
                                                                        </tr>
                                                                    )
                                                                })

                                                        : 
                                                        <h1 className='notFound'><h1>No hay cotizaciones perdidas</h1></h1>

                                                    }
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        : type == 'lost'?
                                            <div className="containerScroll">
                                                <table>
                                                    <tbody>
                                                        {
                                                            data && data.perdidas && data.perdidas.cotizaciones && data.perdidas.cotizaciones.length ?
                                                                data.perdidas.cotizaciones.map((perdida, i) => {
                                                                    return (
                                                                        <tr onClick={() => {
                                                                            dispatch(actions.getCotizacion(perdida))
                                                                            closeCotizacion()
                                                                        }}>
                                                                            <td className='titleTd' >
                                                                                <div className="title Danger">
                                                                                    <h3>{perdida.name}</h3>
                                                                                    <h4>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(perdida.neto)} <span>COP</span></h4>
                                                                                    <span>{dayjs(perdida.fechaAprobada.split('T')[0]).format('DD [de] MMMM [del] YYYY')} </span> 
                                                                                </div>
                                                                            </td>
                                                                            
                                                                            <td>
                                                                                <div className="nro">
                                                                                    <span>Nro.</span>
                                                                                    <h3>{perdida.nro}</h3>
                                                                                </div>
                                                                            </td>
                                                                        
                                                                        </tr> 
                                                                    )
                                                                })
                                                            :
                                                            <h1 className='notFound'><h1>No hay cotizaciones perdidas</h1></h1>
                                                        }
                                                        
               
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="rightGraph">
                            <div className="containerRight">
                                <div className="box">
                                    <div className="containerBox">
                                        <div className="navFilterTime">
                                            <button onClick={() => moveTime('less')}>
                                                <span>
                                                    {
                                                        dayjs(time).subtract(1, 'month').format('MMMM')
                                                    }
                                                </span>
                                            </button>
                                            <div className="divChoose">
                                                <select name="" id="">
                                                    <option value="">{dayjs(time).format('MMMM')}</option>
                                                    <option value="">Febrero</option>
                                                    <option value="">Marzo</option>
                                                </select>
                                            </div>
                                            <button onClick={() => moveTime('plus')}>
                                                <span>
                                                    {
                                                        dayjs(time).add(1, 'month').format('MMMM')
                                                    }
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="dataBoxClient">
                                    {

                                        loading || !data ?
                                        <div className="containerDataBox">
                                            <div className="loading">
                                                <h1>Cargando...</h1>
                                            </div>
                                        </div>
                                        :
                                    <div className="containerDataBox">
                                        <div className="topData">
                                            <span>Total</span>
                                            <h3>{data.aprobadas ? new Intl.NumberFormat('es-CO', {currency: 'COP'}).format(data.aprobadas.total) : 0} <span>COP</span></h3>
                                            <span className='howMany'>{data && data.aprobadas && data.aprobadas.cotizaciones ? data.aprobadas.cotizaciones.length : 0} cotizaciones aprobadas</span>

                                        </div>
                                        <div className="graphLine">
                                            <div className="containerGraphLine">
                                                <div className="line">
                                                    <div className="head">
                                                        <span>Cotizaciones aprobadas</span>
                                                        <h3 style={{color: '#388E3C'}}>{data.aprobadas ? new Intl.NumberFormat('es-Co', {currency: 'COP'}).format(data.aprobadas.total) : 0} COP</h3>
                                                    </div>
                                                    <div className="progress">
                                                        <div className="barProgressActive" style={{
                                                            width: data && data.aprobadas && data.aprobadas.cotizaciones ? `${(data.aprobadas.total / (data.aprobadas.total + data.perdidas.total) )*(100)}%` : 0,
                                                            backgroundColor: '#388E3C'
                                                        }}></div>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="head">
                                                        <span >Cotizaciones perdidas</span>
                                                        <h3 style={{color: '#dc3545'}}>{data.perdidas ? new Intl.NumberFormat('es-Co', {currency: 'COP'}).format(data.perdidas.total) : 0} COP</h3>
                                                    </div>
                                                    <div className="progress">
                                                        <div className="barProgressActive"
                                                        style={{
                                                            width: data && data.perdidas && data.perdidas.cotizaciones ? `${(data.perdidas.total / (data.aprobadas.total + data.perdidas.total) )*(100)}%` : 0,
                                                            backgroundColor: '#dc3545'
                                                        }}></div>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="head">
                                                        <span>Cotizaciones aprobadas</span>
                                                        <h3>3</h3>
                                                    </div>
                                                    <div className="progress">
                                                        <div className="barProgressActive"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}