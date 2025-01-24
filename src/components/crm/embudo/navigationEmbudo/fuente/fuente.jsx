import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdArrowBack, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../../../store/action/action';
import { useSearchParams } from 'react-router-dom';

export default function Fuente(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const sistema = useSelector(store => store.system);
    const { system, alerta} = sistema;

    const [interes, setInteres] = useState('offline')
    const sendNav = (route) => {
        dispatch(actions.HandleNav(route))
    }

    const openFuente = (fuente) => {
        dispatch(actions.getFuente(fuente))
        params.set('add', 'online')
        setParams(params);
    }
    return (
        <div className="embudoNav">
            <div className="containerEmbudoLeft">
                <div className="headerNavEmbudo">
                    <div className="before">
                        <button onClick={() => sendNav(null)}>
                            <MdArrowBack className="icon" />
                        </button>
                    </div>
                    <div className="headerNavEmbudoTitle" style={{textAlign:'center'}}>
                        <h3>Fuentes</h3>
                    </div>
                    <div className="before">
                        <button onClick={() => {
                            params.set('add', 'offline');
                            setParams(params);
                        }}>
                            <AiOutlinePlus className='icon' />
                        </button>
                    </div>
                </div>
                <div className="scrollLeftEmbudo">
                    <div className="containerScrollLeft">
                        <div className="searchAll">
                            <div className="search">
                                <nav>
                                    <ul>
                                        <li className={interes == 'offline' ? 'Active' : null}
                                        onClick={() => setInteres('offline')}> 
                                            <div>
                                                <span>Físicas</span>
                                            </div>
                                        </li>
                                        <li className={interes == 'online' ? 'Active' : null}
                                        onClick={() => setInteres('online')}>
                                            <div>
                                                <span>Virtuales</span>
                                            </div>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="listLonger">
                                <div className="containerListLonger">
                                    { 
                                    interes == 'offline' ?
                                        system.fuentes && system.fuentes.length ?
                                            system.fuentes.map((fuente, i) => {
                                                console.log(fuente)
                                                return (
                                                    fuente.type == 'offline' ?
                                                        <div className="fuente">
                                                            <div className="containerFuente">
                                                                <div className="dataFuente">
                                                                    <h3>{fuente.nombre}</h3>
                                                                </div>
                                                                <div className="options">
                                                                    <button>
                                                                        <BsThreeDotsVertical className="icon" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    : null
                                                )
                                            })
                                        : <span>No hay tags</span>
                                    :

                                        system.fuentes && system.fuentes.length ?
                                            system.fuentes.map((fuente, i) => {
                                                console.log(fuente)
                                                return (
                                                    fuente.type == 'online' ?
                                                        <div className="fuente" onClick={() => {
                                                            openFuente(fuente) 
                                                        }}>
                                                            <div className="containerFuente">
                                                                <div className="dataFuente">
                                                                    <h3>{fuente.nombre}</h3>
                                                                </div>
                                                                <div className="options">
                                                                    <button>
                                                                        <BsThreeDotsVertical className="icon" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    : null
                                                )
                                            })
                                        : <span>No hay tags</span>
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