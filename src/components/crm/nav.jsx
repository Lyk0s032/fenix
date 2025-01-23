import React from 'react';
import { AiFillHome, AiFillWindows, AiOutlineHome, AiOutlineWindows } from 'react-icons/ai';
import { BsCalendar3Event, BsFillPeopleFill, BsPeople } from 'react-icons/bs';
import { MdOutlineSettingsSuggest, MdSettingsSuggest } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Nav(props){
    const user = props.user;
    const navigate = useNavigate();
    const location = useLocation();

    const letMe = () => {
        const pageWidth = document.documentElement.scrollWidth;
        const pageHeight = document.documentElement.scrollHeight;

        console.log(`Ancho de la página: ${pageWidth}px`);
        console.log(`Alto de la página: ${pageHeight}px`);
    }
    return (
        <div className="navigation">
            <div className="containerNav">
                <div className="optionsTop">
                    <nav>
                        <ul>
                            <li className={location.pathname == '/' ? 'Active' : null} onClick={() => navigate('/')}>
                                <div className="icono">
                                    <AiFillHome className='icon' />
                                </div>
                            </li>
                            <li  className={location.pathname == '/clients' ? 'Active' : null} onClick={() => navigate('/clients')}>
                                <div className="icono">
                                    <AiOutlineWindows className='icon' />
                                </div>
                            </li>
                            <li className={location.pathname == '/asesores' ? 'Active' : null} onClick={() => navigate('/asesores')}>
                                <div className="icono">
                                    <BsPeople className='icon' />
                                </div>
                            </li>

                            <li  className={location.pathname == '/calendar' ? 'Active' : null} onClick={() => navigate('/calendar')}>
                                <div className="icono">
                                    <BsCalendar3Event className='icon' />
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>


                <div className="optionsBottom">
                    <nav>
                        <ul>
                            <li>
                                <div className="icono">
                                    <span className='icon'> </span>
                                </div>
                            </li>
                            <li>
                                <div className="profileIcono">
                                    <img src={user.photo} alt="" />
                                </div>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}