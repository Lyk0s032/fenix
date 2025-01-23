import React from 'react';
import ItemCotizaciones from './itemCotizacion';

export default function Pendientes(props){
    const data = props.data;
    const pendientes =  data.filter(ct => ct.state == 'pendiente'); 
    return (
        <div className="containerInfoData">
            <table>
                <tbody>
                    {
                        pendientes && pendientes.length ?
                            pendientes.map((cotizacion, i) => {
                                return (
                                    <ItemCotizaciones key={i+1} cotizacion={cotizacion} />

                                )
                            })
                    : 
                        <div className="notFound">
                            <h1>No hay cotizaciones aquí</h1>
                        </div>
                    }

                </tbody>
            </table>
        </div>
    )
}