import React, { useState } from 'react';
import Later from './later';
import VisitaOrCallAgentar from './visita';
import CotizacionAgendar from './cotizacion';
import NotInteres from './notInteres';
import { MdArrowBack } from 'react-icons/md';
import { useLocation, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import * as actions from '../../../store/action/action';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function NubeActions(props){
    const user = props.user;
    const location = useLocation();

    const dispatch = useDispatch();
    const item = props.item;
    const [choose, setChoose] = useState(null);
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        time: null,
        hour: null
    })

    const nuevaFecha = item.calendaries && item.calendaries ? item.calendaries.find((it) => it.state == 'active') : null;
    // No contesto - CONTACTO
    const dontCall = async () => {
        let tiempo = dayjs().format('YYYY-MM-DD')
        setLoading(true);
        let body = {
            callId: item.id,
            title: item.case == 'contacto 1' ? `Contacto 2 | ${item.title}` : item.case == 'contacto 2' ?  `Contacto 3 | ${item.title}` : 'perdido',
            caso: item.case == 'contacto 1' ? `contacto 2` : item.case == 'contacto 2' ?  `contacto 3` : 'perdido',
            clientId: item.client.id,
            userId: user.id,
            time: tiempo,
            hour: nuevaFecha ? nuevaFecha.hour : '16:00'
        }
        console.log(body) 
        const sendNotCall = await axios.put('api/call/dontCall', body)
        .then(res => {
            setLoading(false);
            dispatch(actions.HandleAlerta('Llamada aplazada, 3 días', 'positive'))
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('w')
            params.delete('a');
            setParams(params);
        })
        .catch(err => {
            setLoading(false);
            dispatch(actions.HandleAlerta('No hemos podido ejecutar esta función, intentalo más tarde', 'mistake'))
        })

        return sendNotCall;
    }
    const before = (where) => {
        setChoose(where);
        params.delete('a');
        setParams(params);
    }
    const openAction = (type) => {
        setChoose(type);
        params.set('a', type)
        setParams(params);
    }

    // DE VISITAS - CANCELAR
    const cancelarVisita = async () => {
        setLoading(true)
        let fechaActual = item.calendaries && item.calendaries.length ? item.calendaries.find(tl => tl.state == 'active') : null;
        let body = {
            visitaId:item.id,
            calendaryId:fechaActual.id,
            userId:user.id,
            clientId: item.client.id
        }

        const sendCancel = await axios.post('api/visitas/cancelar', body)
        .then((res) => {
            setLoading(false);
            dispatch(actions.HandleAlerta('Visita cancelada', 'positive'));
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('w')
            params.delete('a');
            setParams(params);
        }) 
        .catch(err => {
            setLoading(false);
            dispatch(actions.HandleAlerta('No hemos logrado cancelar esta visita, intentalo más tarde', 'mistake'));

        })
        return sendCancel
    }
    return (
        <div className="nubeOptions">
            <div className="containerNubeOptions">
                <div className="who">
                    <h3>{item.case}</h3>
                    <h4>{item.title}</h4>
                    {
                        item.calendaries && item.calendaries.length ?
                            item.calendaries.map((time, i) => {
                                return (
                                    time.state == 'active' ?
                                        <span key={i+1}>
                                            Llamar {dayjs(time.time.split('T')[0]).format('dddd, MMMM D, YYYY') }
                                        </span> 
                                    : null
                                )
                            })
                        : <span>No hemos encontrado fecha en el calendario</span>
                    }
                </div>
                {
                location.pathname == '/' || location.pathname == '/contactos' ?
                // CONTACTO
                <div className="optionsEmbudo">
                    {
                        !choose ?
                        <div className="containerOptions">
                            {
                                loading ? 
                                <span>Enviando...</span>
                                :
                                <div className="">
                                    <button className="tagSelect Great"
                                        onClick={() => setChoose('contesto')}>
                                            <span>Contesto</span>
                                        </button>
                                        <button className="tagSelect Cancel" onClick={() => dontCall()}>
                                            <span>No contesto</span>
                                        </button>
                                        <button className="tagSelect Wait" 
                                        onClick={() => {
                                            setChoose('later')
                                            openAction('later')
                                        }}>
                                            <span>Llamar después</span>
                                        </button>
                                </div>
                            }
                        </div>
                        :
                        choose == 'contesto' ?
                            <div className="containerOptions">
                                <button className='before' onClick={() =>{
                                    before(null) 
                                }}>
                                    <MdArrowBack className="icon" />
                                </button>
                                <button className="tagSelect Great" onClick={() => {
                                    setChoose('interes')
                                }}>
                                    <span>Tiene interés</span>
                                </button>
                                <button className="tagSelect Cancel" onClick={() => {
                                    openAction('notInteres')
                                }}>
                                    <span>No tiene interés</span>
                                </button>

                            </div>
                        :choose == 'interes' ?
                            <div className="containerOptions">
                                <button className='before' onClick={() =>{
                                    before('contesto') 
                                }}>
                                    <MdArrowBack className="icon" />
                                </button>
                                <button className="tagSelect Great" 
                                onClick={() => openAction('visita')}>
                                    <span>Visita</span>
                                </button>
                                <button className="tagSelect Great"
                                onClick={() => openAction('cotizacion')}>
                                    <span>Cotización</span>
                                </button>
                            </div>
                        :choose == 'notInteres' ?
                        <div className="containerOptions">
                            <button className='before' onClick={() =>{
                                before('contesto') 
                            }}>
                                <MdArrowBack className="icon" />
                            </button>
                            <button className="tagSelect Cancel">
                                <span>No tiene interés</span>
                            </button>
                        </div>
                        :choose == 'visita' ?
                            <div className="containerOptions">
                                <button className='before' onClick={() =>{
                                    before('interes') 
                                }}>
                                    <MdArrowBack className="icon" />
                                </button>
                                <button className="tagSelect Great" >
                                    <span>Visita</span>
                                </button>
                            </div>
                        :choose == 'cotizacion' ?
                        <div className="containerOptions">
                            <button className='before' onClick={() =>{
                                before('interes') 
                            }}>
                                <MdArrowBack className="icon" />
                            </button>
                            <button className="tagSelect Great" >
                                <span>cotización</span>
                            </button>
                        </div>
                        : choose == 'later' ?
                            <div className="containerOptions">
                                <button className='before' onClick={() =>{
                                    before(null) 
                                }}>
                                    <MdArrowBack className="icon" />
                                </button>
                                <button className="tagSelect Wait">
                                    <span>Llamar después</span>
                                </button>


                            </div>
                        :null
                    }
                </div>
                // VISITAS
                : location.pathname == '/visitas' ?
                    item.state != 'cancelada' ?
                        <div className="optionsEmbudo">
                            {
                                !choose ?
                                <div className="containerOptions">
                                    {
                                        loading ? 
                                        <span>Enviando...</span>
                                        :
                                        <div className="">
                                            <button className="tagSelect Great"
                                                onClick={() => setChoose('contesto')}>
                                                    <span>Interés</span>
                                                </button>
                                                <button className="tagSelect Cancel" onClick={() => cancelarVisita()}>
                                                    <span>Cancelar</span>
                                                </button>
                                                <button className="tagSelect Wait" 
                                                onClick={() => {
                                                    setChoose('later')
                                                    openAction('later')
                                                }}>
                                                    <span>Visitar después</span>
                                                </button>
                                        </div>
                                    }
                                </div>
                                :
                                choose == 'contesto' ?
                                    <div className="containerOptions">
                                        <button className='before' onClick={() =>{
                                            before(null) 
                                        }}>
                                            <MdArrowBack className="icon" />
                                        </button>
                                        <button className="tagSelect Great" onClick={() => openAction('cotizacion')}>
                                            <span>Cotización</span>
                                        </button>
                                        {/* <button className="tagSelect Cancel" onClick={() => {
                                            openAction('notInteres')
                                        }}>
                                            <span>No tiene interés</span>
                                        </button> */}
 
                                    </div> 
                                
                                :choose == 'notInteres' ?
                                <div className="containerOptions">
                                    <button className='before' onClick={() =>{
                                        before('contesto') 
                                    }}>
                                        <MdArrowBack className="icon" />
                                    </button>
                                    <button className="tagSelect Cancel">
                                        <span>No tiene interés</span>
                                    </button>
                                </div>
                                :choose == 'cotizacion' ?
                                <div className="containerOptions">
                                    <button className='before' onClick={() =>{
                                        before('contesto')  
                                    }}>
                                        <MdArrowBack className="icon" />
                                    </button>
                                    <button className="tagSelect Great" >
                                        <span>cotización</span>
                                    </button>
                                </div>
                                : choose == 'later' ?
                                    <div className="containerOptions">
                                        <button className='before' onClick={() =>{
                                            before(null) 
                                        }}>
                                            <MdArrowBack className="icon" />
                                        </button>
                                        <button className="tagSelect Wait">
                                            <span>Llamar después</span>
                                        </button>


                                    </div>
                                :null
                            }
                        </div>
                    : null
                :null
                }
            </div>
            {
                params.get('a') ?
            <div className="divSendAction">
                <div className="containerSendAction">
                    {
                        params.get('a') == 'visita' ?
                            <VisitaOrCallAgentar user={user} item={item} calendary={item.calendaries} />
                        :
                        params.get('a') == 'cotizacion' ?
                            <CotizacionAgendar user={user} item={item} />
                        : params.get('a') == 'later' ?
                            <Later type='call' user={user} item={item} />
                        : params.get('a') == 'notInteres' ? 
                            <NotInteres type='call' user={user} item={item} calendary={item.calendaries} />
                        :null
                    }
                </div>
            </div>
                :null
            }

        </div>
    )
}