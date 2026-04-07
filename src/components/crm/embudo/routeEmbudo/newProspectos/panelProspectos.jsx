import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
    MdLocalPhone, MdDragIndicator,
    MdClose, MdRefresh, MdSearch, MdCheck, MdErrorOutline
} from 'react-icons/md';
import { BsLayoutThreeColumns, BsFunnelFill } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../../store/action/action';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/* ─── Columnas que pertenecen a dataProspect (requieren llamada API al editar) */
const DATA_PROSPECT_COLS = new Set([
    'categoriaProducto', 'referenciaProducto', 'seRealizoVenta',
    'valorVentaIva', 'cotizacion', 'valorCotizacion', 'asesor', 'motivoRechazo',
]);

/* ─── Definición de columnas ─────────────────────────────────────────── */
const COLS_DEF = [
    { key: 'fecha',             label: 'FECHA',               type: 'date',         width: 120 },
    { key: 'empresa',           label: 'NOMBRE / EMPRESA',    type: 'text',         width: 170 },
    { key: 'whatsapp',          label: 'WHATS APP',           type: 'text',         width: 140 },
    { key: 'hora',              label: 'HORA',                type: 'time',         width: 110 },
    { key: 'fuente',            label: 'FUENTE',              type: 'text',         width: 130 },
    { key: 'categoriaProducto', label: 'CATEG. PRODUCTO',     type: 'text',         width: 175 },
    { key: 'referenciaProducto',label: 'REF. PRODUCTO',       type: 'text',         width: 185 },
    { key: 'seRealizoVenta',    label: 'SE REALIZÓ LA VENTA', type: 'select',       options: ['Sí', 'No'], width: 160 },
    { key: 'valorVentaIva',     label: 'VALOR VENTA + IVA',   type: 'money',        width: 160 },
    { key: 'cotizacion',        label: 'COTIZACIÓN SI/NO',    type: 'select',       options: ['Sí', 'No'], width: 150 },
    { key: 'valorCotizacion',   label: 'VALOR COTIZACIÓN',    type: 'money',        width: 155 },
    { key: 'asesor',            label: 'ASESOR',              type: 'asesor-select',width: 150 },
    { key: 'motivoRechazo',     label: 'MOTIVO DE RECHAZO',   type: 'text',         width: 200 },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */
const fmtMoney = (v) =>
    v !== '' && v != null ? `$${Number(v).toLocaleString('es-CO')}` : '';

/** "14:35" → "2:35 PM"  |  "09:05" → "9:05 AM" */
const fmtAmPm = (hhmm) => {
    if (!hhmm) return '';
    const parts = hhmm.split(':');
    if (parts.length < 2) return hhmm;
    const h = parseInt(parts[0], 10);
    const m = parts[1].padStart(2, '0');
    if (isNaN(h)) return hhmm;
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${period}`;
};

/** boolean → 'Sí' / 'No' / '' */
const boolToSiNo = (v) => (v === true ? 'Sí' : v === false ? 'No' : '');

/** 'Sí'/'No' → true/false */
const siNoToBool = (v) => (v === 'Sí' ? true : v === 'No' ? false : null);

const resolveAsesor = (id, lista) => {
    if (id === null || id === undefined || id === '') return '';
    const found = lista.find(a => Number(a.id) === Number(id));
    return found ? (found.nombre || found.name || found.email || String(id)) : String(id);
};

/**
 * Mapea la respuesta del API al formato interno de la tabla.
 * JSON esperado:
 *   { id, namePersona, phone, state, createdAt,
 *     dataProspect: { categoria, categoriaProducto, venta, cotizado,
 *                     valorCotizado, asesorAsignado, motivoDescripcion },
 *     fuente: { id, nombre } }
 */
const mapProspectos = (lista, asesores = []) =>
    lista.map((p, i) => {
        const dp = p.dataProspect || {};
        const fechaRaw = p.createdAt || p.fecha || '';
        const fecha    = fechaRaw ? fechaRaw.split('T')[0] : '';
        const horaRaw  = fechaRaw && fechaRaw.includes('T')
            ? fechaRaw.split('T')[1].substring(0, 5)
            : (dp.hora || p.hora || '');

        return {
            _idx:            i,
            _id:             p.id || p._id || i,
            _asesorId:       dp.asesorAsignado ?? null,
            _hasDataProspect: !!p.dataProspect,
            _calendaries:    p.calendaries || [],
            _activeCalendaryId: p.calendaries?.find(c => c.state === 'active')?.id ?? null,
            state:           p.state || '',
            fecha,
            hora:            horaRaw,
            empresa:         p.nombreEmpresa || p.namePersona || p.empresa || '',
            whatsapp:        p.phone || p.whatsapp || '',
            fuente:          p.fuente?.nombre || '',
            // dataProspect fields
            categoriaProducto:  dp.categoria          || '',
            referenciaProducto: dp.categoriaProducto  || '',   // API: categoriaProducto = ref producto
            seRealizoVenta:     boolToSiNo(dp.venta),
            valorVentaIva:      dp.valorVenta          || '',
            cotizacion:         boolToSiNo(dp.cotizado),
            valorCotizacion:    dp.valorCotizado       || '',
            asesor:             resolveAsesor(dp.asesorAsignado, asesores),
            motivoRechazo:      dp.motivoDescripcion   || dp.motivoRechazo || '',
        };
    });

/** Construye el body para crear o actualizar dataProspect */
const buildBody = (row) => ({
    categoria:         row.categoriaProducto  || null,
    categoriaProducto: row.referenciaProducto || null,   // REF PRODUCTO → categoriaProducto del API
    venta:             siNoToBool(row.seRealizoVenta),
    cotizado:          siNoToBool(row.cotizacion),
    valorCotizado:     row.valorCotizacion    || null,
    asesorAsignado:    row._asesorId          ?? null,
    motivoDescripcion: row.motivoRechazo      || null,
});

const displayValue = (col, val) => {
    if (col.type === 'money') return fmtMoney(val);
    if (col.type === 'time')  return fmtAmPm(val);
    return val ?? '';
};

const ESTADO_COLOR = {
    'intento 1': { bg: '#EEF2FF', color: '#4F46E5' },
    'intento 2': { bg: '#FFF7ED', color: '#EA580C' },
    'intento 3': { bg: '#FEF2F2', color: '#DC2626' },
    'intento 4': { bg: '#FEF2F2', color: '#991B1B' },
    'perdido':   { bg: '#FEE2E2', color: '#B91C1C' },
    'cliente':   { bg: '#DCFCE7', color: '#15803D' },
};

const CALL_STATES = new Set(['intento 1', 'intento 2', 'intento 3']);

/** Devuelve el objeto de color según estado + venta */
const getStateStyle = (row) => {
    if (row.seRealizoVenta === 'Sí') return ESTADO_COLOR['cliente'];
    if (row.state && row.state.includes('cliente')) return ESTADO_COLOR['cliente'];
    if (row.state === 'perdido') return ESTADO_COLOR['perdido'];
    return ESTADO_COLOR[row.state] || { bg: '#f1f5f9', color: '#64748b' };
};

const EMPTY_FILTERS = {
    desde: '', hasta: '', fuenteId: '', venta: '',
    asesorAsignado: '', valorCotizadoMin: '', valorCotizadoMax: '',
};

/* ════════════════ COMPONENTE PRINCIPAL ════════════════════════════════ */
export default function NewProspectosEmbudo() {
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();

    const embudo  = useSelector(s => s.embudo);
    const sistema = useSelector(s => s.system);
    const usuario = useSelector(s => s.usuario);

    const { prospectosPanel, loadingProspectosPanel } = embudo;
    const fuentes  = sistema?.system?.fuentes || [];
    const asesores = usuario?.asesores        || [];
    const user     = usuario?.user;

    const [tableData,      setTableData]      = useState([]);
    const [columns,        setColumns]        = useState(COLS_DEF.map(c => ({ ...c, visible: true })));
    const [editingCell,    setEditingCell]    = useState(null);
    const [showColManager, setShowColManager] = useState(false);
    const [showFilters,    setShowFilters]    = useState(false);
    const [filters,        setFilters]        = useState(EMPTY_FILTERS);
    const [dragOverIdx,    setDragOverIdx]    = useState(null);
    const [selectedRows,   setSelectedRows]   = useState(new Set());
    /** filas que están guardando { rowIdx: 'saving'|'ok'|'error' } */
    const [rowStatus,      setRowStatus]      = useState({});
    /** Fila con acción de llamada en progreso */
    const [actionLoadingRow, setActionLoadingRow] = useState(null);
    /** Modal de "Llamar después" */
    const [laterModal, setLaterModal] = useState(null); // { rowIdx, row }
    const [laterForm,  setLaterForm]  = useState({ time: '', hour: '16:00', note: '' });

    /** Menú de tres puntos por fila */
    const [activeMenu, setActiveMenu] = useState(null); // { rowIdx, row, x, y }
    const menuRef = useRef(null);

    const dragColRef  = useRef(null);
    const inputRef    = useRef(null);
    const colPanelRef = useRef(null);
    const debounceRef = useRef(null);

    /* ── Carga inicial ── */
    useEffect(() => {
        dispatch(actions.axiosGetProspectosPanel(EMPTY_FILTERS));
        if (!asesores.length) dispatch(actions.axiosToGetAsesores(1, false));
    }, []);

    /* ── Sync Redux → tableData ── */
    useEffect(() => {
        if (prospectosPanel && Array.isArray(prospectosPanel)) {
            setTableData(mapProspectos(prospectosPanel, asesores));
        }
    }, [prospectosPanel, asesores]);

    /* ── Re-resolver asesores cuando llegue la lista ── */
    useEffect(() => {
        if (asesores.length && tableData.length) {
            setTableData(prev => prev.map(r => ({
                ...r, asesor: resolveAsesor(r._asesorId, asesores),
            })));
        }
    }, [asesores]);

    /* ── Focus al editar ── */
    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
            if (inputRef.current.select) inputRef.current.select();
        }
    }, [editingCell]);

    /* ── Cerrar panel columnas al click externo ── */
    useEffect(() => {
        const fn = e => {
            if (colPanelRef.current && !colPanelRef.current.contains(e.target))
                setShowColManager(false);
        };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    /* ── Cerrar menú de acciones al click externo ── */
    useEffect(() => {
        const fn = e => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setActiveMenu(null);
        };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    /* ─── Guardar dataProspect en el API ───────────────────────────────── */
    const saveDataProspect = useCallback(async (rowIdx, updatedRow) => {
        const prospectoId = updatedRow._id;
        const hasDP       = updatedRow._hasDataProspect;
        const body        = buildBody(updatedRow);

        setRowStatus(prev => ({ ...prev, [rowIdx]: 'saving' }));
        try {
            if (hasDP) {
                await axios.patch(`/api/data-prospect/update/${prospectoId}`, body);
            } else {
                await axios.post('/api/data-prospect/create', { prospectoId, ...body });
                // marcar la fila como ya con dataProspect para futuras ediciones
                setTableData(prev => prev.map((r, i) =>
                    i === rowIdx ? { ...r, _hasDataProspect: true } : r
                ));
            }
            setRowStatus(prev => ({ ...prev, [rowIdx]: 'ok' }));
            setTimeout(() => setRowStatus(prev => {
                const n = { ...prev };
                delete n[rowIdx];
                return n;
            }), 2500);
        } catch {
            setRowStatus(prev => ({ ...prev, [rowIdx]: 'error' }));
            setTimeout(() => setRowStatus(prev => {
                const n = { ...prev };
                delete n[rowIdx];
                return n;
            }), 4000);
        }
    }, []);

    /* ─── Acciones de trazabilidad: Contestó / No contestó / Llamar después ── */

    /** No contestó → PUT /api/prospecto/dontCall (avanza intento) */
    const handleNoContesto = useCallback(async (row, rowIdx) => {
        if (actionLoadingRow === rowIdx) return;
        const prospectoId = row._id;
        const nextState =
            row.state === 'intento 1' ? 'intento 2' :
            row.state === 'intento 2' ? 'intento 3' :
            row.state === 'intento 3' ? 'intento 4' : null;

        if (!nextState) {
            dispatch(actions.HandleAlerta('Este prospecto ya llegó al máximo de intentos', 'negative'));
            return;
        }
        setActionLoadingRow(rowIdx);
        try {
            await axios.put('/api/prospecto/dontCall', {
                title:       nextState,
                caso:        nextState,
                prospectoId,
                userId:      user?.id,
                time:        dayjs().format('YYYY-MM-DD'),
                hour:        '4:00PM',
            });
            dispatch(actions.HandleAlerta('No contestó — próxima llamada en 3 días', 'positive'));
            dispatch(actions.axiosGetProspectosPanel(filters));
        } catch {
            dispatch(actions.HandleAlerta('No se pudo registrar el intento', 'negative'));
        } finally {
            setActionLoadingRow(null);
        }
    }, [actionLoadingRow, user, filters, dispatch]);

    /** Contestó → notificación; el asesor gestiona las siguientes acciones desde el Embudo */
    const handleContesto = useCallback((row) => {
        dispatch(actions.HandleAlerta(
            `✓ Contacto registrado para "${row.empresa || 'Prospecto'}". Gestiona las acciones desde el Embudo.`,
            'positive'
        ));
    }, [dispatch]);

    /** Llamar después → envía formulario de fecha/hora */
    const handleLaterSubmit = useCallback(async () => {
        if (!laterModal) return;
        const { rowIdx, row } = laterModal;
        if (!laterForm.time || !laterForm.hour) {
            dispatch(actions.HandleAlerta('Selecciona fecha y hora', 'negative'));
            return;
        }
        setActionLoadingRow(rowIdx);
        try {
            if (row._activeCalendaryId) {
                // Tiene calendario activo → usa /api/prospecto/aplazar
                await axios.put('/api/prospecto/aplazar', {
                    title:       `Llamar después — ${row.empresa || 'Prospecto'}`,
                    note:        laterForm.note || 'Programado desde el panel de prospectos',
                    tags:        [],
                    userId:      user?.id,
                    prospectoId: row._id,
                    calendaryId: row._activeCalendaryId,
                    time:        laterForm.time,
                    hour:        laterForm.hour,
                });
            } else {
                // Sin calendario activo → avanza con dontCall pero con fecha personalizada
                const nextState =
                    row.state === 'intento 1' ? 'intento 2' :
                    row.state === 'intento 2' ? 'intento 3' : 'intento 3';
                await axios.put('/api/prospecto/dontCall', {
                    title:       nextState,
                    caso:        nextState,
                    prospectoId: row._id,
                    userId:      user?.id,
                    time:        laterForm.time,
                    hour:        laterForm.hour,
                });
            }
            dispatch(actions.HandleAlerta(`Llamada programada para ${laterForm.time}`, 'positive'));
            setLaterModal(null);
            setLaterForm({ time: '', hour: '16:00', note: '' });
            dispatch(actions.axiosGetProspectosPanel(filters));
        } catch {
            dispatch(actions.HandleAlerta('No se pudo programar la llamada', 'negative'));
        } finally {
            setActionLoadingRow(null);
        }
    }, [laterModal, laterForm, user, filters, dispatch]);

    /* ─── Filtros ─────────────────────────────────────────────────────── */
    const applyFilters = useCallback((f) => {
        clearTimeout(debounceRef.current);
        dispatch(actions.axiosGetProspectosPanel(f));
    }, [dispatch]);

    const handleFilterChange = (key, value, immediate = false) => {
        const next = { ...filters, [key]: value };
        setFilters(next);
        if (immediate) {
            applyFilters(next);
        } else {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => applyFilters(next), 600);
        }
    };

    const clearFilters = () => { setFilters(EMPTY_FILTERS); applyFilters(EMPTY_FILTERS); };
    const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

    /* ── Columnas visibles ── */
    const visibleCols = columns.filter(c => c.visible);

    /* ── Filtro de estado sobre datos locales ── */
    const stateFilter  = params.get('filter');
    const filteredData = stateFilter ? tableData.filter(r => r.state === stateFilter) : tableData;

    /* ─── Edición inline ──────────────────────────────────────────────── */
    const startEdit = (rowIdx, colKey) => setEditingCell({ rowIdx, colKey });
    const stopEdit  = () => setEditingCell(null);

    /**
     * Confirma el valor editado.
     * Para columnas de dataProspect llama al API.
     * Para la columna asesor también actualiza _asesorId.
     */
    const commitEdit = useCallback((rowIdx, colKey, value, extra = {}) => {
        setTableData(prev => {
            const updated = prev.map((row, i) => {
                if (i !== rowIdx) return row;
                return { ...row, [colKey]: value, ...extra };
            });
            const updatedRow = updated[rowIdx];
            if (DATA_PROSPECT_COLS.has(colKey)) {
                saveDataProspect(rowIdx, updatedRow);
            }
            return updated;
        });
    }, [saveDataProspect]);

    const handleCellKey = (e, rowIdx, colKey) => {
        if (e.key === 'Escape' || e.key === 'Enter') { stopEdit(); return; }
        if (e.key === 'Tab') {
            e.preventDefault();
            stopEdit();
            const ci   = visibleCols.findIndex(c => c.key === colKey);
            const next = visibleCols[ci + 1];
            if (next) startEdit(rowIdx, next.key);
        }
    };

    /* ── Drag & drop columnas ── */
    const onDragStart = (e, idx) => { dragColRef.current = idx; e.dataTransfer.effectAllowed = 'move'; };
    const onDragOver  = (e, idx) => { e.preventDefault(); setDragOverIdx(idx); };
    const onDrop = (e, toIdx) => {
        e.preventDefault();
        const from = dragColRef.current;
        if (from === null || from === toIdx) { setDragOverIdx(null); return; }
        const next = [...columns];
        const [moved] = next.splice(from, 1);
        next.splice(toIdx, 0, moved);
        setColumns(next);
        dragColRef.current = null;
        setDragOverIdx(null);
    };
    const onDragEnd = () => { dragColRef.current = null; setDragOverIdx(null); };

    /* ── Toggle columna ── */
    const toggleCol = key => setColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));

    /* ── Selección de filas ── */
    const toggleRow = idx => setSelectedRows(prev => {
        const n = new Set(prev);
        n.has(idx) ? n.delete(idx) : n.add(idx);
        return n;
    });

    const countState = s => tableData.filter(r => r.state === s).length;

    /* ─── Render celda ────────────────────────────────────────────────── */
    const renderCell = (row, globalIdx, col) => {
        const isEditing = editingCell?.rowIdx === globalIdx && editingCell?.colKey === col.key;
        const val       = row[col.key] ?? '';

        /* ── Modo edición ── */
        if (isEditing) {
            /* Select estándar (Sí/No) */
            if (col.type === 'select') {
                return (
                    <select ref={inputRef} value={val}
                        onChange={e => commitEdit(globalIdx, col.key, e.target.value)}
                        onBlur={stopEdit} style={S.input}>
                        <option value="">— seleccionar —</option>
                        {col.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                );
            }
            /* Select de asesores */
            if (col.type === 'asesor-select') {
                return (
                    <select ref={inputRef} value={row._asesorId ?? ''}
                        onChange={e => {
                            const id     = e.target.value;
                            const nombre = resolveAsesor(id, asesores);
                            commitEdit(globalIdx, col.key, nombre, { _asesorId: id ? Number(id) : null });
                        }}
                        onBlur={stopEdit} style={S.input}>
                        <option value="">— seleccionar asesor —</option>
                        {asesores.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.nombre || a.name || a.email}
                            </option>
                        ))}
                    </select>
                );
            }
            /* Input hora */
            if (col.type === 'time') {
                return (
                    <input ref={inputRef} type="time" value={val}
                        onChange={e => commitEdit(globalIdx, col.key, e.target.value)}
                        onBlur={stopEdit}
                        onKeyDown={e => handleCellKey(e, globalIdx, col.key)}
                        style={S.input} />
                );
            }
            /* Input numérico / fecha / texto */
            const inputType = col.type === 'money' ? 'number' : col.type === 'date' ? 'date' : 'text';
            return (
                <input ref={inputRef} type={inputType} value={val}
                    onChange={e => commitEdit(globalIdx, col.key, e.target.value)}
                    onBlur={stopEdit}
                    onKeyDown={e => handleCellKey(e, globalIdx, col.key)}
                    style={S.input} placeholder="Escribir…" />
            );
        }

        /* ── Modo display ── */

        /* Chips Sí/No */
        if ((col.key === 'seRealizoVenta' || col.key === 'cotizacion') && val) {
            const ok = val === 'Sí';
            return <span style={{ ...S.chip, ...(ok ? S.chipGreen : S.chipRed) }}>{val}</span>;
        }

        const display = displayValue(col, val);
        return (
            <span style={S.cellText} title={col.type === 'time' ? `${val} (${fmtAmPm(val)})` : String(val)}>
                {display !== '' ? display : <span style={S.placeholder}>—</span>}
            </span>
        );
    };

    /* ─── Indicador de estado de fila ────────────────────────────────── */
    const renderRowStatus = (rowIdx) => {
        const st = rowStatus[rowIdx];
        if (!st) return null;
        if (st === 'saving') return <span style={S.statusSaving} title="Guardando…">●</span>;
        if (st === 'ok')     return <span style={S.statusOk}     title="Guardado"><MdCheck size={12} /></span>;
        if (st === 'error')  return <span style={S.statusError}  title="Error al guardar"><MdErrorOutline size={12} /></span>;
        return null;
    };

    /* ════════════════ JSX ═════════════════════════════════════════════ */
    return (
        <div className="pestanaEmbudo" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* ════ CABECERA ════ */}
            <div style={S.header}>
                {/* Fila 1 */}
                <div style={S.headerRow1}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={S.iconCircle}><MdLocalPhone size={18} color="#fff" /></span>
                        <div>
                            {loadingProspectosPanel
                                ? <Skeleton width={180} height={16} />
                                : <h3 style={S.title}>Panel de Prospectos</h3>}
                            {loadingProspectosPanel
                                ? <Skeleton width={110} height={11} style={{ marginTop: 3 }} />
                                : <span style={S.subtitle}>
                                    {filteredData.length} registro{filteredData.length !== 1 ? 's' : ''}
                                    {stateFilter ? ` · ${stateFilter}` : ''}
                                    {activeFilterCount > 0 && (
                                        <span style={S.filterBadge}>{activeFilterCount} filtro{activeFilterCount > 1 ? 's' : ''}</span>
                                    )}
                                  </span>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button style={{ ...S.toolBtn, ...(showFilters ? S.toolBtnActive : {}) }}
                            onClick={() => setShowFilters(v => !v)}>
                            <BsFunnelFill size={13} />
                            <span style={{ marginLeft: 5 }}>Filtros</span>
                            {activeFilterCount > 0 && <span style={S.btnBadge}>{activeFilterCount}</span>}
                        </button>

                        {activeFilterCount > 0 && (
                            <button style={S.toolBtn} onClick={clearFilters}>
                                <MdRefresh size={15} />
                                <span style={{ marginLeft: 5 }}>Limpiar</span>
                            </button>
                        )}

                        <button style={S.toolBtn}
                            onClick={() => dispatch(actions.axiosGetProspectosPanel(filters))}
                            disabled={loadingProspectosPanel}>
                            <MdRefresh size={15} style={{ animation: loadingProspectosPanel ? 'spin 1s linear infinite' : 'none' }} />
                        </button>

                        <div style={{ position: 'relative' }} ref={colPanelRef}>
                            <button style={S.toolBtn} onClick={() => setShowColManager(v => !v)}>
                                <BsLayoutThreeColumns size={13} />
                                <span style={{ marginLeft: 5 }}>Columnas</span>
                            </button>
                            {showColManager && (
                                <div style={S.colPanel}>
                                    <div style={S.colPanelHeader}>
                                        <span>Columnas visibles</span>
                                        <button style={S.iconBtn} onClick={() => setShowColManager(false)}>
                                            <MdClose size={15} />
                                        </button>
                                    </div>
                                    {columns.map(col => (
                                        <label key={col.key} style={S.colPanelItem}>
                                            <input type="checkbox" checked={col.visible}
                                                onChange={() => toggleCol(col.key)}
                                                style={{ marginRight: 8, accentColor: '#3864f3' }} />
                                            {col.label}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fila 2: filtros de estado */}
                {!loadingProspectosPanel && prospectosPanel && prospectosPanel !== 'notrequest' && (
                    <div style={S.stateFilterRow}>
                        {[
                            { key: 'intento 1', label: 'Primer intento' },
                            { key: 'intento 2', label: 'Segundo intento' },
                            { key: 'intento 3', label: 'Tercer intento' },
                        ].map(f => (
                            <button key={f.key}
                                style={{
                                    ...S.stateBtn,
                                    ...(stateFilter === f.key
                                        ? { background: ESTADO_COLOR[f.key]?.bg, color: ESTADO_COLOR[f.key]?.color, borderColor: ESTADO_COLOR[f.key]?.color, fontWeight: 600 }
                                        : {}),
                                }}
                                onClick={() => {
                                    if (stateFilter === f.key) { params.delete('filter'); } else { params.set('filter', f.key); }
                                    setParams(params);
                                }}>
                                {f.label}
                                <span style={{
                                    ...S.stateBadge,
                                    background: stateFilter === f.key ? ESTADO_COLOR[f.key]?.color : '#e2e8f0',
                                    color:      stateFilter === f.key ? '#fff' : '#64748b',
                                }}>{countState(f.key)}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Fila 3: filtros avanzados */}
                {showFilters && (
                    <div style={S.filterPanel}>
                        <div style={S.filterGroup}>
                            <label style={S.filterLabel}>📅 Desde</label>
                            <input type="date" style={S.filterInput} value={filters.desde}
                                onChange={e => handleFilterChange('desde', e.target.value, true)} />
                        </div>
                        <div style={S.filterGroup}>
                            <label style={S.filterLabel}>📅 Hasta</label>
                            <input type="date" style={S.filterInput} value={filters.hasta}
                                onChange={e => handleFilterChange('hasta', e.target.value, true)} />
                        </div>
                        <div style={S.filterGroup}>
                            <label style={S.filterLabel}>🔗 Fuente</label>
                            <select style={S.filterInput} value={filters.fuenteId}
                                onChange={e => handleFilterChange('fuenteId', e.target.value, true)}>
                                <option value="">Todas</option>
                                {fuentes.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                            </select>
                        </div>
                        <div style={S.filterGroup}>
                            <label style={S.filterLabel}>✅ Venta</label>
                            <select style={S.filterInput} value={filters.venta}
                                onChange={e => handleFilterChange('venta', e.target.value, true)}>
                                <option value="">Todos</option>
                                <option value="true">Con venta</option>
                                <option value="false">Sin venta</option>
                            </select>
                        </div>
                        <div style={S.filterGroup}>
                            <label style={S.filterLabel}>👤 Asesor</label>
                            <select style={S.filterInput} value={filters.asesorAsignado}
                                onChange={e => handleFilterChange('asesorAsignado', e.target.value, true)}>
                                <option value="">Todos</option>
                                {asesores.map(a => (
                                    <option key={a.id} value={a.id}>{a.nombre || a.name || a.email}</option>
                                ))}
                            </select>
                        </div>
                        <div style={S.filterDivider} />
                        <div style={S.filterGroup}>
                            <label style={S.filterLabel}>💰 Cotiz. mín.</label>
                            <input type="number" style={S.filterInput} placeholder="0"
                                value={filters.valorCotizadoMin}
                                onChange={e => handleFilterChange('valorCotizadoMin', e.target.value)} />
                        </div>
                        <div style={S.filterGroup}>
                            <label style={S.filterLabel}>💰 Cotiz. máx.</label>
                            <input type="number" style={S.filterInput} placeholder="Sin límite"
                                value={filters.valorCotizadoMax}
                                onChange={e => handleFilterChange('valorCotizadoMax', e.target.value)} />
                        </div>
                        <button style={S.searchBtn} onClick={() => applyFilters(filters)} disabled={loadingProspectosPanel}>
                            <MdSearch size={16} /><span style={{ marginLeft: 4 }}>Buscar</span>
                        </button>
                    </div>
                )}
            </div>

            {/* ════ TABLA ════ */}
            <div style={S.tableWrapper}>
                {loadingProspectosPanel ? (
                    <div style={{ padding: '16px 20px' }}>
                        {[...Array(8)].map((_, i) => <Skeleton key={i} height={33} style={{ marginBottom: 3 }} />)}
                    </div>
                ) : !prospectosPanel || prospectosPanel === 'notrequest' ? (
                    <div style={S.empty}>
                        <span style={{ fontSize: 44 }}>📡</span>
                        <p style={{ color: '#94a3b8', fontWeight: 500 }}>Sin conexión con el servidor</p>
                        <button style={S.searchBtn} onClick={() => dispatch(actions.axiosGetProspectosPanel(filters))}>
                            Reintentar
                        </button>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div style={S.empty}>
                        <span style={{ fontSize: 44 }}>📋</span>
                        <p style={{ color: '#94a3b8', fontWeight: 500 }}>
                            {activeFilterCount > 0 ? 'Sin resultados con los filtros aplicados' : 'Sin registros'}
                        </p>
                        {activeFilterCount > 0 && (
                            <button style={S.searchBtn} onClick={clearFilters}>Limpiar filtros</button>
                        )}
                    </div>
                ) : (
                    <div style={S.scrollContainer}>
                        <table style={S.table}>
                            <thead>
                                <tr>
                                    <th style={{ ...S.th, ...S.thNum, width: 46, minWidth: 46 }}>
                                        <input type="checkbox" style={{ accentColor: '#3864f3' }}
                                            checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                                            onChange={e => setSelectedRows(e.target.checked
                                                ? new Set(filteredData.map((_, i) => i))
                                                : new Set())} />
                                    </th>
                                    <th style={{ ...S.th, width: 170, minWidth: 170, cursor: 'default' }}>
                                        <div style={S.thInner}>
                                            <span style={{ fontSize: 13 }}>📞</span>
                                            <span style={S.thLabel}>ESTADO</span>
                                        </div>
                                    </th>
                                    {visibleCols.map((col, ci) => (
                                        <th key={col.key}
                                            style={{
                                                ...S.th,
                                                width: col.width, minWidth: col.width,
                                                background:  dragOverIdx === ci ? '#dde5ff' : S.th.background,
                                                borderLeft:  dragOverIdx === ci ? '2px solid #3864f3' : undefined,
                                            }}
                                            draggable
                                            onDragStart={e => onDragStart(e, ci)}
                                            onDragOver={e => onDragOver(e, ci)}
                                            onDrop={e => onDrop(e, ci)}
                                            onDragEnd={onDragEnd}>
                                            <div style={S.thInner}>
                                                <MdDragIndicator size={13} color="#aaa" style={{ flexShrink: 0, cursor: 'grab' }} />
                                                <span style={S.thLabel}>{col.label}</span>
                                                {DATA_PROSPECT_COLS.has(col.key) && (
                                                    <span style={S.thDpDot} title="Campo editable (dataProspect)" />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, di) => {
                                    const gi         = tableData.indexOf(row);
                                    const isSelected = selectedRows.has(di);
                                    const st         = rowStatus[gi];
                                    return (
                                        <tr key={row._id ?? di}
                                            style={{ background: isSelected ? '#EEF2FF' : di % 2 === 0 ? '#fff' : '#F9FAFB' }}
                                            className="excelRow">
                                            <td style={{ ...S.tdNum, position: 'relative' }}>
                                                <input type="checkbox" checked={isSelected}
                                                    onChange={() => toggleRow(di)}
                                                    style={{ accentColor: '#3864f3' }} />
                                                {renderRowStatus(gi)}
                                            </td>
                                            {/* ── Columna ESTADO / LLAMADA ── */}
                                            <td style={{ ...S.td, cursor: 'default', overflow: 'visible', padding: '0 8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'nowrap' }}>
                                                    {/* Chip de estado con tooltip */}
                                                    {row.state && (
                                                        <span
                                                            title={row.seRealizoVenta === 'Sí' ? `${row.state} · Venta cerrada` : row.state}
                                                            style={{
                                                                ...S.chip,
                                                                ...getStateStyle(row),
                                                                fontSize: 10, padding: '2px 8px',
                                                                flexShrink: 0, maxWidth: 120,
                                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                            }}>
                                                            {row.seRealizoVenta === 'Sí' ? '✓ cliente' : row.state}
                                                        </span>
                                                    )}

                                                    {/* Tres puntos — solo para intentos activos */}
                                                    {CALL_STATES.has(row.state) && (
                                                        actionLoadingRow === gi ? (
                                                            <span style={{ color: '#94a3b8', fontSize: 11, fontStyle: 'italic' }}>…</span>
                                                        ) : (
                                                            <button
                                                                title="Opciones de llamada"
                                                                style={S.menuBtn}
                                                                className="menuBtnHover"
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                                    setActiveMenu(prev =>
                                                                        prev?.rowIdx === gi ? null
                                                                        : { rowIdx: gi, row, x: rect.left, y: rect.bottom + 6 }
                                                                    );
                                                                }}>
                                                                ···
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            {visibleCols.map(col => {
                                                const isEditing = editingCell?.rowIdx === gi && editingCell?.colKey === col.key;
                                                const isDP      = DATA_PROSPECT_COLS.has(col.key);
                                                return (
                                                    <td key={col.key}
                                                        style={{
                                                            ...S.td,
                                                            background: isEditing ? '#fff'
                                                                : isDP && st === 'saving' ? '#FFFBEB'
                                                                : 'transparent',
                                                            outline: isEditing ? '2px solid #3864f3' : 'none',
                                                            outlineOffset: -1,
                                                            position: 'relative',
                                                            zIndex: isEditing ? 5 : 'auto',
                                                        }}
                                                        onClick={() => !isEditing && startEdit(gi, col.key)}>
                                                        {renderCell(row, gi, col)}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ════ DROPDOWN MENÚ DE ACCIONES (···) ════ */}
            {activeMenu && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        left:     activeMenu.x,
                        top:      activeMenu.y,
                        zIndex:   3000,
                        background: '#fff',
                        borderRadius: 10,
                        boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
                        border: '1px solid #e2e8f0',
                        minWidth: 180,
                        overflow: 'hidden',
                    }}
                    onClick={e => e.stopPropagation()}>

                    {/* Cabecera del menú */}
                    <div style={{ padding: '8px 14px 6px', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {activeMenu.row.empresa || 'Prospecto'}
                        </span>
                    </div>

                    {/* Opción: Contestó */}
                    <button style={S.menuItem} className="menuItemHover" onClick={() => {
                        handleContesto(activeMenu.row);
                        setActiveMenu(null);
                    }}>
                        <span style={S.menuIconGreen}>✓</span>
                        Contestó
                    </button>

                    {/* Opción: No contestó */}
                    <button style={S.menuItem} className="menuItemHover" onClick={() => {
                        handleNoContesto(activeMenu.row, activeMenu.rowIdx);
                        setActiveMenu(null);
                    }}>
                        <span style={S.menuIconRed}>✗</span>
                        No contestó
                    </button>

                    {/* Opción: Llamar después */}
                    <button style={{ ...S.menuItem, borderTop: '1px solid #f1f5f9' }} className="menuItemHover" onClick={() => {
                        setLaterModal({ rowIdx: activeMenu.rowIdx, row: activeMenu.row });
                        setLaterForm({ time: '', hour: '16:00', note: '' });
                        setActiveMenu(null);
                    }}>
                        <span style={S.menuIconOrange}>⏰</span>
                        Llamar después
                    </button>
                </div>
            )}

            {/* ════ MODAL: LLAMAR DESPUÉS ════ */}
            {laterModal && (
                <div style={S.modalOverlay} onClick={() => setLaterModal(null)}>
                    <div style={S.modalBox} onClick={e => e.stopPropagation()}>
                        <div style={S.modalHeader}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                                ⏰ Llamar después
                            </span>
                            <button style={S.iconBtn} onClick={() => setLaterModal(null)}>
                                <MdClose size={16} />
                            </button>
                        </div>
                        <div style={{ padding: '12px 16px 16px' }}>
                            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px' }}>
                                <strong>{laterModal.row.empresa || 'Prospecto'}</strong>
                                {laterModal.row.whatsapp ? ` — ${laterModal.row.whatsapp}` : ''}
                                {laterModal.row.state ? <span style={{
                                    marginLeft: 6, padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                                    background: ESTADO_COLOR[laterModal.row.state]?.bg || '#f1f5f9',
                                    color:      ESTADO_COLOR[laterModal.row.state]?.color || '#64748b',
                                }}>{laterModal.row.state}</span> : null}
                            </p>

                            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={S.filterLabel}>📅 Nueva fecha</label>
                                    <input type="date" style={{ ...S.filterInput, width: '100%', marginTop: 4 }}
                                        value={laterForm.time}
                                        onChange={e => setLaterForm(f => ({ ...f, time: e.target.value }))} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={S.filterLabel}>🕐 Hora</label>
                                    <select style={{ ...S.filterInput, width: '100%', marginTop: 4 }}
                                        value={laterForm.hour}
                                        onChange={e => setLaterForm(f => ({ ...f, hour: e.target.value }))}>
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
                                <label style={S.filterLabel}>📝 Nota (opcional)</label>
                                <textarea
                                    style={{ ...S.filterInput, width: '100%', marginTop: 4, height: 64, resize: 'vertical', padding: '6px 10px', boxSizing: 'border-box' }}
                                    placeholder="Ej: Llamar en la tarde, preguntar por cotización…"
                                    value={laterForm.note}
                                    onChange={e => setLaterForm(f => ({ ...f, note: e.target.value }))} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <button style={S.toolBtn} onClick={() => setLaterModal(null)}>
                                    Cancelar
                                </button>
                                <button style={S.searchBtn}
                                    onClick={handleLaterSubmit}
                                    disabled={actionLoadingRow === laterModal.rowIdx}>
                                    {actionLoadingRow === laterModal.rowIdx ? 'Guardando…' : '✓ Programar llamada'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
                .excelRow:hover td { background-color: #F0F4FF !important; }
                .excelRow td { transition: background .1s; }
                thead th { user-select: none; }
                thead th:hover { background: #e8ecf8 !important; }
                ::-webkit-scrollbar { height: 7px; width: 7px; }
                ::-webkit-scrollbar-track { background: #f1f5f9; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                input[type=number]::-webkit-inner-spin-button { opacity: 1; }
                .menuItemHover:hover { background: #F8FAFC !important; }
                .menuBtnHover:hover { background: #EEF2FF !important; border-color: #c7d2fe !important; color: #3864f3 !important; }
            `}</style>
        </div>
    );
}

/* ─── Estilos ────────────────────────────────────────────────────────── */
const S = {
    header: {
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0, padding: '12px 18px 0',
    },
    headerRow1: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 10, flexWrap: 'wrap', gap: 8,
    },
    iconCircle: {
        width: 36, height: 36, borderRadius: '50%', background: '#3864f3',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    title:    { margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' },
    subtitle: { fontSize: 12, color: '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 },
    filterBadge: { background: '#3864f3', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700 },
    toolBtn: {
        display: 'inline-flex', alignItems: 'center', padding: '5px 11px',
        border: '1px solid #e2e8f0', borderRadius: 7, background: '#fff', cursor: 'pointer',
        fontSize: 12, color: '#475569', fontWeight: 500, transition: 'all .15s',
    },
    toolBtnActive: { background: '#EEF2FF', borderColor: '#3864f3', color: '#3864f3' },
    btnBadge: { marginLeft: 5, background: '#3864f3', color: '#fff', borderRadius: 10, padding: '0 6px', fontSize: 10, fontWeight: 700 },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' },
    stateFilterRow: { display: 'flex', gap: 6, paddingBottom: 10, borderTop: '1px solid #f1f5f9', paddingTop: 8, marginTop: 2 },
    stateBtn: {
        display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20,
        border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, cursor: 'pointer',
        color: '#475569', fontWeight: 500, transition: 'all .15s',
    },
    stateBadge: { borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 600 },
    filterPanel: {
        display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10,
        background: '#F8FAFC', borderTop: '1px solid #e2e8f0', padding: '10px 0 12px', marginTop: 2,
    },
    filterGroup: { display: 'flex', flexDirection: 'column', gap: 3 },
    filterLabel: { fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.03em' },
    filterInput: {
        height: 32, padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: 7,
        fontSize: 12, color: '#1e293b', background: '#fff', outline: 'none', minWidth: 120, fontFamily: 'inherit',
    },
    filterDivider: { width: 1, height: 32, background: '#e2e8f0', margin: '0 4px', alignSelf: 'flex-end' },
    searchBtn: {
        display: 'inline-flex', alignItems: 'center', height: 32, padding: '0 14px', borderRadius: 7,
        background: '#3864f3', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600,
        cursor: 'pointer', transition: 'opacity .15s', alignSelf: 'flex-end',
    },
    colPanel: {
        position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: '#fff',
        border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        zIndex: 999, minWidth: 220, overflow: 'hidden',
    },
    colPanelHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 14px', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 600, color: '#1e293b',
    },
    colPanelItem: {
        display: 'flex', alignItems: 'center', padding: '8px 14px',
        fontSize: 12, color: '#475569', cursor: 'pointer', borderBottom: '1px solid #f8fafc',
    },
    tableWrapper: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    scrollContainer: { flex: 1, overflowX: 'auto', overflowY: 'auto' },
    table: { borderCollapse: 'collapse', tableLayout: 'fixed', width: 'max-content', minWidth: '100%', fontSize: 13 },
    th: {
        position: 'sticky', top: 0, zIndex: 10, background: '#F1F5F9',
        borderRight: '1px solid #e2e8f0', borderBottom: '2px solid #cbd5e1',
        padding: '0 6px', height: 36, fontWeight: 700, fontSize: 11, color: '#475569',
        textAlign: 'left', letterSpacing: '0.03em', cursor: 'grab', whiteSpace: 'nowrap', overflow: 'hidden',
    },
    thNum: { zIndex: 11, textAlign: 'center' },
    thInner: { display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' },
    thLabel: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 },
    thDpDot: {
        width: 5, height: 5, borderRadius: '50%', background: '#3864f3',
        flexShrink: 0, display: 'inline-block',
    },
    td: {
        borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #f1f5f9',
        padding: '0 6px', height: 34, cursor: 'cell', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 0,
    },
    tdNum: {
        borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #f1f5f9',
        padding: '0 8px', height: 34, textAlign: 'center', color: '#94a3b8', fontSize: 11, background: '#FAFAFA',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
    },
    cellText: { display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1e293b' },
    placeholder: { color: '#cbd5e1' },
    input: {
        width: '100%', height: '100%', border: 'none', outline: 'none',
        background: 'transparent', fontSize: 13, color: '#1e293b', padding: '0 2px', fontFamily: 'inherit',
    },
    chip: { display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 },
    chipGreen: { background: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0' },
    chipRed:   { background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' },
    empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220, color: '#94a3b8', gap: 8 },
    /* indicadores de guardado */
    statusSaving: { fontSize: 10, color: '#F59E0B', animation: 'pulse 1s infinite', lineHeight: 1 },
    statusOk:     { display: 'flex', color: '#16A34A', lineHeight: 1 },
    statusError:  { display: 'flex', color: '#DC2626', lineHeight: 1 },
    /* botón de tres puntos (···) */
    menuBtn: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        height: 22, padding: '0 7px', borderRadius: 6,
        border: '1px solid #e2e8f0', background: '#F8FAFC', color: '#475569',
        cursor: 'pointer', fontSize: 15, fontWeight: 700, letterSpacing: 2,
        flexShrink: 0, lineHeight: 1, transition: 'all .1s',
    },
    /* items del dropdown */
    menuItem: {
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        padding: '9px 14px', background: 'none', border: 'none',
        fontSize: 13, color: '#1e293b', cursor: 'pointer', textAlign: 'left',
        transition: 'background .1s',
    },
    menuIconGreen:  { fontSize: 13, fontWeight: 700, color: '#16A34A', width: 16, textAlign: 'center' },
    menuIconRed:    { fontSize: 13, fontWeight: 700, color: '#DC2626', width: 16, textAlign: 'center' },
    menuIconOrange: { fontSize: 13, color: '#EA580C', width: 16, textAlign: 'center' },
    /* modal llamar después */
    modalOverlay: {
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)',
        zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    modalBox: {
        background: '#fff', borderRadius: 14,
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        width: 430, maxWidth: '95vw',
    },
    modalHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 16px 10px', borderBottom: '1px solid #f1f5f9',
    },
};
