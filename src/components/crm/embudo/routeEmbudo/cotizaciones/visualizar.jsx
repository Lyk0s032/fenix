import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdAccessTime, MdArrowBack, MdClose, MdOutlineMessage } from 'react-icons/md';
import { useParams, useSearchParams } from 'react-router-dom';
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import Probability from './probability';

/** Campo comercial `estado` (API PUT /api/cotizacion/estado). Ver COTIZACION_API_DOCS.md */
const OPCIONES_ESTADO_SEGUIMIENTO = [
    { value: null, label: 'Sin enviar', css: 'sin-enviar' },
    { value: 'Enviada', label: 'Enviada', css: 'enviada' },
    { value: 'en seguimiento', label: 'En seguimiento', css: 'en-seguimiento' },
    { value: 'cierre', label: 'Cierre', css: 'cierre' },
    { value: 'perdida', label: 'Perdida', css: 'perdida' },
    { value: 'sin respuesta', label: 'Sin respuesta', css: 'sin-respuesta' },
];

function mismoEstadoSeguimiento(actual, siguiente) {
    const a = actual == null || actual === '' ? null : String(actual);
    const b = siguiente == null || siguiente === '' ? null : String(siguiente);
    return a === b;
}

export default function CotizacionesPanel(props){
    const user = props.user;
    const [params, setParams] = useSearchParams();
    const [options, setOptions] = useState(null);
    const [note, setNote] = useState(null);

    const [state, setState] = useState('espera'); 
    const dispatch = useDispatch();

    const embudo = useSelector(store => store.embudo);
    const { cotizacion, loadingCotizacion } = embudo;
    const noteCotizacionsList = actions.noteCotizacionsFromCotizacion(cotizacion);
    useEffect(() => {
        if(!cotizacion) {
            params.delete('cotizacion')
            setParams(params);
        }
    }, [])
    const calendary = cotizacion && cotizacion.calendaries && cotizacion.calendaries.length ? cotizacion.calendaries.find((it) => it.state == 'active') : null;

    
    const [form, setForm] = useState({
        calendaryId: null,
        title:cotizacion ?  cotizacion.name : null, 
        nit: cotizacion ? cotizacion.nit : null, 
        nro: cotizacion ? cotizacion.nro : null, 
        fecha: cotizacion ? cotizacion.fecha : null, 
        bruto: cotizacion ? cotizacion.bruto : null, 
        descuento: cotizacion ? cotizacion.descuento : null, 
        neto: cotizacion ? cotizacion.neto : null, 
    });
    const [iva, setIva] = useState(cotizacion ? cotizacion.iva == 19 ? true : false : false);
    const [loading, setLoading] = useState(false);

    const [aplazar, setAplazar] = useState({
        time: null,
        hour: null
    });

    const [estadoSeguimientoMenuAbierto, setEstadoSeguimientoMenuAbierto] = useState(false);
    const [estadoSeguimientoSaving, setEstadoSeguimientoSaving] = useState(false);
    const estadoSeguimientoRef = useRef(null);

    const [trazabilidadAbierta, setTrazabilidadAbierta] = useState(false);
    const [notaTrazabilidad, setNotaTrazabilidad] = useState('');
    const [notaTrazabilidadSaving, setNotaTrazabilidadSaving] = useState(false);
    /** Nota mostrada al instante tras guardar hasta que el GET devuelve la lista real (sin spinner). */
    const [trazabilidadPendingNote, setTrazabilidadPendingNote] = useState(null);
    const trazabilidadListaRef = useRef(null);
    const trazabilidadComposerRef = useRef(null);
    const cotizacionRootRef = useRef(null);
    const [trazabilidadAnchorEl, setTrazabilidadAnchorEl] = useState(null);

    const notasTrazabilidadOrdenadas = useMemo(() => {
        let raw = [...actions.noteCotizacionsFromCotizacion(cotizacion)];
        if (trazabilidadPendingNote) {
            const t = String(trazabilidadPendingNote.note).trim();
            const dup = raw.some((n) => String(n?.note ?? '').trim() === t);
            if (!dup) raw.push(trazabilidadPendingNote);
        }
        return raw.sort((a, b) => {
            const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return ta - tb;
        });
    }, [cotizacion?.noteCotizacions, cotizacion?.id, trazabilidadPendingNote]);
    // ACTUALIZAR COTIZACIÓN
    const updateCotizacion = async () => {
        if(!form.bruto) return dispatch(actions.HandleAlerta('Ingresa un valor bruto'));
        if(!form.title) return dispatch(actions.HandleAlerta('Debes asignar un nombre a esta cotización'));
        if(!form.fecha) return dispatch(actions.HandleAlerta('La fecha no puede estar vacia.'));
        setLoading(true);
        let brt = form.bruto; 
        let descuento = form.descuento;
    
        let valorConDescuento = Number(brt) - Number(descuento); 
        let valorConIva = valorConDescuento * (19 / 100);

        let valorFinal =  iva ? valorConDescuento + valorConIva : valorConDescuento;

        let body = {
            clientId: cotizacion.client.id,
            cotizacionId: cotizacion.id, 
            userId:user.id, 
            name:form.title, 
            nit: form.nit, 
            nro: form.nro, 
            fecha: form.fecha, 
            bruto: form.bruto, 
            iva: iva ? 19 : 0, 
            descuento: form.descuento,  
            neto: valorFinal,
            state: cotizacion.state == 'aplazado' ? 'aplazado' : !valorFinal ? 'desarrollo' : 'pendiente'
        }
        const updateCoti = await axios.put('/api/cotizacion/add', body)
        .then((res) => {
            setLoading(false);
            dispatch(actions.HandleAlerta('Actualizado con éxito', 'positive'));
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('cotizacion');
            setParams(params);
        })
        .catch((err) => {
            setLoading(false);
            dispatch(actions.HandleAlerta('Error', 'mistake'));
        })
        return updateCoti;

    }
    // CAMBIAR DE ESTADO LA COTIZACIÓN
    const changeState = async (state) => {
        let body = {
            cotizacionId: cotizacion.id,
            state,

        }
        const sendChangeState = await axios.put('api/cotizacion/state', body)
        .then((res) => {
            dispatch(actions.HandleAlerta("Éxito", "positive"))
            dispatch(actions.AxiosGetAllEmbudo(user.id, false))
            params.delete('cotizacion')
            setParams(params);
            return res;

        })
        .catch(err => {
            dispatch(actions.HandleAlerta("No hemos logrado cambiar este estado", "mistake"))
            return err;

        })
        return sendChangeState;
    }

    /** Cambia el campo comercial `estado` (seguimiento), no confundir con `state` del embudo */
    const changeEstadoSeguimiento = async (nuevoEstado) => {
        if (!cotizacion?.id || estadoSeguimientoSaving) return;
        if (mismoEstadoSeguimiento(cotizacion.estado, nuevoEstado)) {
            setEstadoSeguimientoMenuAbierto(false);
            return;
        }
        setEstadoSeguimientoSaving(true);
        try {
            await axios.put('/api/cotizacion/estado', {
                cotizacionId: cotizacion.id,
                estado: nuevoEstado,
            });
            dispatch(actions.HandleAlerta('Estado actualizado con éxito', 'positive'));
            dispatch(actions.getCotizacion({ ...cotizacion, estado: nuevoEstado }));
            if (user?.id) dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            setEstadoSeguimientoMenuAbierto(false);
        } catch (e) {
            const msg = e?.response?.data?.msg || 'No se pudo actualizar el estado';
            dispatch(actions.HandleAlerta(msg, 'mistake'));
        } finally {
            setEstadoSeguimientoSaving(false);
        }
    };

    useEffect(() => {
        if (!estadoSeguimientoMenuAbierto) return;
        const onDocMouseDown = (ev) => {
            if (estadoSeguimientoRef.current && !estadoSeguimientoRef.current.contains(ev.target)) {
                setEstadoSeguimientoMenuAbierto(false);
            }
        };
        const onKey = (ev) => {
            if (ev.key === 'Escape') setEstadoSeguimientoMenuAbierto(false);
        };
        document.addEventListener('mousedown', onDocMouseDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocMouseDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [estadoSeguimientoMenuAbierto]);

    useEffect(() => {
        setEstadoSeguimientoMenuAbierto(false);
    }, [cotizacion?.id]);

    useEffect(() => {
        setTrazabilidadAbierta(false);
        setNotaTrazabilidad('');
        setTrazabilidadPendingNote(null);
    }, [cotizacion?.id]);

    useEffect(() => {
        if (!trazabilidadAbierta || !cotizacion?.id) return;
        dispatch(actions.axiosToGetCotizacion(cotizacion.id, false));
    }, [trazabilidadAbierta, cotizacion?.id, dispatch]);

    useEffect(() => {
        if (!trazabilidadPendingNote) return;
        const list = actions.noteCotizacionsFromCotizacion(cotizacion);
        const t = String(trazabilidadPendingNote.note).trim();
        if (list.some((n) => String(n?.note ?? '').trim() === t)) {
            setTrazabilidadPendingNote(null);
        }
    }, [cotizacion?.noteCotizacions, cotizacion, trazabilidadPendingNote]);

    useLayoutEffect(() => {
        const el = cotizacionRootRef.current?.closest('.visualizacionEmbudo');
        setTrazabilidadAnchorEl(el ?? null);
    }, [cotizacion?.id, trazabilidadAbierta]);

    useEffect(() => {
        if (!trazabilidadAbierta) return;
        requestAnimationFrame(() => {
            trazabilidadComposerRef.current?.focus();
        });
    }, [trazabilidadAbierta]);

    useEffect(() => {
        if (!trazabilidadAbierta || !trazabilidadListaRef.current) return;
        const el = trazabilidadListaRef.current;
        el.scrollTop = el.scrollHeight;
    }, [trazabilidadAbierta, notasTrazabilidadOrdenadas]);

    useEffect(() => {
        if (!cotizacion?.id) return;
        const onKey = (e) => {
            if (e.key === 'Escape' && trazabilidadAbierta) {
                e.preventDefault();
                setTrazabilidadAbierta(false);
                return;
            }
            if (e.key !== 'ArrowDown') return;
            const ae = document.activeElement;
            const tag = ae?.tagName?.toUpperCase();
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
                if (ae?.getAttribute('data-trazabilidad-composer') !== 'true') return;
            }
            e.preventDefault();
            setTrazabilidadAbierta(true);
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [cotizacion?.id, trazabilidadAbierta]);

    const enviarNotaTrazabilidad = async () => {
        const texto = (notaTrazabilidad || '').trim();
        if (!texto || !cotizacion?.id || notaTrazabilidadSaving) return;
        setNotaTrazabilidadSaving(true);
        try {
            await axios.post('/api/cotizacion/notes/add', {
                cotizacionId: cotizacion.id,
                note: texto,
                estado: 'guardado',
            });
            setNotaTrazabilidad('');
            const pending = {
                id: `local-${Date.now()}`,
                note: texto,
                createdAt: new Date().toISOString(),
            };
            setTrazabilidadPendingNote(pending);
            dispatch(actions.HandleAlerta('Nota guardada', 'positive'));
            try {
                const { data } = await axios.get(`/api/cotizacion/getById/${cotizacion.id}`, {
                    params: { _t: Date.now() },
                });
                dispatch(actions.getCotizacion(data));
                const list = actions.noteCotizacionsFromCotizacion(data);
                if (list.some((n) => String(n?.note ?? '').trim() === texto.trim())) {
                    setTrazabilidadPendingNote(null);
                }
            } catch {
                dispatch(actions.axiosToGetCotizacion(cotizacion.id, false));
            }
        } catch (err) {
            const msg = err?.response?.data?.msg || 'No se pudo guardar la nota';
            dispatch(actions.HandleAlerta(msg, 'mistake'));
        } finally {
            setNotaTrazabilidadSaving(false);
        }
    };
    // APLAZAR COTIZACIÓN
    const handleAplazarCotización = async () => {
        if(loading) return null 
        if(!aplazar.time || !aplazar.hour) return dispatch(actions.HandleAlerta('Llena los campos', 'mistake'))
        setLoading(true);
        const fechaItem = cotizacion.calendaries && cotizacion.calendaries.length ? cotizacion.calendaries.find((it) => it.state == 'active') : null;
        let body = {
            title: `Aplazada - ${cotizacion.name}`,
            userId: user.id,
            clientId: cotizacion.client.id,
            calendaryId: fechaItem ? fechaItem.id : null,
            cotizacionId: cotizacion.id,
            time: aplazar.time,
            hour: aplazar.hour
        }

        const sendAplazar = await axios.put('api/cotizacion/aplazar', body)
        .then((res) => {
            setLoading(false)
            dispatch(actions.HandleAlerta(`Aplazado para ${aplazar.time}`, 'positive'))
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('cotizacion')
            setParams(params);
        })
        .catch((err) => {
            setLoading(false)
            dispatch(actions.HandleAlerta(`No hemos logrado aplazar esta cotización`, 'mistake'))
        })
        return sendAplazar;
    }

    const addNote = async () => {
        if(!note || note == '') return dispatch(actions.HandleAlerta('Ingresa una nota', 'mistake'))
        let body = {
            type: '',
            clientId: cotizacion.client.id,
            userId: user.id,
            manual: 'manual',
            note: note,
            cotizacionId: cotizacion.id
        }
        const sendNote = await axios.post('api/notes/addManual', body)
        .then((res) => {
            setNote('');
            dispatch(actions.axiosToGetCotizacion(cotizacion.id, false));
            dispatch(actions.HandleAlerta('Agregado con éxito', 'positive'));
            return true
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado ingresar esto.', 'mistake'));
            return null
        })
        return sendNote;
    }
    
    return (
        <div className="cotizacion" ref={cotizacionRootRef}>
            {
            !cotizacion || loadingCotizacion ?
                <div className="containerCotizacion">
                    <h1>Cargando</h1>
                </div>
                :
                <div className="containerCotizacion">
                    <div className="top">
                        <div className="containerTop">
                            <div className="titleAndBack">
                                <button onClick={() => {
                                    params.delete('cotizacion');
                                    setParams(params);
                                }}>
                                    <MdArrowBack className='icon' />
                                </button>
                                <h1>Cotización</h1>
                                
                            </div>
                            {
                                cotizacion.state == 'pendiente' || cotizacion.state == 'aplazado' ?  
                                    // SI ES DESARROLLO HABILITAMOS
                                    options == 'edit' ?
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button className='Wait' onClick={() => setOptions(null)}>
                                                <AiOutlineArrowLeft className='icon' /><br />
                                                <span>Regresar</span>
                                            </button>
                                        </div>
                                        <div className="edit">
                                            <button >
                                                <BsThreeDotsVertical className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                    : options == 'message' ?
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button className='Wait' onClick={() => setOptions(null)}>
                                                <AiOutlineArrowLeft className='icon' /><br />
                                                <span>Regresar</span>
                                            </button>
                                        </div>
                                        <div className="edit">
                                            <button >
                                                <MdOutlineMessage className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                    : options == 'aplazar' ?
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button className='Wait' onClick={() => setOptions(null)}>
                                                <AiOutlineArrowLeft className='icon' /><br />
                                                <span>Regresar</span>
                                            </button>
                                            <button className='Wait'>
                                                <MdAccessTime className="icon Wait" /><br />
                                                <span className='Wait'>Aplazar</span>
                                            </button>
                                        </div>
                                        <div className="edit">
                                            <button onClick={() => setOptions('edit')}>
                                                <BsThreeDotsVertical className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button onClick={() => changeState('aprobada')}>
                                            <AiOutlineCheckCircle className="icon Positive" /><br />
                                                <span className='Positive'>Aprobar</span>
                                            </button> 
                                            <button onClick={() => changeState('perdido')}>
                                                <AiOutlineCloseCircle className="icon Cancel" /> <br />
                                                <span className='Cancel'>Perder</span>
                                            </button >
                                            <button className='Wait' onClick={() => {
                                                setOptions('aplazar')
                                            }}>
                                                <MdAccessTime className="icon Wait" /><br />
                                                <span className='Wait'>Aplazar</span>
                                            </button>

                                            <button className='Wait' onClick={() => {
                                                params.set('probability', true)
                                                setParams(params)
                                            }}>
                                                <MdAccessTime className="icon Wait" /><br />
                                                <span className='Wait'>%%%</span>
                                            </button>
                                        </div>
                                        <div className="edit">
                                            <button style={{marginRight:20}} onClick={() => setOptions('message')}>
                                                <MdOutlineMessage className="icon"  />
                                            </button>
                                            <button onClick={() => setOptions('edit')}>
                                                <BsThreeDotsVertical className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                : cotizacion.state == 'desarrollo' ?
                                        // SI ES DESARROLLO HABILITAMOS
                                    options == 'edit' ?
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button className='Wait' onClick={() => setOptions(null)}>
                                                <AiOutlineArrowLeft className='icon' /><br />
                                                <span>Regresar</span>
                                            </button>
                                        </div>
                                        <div className="edit">
                                            <button >
                                                <BsThreeDotsVertical className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    :
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button onClick={() => changeState('perdido')}>
                                                <AiOutlineCloseCircle className="icon Cancel" /> <br />
                                                <span className='Cancel'>Perder</span>
                                            </button >
                                        </div>
                                        <div className="edit">
                                            <button onClick={() => setOptions('edit')}>
                                                <BsThreeDotsVertical className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                : cotizacion.state == 'aprobada' ?
                                    options == 'edit' ?
                                        <div className="actionsAndOptions">
                                            <div className="dinamiActions">
                                                <button className='Wait' onClick={() => setOptions(null)}>
                                                    <AiOutlineArrowLeft className='icon' /><br />
                                                    <span>Regresar</span>
                                                </button>
                                            </div>
                                            <div className="edit">
                                                <button >
                                                    <BsThreeDotsVertical className="icon"  />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        :
                                        <div className="actionsAndOptions">
                                            
                                            <div className="edit">
                                                <button onClick={() => setOptions('edit')}>
                                                    <BsThreeDotsVertical className="icon"  />
                                                </button>
                                            </div>
                                        </div>
                                : null
                            }
                            
                        </div>
                        <div className="state">
                            {
                                cotizacion.state == 'pendiente' ?
                                <div className="slide">
                                    <span>Pendiente</span>
                                </div>
                                : cotizacion.state == 'desarrollo' ?
                                <div className="slide">
                                    <span>En desarrollo</span>
                                </div> 
                                : cotizacion.state == 'aplazado' ?
                                <div className="slide">
                                    <span>Aplazada para: {calendary ? calendary.time.split('T')[0] : null}</span>
                                </div>
                                : cotizacion.state == 'aprobada' ?
                                <div className="slide">
                                    <span>Aprobada</span>
                                </div>
                                : null
                            }
                            
                        </div>
                    </div>
                    {
                        options == 'aplazar' ? 
                        <div className="dataCotizacion">
                            <div className="containerDataCotizacion">
                                <div className="titleForm">
                                    <h1>Perfecto, ¿Qué fecha tienes en mente?</h1>
                                </div>
                                <div className="form">
                                    <div className="containerForm">
                                        <div className="inputDiv">
                                            <label htmlFor="">Selecciona fecha en el calendario</label><br />
                                            <input type="date" onChange={(e) => {
                                                setAplazar({
                                                    ...aplazar,
                                                    time: e.target.value
                                                })
                                            }} value={aplazar.time}/>
                                        </div>
                                        <div className="inputDiv">
                                            <label htmlFor="">Hora</label><br />
                                            <select name="" id="" onChange={(e) => {
                                                setAplazar({
                                                    ...aplazar,
                                                    hour: e.target.value
                                                })
                                            }} value={aplazar.hour}>
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
                                        <div className="inputDiv">
                                            <button onClick={() => handleAplazarCotización()}>
                                                <span>Aplazar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="dataCotizacion">
                            <div className="containerDataCotizacion">
                                <div className="headerCotizacionDoc">
                                    <div className="logoCotizacion">
                                        <img src="https://www.metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                                    </div>
                                    <div
                                        className="estadoNubeWrap estadoNubeWrapTop estadoNubeCompound"
                                        ref={estadoSeguimientoRef}
                                    >
                                        <button
                                            type="button"
                                            className={`estadoNube estadoNube--trigger ${cotizacion?.estado ? cotizacion.estado.toLowerCase().replace(/\s+/g, '-') : 'sin-enviar'}`}
                                            onClick={() => setEstadoSeguimientoMenuAbierto((v) => !v)}
                                            aria-expanded={estadoSeguimientoMenuAbierto}
                                            aria-haspopup="true"
                                            disabled={estadoSeguimientoSaving}
                                        >
                                            {cotizacion?.estado
                                                ? (cotizacion.estado === 'Enviada' ? 'Enviada'
                                                    : cotizacion.estado === 'en seguimiento' ? 'En seguimiento'
                                                    : cotizacion.estado === 'cierre' ? 'Cierre'
                                                    : cotizacion.estado === 'sin respuesta' ? 'Sin respuesta'
                                                    : cotizacion.estado === 'perdida' ? 'Perdida'
                                                    : cotizacion.estado)
                                                : 'Sin enviar'}
                                        </button>
                                        {estadoSeguimientoMenuAbierto ? (
                                            <div className="estadoNubeCluster" role="menu" aria-label="Cambiar estado de seguimiento">
                                                {OPCIONES_ESTADO_SEGUIMIENTO.map((op) => {
                                                    const activo = mismoEstadoSeguimiento(cotizacion?.estado, op.value);
                                                    return (
                                                        <button
                                                            key={op.css}
                                                            type="button"
                                                            role="menuitem"
                                                            className={`estadoChip ${op.css}${activo ? ' estadoChip--activo' : ''}`}
                                                            disabled={estadoSeguimientoSaving || activo}
                                                            onClick={() => changeEstadoSeguimiento(op.value)}
                                                        >
                                                            {op.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                {
                                options == 'edit' ?
                                    <div className="dataCoti">
                                        
                                        <div className="valorCotizacion">
                                            <div className="containerValor">
                                                <div className="table">
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Nombre cotización</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="text" value={form.title} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        title: e.target.value
                                                                    })
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Nro</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="text" value={form.nro} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        nro: e.target.value
                                                                    })
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>NIT</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="text" value={form.nit} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        nit: e.target.value
                                                                    })
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Valor bruto</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="text" value={form.bruto} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        bruto: e.target.value
                                                                    })
                                                                }}  />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Descuento</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="text" value={form.descuento} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        descuento: e.target.value
                                                                    })
                                                                }}  />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Iva incluido {iva ? 'aplica' : 'no aplica'}</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input className='check' onClick={() => {
                                                                    setIva(!iva)
                                                                }} type="checkbox" checked={iva} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Fecha </h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="date" value={form.fecha.split('T')[0]} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        fecha: e.target.value
                                                                    })
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    

                                                    <div className="titleAndResponse Bruto">
                                                        <div className="titleTable">
                                                            <span>Neto</span>
                                                        
                                                            {
                                                                iva ? 
                                                                <h3>
                                                                    {
                                                                        new Intl.NumberFormat('es-CO', {currency:'COP'}).format((form.bruto - form.descuento) +((form.bruto - form.descuento) * (19/100)))
                                                                    }
                                                                    <span> COP</span>
                                                                </h3>
                                                                
                                                                :
                                                                <h3>
                                                                    {
                                                                        new Intl.NumberFormat('es-CO', {currency:'COP'}).format((form.bruto - form.descuento))
                                                                    }
                                                                    <span> COP</span>
                                                                </h3>
                                                            } 
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <button onClick={() => updateCotizacion()}>
                                                                    <span>{loading ? 'Actualizando..' : 'Actualizar' }</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                : options == 'message' ?
                                    <div className="dataCoti">
                                        <div className="history">
                                            <div className="getHistory">
                                                <div className="scrollHistory">
                                                    <div className="notes">
                                                        {
                                                            loadingCotizacion ?
                                                                <h1>Cargando...</h1>
                                                            : noteCotizacionsList.length === 0 ?
                                                                <h1>No hay notas</h1>
                                                            : noteCotizacionsList.map((c, i) => (
                                                                        <div className="note" key={c.id != null ? String(c.id) : i}>
                                                                            <span>{c.note}</span>
                                                                            <div className="time">
                                                                                <strong>14 de Abril del 2025</strong>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="getData">
                                                <div className="containerGetData">
                                                    <input type="text" placeholder='Anexa información de la cotización aquí...' 
                                                    onChange={((e) => {
                                                        setNote(e.target.value)
                                                    })} onKeyDown={(e) => {
                                                        if(e.key == 'Enter'){
                                                            addNote()
                                                        }
                                                    }} value={note}/>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                :
                                    <div className="dataCoti">
                                        <div className="topAbout">
                                            <div className="containerAbout">
                                                <div className="asesor">
                                                    <h3>{cotizacion.user.name}</h3>
                                                    <span>Nro. {cotizacion.nro}</span><br />
                                                    <span className='time'>{dayjs(cotizacion.fecha.split('T')[0]).format('DD [de] MMMM [del] YYYY')}</span>
                                                </div>
                                                <div className="asesor Reverse">
                                                    <h3>{cotizacion.client.nombreEmpresa}</h3>
                                                    <span>Nit. {cotizacion.nit}</span><br />
                                                    <span className='time'>{cotizacion.state}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="valorCotizacion">
                                            <div className="containerValor">
                                                <div className="table">
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Nombre cotización</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <h3 className='title'>
                                                                {cotizacion.name}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Valor bruto</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            {
                                                            cotizacion.bruto ?
                                                                <h3 className='bruto'>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.bruto)}<span> COP</span></h3>
                                                            :
                                                                <h3 className='bruto'><span>Sin definir</span></h3>
                                                                
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Descuento</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            {
                                                            cotizacion.descuento ?
                                                                <h3 className='descuento'>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.descuento)} <span>COP</span></h3>
                                                            :
                                                                <h3 className='descuento'><span>Sin definir</span></h3>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Iva incluido</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <span className='iva'>{cotizacion.iva == 19 ? 'Aplica' : 'No aplica'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="titleAndResponse Bruto">
                                                        <div className="titleTable">
                                                            <h3>Neto </h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.neto)} <span>COP</span></h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {
                        params.get('probability') ?
                            <Probability cotizacion={cotizacion} />
                        : null
                    }
                </div>
            }

            {trazabilidadAbierta && cotizacion && trazabilidadAnchorEl
                ? createPortal(
                    (
                        <div
                            className="cotizacionTrazabilidadOverlay"
                            role="presentation"
                            onClick={() => setTrazabilidadAbierta(false)}
                        >
                            <div
                                className="cotizacionTrazabilidadPanel"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="cotizacion-trazabilidad-titulo"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <header className="cotizacionTrazabilidad__barra">
                                    <div className="cotizacionTrazabilidad__barraStart">
                                        <div className="cotizacionTrazabilidad__iconoCabecera" aria-hidden>
                                            <MdOutlineMessage className="icon" />
                                        </div>
                                        <div className="cotizacionTrazabilidad__titulo">
                                            {/* <span className="cotizacionTrazabilidad__tituloTexto" id="cotizacion-trazabilidad-titulo">
                                                Trazabilidad
                                            </span> */}
                                            {/* <span className="cotizacionTrazabilidad__subtitulo">
                                                Notas internas del seguimiento · orden cronológico
                                            </span> */}
                                            <div className="cotizacionTrazabilidad__cotizacionMeta">
                                                <strong title={cotizacion.name}>{cotizacion.name}</strong>
                                                <span className="cotizacionTrazabilidad__nro">N.º {cotizacion.nro}</span>
                                            </div>
                                            <p className="cotizacionTrazabilidad__shortcuts" aria-label="Atajos de teclado">
                                                <span className="cotizacionTrazabilidad__shortcut">
                                                    <kbd className="cotizacionTrazabilidad__kbd">↓</kbd> abrir
                                                </span>
                                                <span className="cotizacionTrazabilidad__shortcut">
                                                    <kbd className="cotizacionTrazabilidad__kbd">Esc</kbd> cerrar
                                                </span>
                                                <span className="cotizacionTrazabilidad__shortcut">
                                                    <kbd className="cotizacionTrazabilidad__kbd">Enter</kbd> guardar nota
                                                </span>
                                                <span className="cotizacionTrazabilidad__shortcutHint">Mayús+Enter nueva línea</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="cotizacionTrazabilidad__cerrar"
                                        aria-label="Cerrar trazabilidad"
                                        onClick={() => setTrazabilidadAbierta(false)}
                                    >
                                        <MdClose className="icon" />
                                    </button>
                                </header>
                                <div className="cotizacionTrazabilidad__cuerpo">
                                    <section className="cotizacionTrazabilidad__seccion" aria-labelledby="traz-historial-titulo">
                                        <div className="cotizacionTrazabilidad__seccionCabecera">
                                            <h2 className="cotizacionTrazabilidad__seccionTitulo" id="traz-historial-titulo">
                                                Historial de notas
                                            </h2>
                                            {notasTrazabilidadOrdenadas.length > 0 ? (
                                                <span className="cotizacionTrazabilidad__contador">
                                                    {notasTrazabilidadOrdenadas.length}{' '}
                                                    {notasTrazabilidadOrdenadas.length === 1 ? 'nota' : 'notas'}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="cotizacionTrazabilidad__lista" ref={trazabilidadListaRef}>
                                            {notasTrazabilidadOrdenadas.length ? (
                                                <ul className="cotizacionTrazabilidad__timeline">
                                                    {notasTrazabilidadOrdenadas.map((n, i) => (
                                                        <li key={n.id != null ? String(n.id) : `traz-${i}`} className="cotizacionTrazabilidad__item">
                                                            <span className="cotizacionTrazabilidad__punto" aria-hidden />
                                                            <div className="cotizacionTrazabilidad__itemInner">
                                                                <p className="cotizacionTrazabilidad__notaTexto">{n.note}</p>
                                                                {n.createdAt ? (
                                                                    <time className="cotizacionTrazabilidad__fecha" dateTime={n.createdAt}>
                                                                        <span className="cotizacionTrazabilidad__fechaLabel">Registrada el </span>
                                                                        {dayjs(n.createdAt).format('D MMM YYYY · HH:mm')}
                                                                    </time>
                                                                ) : null}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="cotizacionTrazabilidad__empty">
                                                    <MdOutlineMessage className="cotizacionTrazabilidad__emptyIcon" aria-hidden />
                                                    <p className="cotizacionTrazabilidad__emptyTitulo">Aún no hay notas</p>
                                                    <p className="cotizacionTrazabilidad__emptyTexto">
                                                        Las notas que guardes aquí quedan en orden de fecha y ayudan a todo el equipo a entender qué pasó con la cotización.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                    <section className="cotizacionTrazabilidad__composer" aria-labelledby="traz-nueva-titulo">
                                        
                                       
                                        <label className="cotizacionTrazabilidad__labelSr" htmlFor={`trazabilidad-nota-${cotizacion.id}`}>
                                            Texto de la nota
                                        </label>
                                        <textarea
                                            id={`trazabilidad-nota-${cotizacion.id}`}
                                            ref={trazabilidadComposerRef}
                                            data-trazabilidad-composer="true"
                                            className="cotizacionTrazabilidad__input"
                                            rows={3}
                                            placeholder="Ej.: Cliente pidió revisar precio unitario · Quedamos en llamar el martes…"
                                            value={notaTrazabilidad}
                                            disabled={notaTrazabilidadSaving}
                                            onChange={(e) => setNotaTrazabilidad(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    enviarNotaTrazabilidad();
                                                }
                                            }}
                                        />
                                        <div className="cotizacionTrazabilidad__composerAcciones">
                                            {/* <button
                                                type="button"
                                                className="cotizacionTrazabilidad__btnGuardar"
                                                disabled={
                                                    notaTrazabilidadSaving || !(notaTrazabilidad || '').trim()
                                                }
                                                onClick={() => enviarNotaTrazabilidad()}
                                            >
                                                {notaTrazabilidadSaving ? 'Guardando…' : 'Guardar nota'}
                                            </button> */}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    ),
                    trazabilidadAnchorEl
                )
                : null}
        </div>
    )
}