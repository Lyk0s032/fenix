import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import axios from 'axios';
export default function ModalNewFuente(){
    const [params, setParams] = useSearchParams();
    const [type, setType] = useState('offline');
    const [nameFuente, setNameFuente] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleNewFuente = async () => {
       if(!nameFuente) dispatch(actions.HandleAlerta('No puedes dejar el campo vacio.', 'negative'))
        // caso contrario
        setLoading(true)

        let body = {
                name: nameFuente,
                type: type
        }
        const create = await axios.post('/api/prospecto/addFuente', body)
        .then((res) => {
            setLoading(false)
            setNameFuente('')
            dispatch(actions.axiosGetSystem(false))            
            dispatch(actions.HandleAlerta('Fuente creada con éxito.', 'positive'))
        }).catch((err) => {
            setLoading(false)
            dispatch(actions.HandleAlerta('Ha ocurrido un error.', 'negative'))

        })
    }
    return (
        <div className="modal">
            <div className="hidden" onClick={() => {
                params.delete('add');
                setParams(params);
            }}></div>
            <div className="containerModalSmall">
                <div className="header">
                    <h3>Nueva fuente - <button onClick={() => {
                        if(type == 'offline'){
                           return  setType('online')
                        }else{
                            setType('offline')
                        }
                    }}>{type == 'offline' ? 'Físicas' : 'Online'}</button></h3>
                </div>
                <div className="result">
                    <form className="containerResult" onSubmit={(e) => {
                        e.preventDefault()
                        if(!loading){
                            handleNewFuente()
                        }
                    }}>
                        <div className="inputDiv">
                            <label htmlFor="">Nombre de la fuente</label><br />
                            <input type="text" placeholder='Ej. Carlos Muñoz'
                            value={nameFuente} onChange={(e) => {
                                setNameFuente(e.target.value)
                            }} />
                        </div>

                        <div className="inputDiv">
                            <button>
                                <span>{loading ? 'Creando...' : 'Añadir fuente'}</span>
                            </button>
                        </div>
                        
                    </form>
                </div>
            
            </div>

        </div>
    )
}