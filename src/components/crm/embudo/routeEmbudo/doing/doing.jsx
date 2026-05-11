import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BsCloudPlus } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import * as actions from '../../../../store/action/action';
import { cambiarEstadoDoing, crearDoing, listarPendientes } from './doingApi';
import './doing.css';

function DoingModal({ user, onClose }) {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const [draft, setDraft] = useState({ name: '', description: '' });
    const [savingNew, setSavingNew] = useState(false);
    const [busyIds, setBusyIds] = useState(() => new Set());
    const [bannerErr, setBannerErr] = useState('');
    const firstInputRef = useRef(null);

    const refresh = useCallback(async () => {
        if (!user?.id) return;
        setLoadingList(true);
        setBannerErr('');
        try {
            const list = await listarPendientes(user.id);
            setItems(list);
        } catch (e) {
            const msg =
                e?.response?.data?.msg ||
                e?.message ||
                'No se pudieron cargar los pendientes.';
            setBannerErr(msg);
            dispatch(actions.HandleAlerta(msg, 'mistake'));
        } finally {
            setLoadingList(false);
        }
    }, [user?.id, dispatch]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        const t = setTimeout(() => firstInputRef.current?.focus(), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const onKey = (ev) => {
            if (ev.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    const setBusy = (id, on) => {
        setBusyIds((prev) => {
            const next = new Set(prev);
            if (on) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    const handleGuardarNuevo = async () => {
        const name = draft.name.trim();
        if (!name || !user?.id) {
            dispatch(
                actions.HandleAlerta('El título es obligatorio para crear un pendiente.', 'mistake')
            );
            return;
        }
        setSavingNew(true);
        setBannerErr('');
        try {
            await crearDoing({
                name,
                userId: user.id,
                description: draft.description.trim() || undefined,
            });
            setDraft({ name: '', description: '' });
            dispatch(actions.HandleAlerta('Pendiente creado.', 'positive'));
            await refresh();
            firstInputRef.current?.focus();
        } catch (e) {
            const msg =
                e?.response?.data?.msg ||
                e?.message ||
                'No se pudo crear el pendiente.';
            setBannerErr(msg);
            dispatch(actions.HandleAlerta(msg, 'mistake'));
        } finally {
            setSavingNew(false);
        }
    };

    const handleMarcarCumplida = async (doingId) => {
        setBusy(doingId, true);
        setBannerErr('');
        try {
            await cambiarEstadoDoing(doingId, 'cumplida');
            dispatch(actions.HandleAlerta('Marcado como cumplido.', 'positive'));
            await refresh();
        } catch (e) {
            const msg =
                e?.response?.data?.msg ||
                e?.message ||
                'No se pudo actualizar el estado.';
            setBannerErr(msg);
            dispatch(actions.HandleAlerta(msg, 'mistake'));
        } finally {
            setBusy(doingId, false);
        }
    };

    const modal = (
        <div className="doingBackdrop" role="presentation" onClick={onClose}>
            <div
                className="doingModal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="doingModalTitle"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="doingModalHeader">
                    <div>
                        <h2 id="doingModalTitle">Pendientes por crear</h2>
                        <p>
                            Vista rápida tipo hoja: creá filas nuevas o marcá como cumplido. Los datos
                            vienen de la API de doings (cotización).
                        </p>
                    </div>
                    <button type="button" className="doingModalClose" onClick={onClose}>
                        Cerrar
                    </button>
                </div>

                {bannerErr ? <div className="doingErrBanner">{bannerErr}</div> : null}

                <div className="doingSheetToolbar">
                    {loadingList ? 'Cargando…' : `${items.length} pendiente(s)`}
                </div>

                <div className="doingSheetWrap">
                    <table className="doingSheet">
                        <colgroup>
                            <col style={{ width: '28%' }} />
                            <col style={{ width: '36%' }} />
                            <col style={{ width: '18%' }} />
                            <col style={{ width: '18%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th>Creado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        <div className="doingCellStatic">{row.name || '—'}</div>
                                    </td>
                                    <td>
                                        <div className="doingCellStatic">{row.description || '—'}</div>
                                    </td>
                                    <td>
                                        <div className="doingCellStatic">
                                            {row.createdAt
                                                ? dayjs(row.createdAt).format('DD/MM/YYYY HH:mm')
                                                : '—'}
                                        </div>
                                    </td>
                                    <td className="doingCellActions">
                                        <button
                                            type="button"
                                            className="doingBtnPrimary"
                                            disabled={busyIds.has(row.id)}
                                            onClick={() => handleMarcarCumplida(row.id)}
                                        >
                                            {busyIds.has(row.id) ? '…' : 'Cumplida'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr className="doingNewRow">
                                <td>
                                    <input
                                        ref={firstInputRef}
                                        className="doingCellInput"
                                        placeholder="Nuevo título…"
                                        value={draft.name}
                                        onChange={(e) =>
                                            setDraft((d) => ({ ...d, name: e.target.value }))
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleGuardarNuevo();
                                            }
                                        }}
                                        disabled={savingNew}
                                    />
                                </td>
                                <td>
                                    <input
                                        className="doingCellInput"
                                        placeholder="Detalle (opcional)"
                                        value={draft.description}
                                        onChange={(e) =>
                                            setDraft((d) => ({ ...d, description: e.target.value }))
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleGuardarNuevo();
                                            }
                                        }}
                                        disabled={savingNew}
                                    />
                                </td>
                                <td>
                                    <div className="doingCellStatic">—</div>
                                </td>
                                <td className="doingCellActions">
                                    <button
                                        type="button"
                                        className="doingBtnPrimary"
                                        onClick={handleGuardarNuevo}
                                        disabled={savingNew}
                                    >
                                        {savingNew ? 'Guardando…' : 'Guardar fila'}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="doingModalFooter">
                    Atajo: Enter guarda la fila nueva · Escape cierra · Solo la API documentada
                    permite crear registros y pasarlos a estado cumplida.
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

/**
 * Botón tipo nube junto al título de Cotizaciones: abre pendientes (doings) en rejilla rápida.
 */
/** Igual que App → RoutePanel (`user.user`): el payload de sesión envuelve el perfil en `.user`. */
function usuarioSesionDesdeStore(usuarioRoot) {
    if (!usuarioRoot) return null;
    return usuarioRoot.user ?? usuarioRoot;
}

export default function DoingEmbudo() {
    const usuarioRoot = useSelector((store) => store.usuario.user);
    const user = usuarioSesionDesdeStore(usuarioRoot);
    const [open, setOpen] = useState(false);

    if (!user?.id) return null;

    return (
        <>
            <button
                type="button"
                className="doingCloudBtn"
                title="Pendientes por crear (cotización)"
                aria-label="Abrir pendientes por crear"
                onClick={() => setOpen(true)}
            >
                <BsCloudPlus className="doingCloudIcon" aria-hidden />
            </button>
            {open ? <DoingModal user={user} onClose={() => setOpen(false)} /> : null}
        </>
    );
}
