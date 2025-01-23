import React from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

export default function ItemCotizaciones(props){
    const cotizacion = props.cotizacion;
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();  
    console.log(cotizacion) 
    const openCotizacion = () => {
        dispatch(actions.getCotizacion(cotizacion))
        params.set('cotizacion','action')
        setParams(params);
    }
    return (
        <tr onClick={() => {
            openCotizacion()
        }}>
            <td >
                <div className="userDiv">
                    <div className="photo">
                        <img src={cotizacion.client.photo} alt="" />
                    </div>
                    <div className="dataBusiness">
                        <h3>{cotizacion.client.nombreEmpresa}</h3>
                        <span>{cotizacion.client.type}</span>
                    </div> 
                </div>
            </td>
            <td>
                <div className="titleCoti">
                    <h3>{cotizacion.name}</h3>
                    <span>Fecha de cotización: {dayjs(cotizacion.fecha.split('T')[0]).format('dddd, MMMM D, YYYY')}</span>
                </div>
            </td>
            <td>
                <div className="price">
                    <span>Neto</span>
                    <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.neto)} COP</h3>
                </div>
            </td>
            <td>
                <div className="price">
                    <span>Nro</span> 
                    <h3>{cotizacion.nro}</h3>
                </div>
            </td>
        </tr>
    )
}