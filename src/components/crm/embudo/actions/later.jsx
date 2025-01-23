import React, { useState } from 'react';
import { MdArrowRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../../store/action/action';
import { laterFunction } from '../actionsAxios';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function Later(props){
    const user = props.user;
    const item = props.item;
    const type = props.type;
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    const [lista, setTags] = useState([]);
    const [note, setNote] = useState(null);
    const [time, setTime] = useState(null); 
    const [hour, setHour] = useState(null);    
    const [loading, setLoading] = useState(false);
    const embudo = useSelector(store => store.system);

    const { system } = embudo;

    // Aplaza el prospecto
    const handleAplzar = async () => {  
        if(!note || !lista || !time || !hour) return dispatch(actions.HandleAlerta('Llena los campos', 'mistake'))
        //title, note, tags, userId, prospectoId, calendaryId, time, hour, type
        const fecha = item.calendaries ? item.calendaries.find(cl => cl.state == 'active') : 1;
        const apl = await laterFunction('Sin titulo', note, lista, user.id, item.id, fecha.id, time, hour, 'intento')
        .then((res) => {
            console.log('APLAZADO');
            dispatch(actions.HandleAlerta('Ossk', 'positive'))
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('w')
            params.delete('a');
            setParams(params); 
        })
        .catch(err => {
            console.log('error');
        })
        
        return 

    }

    const handleAplazarLlamada = async () => {
        if(loading) return null 
        if(!note || !lista || !time || !hour) return dispatch(actions.HandleAlerta('Llena los campos', 'mistake'))
        setLoading(true);
        let fechaItem = item.calendaries && item.calendaries.length ? item.calendaries.find((it) => it.state == 'active') : null;
        let body = {
            title: `Aplazada - ${item.title}`,
            note: note,
            tags: lista,
            userId: user.id,
            clientId: item.client.id,
            calendaryId: fechaItem.id,
            callId: item.id,
            time: time,
            hour: hour
        }

        const sendAplazar = await axios.put('api/call/aplazar', body)
        .then((res) => {
            setLoading(false)
            dispatch(actions.HandleAlerta(`Aplazado para ${time}`, 'positive'))
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('w')
            params.delete('a');
            setParams(params);
        })
        .catch((err) => {
            setLoading(false)
            dispatch(actions.HandleAlerta(`Aplazado para ${time}`, 'positive'))
        })
        return sendAplazar;
    }

    // Aplazar visita
    const handleAplazarVisita = async () => {
        if(loading) return null 
        if(!note || !lista || !time || !hour) return dispatch(actions.HandleAlerta('Llena los campos', 'mistake'))
        setLoading(true);
        let fechaItem = item.calendaries && item.calendaries.length ? item.calendaries.find((it) => it.state == 'active') : null;
        let body = {
            title: `Aplazada - ${item.title}`,
            note: note,
            tags: lista, 
            userId: user.id,
            clientId: item.client.id,
            calendaryId: fechaItem.id,
            visitaId: item.id,
            time: time,
            hour: hour
        }

        const sendAplazar = await axios.put('api/visitas/aplazar', body)
        .then((res) => {
            setLoading(false)
            dispatch(actions.HandleAlerta(`Aplazado para ${time}`, 'positive'))
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('w')
            params.delete('a');
            setParams(params);
        })
        .catch((err) => {
            setLoading(false)
            dispatch(actions.HandleAlerta(`Aplazado para ${time}`, 'positive'))
        })
        return sendAplazar;
    }
    return (
        type == 'call' ?
        <div className="formAction">
            <div className="formAction">
                <div className="headerAction">
                    <h3>Esta bien, ¡Aplacemos esta {item.case ? 'llamada' : 'visita'}</h3>
                </div>
                <div className="containerActionForm">
                    <div className="form" >
                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">
                                    Selecciona una nueva fecha 
                                </label><br />
                                <input type="date" onChange={(e) => {
                                    setTime(e.target.value);
                                }} />
                            </div>

                            <div className="inputDiv">
                                <label htmlFor="">
                                    Selecciona la hora 
                                </label><br />
                                <select name="" id="" onChange={(e) => {
                                    setHour(e.target.value)
                                }}>
                                <option value="7:00">7:00 AM</option>
                                <option value="8:00">8:00 AM</option>
                                <option value="9:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                                <option value="18:00">6:00 PM</option>
                                <option value="19:00">7:00 PM</option>
                                <option value="20:00">8:00 PM</option>
                                <option value="21:00">9:00 PM</option>
                                <option value="22:00">10:00 PM</option>
                                
                                </select>
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Selecciona tags</label>
                            <div className="tags">
                            {
                                    system && system.tags && system.tags.length ?
                                        system.tags.map((tg,i) => {
                                            return (
                                                tg.type == 'negative' ?
                                                    <button className={lista.includes(tg.id) ? 'tag Active' :'tag'} key={i+1} onClick={() => {
                                                        if(lista.includes(tg.id)){
                                                            let newArray = lista.filter(t => t != tg.id);
                                                            setTags(newArray);
                                                        }else{
                                                            setTags([...lista, tg.id])
                                                        }
                                                    }}>
                                                        <span>{tg.nombre}</span>
                                                    </button>
                                                : null
                                            )
                                        })
                                    : <span>No hay</span>
                                }
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="">¿Deseas escribir algo?</label><br />
                            <textarea placeholder="Escribir aquí..." name="" id=""
                            value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                        </div>
                        <div className="inputDiv">
                            <button className='send' onClick={(e) => {
                                e.preventDefault();
                                item.case ?
                                    handleAplazarLlamada()
                                :
                                handleAplazarVisita() 
                            }}>
                                <span>
                                    {loading ? 'Aplazando...' : 'Aplazar'}
                                </span>
                                <MdArrowRight className="icon" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        :
        <div className="formAction">
            <div className="formAction">
                <div className="headerAction">
                    <h3>Esta bien, ¡Aplacemos esta  
                        {type == 'llamada' ? ' Llamada' : type == 'visita' ? ' Visita' : ` Comunicación`}!</h3>
                </div>
                <div className="containerActionForm">
                    <div className="form" >
                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">
                                    Selecciona una nueva fecha
                                </label><br />
                                <input type="date" onChange={(e) => {
                                    setTime(e.target.value);
                                }} />
                            </div>

                            <div className="inputDiv">
                                <label htmlFor="">
                                    Selecciona la hora 
                                </label><br />
                                <select name="" id="" onChange={(e) => {
                                    setHour(e.target.value)
                                }}>
                                <option value="7:00">7:00 AM</option>
                                <option value="8:00">8:00 AM</option>
                                <option value="9:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                                <option value="18:00">6:00 PM</option>
                                <option value="19:00">7:00 PM</option>
                                <option value="20:00">8:00 PM</option>
                                <option value="21:00">9:00 PM</option>
                                <option value="22:00">10:00 PM</option>
                                
                                </select>
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Selecciona tags</label>
                            <div className="tags">
                            {
                                    system && system.tags && system.tags.length ?
                                        system.tags.map((tg,i) => {
                                            return ( 
                                                tg.type == 'negative' ?
                                                    <button className={lista.includes(tg.id) ? 'tag Active' :'tag'} key={i+1} onClick={() => {
                                                        if(lista.includes(tg.id)){
                                                            let newArray = lista.filter(t => t != tg.id);
                                                            setTags(newArray);
                                                        }else{
                                                            setTags([...lista, tg.id])
                                                        }
                                                    }}>
                                                        <span>{tg.nombre}</span>
                                                    </button>
                                                : null
                                            )
                                        })
                                    : <span>No hay</span>
                                }
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="">¿Deseas escribir algo?</label><br />
                            <textarea placeholder="Escribir aquí..." name="" id=""
                            value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                        </div>
                        <div className="inputDiv">
                            <button className='send' onClick={(e) => {
                                e.preventDefault();
                                handleAplzar()
                            }}>
                                <span>
                                    Aplazar
                                </span>
                                <MdArrowRight className="icon" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}