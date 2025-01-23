import React from 'react';

export default function CotizacionesByUser(props){
    const cotizacions = props.cotizaciones;
    return (
        <div className="listTable">
            <table>
                <tbody>
                {
                    cotizacions && cotizacions.length ?
                        cotizacions.map((cotizacion, i) => {
                            return (
                                <tr>
                                    <td>
                                        <div className="business">
                                            <div className="photo">
                                                <img src={cotizacion.client.photo} alt="" />
                                            </div>
                                            <div className="data">
                                                <h3>{cotizacion.client.nombreEmpresa}</h3>
                                                <span>{cotizacion.client.type}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="title">
                                            <h3>{cotizacion.name}</h3>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="try">
                                            <span>Neto</span>
                                            <h3> {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.bruto)} <span>COP</span></h3>
                                        </div>
                                    </td>
                                </tr>
                        )})
                    :
                    <div className="loading">
                        <h1>Sin resultados</h1>
                    </div>
                    }
                </tbody>
            </table>
        </div>
    )
}