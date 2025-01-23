import React, { useState } from 'react';
import { MdArrowBack, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import SearchClient from './selectClient';
import CotizacionNew from './cotizacion';
import Llamada from './llamada';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../../../store/action/action';
import Choose from './choose';

export default function NewEmbudo(props){
    const user = props.user;
    const dispatch = useDispatch();
    const sistema = useSelector(store => store.system);
    const { step } = sistema;

    const sendNav = (route) => {
        dispatch(actions.HandleNav(route))
    } 
    const setStep = (route) => {
        dispatch(actions.HandleNew(route))
    }
    return (
        <div className="embudoNav">
            <div className="containerEmbudoLeft">
                <div className="headerNavEmbudo">
                    <div className="before">
                        <button onClick={() => {
                            // Si no hay step. Vuelve al inicio
                            !step ? sendNav(null)
                            : step == 'choose' ? setStep(null)
                            : step == 'call' || step == 'visita' || step == 'cotizacion' ?
                                setStep('choose')
                            : null
                        }}>
                            <MdArrowBack className="icon" />
                        </button>
                    </div>
                    <div className="headerNavEmbudoTitle">
                        <h3>Nuevo registro</h3>
                    </div>
                </div>
                <div className="scrollLeftEmbudo">
                    <div className="containerScrollLeft">
                        <div className="searchAll">
                          
                            <div className="scrollClients">
                                <div className="containerScroll">
                                    {
                                        !step ?
                                            <SearchClient />
                                        : step == 'choose' ?
                                            <Choose />
                                        : step == 'cotizacion' ?
                                            <CotizacionNew user={user} />
                                        : step == 'call' ?
                                            <Llamada type='call' user={user} />
                                        : step == 'visita' ?
                                            <Llamada type='visita' user={user} />
                                        :null 
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