import dayjs from 'dayjs';
import React from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';

export default function CotizacionesListClient(props){
    const type = props.type;
    const cotizaciones = props.cotizaciones;

    const pendientes = cotizaciones.length ? cotizaciones.filter(coti => coti.state == 'pendiente' || coti.state == 'aplazado') : [];
    const desarrollo = cotizaciones.length ? cotizaciones.filter(coti => coti.state == 'desarrollo') : [];

    const dispatch = useDispatch();
    const closeCotizacion = () => {
        const coti = document.querySelector("#cotizacion").classList.toggle('cotizacionActive');
        return coti;
    }

    const open = (item) => {
        dispatch(actions.getCotizacion(item))
        closeCotizacion()
    }
    return (
        <div className="cotizacionesLists">
            {
                type == 'pendientes' ?
                <div className="containerLists">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <span>Cotización</span>
                                </th>
                                <th>
                                    <span>Valor</span>
                                </th>
                                <th>
                                    <span>Nro</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pendientes.length ?
                                    pendientes.map((coti, i) => {
                                        return (
                                            <tr key={i+1}>
                                                <td onClick={() => open(coti)} >
                                                    <div className="title">
                                                        <h3>{coti.name}</h3>
                                                        <span>{dayjs(coti.fecha).format('dddd DD MMMM YYYY ')}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="price">
                                                        <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(coti.bruto)-Number(coti.descuento))} <span>COP</span></h3>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='nro'>
                                                        <span>{coti.nro}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                :

                                <h1>No hay resultados</h1>
                            }
                            

                        </tbody>
                    </table>
                </div>
                : type == 'desarrollo' ?
                <div className="containerLists">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <span>Cotización</span>
                                </th>
                                <th>
                                    <span>Valor</span>
                                </th>
                                <th>
                                    <span>Nro</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                desarrollo.length ?
                                    desarrollo.map((coti, i) => {
                                        return (
                                            <tr key={i+1}>
                                                <td onClick={() => open(coti)}>
                                                    <div className="title">
                                                        <h3>{coti.name}</h3>
                                                        <span>{dayjs(coti.fecha).format('dddd DD MMMM YYYY ')}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="price">
                                                        <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(coti.bruto)-Number(coti.descuento))} <span>COP</span></h3>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='nro'>
                                                        <span>{coti.nro}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                :

                                <h1>No hay resultados</h1>
                            }
                            

                        </tbody>
                    </table>
                </div>
                :null
            }
            
        </div>
    )
}