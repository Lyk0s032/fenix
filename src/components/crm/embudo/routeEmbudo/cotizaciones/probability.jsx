import React from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function Probability({ cotizacion }){
    const hastaElCien = Array.from({ length: 100 }, (_, i) => i + 1);
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    
    const giveThat = async (number) => {
        if(!number) return dispatch(actions.HandleAlerta('Debe ingresar número', 'mistake'));
        // Caso contrario, avanzamos
        let body = {
            cotizacionId: cotizacion.id,
            number: number
        }
        const send = await axios.post('/api/cotizacion/give/calification', body)
        .then(res => {
            dispatch(actions.HandleAlerta('¡Gracias!', 'positive'))
            params.delete('probability')
            setParams(params);
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('Ha ocurrido un error, intentalo más tarde.', 'mistake'));
        })

        return send;
    }
    return (
        <div className="modalProbability">
            <div className="containerRight">
                <div className="scrollOptions">
                    {
                        hastaElCien.reverse().map((r,i) => {
                            return (
                                <button key={i+1} onClick={() => {
                                    giveThat(r)
                                }}>
                                    <span>{r}%</span>
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}