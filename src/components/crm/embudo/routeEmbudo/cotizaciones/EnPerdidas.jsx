import React from 'react';
import ItemCotizaciones from './itemCotizacion';
import ItemEnEspera from './itemEspera';
import ItemEnPerdido from './itemPerdido';

export default function EnPerdido(props){
    const data = props.data;
    const perdido =  data.filter(ct => ct.state == 'perdido');

    return (
        <div className="containerInfoData">
            <table>
                <tbody>
                    {
                        perdido && perdido.length ?
                        perdido.map((cotizacion, i) => {
                                return (
                                    <ItemEnPerdido key={i+1} cotizacion={cotizacion} calendary={cotizacion.calendaries ? cotizacion.calendaries : null}/>
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