import React, { useState } from 'react';
import Later from './later';
import VisitaOrCallAgentar from './visita';
import CotizacionAgendar from './cotizacion';
import NotInteres from './notInteres';
import { MdArrowBack } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as actions from '../../../store/action/action';
import ToClient from './toClient';

export default function NubeActionsIntentos(props){
    const user = props.user;
    const item = props.item;
    const [choose, setChoose] = useState(null);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
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

    const handleDontCall = async () => {
        setLoading(true);
        const hoy = dayjs()
        let st = item.state == 'intento 1' ? "intento 2" : item.state == 'intento 2' ? "intento 3" : item.state == 'intento 3' ? "intento 4" : null
        let body = {
            title: `${st}`,
            caso: st,
            prospectoId: item.id,
            userId: user.id,
            time: hoy,
            hour: "4:00PM" 
        } 
        const send = await axios.put('/api/prospecto/dontCall', body)
        .then((res) => {
            setLoading(false);
            dispatch(actions.HandleAlerta("Próxima llamada, en 3 días", 'positive'))
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('w')
            params.delete('a');
            setParams(params);
            
        })
        .catch(err => {
            setLoading(false);
            console.log(err);
            dispatch(actions.HandleAlerta("No hemos podido crear esto", 'negative'))

        })
    }
    return (
        <div className="nubeOptions">
            <div className="containerNubeOptions">
                <div className="who">
                    <h3>{item.state}</h3>
                </div>
                {
                    loading ?
                    <span>Enviando...</span>
                    :
                <div className="optionsEmbudo">
                    {
                        !choose ?
                        <div className="containerOptions">
                            <button className="tagSelect Great"
                            onClick={() => setChoose('contesto')}>
                                <span>Contesto</span>
                            </button>
                            <button className="tagSelect Cancel" onClick={() => {handleDontCall()}}>
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
                        : choose == 'toClient' ?
                            <div className="containerOptions">
                                <button className='before' onClick={() =>{
                                    before(null) 
                                }}>
                                    <MdArrowBack className="icon" />
                                </button>
                                    
                                <button className="tagSelect Great" >
                                    <span>Convertir a cliente</span>
                                </button>
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
                                    openAction('toClient')
                                }}>
                                    <span>Convertir a cliente</span>
                                </button>
                                <button className="tagSelect Cancel" onClick={() => {
                                    openAction('notInteres')
                                }}>
                                    <span>No tiene interés</span>
                                </button>

                            </div>
                        :   choose == 'notInteres' ?
                                <div className="containerOptions">
                                    <button className='before' onClick={() =>{
                                        before('contesto') 
                                    }}>
                                        <MdArrowBack className="icon" />
                                    </button>
                                    
                                    <button className="tagSelect Cancel" >
                                        <span>No tiene interés</span>
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
                }
            </div>
            {
                params.get('a') ?
            <div className="divSendAction">
                <div className="containerSendAction">
                    {
                        params.get('a') == 'visita' ?
                            <VisitaOrCallAgentar />
                        :
                        params.get('a') == 'toClient' ?
                            <ToClient user={user} item={item} />
                        :
                        params.get('a') == 'cotizacion' ?
                            <CotizacionAgendar user={user} />
                        : params.get('a') == 'later' ?
                            <Later user={user} type='intento' item={item}/>
                        : params.get('a') == 'notInteres' ?
                            <NotInteres user={user} type='intento' item={item}/>
                        :null
                    }
                </div>
            </div>
                :null
            }

        </div>
    )
}