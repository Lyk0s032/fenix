import React, { useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdAttachMoney } from 'react-icons/md';
import NewEmbudo from './new/new';
import Fuente from './fuente/fuente';
import Tags from './tags/tags';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../../store/action/action';

import Prospecto from './prospecto/prospecto';
import { FaDollarSign } from 'react-icons/fa';
import ModalSeeOnline from '../modales/newFuenteOnline';

export default function NavEmbudo(props){
    const user = props.user;
    const [state, setState] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const navRoute = location.pathname;
    // STATES

    const usuario = useSelector(store => store.usuario);
    const sistema = useSelector(store => store.system);
    const { nav } = sistema;

    const embudo = useSelector(store => store.embudo);

    const sendNav = (route) => {
        dispatch(actions.HandleNav(route))
    }

    const divRef = useRef(null);
    const handleOpen = () => {
        const a = document.querySelector("#hidden").classList.toggle('hidden-Active')
        return a
    }

    const handleClose = () => {
        const a = document.querySelector("#hidden")
        if(a.className == 'hidden'){

        }else{
            a.classList.toggle('hidden-Active')

        }
    }

    return (
        <div className="embudoNavigation">
            <div className="containerEmbudoNavigation">
                <div className="top">
                    <div className="containerTop">
                        <div className="logo">
                            <img src="https://metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                        </div>
                        <div className="smallOptions">
                            <nav>
                                <ul >
                                    <li onClick={() => sendNav('new')}>
                                        <div className="">
                                            <AiOutlinePlus className="icon" />
                                        </div>
                                    </li>
                                    <li className='' ref={divRef} tabIndex="0"  onClick={() => handleOpen()} onBlur={() => handleClose()}>
                                        <div className="navHidden" >
                                            <BsThreeDotsVertical className="icon" />

                                            <div className="hidden" id="hidden">
                                                <nav>
                                                    <ul>
                                                        <li onClick={() => sendNav('fuente')}>
                                                            <AiOutlinePlus className="icono" />
                                                            <span>Fuente</span><br />
                                                        </li>
                                                        <li onClick={() => sendNav('prospecto')}>
                                                            <AiOutlinePlus className="icono" />
                                                            <span>Prospecto</span><br />
                                                        </li>
                                                        <li onClick={() => sendNav('tags')}>
                                                            <AiOutlinePlus className="icono" />
                                                            <span>Tags</span><br />
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                {
                    user.rango == 'lider' || user.rango == 'asesor' ?
                        <div className="searchAndTags">
                            <div className="containerSearchAndTags">

                                <div className="financeThisMonth">
                                    <div className="containerFinanceThisMonth">
                                        
                                        <div className="dataFinanceBig" onClick={() => navigate('/aprobadas')}>
                                            <div className="containerDataFinance">
                                                <div className="icono">
                                                    <FaDollarSign className="icon" />
                                                </div>
                                                    {
                                                        embudo.loadingAprobadas || !embudo.aprobadas ?
                                                            <div className="rightFinance">
                                                                <span>Hasta el momento</span> 
                                                                <h1>--- <span>COP</span></h1>
                                                                <h3>-- Cotizaciones aprobadas</h3>
                                                            </div>
                                                        : embudo.aprobadas == 404 || embudo.aprobadas == 'notrequest' ?
                                                            <div className="rightFinance">
                                                                <span>Hasta el momento</span> 
                                                                <h1>0 <span>COP</span></h1>
                                                                <h3>0 Cotizaciones aprobadas</h3>
                                                            </div> 
                                                        : embudo.aprobadas.length ?  
                                                            <div className="rightFinance">
                                                                {console.log(embudo.aprobadas)} 
                                                                <span>Hasta el momento</span>
                                                                <h1>{new Intl.NumberFormat('es-CO', {currency: 'COP'}).format(embudo.aprobadas.reduce((acumulador, valorActual) => acumulador + (Number(valorActual.bruto) - Number(valorActual.descuento)), 0)) } <span>COP</span></h1>
                                                                <h3>{embudo.aprobadas.length} Cotizaciones aprobadas</h3>
                                                            </div>
                                                        :
                                                            <div className="rightFinance">
                                                                <span>Hasta el momento</span> 
                                                                <h1>--- <span>COP</span></h1>
                                                                <h3>--- Cotizaciones aprobadas</h3>
                                                            </div>
                                                    }
                                                
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                {/* <div className="search">
                                    <input type="text" placeholder='Buscar cliente' />
                                </div> */}
                                {/* <div className="tagsOpen">
                                    <div className="containerTags">
                                        <button onClick={() => sendNav('fuente')}>
                                            <AiOutlinePlus className="icon" />
                                            <span>Fuente</span><br />
                                        </button>
                                        <button onClick={() => sendNav('prospecto')}>
                                            <AiOutlinePlus className="icon" />
                                            <span>Prospecto</span>
                                        </button>
                                        
                                        <button onClick={() => sendNav('tags')}>
                                            <AiOutlinePlus className="icon" />
                                            <span>Tags</span>
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    :null
                }
                <div className="optionsForNavigationEmbudo">
                    {
                        user.rango == 'lider' || user.rango == 'asesor' ?
                        <div className="containerOptionsForNavigationEmbudo">
                            
                            <div className={navRoute == "/" ? "itemNavigation Active" : 'itemNavigation'} onClick={() => navigate('/')}>
                                <div className="containerItemNavigation">
                                    <div className="title">
                                        <div className="titleInfo">
                                            <h3>Contactos</h3>
                                            <h1>
                                                {
                                                    embudo.loadingContactos || !embudo.contactos || embudo.contactos == 404 || embudo.contactos == 'notrequest' ?
                                                    0
                                                    : embudo.contactos.length ? embudo.contactos.length : 0 
                                                }
                                            </h1>

                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className={navRoute == "/visitas" ? "itemNavigation Active" : 'itemNavigation'}  onClick={() => navigate('/visitas')}>
                                <div className="containerItemNavigation">
                                    <div className="title">
                                        
                                        <div className="titleInfo">
                                            <h3>Visitas pendientes</h3>
                                            <h1>
                                                {
                                                    embudo.loadingVisitas || !embudo.visitas || embudo.visitas == 404 || embudo.visitas == 'notrequest'  ?
                                                    0
                                                    : embudo.visitas.length ? embudo.visitas.length : 0
                                                }
                                            </h1>

                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className={navRoute == "/cotizaciones" ? "itemNavigation Active" : 'itemNavigation'}  onClick={() => navigate('/cotizaciones')}>
                                <div className="containerItemNavigation">
                                    <div className="title">
                                        
                                        <div className="titleInfo">
                                                {
                                                    embudo.loadingCotizaciones || !embudo.cotizaciones ?
                                                        <div className="rightFinance">
                                                            <span >Cotizaciones pendientes</span> 
                                                            <h1>--- <span>COP</span></h1>
                                                        </div>
                                                    : embudo.cotizaciones == 404 || embudo.cotizaciones == 'notrequest' ?
                                                        <div className="rightFinance">
                                                            <span >Cotizaciones pendientes</span> 
                                                            <h1>0 <span >COP</span></h1>
                                                        </div> 
                                                    : embudo.cotizaciones.length ?  
                                                        <div className="rightFinance">
                                                            <span >Cotizaciones pendientes ({embudo.cotizaciones.length})</span> 
                                                            <Pendiente cotizaciones={embudo.cotizaciones} />
                                                        </div>
                                                    :
                                                        <div className="rightFinance">
                                                            <span >Cotizaciones pendientes</span> 
                                                            <h1>--- <span>COP</span></h1>
                                                        </div>
                                                }

                                        
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>

                            <div className={navRoute == "/prospectos" ? "itemNavigation Active" : 'itemNavigation'}  onClick={() => navigate('/prospectos')}>
                                <div className="containerItemNavigation">
                                    <div className="title">
                                        
                                        <div className="titleInfo">
                                            <h3>Clientes prospectos</h3>
                                            <h1>
                                                {
                                                    embudo.loadingProspectos || !embudo.prospectos || embudo.prospectos == 404 || embudo.prospectos == 'notrequest' ?
                                                    0
                                                    : embudo.prospectos.length ? embudo.prospectos.length : 0
                                                }    
                                            </h1>                                        

                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    :
                        <div className="containerOptionsForNavigationEmbudo">
                            <div className={navRoute == "/prospectos" ? "itemNavigation Active" : 'itemNavigation'}  onClick={() => navigate('/prospectos')}>
                                <div className="containerItemNavigation">
                                    <div className="title">
                                        
                                        <div className="titleInfo">
                                            <h3>Clientes prospectos</h3>
                                            <h1>
                                                {
                                                    embudo.loadingProspectos || !embudo.prospectos || embudo.prospectos == 404 || embudo.prospectos == 'notrequest' ?
                                                    0
                                                    : embudo.prospectos.length ? embudo.prospectos.length : 0
                                                }    
                                            </h1>                                        

                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            {
                nav == 'new' ?
                    <NewEmbudo user={user}/>
                :nav == 'fuente' ?
                    <Fuente />
            
                : nav == 'tags' ?
                    <Tags />
                : nav == 'prospecto' ?
                    <Prospecto user={user} />
                : null
            }
        </div>
    )
}

function Pendiente(props){
    const cotizaciones = props.cotizaciones;

    const filtrado = cotizaciones.filter(coti => coti.state == 'pendiente' || coti.state == 'aplazado'); 
    return ( 
        <h1 >{new Intl.NumberFormat('es-CO', {currency: 'COP'}).format(filtrado.reduce((acumulador, valorActual) => acumulador + (Number(valorActual.bruto) - Number(valorActual.descuento)), 0)) } <span >COP</span></h1>
    )
}