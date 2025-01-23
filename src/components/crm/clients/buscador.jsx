import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Buscador(props){
    const [clientes, setClientes] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
    return (
        <div className="containerSearchClients">
            <div className="inputDiv">
                <input type="text" placeholder='Busca entre todos los clientes' 
                onChange={(e) => {
                    setWord(e.target.value)
                    searchAllForType(e.target.value)
                }} value={word} />
                {
                    !clientes ? null
                    :
                <div className="resultsDivs">
                    <div className="data">
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
                                <div className="clientDiv" onClick={() => navigate(`client/${cl.id}`)}>
                                    <div className="containerClientDiv">
                                        <div className="photo">
                                            <img src={cl.photo} alt="" />
                                        </div>
                                        <div className="dataClientDiv">
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
                }
            </div>
        </div>
    )
}