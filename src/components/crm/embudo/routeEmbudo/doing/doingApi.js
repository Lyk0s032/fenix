import axios from 'axios';

/** Ver DOING_API_DOCS.md — rutas bajo `api/cotizacion/doing` */

export async function listarPendientes(userId) {
    const { data } = await axios.get(`api/cotizacion/doing/pendientes/${userId}`);
    return Array.isArray(data) ? data : [];
}

export async function crearDoing({ name, userId, description, state }) {
    const { data, status } = await axios.post(`api/cotizacion/doing`, {
        name,
        userId,
        description: description || undefined,
        state,
    });
    return { data, status };
}

export async function cambiarEstadoDoing(doingId, state) {
    const { data } = await axios.put(`api/cotizacion/doing/state`, {
        doingId,
        state,
    });
    return data;
}
