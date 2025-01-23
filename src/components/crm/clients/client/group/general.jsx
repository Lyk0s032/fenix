import React, { useState } from 'react';

export default function GeneralUser(props){
    const coti = props.cotizaciones;
    const [show, setShow] = useState(null);
    console.log(coti)

    const pendientes = coti && coti.length ? coti.filter(cl => cl.state == 'pendiente') : 0
    const desarrollo = coti && coti.length ? coti.filter(cl => cl.state == 'desarrollo') : 0
 
    console.log(pendientes)
    return (
        <div className="containerGeneralUser">
            <div className="containerResultsUser">
                <div className="leftNavigation">
                    <div className="containerNav">
                        <nav>
                            <ul>
                                <li className={!show ? 'Active' : null} 
                                onClick={() => setShow(null)}>
                                    <div>
                                        <span>Cotizaciones pendientes</span>
                                    </div>
                                </li>
                                <li className={show == 'desarrollo' ?  'Active' : null} 
                                onClick={() => setShow('desarrollo')}>
                                    <div>
                                        <span>Cotizaciones en desarrollo</span>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="rightData">
                    <div className="containerRightData">
                        { 
                            !show ?
                            <table>
                                <tbody>
                                    {
                                        pendientes && pendientes.length ?
                                            pendientes.map((pendiente, i) => {
                                                return (
                                                    <tr >
                                                        <td >
                                                            <div className="business">
                                                                <div className="photo">
                                                                    <img src={pendiente.client.photo} alt="" />
                                                                </div>
                                                                <div className="data">
                                                                    <h3>{pendiente.client.nombreEmpresa}</h3>
                                                                    <span>{pendiente.client.fecha}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="title">
                                                                <h3>{pendiente.name}</h3>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='try'>
                                                                <span>{pendiente.nro}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <div className="notFound">
                                                <h1>No hay resultados</h1>
                                            </div>
                                    }
                                    
                                  
                                </tbody>
                            </table>
                            :
                        
                            <table>
                                <tbody>
                                {
                                        desarrollo && desarrollo.length ?
                                            desarrollo.map((desarro, i) => {
                                                return (
                                                    <tr >
                                                        <td >
                                                            <div className="business">
                                                                <div className="photo">
                                                                    <img src={desarro.client.photo} alt="" />
                                                                </div>
                                                                <div className="data">
                                                                    <h3>{desarro.client.nombreEmpresa}</h3>
                                                                    <span>{desarro.client.fecha}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="title">
                                                                <h3>{desarro.name}</h3>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='try'>
                                                                <span>En desarrollo</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <div className="notFound">
                                                <h1>No hay resultados</h1>
                                            </div>
                                    }
                                    
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}