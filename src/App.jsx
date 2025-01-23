import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import RoutePanel from './components/crm/routesPanel'
import Sign from './components/sign/sign'
import './css/index.css'
import * as actions from './components/store/action/action';
import { useDispatch, useSelector } from 'react-redux'

function App() { 
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();
 
  const usuario = useSelector(store => store.usuario);
  const { user, loadingUser } = usuario; 

  const log = JSON.parse(window.localStorage.getItem("loggedPeople"));

  useEffect(() => {
      if(log && !user){    
          dispatch(actions.AxiosAuthUser(log, true));
      }else{
        window.localStorage.removeItem('loggedPeople'); 
      } 
  }, [])  
  return (
    loadingUser ? 
      <div className="loadingPanel">
        <div className="containerLoading">
            <h1>Accediendo...</h1>
            <span>Estamos cargando la información básica...</span>
        </div>
      </div>
    :
    <>
      <Router>
        <Routes>
          <Route path="/*" element={user ? <RoutePanel user={user.user} /> : <Navigate to="/sign" />} />
          <Route path="/sign/" element={user && !loadingUser ? <Navigate to="/" /> : <Sign />} /> 
        </Routes>
      </Router>
    </>
  )
}

export default App
