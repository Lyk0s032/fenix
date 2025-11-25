import React, { useState } from 'react';
import ItemCotizaciones from './itemCotizacion';
import { useSelector } from 'react-redux';

export default function AprobadasCotizaciones(props){
    const data = props.data;
    const usuarios = useSelector(store => store.usuario);
    const { asesores, loadingAsesores } = usuarios;
    
    console.log(usuarios)
    const [ase, setAse] = useState(null);

    const cotizacionesFiltradas = ase
    ? data.filter(c => c.userId === Number(ase))
    : data;
 
    console.log(data)
    console.log('asesor', ase)
    return (
        <div className="containerInfoData">
            <select name="" id="" onChange={(e) => {
                    setAse(e.target.value)
                }} value={ase}>
                <option value="">Seleccionar asesor</option>
                {
                    asesores?.length ? 
                        asesores.map((asesor, i) => {
                            return (
                                <option  key={i+1}
                                 value={asesor.id}>{asesor.name}</option>
                            )
                        })
                    : null
                }
            </select>
            <table>
                <tbody>
                    {
                        data && data.length ?
                        cotizacionesFiltradas.map((cotizacion, i) => (
                            <ItemCotizaciones key={i + 1} cotizacion={cotizacion} />
                        ))
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