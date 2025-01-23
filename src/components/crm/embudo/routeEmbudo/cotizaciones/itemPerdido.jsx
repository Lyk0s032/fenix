import React from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

export default function ItemEnPerdido(props){
    const cotizacion = props.cotizacion;
    const calendaries = props.calendary;
    const dispatch = useDispatch();
    const time = calendaries && calendaries.length ? calendaries.find(tl => tl.state == 'active') : null;
    const [params, setParams] = useSearchParams();
    
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
                    <span>Fecha de cotización:  {dayjs(cotizacion.fecha.split('T')[0]).format('dddd, MMMM D, YYYY')}</span>
                </div>
            </td>
            <td>
                <div className="state">
                    <h3 style={{color: 'red'}}>Perdido</h3>
                </div>
            </td>
            
        </tr>
    )
}