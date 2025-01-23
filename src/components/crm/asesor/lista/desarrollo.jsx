import React from 'react';

export default function DesarrolloByUser(props){
    const data = props.data;
    return (
        <div className="listTable">
            <table>
                <tbody>
                    {
                        data && data.length ?
                            data.map((res, i) => {
                                return ( 
                                    res.state == 'desarrollo' ?
                                    <tr>
                                        <td>
                                            <div className="business">
                                                <div className="photo">
                                                    <img src={res.client.photo} alt="" />
                                                </div>
                                                <div className="data">
                                                    <h3>{res.client.nombreEmpresa}</h3>
                                                    <span>{res.client.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="title">
                                                <h3>{res.name}</h3>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="try">
                                                <span>En desarrollo</span>
                                            </div>
                                        </td>
                                    </tr>
                                    :null
                                )
                            })
                        :
                        <div className="notFound">
                            <h1>No hay resultados</h1>
                        </div>
                    }
                    
                </tbody>
            </table>
        </div>
    )
}