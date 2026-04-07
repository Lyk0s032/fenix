import dayjs from 'dayjs';
import React, { useEffect, useState, useRef } from 'react';
import { MdOutlineClose, MdOutlineQuestionMark } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import 'dayjs/locale/es';
import { useDispatch } from 'react-redux';
import * as actions from '../../../../store/action/action';
import axios from 'axios';

/**
 * ItemProspecto
 * Componente de fila de prospecto con opciones de llamada (Contestó, No contestó, Llamar después)
 * 
 * Props:
 *  - item       {object}  Datos del prospecto
 *  - userId     {number}  ID del usuario actual
 *  - filters    {object}  Filtros actuales para refrescar
 */
export default function ItemProspecto({ item, userId, filters = {} }) {
    dayjs.locale('es');
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    
    const [activeMenu, setActiveMenu] = useState(false);
    const [showLaterModal, setShowLaterModal] = useState(false);
    const [laterForm, setLaterForm] = useState({ time: '', hour: '16:00', note: '' });
    const [loading, setLoading] = useState(false);
    const menuRef = useRef(null);

    const openAction = (data) => {
        dispatch(actions.getItem(data));
        if (params.get('w') == 'action') {
            params.delete('w');
            setParams(params);
        }
        params.set('w', 'action');
        setParams(params);
    };

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenu(false);
            }
        };
        if (activeMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenu]);

    useEffect(() => {
        if (!item) {
            params.delete('w');
            params.delete('action');
            setParams(params);
        }
    }, []);

    // Contestó → Notificación positiva
    const handleContesto = async () => {
        setActiveMenu(false);
        dispatch(actions.HandleAlerta(
            `✓ Contacto registrado para "${item.nombreEmpresa || item.namePersona || 'Prospecto'}". Gestiona las acciones desde el Embudo.`,
            'positive'
        ));
        // Abre la modal de acción
        openAction(item);
    };

    // No contestó → Avanza el estado del prospecto
    const handleNoContesto = async () => {
        setActiveMenu(false);
        setLoading(true);

        const nextState =
            item.state === 'intento 1' ? 'intento 2' :
            item.state === 'intento 2' ? 'intento 3' :
            item.state === 'intento 3' ? 'intento 4' : null;

        if (!nextState) {
            dispatch(actions.HandleAlerta('Este prospecto ya llegó al máximo de intentos', 'negative'));
            setLoading(false);
            return;
        }

        try {
            await axios.put('/api/prospecto/dontCall', {
                title: nextState,
                caso: nextState,
                prospectoId: item.id || item._id,
                userId: userId,
                time: dayjs().format('YYYY-MM-DD'),
                hour: '4:00PM',
            });
            dispatch(actions.HandleAlerta('No contestó — próxima llamada en 3 días', 'positive'));
            // Refrescar lista de prospectos
            dispatch(actions.axiosGetProspectosPanel(filters));
        } catch (error) {
            dispatch(actions.HandleAlerta('No se pudo registrar el intento', 'negative'));
        } finally {
            setLoading(false);
        }
    };

    // Llamar después → Abre modal
    const handleLlamarDespues = () => {
        setActiveMenu(false);
        setShowLaterModal(true);
        setLaterForm({ time: '', hour: '16:00', note: '' });
    };

    // Enviar formulario de "Llamar después"
    const handleLaterSubmit = async () => {
        if (!laterForm.time || !laterForm.hour) {
            dispatch(actions.HandleAlerta('Selecciona fecha y hora', 'negative'));
            return;
        }

        setLoading(true);
        try {
            const calendaryActiva = item.calendaries?.find(c => c.state === 'active');
            
            if (calendaryActiva) {
                // Tiene calendario activo → aplazar
                await axios.put('/api/prospecto/aplazar', {
                    title: `Llamar después — ${item.nombreEmpresa || item.namePersona || 'Prospecto'}`,
                    note: laterForm.note || 'Programado desde el panel de prospectos',
                    tags: [],
                    userId: userId,
                    prospectoId: item.id || item._id,
                    calendaryId: calendaryActiva.id,
                    time: laterForm.time,
                    hour: laterForm.hour,
                });
            } else {
                // Sin calendario activo → dontCall con fecha personalizada
                const nextState =
                    item.state === 'intento 1' ? 'intento 2' :
                    item.state === 'intento 2' ? 'intento 3' : 'intento 3';
                
                await axios.put('/api/prospecto/dontCall', {
                    title: nextState,
                    caso: nextState,
                    prospectoId: item.id || item._id,
                    userId: userId,
                    time: laterForm.time,
                    hour: laterForm.hour,
                });
            }

            dispatch(actions.HandleAlerta(`Llamada programada para ${laterForm.time}`, 'positive'));
            setShowLaterModal(false);
            setLaterForm({ time: '', hour: '16:00', note: '' });
            dispatch(actions.axiosGetProspectosPanel(filters));
        } catch (error) {
            dispatch(actions.HandleAlerta('No se pudo programar la llamada', 'negative'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <tr onClick={(e) => {
                // Si hace clic en los botones, no abre el item
                if (e.target.closest('.try')) return;
                openAction(item);
            }}>
                <td>
                    <div className='aboutClient'>
                        <div className="containerAbout">
                            <div className="div"></div>
                            {
                                item.type == 'digital' ?
                                <div className="dataAbout">
                                    <h3>{item.namePersona ? item.namePersona : 'Sin definir'}</h3>
                                    <h4>{item.phone}</h4>
                                    <span>{item.type} - {item.fuente?.nombre}</span> 
                                </div>
                                :
                                <div className="dataAbout">
                                    <h3>{item.nombreEmpresa ? item.nombreEmpresa : 'Sin definir'}</h3>
                                    <h4>{item.phone}</h4>
                                    <span>{item.type} - {item.fuente?.nombre}</span>
                                </div>
                            }
                        </div>
                    </div>
                </td>

                <td></td>

                <td>
                    <div className="try">
                        <div className="containerTry">
                            {/* Botón intento 1 */}
                            {
                                item.state == 'intento 2' || item.state == 'intento 3' ?
                                <button className='cancel'>
                                    <MdOutlineClose className='icon' />
                                </button>
                                : item.state == 'intento 1' ? 
                                <button 
                                    className='great' 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenu(!activeMenu);
                                    }}
                                    style={{ position: 'relative' }}
                                >
                                    <MdOutlineQuestionMark className='icon' />
                                    {/* Menú desplegable */}
                                    {activeMenu && (
                                        <div 
                                            ref={menuRef}
                                            style={styles.menu}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div style={styles.menuHeader}>
                                                <span style={styles.menuTitle}>
                                                    {item.nombreEmpresa || item.namePersona || 'Prospecto'}
                                                </span>
                                            </div>
                                            
                                            <button 
                                                style={styles.menuItem} 
                                                className="menuItemHover"
                                                onClick={handleContesto}
                                                disabled={loading}
                                            >
                                                <span style={styles.menuIconGreen}>✓</span>
                                                Contestó
                                            </button>

                                            <button 
                                                style={styles.menuItem} 
                                                className="menuItemHover"
                                                onClick={handleNoContesto}
                                                disabled={loading}
                                            >
                                                <span style={styles.menuIconRed}>✗</span>
                                                No contestó
                                            </button>

                                            <button 
                                                style={{ ...styles.menuItem, borderTop: '1px solid #f1f5f9' }} 
                                                className="menuItemHover"
                                                onClick={handleLlamarDespues}
                                                disabled={loading}
                                            >
                                                <span style={styles.menuIconOrange}>⏰</span>
                                                Llamar después
                                            </button>
                                        </div>
                                    )}
                                </button>
                                : null
                            }
                            
                            {/* Botón intento 2 */}
                            {
                                item.state == 'intento 3' ?
                                <button className='cancel'>
                                    <div className="hidden">
                                        {item.calendaries && item.calendaries.length ? 
                                            item.calendaries.map((t, i) => {
                                                return (
                                                    t.case == 'intento 2' ?
                                                        <span key={i+1}>
                                                        {dayjs(t.time.split('T')[0]).format('dddd, MMMM D, YYYY')}
                                                        </span>
                                                    : null
                                                )
                                            })
                                        : null}
                                    </div>
                                    <MdOutlineClose className='icon' />
                                </button>
                                : item.state == 'intento 2' ?
                                <button 
                                    className='great'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenu(!activeMenu);
                                    }}
                                    style={{ position: 'relative' }}
                                >
                                    <MdOutlineQuestionMark className='icon' />
                                    {/* Menú desplegable - mismo que arriba */}
                                    {activeMenu && (
                                        <div 
                                            ref={menuRef}
                                            style={styles.menu}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div style={styles.menuHeader}>
                                                <span style={styles.menuTitle}>
                                                    {item.nombreEmpresa || item.namePersona || 'Prospecto'}
                                                </span>
                                            </div>
                                            
                                            <button 
                                                style={styles.menuItem} 
                                                className="menuItemHover"
                                                onClick={handleContesto}
                                                disabled={loading}
                                            >
                                                <span style={styles.menuIconGreen}>✓</span>
                                                Contestó
                                            </button>

                                            <button 
                                                style={styles.menuItem} 
                                                className="menuItemHover"
                                                onClick={handleNoContesto}
                                                disabled={loading}
                                            >
                                                <span style={styles.menuIconRed}>✗</span>
                                                No contestó
                                            </button>

                                            <button 
                                                style={{ ...styles.menuItem, borderTop: '1px solid #f1f5f9' }} 
                                                className="menuItemHover"
                                                onClick={handleLlamarDespues}
                                                disabled={loading}
                                            >
                                                <span style={styles.menuIconOrange}>⏰</span>
                                                Llamar después
                                            </button>
                                        </div>
                                    )}
                                </button>
                                :
                                <button className='inactive'>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                            }

                            {/* Botón intento 3 */}
                            {
                                item.state == 'intento 3' ?
                                <button 
                                    className='great'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenu(!activeMenu);
                                    }}
                                    style={{ position: 'relative' }}
                                >
                                    <MdOutlineQuestionMark className='icon' />
                                    {/* Menú desplegable */}
                                    {activeMenu && (
                                        <div 
                                            ref={menuRef}
                                            style={styles.menu}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div style={styles.menuHeader}>
                                                <span style={styles.menuTitle}>
                                                    {item.nombreEmpresa || item.namePersona || 'Prospecto'}
                                                </span>
                                            </div>
                                            
                                            <button 
                                                style={styles.menuItem} 
                                                className="menuItemHover"
                                                onClick={handleContesto}
                                                disabled={loading}
                                            >
                                                <span style={styles.menuIconGreen}>✓</span>
                                                Contestó
                                            </button>

                                            <button 
                                                style={styles.menuItem} 
                                                className="menuItemHover"
                                                onClick={handleNoContesto}
                                                disabled={loading}
                                            >
                                                <span style={styles.menuIconRed}>✗</span>
                                                No contestó
                                            </button>

                                            <button 
                                                style={{ ...styles.menuItem, borderTop: '1px solid #f1f5f9' }} 
                                                className="menuItemHover"
                                                onClick={handleLlamarDespues}
                                                disabled={loading}
                                            >
                                                <span style={styles.menuIconOrange}>⏰</span>
                                                Llamar después
                                            </button>
                                        </div>
                                    )}
                                </button>
                                : 
                                <button className='inactive'>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                            }
                        </div>
                    </div>
                </td>
            </tr>

            {/* Modal Llamar Después */}
            {showLaterModal && (
                <div 
                    style={styles.modalOverlay} 
                    onClick={() => setShowLaterModal(false)}
                >
                    <div 
                        style={styles.modalBox} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={styles.modalHeader}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                                ⏰ Llamar después
                            </span>
                            <button 
                                style={styles.closeBtn} 
                                onClick={() => setShowLaterModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div style={{ padding: '12px 16px 16px' }}>
                            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px' }}>
                                <strong>{item.nombreEmpresa || item.namePersona || 'Prospecto'}</strong>
                                {item.phone ? ` — ${item.phone}` : ''}
                            </p>

                            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>📅 Nueva fecha</label>
                                    <input 
                                        type="date" 
                                        style={{ ...styles.input, width: '100%', marginTop: 4 }}
                                        value={laterForm.time}
                                        onChange={(e) => setLaterForm(f => ({ ...f, time: e.target.value }))} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>🕐 Hora</label>
                                    <select 
                                        style={{ ...styles.input, width: '100%', marginTop: 4 }}
                                        value={laterForm.hour}
                                        onChange={(e) => setLaterForm(f => ({ ...f, hour: e.target.value }))}
                                    >
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
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: 14 }}>
                                <label style={styles.label}>📝 Nota (opcional)</label>
                                <textarea
                                    style={{ ...styles.input, width: '100%', marginTop: 4, height: 64, resize: 'vertical', padding: '6px 10px', boxSizing: 'border-box' }}
                                    placeholder="Ej: Llamar en la tarde, preguntar por cotización…"
                                    value={laterForm.note}
                                    onChange={(e) => setLaterForm(f => ({ ...f, note: e.target.value }))} 
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <button 
                                    style={styles.cancelBtn} 
                                    onClick={() => setShowLaterModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    style={styles.submitBtn}
                                    onClick={handleLaterSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando…' : '✓ Programar llamada'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Estilos CSS */}
            <style>{`
                .menuItemHover:hover {
                    background: #F8FAFC !important;
                }
            `}</style>
        </>
    );
}

const styles = {
    menu: {
        position: 'absolute',
        left: '50%',
        top: '100%',
        transform: 'translateX(-50%)',
        zIndex: 3000,
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
        border: '1px solid #e2e8f0',
        minWidth: 180,
        overflow: 'hidden',
        marginTop: 6,
    },
    menuHeader: {
        padding: '8px 14px 6px',
        borderBottom: '1px solid #f1f5f9',
    },
    menuTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '9px 14px',
        background: 'none',
        border: 'none',
        fontSize: 13,
        color: '#1e293b',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background .1s',
    },
    menuIconGreen: {
        fontSize: 13,
        fontWeight: 700,
        color: '#16A34A',
        width: 16,
        textAlign: 'center',
    },
    menuIconRed: {
        fontSize: 13,
        fontWeight: 700,
        color: '#DC2626',
        width: 16,
        textAlign: 'center',
    },
    menuIconOrange: {
        fontSize: 13,
        color: '#EA580C',
        width: 16,
        textAlign: 'center',
    },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.35)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBox: {
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        width: 430,
        maxWidth: '95vw',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px 10px',
        borderBottom: '1px solid #f1f5f9',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#94a3b8',
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        fontWeight: 600,
        color: '#64748b',
        letterSpacing: '0.03em',
    },
    input: {
        height: 32,
        padding: '0 10px',
        border: '1px solid #e2e8f0',
        borderRadius: 7,
        fontSize: 12,
        color: '#1e293b',
        background: '#fff',
        outline: 'none',
        fontFamily: 'inherit',
    },
    cancelBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 11px',
        border: '1px solid #e2e8f0',
        borderRadius: 7,
        background: '#fff',
        cursor: 'pointer',
        fontSize: 12,
        color: '#475569',
        fontWeight: 500,
    },
    submitBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        height: 32,
        padding: '0 14px',
        borderRadius: 7,
        background: '#3864f3',
        color: '#fff',
        border: 'none',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
    },
};
