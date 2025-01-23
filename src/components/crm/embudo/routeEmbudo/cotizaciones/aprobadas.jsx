import React from 'react';
import ItemCotizaciones from './itemCotizacion';

export default function AprobadasCotizaciones(props){
    const data = props.data;
    return (
        <div className="containerInfoData">
            <table>
                <tbody>
                    {
                        data && data.length ?
                         data.map((cotizacion, i) => {
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