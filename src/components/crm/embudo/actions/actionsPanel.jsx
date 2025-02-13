import React, { useEffect, useRef, useState } from 'react';
import { MdArrowBack, MdBusiness, MdCall, MdCheck, MdClose, MdQuestionAnswer } from 'react-icons/md';
import { useLocation, useSearchParams } from 'react-router-dom';
import NubeActions from './nubeAcciones';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import NubeActionsIntentos from './nubeAccionesIntentos';
import dayjs from 'dayjs';
import axios from 'axios';

export default function ActionsPanelEmbudo(props){
    const user = props.user;
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const embudo = useSelector(store => store.embudo);
    const { item, loadingItem} = embudo;


    const [note, setNote] = useState(null);


    const [focus, setFocus] = useState(false);

    const handleFocus = () => {
        setFocus(true);
    }
    const handleOffFocus = () => {
        setFocus(false);
    }
    const openAction = () => {
        if(params.get('w') == 'action'){
            params.delete('w');
            params.delete('a');
            setParams(params);
        }else{
            params.set('w', 'action');
            setParams(params);
        }
        
    }

    const addNote = async () => {
        let body = {
            userId: user.id,
            clientId: item.client.id,
            callId: location.pathname == '/' ?  item.id : null,
            visitaId: location.pathname == '/visitas' ? item.id : null,
            prospectId: location.pathname == '/prospectos' ? item.id : null,
            type: location.pathname == '/' ? 'contacto' : location.pathname == '/visitas' ? 'visita' : location.pathname == '/prospectos' ? 'prospecto' : null,
            contacto: location.pathname == '/' ? item.case : null,
            prospecto: location.pathname == '/prospectos' ? item.state : null,
            note    
        }
        console.log(body)
        const sendNote = await axios.post('api/notes/addManual', body)
        .then((res) => {
            console.log(res.data);
            dispatch(actions.getItem(res.data))
            setNote('');
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos podido agregar esta nota', 'mistake'))
        })

        return sendNote
    } 

    const mensajeRef = useRef(null);

    useEffect(() => {
        if (mensajeRef.current) {
          // Desplazamos el scroll al fondo
          mensajeRef.current.scrollTop = mensajeRef.current.scrollHeight;
        }
      }, [item]);

    return (
        <div className="actionsEmbudo">
            {
                !item || loadingItem ?
                    <h1>Cargando...</h1>
                :
                item == 'notrequest' ? 
                <div className="containerActionsEmbudo">
                    <div className="top">
                        <div className="containerTop">
                            <div className="title">
                                <div className="juntos">
                                    <button className='btn' onClick={() => openAction()}>
                                        <MdArrowBack className='icon' />
                                    </button>
                                    <div className="dataTitle">
                                            <div className="topDataClient">
                                                <div className="photo">
                                                    <img src="https://static.vecteezy.com/system/resources/previews/026/822/782/non_2x/incognito-icon-unknown-illustration-sign-nameless-symbol-or-logo-vector.jpg" alt="" />
                                                </div>
                                                <div className="clientData">
                                                    <h3>Ups!</h3>
                                                    <h4>No hemos encontrado esto</h4>
                                                </div>
                                            </div>
                                    </div>
                                </div>

                                <div className="optionsConfig">
                                    <nav>
                                        <ul>
                                            
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={focus ? "clientConversation Focus" : "clientConversation"}>
                        <div className="notFound">
                            <h1>No hemos encontrado esto</h1>
                        </div>
                    </div> 
                    
                </div>
                :
                <div className="containerActionsEmbudo">
                    <div className="top">
                        <div className="containerTop">
                            <div className="title">
                                <div className="juntos">
                                    <button className='btn' onClick={() => openAction()}>
                                        <MdArrowBack className='icon' />
                                    </button>
                                    <div className="dataTitle">
                                        {
                                            item.state == 'intento 1' || item.state == 'intento 2' || item.state == 'intento 3'?
                                            <div className="topDataClient">
                                                <div className="photo">
                                                    <img src="https://static.vecteezy.com/system/resources/previews/026/822/782/non_2x/incognito-icon-unknown-illustration-sign-nameless-symbol-or-logo-vector.jpg" alt="" />
                                                </div>
                                                <div className="clientData">
                                                    <h3>{item.nombreEmpresa}</h3>
                                                    <h4>{item.namePersona}</h4>
                                                    <h4>{item.phone}</h4>
                                                    <span>{item.direccion}</span>
                                                </div>
                                            </div>
                                            :
                                            <div className="topDataClient">
                                                <div className="photo">
                                                    {console.log(item)}
                                                    <img style={{borderRadius:100}} src={item && item.client ? item.client.photo ? item.client.photo : null : null} alt="" />
                                                </div>
                                                <div className="clientData"> 
                                                    <h3>{item.client.nombreEmpresa}</h3>
                                                    <h4>{item.client.responsable}</h4>
                                                    <h4>{item.client.phone}</h4>
                                                    <span>{item.client.direccion}</span>
                                                </div>
                                            </div>
                                        }


                                    </div>
                                </div>

                                <div className="optionsConfig">
                                    <nav>
                                        <ul>
                                            
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={focus ? "clientConversation Focus" : "clientConversation"}>
                             
                            {/* Nube de acciones */}
                            {
                                item.state.split(' ')[0] == 'intento' ?
                                <NubeActionsIntentos user={user} item={item} />
                                :
                                item.state == 'perdido' ? null:
                                <NubeActions user={user} item={item} />
                            }
                            { item.client ? 
                            <div className="containerClientConversation"ref={mensajeRef}>
                                {
                                    item.client.registers && item.client.registers.length ?
                                        item.client.registers.map((register, i) => {
                                            return (
                                                // AUTOMATICO
                                                register.manual == 'automatico' ?
                                                    <div className="itemConversation" key={i+1}>
                                                        <div className="icono">
                                                            {
                                                                register.type == 'visita' ?
                                                                    <MdBusiness className='icon' />
                                                                : register.type == 'contacto' ?
                                                                    <MdCall className='icon' /> 
                                                                : null

                                                            }
                                                        </div>
                                                        <div className="register">
                                                            <span className="time">
                                                                {
                                                                    dayjs(register.createdAt.split('T')[0]).format('dddd, MMMM D, YYYY') 
                                                                
                                                                }</span>
                                                                <h4>- Sistema</h4> <br />
                                                            <span className='note'>{register.note}</span><br />
                                                        </div>
                                                    </div>
                                                // MANUAL
                                                :register.manual == 'manual' ?
                                                    <div className="itemConversation Manual">
                                                        <div className={register.type == 'visita' ? "icono Visita" : register.type == 'contacto' ? "icono Call" : "icono"}>
                                                            {
                                                                register.type == 'visita' ?
                                                                    <MdBusiness className='icon' />
                                                                : register.type == 'contacto' ?
                                                                    <MdCall className='icon' /> 
                                                                : null

                                                            }
                                                        </div>
                                                        <div className={register.type == 'visita' ? "register Visita" : register.type == 'call' ? "register Call" : "register"}>
                                                            <span className="time">
                                                                {
                                                                    dayjs(register.createdAt.split('T')[0]).format('dddd, MMMM D, YYYY') 
                                                                
                                                                }</span>
                                                            {
                                                                register.type == 'visita' ?
                                                                <h4>- {item.title}</h4>
                                                                : register.type == 'contacto' ?
                                                                <h4>- {item.title} </h4>
                                                                :null
                                                            }
                                                            <h3>{register.user.name} escribio:</h3> 
                                                            <span className='note'>{register.note}</span><br />
                                                        </div>
                                                    </div>
                                                : null                
                                            )
                                        })
                                    : <span>Sin registros</span>
                                }
                                

                            </div>
                                : null
                            }
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        addNote();
                    }} className={focus ? "bottomType Focus" : "bottomType"}>
                        <textarea className='type' onFocus={handleFocus} onBlur={handleOffFocus} placeholder='Escribe una nota' name="" id=""
                        onChange={(e) => {
                            setNote(e.target.value)
                        }} value={note} 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();  // Evitar el salto de línea en el textarea
                                addNote();           // Llamar a la función que envía el texto
                            } 
                        }}></textarea>
                    </form>
                </div>
            }
        </div>
    )
}