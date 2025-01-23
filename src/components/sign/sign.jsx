import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import * as actions from '../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Sign(){
    const imgs = [
        'https://images5.alphacoders.com/133/1339453.png',
        'https://static.vecteezy.com/system/resources/previews/031/690/092/non_2x/astronomy-satellites-observe-earth-at-night-from-space-free-photo.jpg',
        'https://images.unsplash.com/photo-1707587537934-4c48040ccae4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aHViYmxlJTIwdGVsZXNjb3BlfGVufDB8fDB8fHww',
        'https://static.vecteezy.com/system/resources/previews/033/855/401/large_2x/time-concept-with-vintage-alarm-clock-against-space-background-3d-rendering-passage-of-time-with-clock-in-space-ai-generated-free-photo.jpg',
        'https://storage.googleapis.com/littlenimobucket/wp-content/uploads/2024/02/LittleNimoAi.com-Wallpapers-astro-63.png',
        'https://cdn.pixabay.com/photo/2024/02/28/18/51/ai-generated-8602698_1280.jpg'
    ]

    let randomElement = imgs[Math.floor(Math.random() * imgs.length)];
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [data, setData] = useState({
        phone: null,
        password: null
    }); 
    const [loading, setLoading] = useState(false);
    const [mistake, setMistake] = useState(null);
    const [positive, setPositive] = useState(null);

    const usuario = useSelector(store => store.usuario);
    console.log(usuario)
    const signIn = async(req, res) => {
        if(!data.phone || !data.password) return setMistake('No puedes dejar campos vacios');

        setLoading(true);
        let body = {
            phone: data.phone,
            password: data.password 
        }
        const login = await axios.post('/api/users/sign/in', body)
        .then((res) => {  
            setMistake(null);
            setLoading(false) 
            setPositive('Logueado')
            if(res && res.status == 200){
                setMistake(null);
                console.log(res.data);
                window.localStorage.setItem("loggedPeople", JSON.stringify(res.data.data));
               return res.data
            }
        })
        .then((data) => {
            dispatch(actions.AxiosAuthUser(data.data, true));
        })
        .catch(err => {
            setLoading(false)
            if(err.status == 404){
                return setMistake('No hemos encontrado este usuario')
            }else if(err.status == 401){
                setMistake('La contraseña no es valida');
            }else{
                setMistake('Mensaje generico')
            }

        })
        
        return login
    }
    useEffect(() => {
        
    }, [])
    return (
        <div className="sign">
            {
                mistake ? 
                <div className="nubeMistake">
                    <div className="containerNube">
                        <div className="messageContainer">
                            <span>{mistake}</span>
                        </div>
                        <div className="topClose">
                            <button onClick={() => setMistake(null)}>
                                <MdClose className="icon" />
                            </button>
                        </div>
                        
                    </div>
                </div>
                :null
            }
            <div className="container">
                <div className="left" style={{
                        backgroundImage: `url(${randomElement})`
                    }}>
                    <div className="opacity"></div>
                </div>
                <div className="right">
                    <div className="boxSign" >
                        <div className="img">
                            <img src="https://metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                        </div>
                        <div className="formSign">
                            <div className="inputDiv"> <h1>{positive ? positive : null}</h1>
                                <label htmlFor="">Número de teléfono</label><br />
                                <input type="text" placeholder="" onChange={(e) => {
                                    setData({
                                        ...data,
                                        phone: e.target.value
                                    })
                                }} value={data.phone} />
                            </div>
                            <div className="inputDiv">
                                <label htmlFor="">Contraseña</label><br />
                                <input type="password" placeholder="" onChange={(e) => {
                                    setData({
                                        ...data,
                                        password: e.target.value
                                    })
                                }} value={data.password}/>
                            </div>
                            <div className="inputDiv">
                                <button onClick={() => signIn()}>
                                    <span>{loading ? 'Accediendo' : 'Acceder'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}