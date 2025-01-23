import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import axios from 'axios';
import Item from '../routeEmbudo/item';
import { useSearchParams } from 'react-router-dom';

export default function ModalNewContact(props){
    const user = props.user;
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams()
    const sistema = useSelector(store => store.system);

    const { cliente } = sistema;

    const [form, setForm] = useState({
        nombre: null,
        phone: null,
        email: null,
        cargo: 'gerente'
    });
    const [loading, setLoading] = useState(false);

    const reset = () => {
        setForm({
            nombre: '',
            phone: '',
            email: '',
            cargo: 'gerente'
        })   
    }
    const handleCreate = async () => {
        if(loading) return null;

        if(!form.nombre || !form.phone || !form.cargo) dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'))
        // Caso contrario, agilizamos.
        setLoading(true)
        let body = {
            clientId: cliente.id,
            asesorId: user.id,
            nombre: form.nombre,
            phone: form.phone,
            email: form.email,
            rango: form.cargo
        }
        const create = await axios.post('api/contactos/add', body)
        .then((res) => {
            dispatch(actions.handleCliente(res.data));
            dispatch(actions.HandleAlerta('Contacto creado con éxito', 'positive'))
            setLoading(false)
            reset()   
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos podido crear esto, intentalo más tarde', 'mistake'))
            setLoading(false)
        
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
                    <h3>Nuevo contacto - {cliente ? cliente.nombreEmpresa : null}</h3>
                </div>
                <div className="result">
                    {
                        !cliente ?
                            <div className="notFound">
                                <h1>Selecciona primero un cliente</h1>
                            </div>
                        :
                    <div className="containerResult">
                        <div className="inputDiv">
                            <label htmlFor="">Nombre de contacto</label>
                            <input type="text" placeholder='' onChange={(e) => {
                                setForm({
                                    ...form,
                                    nombre: e.target.value
                                })
                            }} value={form.nombre}/>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="">Número de contacto</label>
                            <input type="text" placeholder='' onChange={(e) => {
                                setForm({
                                    ...form,
                                    phone: e.target.value
                                })
                            }} value={form.phone}/>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="">Correo eléctronico</label>
                            <input type="text" placeholder='' onChange={(e) => {
                                setForm({
                                    ...form,
                                    email: e.target.value
                                })
                            }} value={form.email}/>
                        </div>
                        
                        <div className="inputDiv">
                            <label htmlFor="">Cargo</label>
                            <br />
                            <select name="" id=""
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    cargo: e.target.value
                                })
                            }} value={form.cargo}>
                                <option value="gerente">Gerente</option>
                                <option value="lider de compras">Lider de compras</option>
                                <option value="asesor">Asesor</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="director ejecutivo">Director ejecutivo</option>
                            </select>
                        </div>

                        <div className="inputDiv">
                            <button onClick={() => handleCreate()}>
                                <span>{loading ? 'Creando contacto' : 'Crear contacto'}   </span>
                            </button>
                        </div>
                        
                    </div>
                    }
                </div>
            
            </div>

        </div>
    )
}