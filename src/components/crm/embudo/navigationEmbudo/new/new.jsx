import React, { useEffect, useState } from 'react';
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

    const usuarios = useSelector(store => store.usuario);
    const { asesores, loadingAsesores } = usuarios; 

    const sendNav = (route) => {
        dispatch(actions.HandleNav(route))
    } 
    const setStep = (route) => {
        dispatch(actions.HandleNew(route))
    }

    useEffect(() => {
        if(!asesores){
            dispatch(actions.axiosToGetAsesores(user.id, true)) 
        }
    }, [asesores])
    return (
        <div className="embudoNav">
            {
                loadingAsesores || !asesores ?
                    <div className="containerEmbudoLeft">
                        <h1>Cargando...</h1>
                    </div>
                :
                !asesores || asesores == 'notrequest' || asesores == 404 ?
                    <div className="containerEmbudoLeft">
                        <h1>No hemos logrado cargar esta información</h1>
                        <span>Intentalo más tarde</span>
                    </div>
                : 
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
                                                <CotizacionNew user={user} asesores={asesores} />
                                            : step == 'call' ?
                                                <Llamada type='call' user={user} asesores={asesores}/>
                                            : step == 'visita' ?
                                                <Llamada type='visita' user={user} asesores={asesores}/>
                                            :null 
                                        }
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