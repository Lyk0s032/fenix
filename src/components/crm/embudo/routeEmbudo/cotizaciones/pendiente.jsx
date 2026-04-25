import React from 'react';
import ItemCotizaciones from './itemCotizacion';

export default function Pendientes(props){
    const data = props.data;
    const selectedEstado = props.selectedEstado;
    
    // Primero filtrar por state (pendiente)
    let pendientes = data.filter(ct => ct.state == 'pendiente');
    
    // Luego aplicar filtro de estado si está seleccionado
    if (selectedEstado !== null) {
        if (selectedEstado === 'sin_enviar') {
            pendientes = pendientes.filter(cot => !cot.estado || cot.estado === null);
        } else {
            pendientes = pendientes.filter(cot => cot.estado === selectedEstado);
        }
    }
    
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