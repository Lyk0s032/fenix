import React, { useState } from 'react';
import { MdArrowRight, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import * as actions from '../../../store/action/action';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function VisitaOrCallAgentar(props){
    const user = props.user;
    const item = props.item;
    const calendary = props.calendary;
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        time: null,
        hour: null,
        title: null
    });
    const [loading, setLoading] = useState(false);

    const calendarioActivo = calendary && calendary.length ? calendary.find((fecha) => fecha.state == 'active') : null;
    const newVisita = async () => {
        if(loading) return null;
        if(!form.time || !form.hour || !form.title) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'))
        setLoading(true);
        let body = {
            callId: item.id,
            clientId: item.client.id,
            userId: user.id,
            calendaryId: calendarioActivo ? calendarioActivo.id : null,
            title: form.title,
            time: form.time,
            hour: form.hour
        }
        const agendarVisita = await axios.post('/api/call/agendaVisita', body)
        .then((res) => {
            setLoading(false);
            dispatch(actions.HandleAlerta('Visita agendada con éxito', 'positive'))
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('w')
            params.delete('a');
            setParams(params);
        })
        .catch(err => {
            setLoading(false);
            console.log(err)
            dispatch(actions.HandleAlerta('Ha ocurrido un error', 'mistake'))

        })
    }

    return (
        <div className="formAction">
            <div className="formAction">
                <div className="headerAction">
                    <h3>Perfecto, ¡Agendemos la visita!</h3>
                </div>
                <div className="containerActionForm">
                    <form className="form" onSubmit={(e) => {
                        e.preventDefault();
                        return newVisita()
                    }}>
                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">
                                    Selecciona una nueva fecha
                                </label><br />
                                <input type="date" onChange={(e) => {
                                    setForm({
                                        ...form,
                                        time: e.target.value
                                    })
                                }} value={form.time}/>
                            </div>

                            <div className="inputDiv">
                                <label htmlFor="">
                                    Selecciona la hora
                                </label><br />
                                <select name="" id="" onChange={(e) => {
                                    setForm({
                                        ...form,
                                        hour: e.target.value
                                    })
                                }} value={form.hour}>
                                    <option value="7:00">7:00 AM</option>
                                    <option value="8:00">8:00 AM</option>
                                    <option value="9:00">9:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="13:00">1:00 PM</option>
                                    <option value="14:00">2:00 PM</option>
                                    <option value="15:00">3:00 PM</option>
                                    <option value="16:00">4:00 PM</option>
                                    <option value="17:00">5:00 PM</option>
                                    <option value="18:00">6:00 PM</option>
                                    <option value="19:00">7:00 PM</option>
                                    <option value="20:00">8:00 PM</option>
                                    <option value="21:00">9:00 PM</option>
                                    <option value="22:00">10:00 PM</option>
                                </select>
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="">Titulo de la visita</label><br />
                            <input type="text" onChange={(e) => {
                                setForm({
                                    ...form,
                                    title: e.target.value
                                })
                            }} value={form.title}/>
                        </div>

                        <div className="inputDiv">
                            <button className='send'>
                                <span>
                                    {loading ? 'Programando nueva visita' : 'Programar visita'}
                                </span>
                                <MdOutlineKeyboardArrowRight className="icon" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}