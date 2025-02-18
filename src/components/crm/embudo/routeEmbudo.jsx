import React, { useEffect } from 'react';
import NavEmbudo from './navigationEmbudo/navEmbudo';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import ContactoEmbudo from './routeEmbudo/contacto';
import { CSSTransition } from 'react-transition-group';
import ActionsPanelEmbudo from './actions/actionsPanel';
import VisitaEmbudo from './routeEmbudo/visita';
import * as actions from './../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import ProspectosEmbudo from './routeEmbudo/prospectos';
import CotizacionesEmbudo from './routeEmbudo/cotizaciones';
import CotizacionesPanel from './routeEmbudo/cotizaciones/visualizar';
import AprobadasEmbudo from './routeEmbudo/aprobadas';

export default function RouteEmbudo(props){
    const user = props.user;
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();

    const embudo = useSelector(store => store.embudo);

    const { contactos, loadingContacto, visitas, loadingVisitas } = embudo;
    

    const searchData = async () => {
        dispatch(actions.EmbudoLoading(true))
        dispatch(actions.AxiosGetAllEmbudo(user.id, true))
    }
    useEffect(() => {
        // dispatch(actions.axiosToGetContactos(1, true))
        // dispatch(actions.axiosToGetVisitas(1, true))
        searchData()
        .then((res) => {
            dispatch(actions.EmbudoLoading(false))
        })

    }, [])
    return ( 
        <div className="embudo">
            <div className="containerEmbudo">
                {/* NAVEGACION DENTRO DEL EMBUDO */}
                <div className="segureDiv">
                    {
                        embudo.loadingEmbudo ?
                            <h1>Cargando</h1>
                        : 
                        <NavEmbudo user={user} />

                    }
                </div>

                {

                    <div className="visualizacionEmbudo">
                        {
                            user.rango == 'comercial' ?
                                <Routes>
                                    <Route path="/*" element={<ProspectosEmbudo />} />
                                </Routes>
                            :
                                <Routes>
                                    <Route path="/*" element={<ContactoEmbudo contactos={contactos}/>} />
                                    <Route path="/visitas/*" element={<VisitaEmbudo />} />
                                    <Route path="/cotizaciones/*" element={<CotizacionesEmbudo />} />
                                    <Route path="/prospectos/*" element={<ProspectosEmbudo />} />
                                    <Route path="/aprobadas/*" element={<AprobadasEmbudo />} />
                                </Routes>

                        }

                            <CSSTransition 
                                in={params.get('w') == 'action'} 
                                timeout={500}
                                classNames="slide"
                                unmountOnExit>
                                    <ActionsPanelEmbudo user={user} />
                            </CSSTransition>


                            <CSSTransition 
                                in={params.get('cotizacion')} 
                                timeout={500}
                                classNames="slide"
                                unmountOnExit>
                                    <CotizacionesPanel user={user}/>
                            </CSSTransition>
                    </div>
                }
            </div>
        </div>
    )
}