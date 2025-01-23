import React, { useState } from 'react';
import { MdArrowRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../../store/action/action';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function NotInteres(props){
    const user = props.user;
    const type = props.type;
    const item = props.item;
    const calendary = props.calendary;
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();

    const [lista, setTags] = useState([]);
    const [note, setNote] = useState(null);    
    const embudo = useSelector(store => store.system);
    const [loading, setLoading] = useState(false);

    const { system } = embudo;
    console.log(embudo)
    console.log(system)
    
    const notInteres = async () => {
        if(type == 'intento'){
                if(!note) return dispatch(actions.HandleAlerta('Debes escribir una razón', 'mistake'))
                if(!lista.length) return dispatch(actions.HandleAlerta('Debes seleccionar un tag', 'mistake'))
                
                setLoading(true);
                let body = {
                    prospectoId:item.id,
                    userId:user.id,
                    extra: 'perdido',
                    nota: note,
                    tags: lista,
                }
                const sendNotInteres = await axios.put('api/prospecto/sinInteres', body)
                .then((res) => {
                    setLoading(false);
                    dispatch(actions.HandleAlerta('Enviado a perdido', 'positive'))
                    dispatch(actions.AxiosGetAllEmbudo(user.id, false));
                    params.delete('w')
                    params.delete('a'); 
                    setParams(params);
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false);
                    dispatch(actions.HandleAlerta('No hemos logrado enviar estoa perdido', 'mistake'))
    
                })
                return setLoading(false);
        }else{
            if(!note) return dispatch(actions.HandleAlerta('Debes escribir una razón', 'mistake'))
            if(!lista.length) return dispatch(actions.HandleAlerta('Debes seleccionar un tag', 'mistake'))
            
            setLoading(true);
            let programacion = calendary && calendary.length ? calendary.find(tl => tl.state = 'active') : null;
            
            let body = {
                callId:item.id,
                userId:user.id,
                clientId:item.client.id,
                extra: 'perdido',
                contacto: item.case,
                nota: note,
                tags: lista,
                calendaryId: programacion.id
            }
            const sendNotInteres = await axios.put('api/call/sinInteres', body)
            .then((res) => {
                setLoading(false);
                dispatch(actions.HandleAlerta('Enviado a perdido', 'positive'))
                dispatch(actions.AxiosGetAllEmbudo(user.id, false));
                params.delete('w')
                params.delete('a'); 
                setParams(params);
            })
            .catch(err => {
                setLoading(false);
                dispatch(actions.HandleAlerta('No hemos logrado enviar estoa perdido', 'mistake'))

            })
            return setLoading(false);
        }
        

    }
    return (
        <div className="formAction">
            <div className="formAction"> 
                <div className="headerAction">
                    <h3>¿Que paso?, queremos mejorar</h3>
                </div>
                <div className="containerActionForm">
                    <div className="form">
                        
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
                            <textarea placeholder="Escribe aqui..." name="" id=""
                            value={note} onChange={(e) => setNote(e.target.value)}></textarea> 
                        </div>
                        <div className="inputDiv">
                            <button className='send' onClick={() => {
                                notInteres();
                            }}>
                                <span>
                                    {loading ? 'Enviando a perdido' : 'Enviar a perdido'}
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