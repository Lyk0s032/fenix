import React, { useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../store/action/action';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { MdArrowBack, MdArrowLeft } from 'react-icons/md';

export default function LeftAsesores(props){
    const user = props.user;
    const usuarios = props.asesores;

    const [params, setParams] = useSearchParams();
    const [show, setShow] = useState(null);
    const dispatch = useDispatch();
    const [data, setData] = useState({
        nombre: null,
        lastName: null,
        phone: null,
        email: null,
        age: null,
        url: null,
        rango: 'asesor'
    });
    const [loading, setLoading] = useState(false);

    const createNewUser = async () => {
        if(!data.nombre || !data.lastName || !data.phone || !data.email || !data.age || !data.url){
            dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'))
        }
        if(loading) return null
        setLoading(true);

        let body = {
            name: data.nombre,
            lastName: data.lastName,
            nick: `${data.nombre} ${data.lastName}`,
            phone: data.phone,
            email: data.email,
            password: data.phone,
            rango: data.rango

        }
        const addUser = await axios.post('/api/users/create', body)
        .then((res) => {
            console.log(res);
            setLoading(false)
            dispatch(actions.HandleAlerta("Asesor creado con éxito", 'positive'));
            dispatch(actions.axiosToGetAsesores(user.id, true)) 
            
        })
        .catch(err => {
            console.log(err);
            setLoading(false)
            if(err.status == 502) return dispatch(actions.HandleAlerta("Ya existe un asesor con ese teléfono o correo eléctronico", 'mistake'))
            dispatch(actions.HandleAlerta("No hemos logrado crear este asesor", 'mistake'))
            setShow(null)
        })
        return addUser;
    }
    return (
        <div className="leftNavAsesores">
            <div className="containerLeftAsesores">
                <div className="logo">
                    <img src="https://metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                </div>
                {
                    show == 'newUser' ?
                    <div className="containerUsers">
                        <button className="left" onClick={() => setShow(null)}>
                            <MdArrowBack className="icon" />
                        </button>
                        <div className="newUser">
                            <div className="title">
                                <span>Nuevo usuario</span>
                            </div>
                            <div className="form">
                                <div className="inputDiv">
                                    <label htmlFor="">Nombre completo</label><br />
                                    <input type="text" placeholder='Escribe aquí' 
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            nombre: e.target.value
                                        })
                                    }} value={data.nombre}/>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Apellidos</label><br />
                                    <input type="text" placeholder='Escribe aquí' 
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            lastName: e.target.value
                                        })
                                    }} value={data.lastName}/>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Teléfono</label><br />
                                    <input type="text" placeholder='Escribe aquí' 
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            phone: e.target.value
                                        })
                                    }} value={data.phone}/>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Correo eléctronico</label><br />
                                    <input type="text" placeholder='Escribe aquí' 
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            email: e.target.value
                                        })
                                    }} value={data.email}/>
                                </div>
                                
                                <div className="inputDiv">
                                    <label htmlFor="">Edad</label><br />
                                    <input type="number" placeholder='Escribe aquí' 
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            age: e.target.value
                                        })
                                    }} value={data.age}/>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Foto de perfil (URL de la imagen)</label><br />
                                    <input type="text" placeholder='Escribe aquí' 
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            url: e.target.value
                                        })
                                    }} value={data.url}/>
                                </div>
                                <div className="inputDiv">
                                    <button onClick={() => createNewUser()}>
                                        <span>{loading ? 'Creando...' : 'Crear asesor'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="containerUsers">
                        <div className="itemNewUser" onClick={() => setShow('newUser')}>
                            <div className="containerNew">
                                <div className="icono">
                                    <BsPlus className="icon" />
                                </div>
                                <div className="message">
                                    <h3>Nuevo asesor</h3>
                                </div>
                            </div>
                        </div>
                                    {console.log(usuarios)} 
                        {
                            !usuarios || usuarios == 404 || usuarios == 'notrequest' ?
                                <div className="notFound">
                                    <h1>No hemos encontrado usuarios</h1>
                                </div>
                            :   
                            usuarios && usuarios.length ?
                                usuarios.map((user, i) => {
                                    return (
                                        <div className="itemUser" onClick={() => {
                                            params.set('watch', user.id);
                                            setParams(params);
                                        }}>
                                            <div className="containerItem">
                                                <div className="img">
                                                    <img src={user.photo} alt="" />
                                                </div>
                                                <div className="dataUser">
                                                    <h3>{user.name}</h3>
                                                    <span>{user.rango}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            : <span>No hay usuarios</span>
                        }

                    </div>
                }
            </div>
        </div>
    )
}