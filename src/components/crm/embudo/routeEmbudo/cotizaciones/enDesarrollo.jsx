import React from 'react';
import ItemEnDesarrollo from './itemEnDesarrollo';

export default function EnDesarrollo(props){
    const data = props.data;
    const desarrollo =  data.filter(ct => ct.state == 'desarrollo'); 
    return (
        <div className="containerInfoData">
            <table>
                <tbody>
                    {
                        desarrollo && desarrollo.length ?
                            desarrollo.map((cotizacion, i) => {
                                return ( 
                                    <ItemEnDesarrollo key={i+1} cotizacion={cotizacion} />

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