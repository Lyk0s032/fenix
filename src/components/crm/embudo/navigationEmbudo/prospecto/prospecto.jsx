import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdArrowBack, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export default function Prospecto(props){ 
    const user = props.user;
    const [interes, setInteres] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const sistema = useSelector(store => store.system);
    const { system } = sistema;
    // ESTADO CREAR PROSPECTO
    const [prospecto, setProspecto] = useState({
        nombreEmpresa:null,
        namePersona: null,
        phone:null,
        email:null,
        type: 'empresa',
        cargo: 'gerente',
        url: null,
        direccion: null,
        city: null,
        fijo: null,
        fuenteId: null
    })

    const setForm = () => {
        setProspecto({
            nombreEmpresa:'',
            namePersona: '',
            phone:'',
            email:'',
            type: 'empresa',
            cargo: 'gerente',
            url: '',
            direccion: '',
            city: '',
            fijo: '', 
            fuenteId: ''
        })
    }
    const handleCreateProspecto = async () => {
        if(!prospecto.fuenteId) return dispatch(actions.HandleAlerta('Selecciona una fuente', 'negative'))
        if(!prospecto.namePersona || !prospecto.phone) return dispatch(actions.HandleAlerta('Ingresa nombre y teléfono validos', 'negative'))
        setLoading(true)
        let body = {
            nombreEmpresa: prospecto.nombreEmpresa,
            namePersona: prospecto.namePersona,
            phone: prospecto.phone,
            email: prospecto.email,
            type: prospecto.type,
            cargo: prospecto.cargo,
            url: prospecto.url,
            direccion: prospecto.direccion,
            fijo: prospecto.fijo, 
            city: prospecto.city,
            fuenteId: prospecto.fuenteId
        }

        const sendCreation = await axios.post('/api/prospecto/create', body)
        .then(res => {
            setLoading(false);
            console.log(res);
            dispatch(actions.HandleAlerta('Creado con éxito', 'positive'))
            setForm()
            dispatch(actions.AxiosGetAllEmbudo(user.id, false))
            return res.data
        })
        .then((data) => {
            dispatch(actions.handleCliente(data))
            dispatch(actions.HandleNew('choose'))
        })
        .catch(err => { 
            setLoading(false);
            console.log(err);
            dispatch(actions.HandleAlerta('Ha ocurrido un error', 'negative'))
        })

        return sendCreation;
    }
    // Navegación
    const sendNav = (route) => {
        dispatch(actions.HandleNav(route))
    }
    return (
        <div className="embudoNav">
            <div className="containerEmbudoLeft">
                <div className="headerNavEmbudo">
                    <div className="before">
                        <button onClick={() => sendNav(null)}>
                            <MdArrowBack className="icon" />
                        </button>
                    </div>
                    <div className="headerNavEmbudoTitle" style={{textAlign:'center'}}>
                        <h3>Prospecto</h3>
                    </div>
                    <div className="before">
                        <button>
                        </button>
                    </div>
                </div>
                <div className="scrollLeftEmbudo">
                    <div className="containerScrollLeft">
                        <div className="searchAll">
                            <div className="listLonger">
                                <div className="containerListLonger">
                                    <form className="formNewCoti"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if(!loading){
                                            handleCreateProspecto()
                                        }
                                    }}>
                                        <div className="containerFormNew">
                                            <div className="inputDiv"> 
                                                <label htmlFor="">Nombre de encargado</label><br />
                                                <input type="text" placeholder='Escribe aquí'
                                                onChange={(e) => setProspecto({
                                                    ...prospecto,
                                                    namePersona: e.target.value
                                                })} value={prospecto.namePersona}  />
                                            </div>
                                            <div className="inputDiv">
                                                <label htmlFor="">Número de teléfono</label><br />
                                                <input type="text" placeholder='Escribe aquí' 
                                                onChange={(e) => setProspecto({
                                                    ...prospecto,
                                                    phone: e.target.value
                                                })} value={prospecto.phone} />
                                            </div>
                                            <div className="inputDiv">
                                                <label htmlFor="">Cargo del encargado</label><br />
                                                <select name="" id="" 
                                                onChange={(e) => setProspecto({
                                                    ...prospecto,
                                                    cargo: e.target.value
                                                })} value={prospecto.cargo} >
                                                    <option value="gerente">Gerente</option>
                                                    <option value="lider de compras">Lider de compras</option>
                                                    <option value="lider comercial">Lider comercial</option>
                                                    <option value="contratista">Contratista</option>
                                                    <option value="otros">ETC</option>
                                                </select>
                                            </div>
                                            <div className="inputDiv">
                                                <label htmlFor="">Nombre de la empresa</label><br />
                                                <input type="text" placeholder='Escribe aquí' 
                                                onChange={(e) => setProspecto({
                                                    ...prospecto,
                                                    nombreEmpresa: e.target.value
                                                })} value={prospecto.nombreEmpresa} />
                                            </div>
                                            <div className="inputDiv">
                                                <label htmlFor="">Dirección</label><br />
                                                <input type="text" placeholder='Escribe aquí' 
                                                onChange={(e) => setProspecto({
                                                    ...prospecto,
                                                    direccion: e.target.value
                                                })} value={prospecto.direccion} />
                                            </div>
                                            <div className="inputDiv">
                                                <label htmlFor="">URL - Sitio web</label><br />
                                                <input type="text" placeholder='Escribe aquí' 
                                                onChange={(e) => setProspecto({
                                                    ...prospecto,
                                                    url: e.target.value
                                                })} value={prospecto.url} />
                                            </div>
                                            <div className="inputDiv">
                                                <label htmlFor="">Teléfono fijo</label><br />
                                                <input type="text" placeholder='Escribe aquí' 
                                                onChange={(e) => setProspecto({
                                                    ...prospecto,
                                                    fijo: e.target.value
                                                })} value={prospecto.fijo} />
                                            </div>
                                            <div className="inputDiv">
                                                <label htmlFor="">Correo eléctronico</label><br />
                                                <input type="text" placeholder='Escribe aquí' 
                                                onChange={(e) => setProspecto({
                                                    ...prospecto,
                                                    email: e.target.value
                                                })} value={prospecto.email} />
                                            </div>
                                            <div className="inputDiv">
                                                <label htmlFor="">Ciudad - Pais</label><br />
                                                <input type="text" placeholder='Ejemplo: Cali, Colombia' 
                                                onChange={(e) => setProspecto({
                                                    ...prospecto,
                                                    city: e.target.value
                                                })} value={prospecto.city} />
                                            </div>
                                            <div className="inputDiv">
                                                <label htmlFor="">Seleccionar fuente</label><br />
                                                <select name="" id="" onChange={(e) => setProspecto({
                                                    ...prospecto,
                                                    fuenteId: e.target.value
                                                })} value={prospecto.fuenteId}>
                                                    <option value={null}>Seleccionar</option>
                                                    {
                                                        system.fuentes && system.fuentes.length ?
                                                            system.fuentes.map((fuente, i) => {
                                                                return (
                                                                    <option value={fuente.id} key={i+1}>
                                                                        {fuente.nombre}
                                                                    </option>

                                                                )
                                                            })
                                                        : 
                                                        <span>No hay fuentes creadas</span>
                                                    }

                                                </select>
                                            </div>
                                            <div className="inputDiv">
                                                <label htmlFor="">Tipo de prospecto</label><br />
                                                <select name="" id="" onChange={(e) => {
                                                    setProspecto({
                                                        ...prospecto, 
                                                        type: e.target.value
                                                    })
                                                }}>
                                                    <option value="empresa">Empresa</option>
                                                    <option value="persona">Persona</option>
                                                </select>
                                            </div>
                                            <div className="inputDiv">
                                                <button>
                                                    <span>{loading ? 'Creando prospecto...' : 'Agregar prospecto'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}