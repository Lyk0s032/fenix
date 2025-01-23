import React from 'react';
import ItemCotizaciones from './itemCotizacion';
import ItemEnEspera from './itemEspera';

export default function EnEspera(props){
    const data = props.data;
    const desarrollo =  data.filter(ct => ct.state == 'aplazado');

    return (
        <div className="containerInfoData">
            <table>
                <tbody>
                    {
                        desarrollo && desarrollo.length ?
                            desarrollo.map((cotizacion, i) => {
                                return (
                                    <ItemEnEspera key={i+1} cotizacion={cotizacion} calendary={cotizacion.calendaries ? cotizacion.calendaries : null}/>
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