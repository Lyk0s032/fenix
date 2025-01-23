import React, { useState } from 'react';
import { MdArrowBack, MdPhone } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function ProfileFuncion(props){
    const client = props.client;
    const [nav, setNav] = useState(null);
    const navigate = useNavigate();
    return (
        <div className="profileLeft">
            <div className="containerProfile">
                <div className="top">
                    <button onClick={() => {
                        navigate('/clients')
                    }}>
                        <MdArrowBack className="icon" />
                    </button>
                </div>
                <div className="profile">
                    <div className="containerProf">
                        <div className="topProf">
                            <div className="containerTop">
                                <div className="img">
                                    <img src={client.photo} alt="" />
                                </div>
                                <div className="dataBig">
                                    <h3>{client.nombreEmpresa}</h3>
                                    <span>{client.type}</span><br />
                                    <span className="link">{client.url}</span>
                                </div>
                            </div>
                        </div>
                        <div className="dataByClient">
                            <div className="containerData">
                                <div className="navData">
                                    <nav>
                                        <ul>
                                            <li className={!nav ? 'Active' : null} onClick={() => setNav(null)}>
                                                <div>
                                                    <span>Detalles</span>
                                                </div>
                                            </li>
                                            <li className={nav == 'contacts' ? 'Active' : null} onClick={() => setNav('contacts')}>
                                                <div>
                                                    <span>Contactos</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className="resultDataNav">
                                {
                                    nav == 'contacts' ?
                                    <div className="containerResult">
                                        {
                                            client.contacts && client.contacts.length ?
                                                client.contacts.map((contact, i) => {
                                                    return (
                                                        <div className="contactItem" key={i+1}>
                                                            <div className="containerItem">
                                                                <div className="icono">
                                                                    <MdPhone className="icon" />
                                                                </div>
                                                                <div className="dataItem">
                                                                    <h3>{contact.nombre}</h3>
                                                                    <span className='cargo'>{contact.rango}</span><br />
                                                                    <span className='phone'>{contact.phone}</span><br />
                                                                    <span className='email'>{contact.email ? contact.email : 'Sin email'}</span>
                                                                
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            :
                                            <div className="notFound">
                                                <h1>
                                                    No hay contactos registrados.
                                                </h1>
                                            </div>
                                        }

                                    </div>
                                    :
                                    <div className="containerResult">
                                        <div className="itemDetai">
                                            <span>NIT</span>
                                            <h3>{client.nit}</h3>
                                        </div>
                                        
                                        <div className="itemDetai">
                                            <span>Teléfono</span>
                                            <h3>{client.phone}</h3>
                                        </div>
                                        <div className="itemDetai">
                                            <span>Correo eléctronico</span>
                                            <h3>{client.email}</h3>
                                        </div>
                                        <div className="itemDetai">
                                            <span>Fijo</span>
                                            <h3>{client.phone}</h3>
                                        </div>
                                        <div className="itemDetai">
                                            <span>Dirección</span>
                                            <h3>{client.direccion}</h3>
                                        </div>
                                        <div className="itemDetai">
                                            <span>Ciudad</span>
                                            <h3>{client.ciudad}</h3>
                                        </div>
                                        <div className="itemDetai">
                                            <span>Estado</span>
                                            <h3 className="state">Activo</h3>
                                        </div>
                                    </div>
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}