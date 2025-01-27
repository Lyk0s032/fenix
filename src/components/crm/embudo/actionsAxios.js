import axios from "axios"

export const laterFunction = async (title, note, tags, userId, prospectoId, calendaryId, time, hour, type) => {
    let body = {
        title,
        note,
        tags,
        userId,
        prospectoId,
        calendaryId,
        time,
        hour
    }

    const send = await axios.put('api/prospecto/aplazar', body)
    .then((res) => {
        console.log(res);
        console.log('funciono')
        return res
    })
    .catch(err => {
        console.log(err);
        console.log('Falla')
    });

    return send
}

export const nuevoClient = async (photo, prospectoId, 
    nombreEmpresa, nit, phone, email, type, sector, 
    responsable, url, direccion, fijo, ciudad) => {
    let body = {
        photo,
        prospectoId,
        nombreEmpresa,
        nit,
        phone, 
        email,
        type,
        sector,
        responsable,
        url,
        direccion,
        fijo,
        ciudad
    }
    const save = await axios.post('api/prospecto/createClient', body)
    .then((res) => {
        return res
    })
    .catch(err => {
        console.log(err);
        console.log('error')
    })

    return save
}
