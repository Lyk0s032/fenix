import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function QR(){

    const [fuente, setFuente] = useState(null);
    const [loading, setLoading] = useState(false);
    const variable = useParams();

    const [mistake, setMistake] = useState(null);
    const [positive, setPositive] = useState(null);

    const [form, setForm] = useState({
        nombre:null,
        lastName: null,
        email: null,
        phone: null,
        nombreEmpresa: null,
    });
    const [loadingForm, setLoadingForm] = useState(false);
    const axiosGetFuente = async () => {
        setLoading(true)
        axios.get(`api/prospecto/getFuente/${variable.name}`)
        .then((res) => {
            console.log(res) 
            setLoading(false);
            setFuente(res.data)
        })
        .catch(err => {
            console.log(err)
            setLoading(false);
            setFuente(404)
        })
    }

    
    const createData = async () => {
        if(!form.nombre || !form.lastName || !form.email || !form.phone || !form.nombreEmpresa){
            return setMistake('No puedes dejar campos vacios');
        }
        setLoadingForm(true);
        let body = {
            nombreEmpresa: form.nombreEmpresa, 
            namePersona: `${form.nombre} ${form.lastName}`, 
            phone: form.phone, 
            email: form.email, 
            fuenteId: fuente.id
        }
        const add = await axios.post('/api/prospecto/create', body)
        .then((res) => {
            setLoadingForm(false);
            setPositive(true)
        })
        .catch(err => {
            setLoadingForm(false)
            setMistake('Ha ocurrido un error');

        })

        return add;
    }
    useEffect(() => {
        axiosGetFuente()
    }, [])
    return (
        <div className="qr">
            {
                loading || !fuente ?
                <div className="containerQr">
                    <div className="loading">
                        <div className="box">
                            <h3>Cargando...</h3>
                            <span>Esperemos un momento</span>
                        </div>
                    </div>
                </div>
                : fuente == 404 ?
                <div className="containerQr">
                    <div className="notFound">
                        <div className="box">
                            <h1>Ups! 404</h1>
                            <span>No hemos encontrado este sitio, por favor intentalo más tarde.</span>
                        </div>
                    </div>
                </div>
                :
                positive ?
                <div className="containerQr">
                    <div className="message">
                        <div className="boxMessage">
                            <h1>¡Gracias por la confianza!</h1>
                            <span>Pronto nos comunicaremos contigo</span>
                        </div>
                    </div>
                </div>
                :
                <div className="containerQr">
                    <div className="titleQr">
                        <h3>{fuente.nombre}</h3>
                    </div>
                    <div className="containerFormBig">
                        <form className="form" onSubmit={(e) => {
                            e.preventDefault()
                            createData()
                        }}>
                            <div className="containerForm">
                                <div className="inputDiv">
                                    <label htmlFor="">Nombre</label><br />
                                    <input type="text" onChange={(e) => {
                                        setForm({
                                            ...form,
                                            nombre: e.target.value
                                        })
                                    }} value={form.nombre}/>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Apellido</label><br />
                                    <input type="text" onChange={(e) => {
                                        setForm({
                                            ...form,
                                            lastName: e.target.value
                                        })
                                    }} value={form.lastName}/>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Correo electronico</label><br />
                                    <input type="text" onChange={(e) => {
                                        setForm({
                                            ...form,
                                            email: e.target.value
                                        })
                                    }} value={form.email}/>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Número de teléfono</label><br />
                                    <input type="text" onChange={(e) => {
                                        setForm({
                                            ...form,
                                            phone: e.target.value
                                        })
                                    }} value={form.phone}/>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Nombre de la empresa</label><br />
                                    <input type="text" onChange={(e) => {
                                        setForm({
                                            ...form,
                                            nombreEmpresa: e.target.value
                                        })
                                    }} value={form.nombreEmpresa}/>
                                </div>
                                <div className="inputDiv">
                                    <button >
                                        <span>Enviar</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}