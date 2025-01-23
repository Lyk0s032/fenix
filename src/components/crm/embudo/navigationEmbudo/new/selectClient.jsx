import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '../../../../store/action/action';
import axios from 'axios';

export default function SearchClient(){
    const dispatch = useDispatch();
    const [clientes, setClientes] = useState(null);
    const [loading, setLoading] = useState(false);

    const [word, setWord] = useState(null);
    const searchAllForType = async (query) => {

        if(!query || query == '') return null

            const srch = await axios.get('api/clients/search', {
                params: { query: query }
            })
            .then((res) => {
                if(res.status == 404){
                    setClientes(404);
                }else{
                    setClientes(res.data);
                }
            })
            .catch(err => {
                if(err.status == 404){
                    setClientes(404);
                }else{
                    setClientes(res.data);
                }
            });
            setWord(query)
            return srch;
    }

    const SelectClient = async (cliente) => {
        dispatch(actions.handleCliente(cliente))
        dispatch(actions.HandleNew('choose'))
    }

    return ( 
        <div className="leftNavEmbudoNew">
            <div className="containerLeftNavEmbudoNew">
                
                <div className="divSearchClientes">
                    <div className="inputDiv">
                        <input type="text" placeholder='Buscar aquí' 
                        onChange={(e) => {
                            setWord(e.target.value)
                            searchAllForType(e.target.value)
                        }} value={word}/>
                    </div>
                </div>
                <div className="titleNew">
                    <h3>Clientes de la empresa</h3>
                </div>
                {
                    !clientes?
                        <div className="notFound">
                            <h3>Buscar elementos</h3>
                        </div>
                    :
                    clientes == 404 ?
                        <div className="notFound">
                            <h3>No hemos encontrado clientes con <strong>{word} </strong></h3>
                        </div>
                   :
                   clientes.map((cl, i) => {
                        return (
                            <div className="itemClient" key={i+1} onClick={() => {
                                SelectClient(cl)
                            }}>
                                <div className="containerItemCl">
                                    <div className="photo">
                                        <img src={cl.photo} alt="" />
                                    </div>
                                    <div className="dataClient">
                                        <h3>{cl.nombreEmpresa}</h3>
                                        <span>{cl.type}</span>
                                    </div>
                                </div>
                            </div>
                        )
                   })
                    
                }
                
            </div>
        </div>
    )
}