import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';

const Private = () => {
    const [ok, setok] = useState(false);
    const [auth ,setauth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {
            const res = await axios.get("http://localhost:5000/api/v1/auth/user-auth");
            // console.log(res);
            if(res.data.ok) {
                setok(true)
            }else{
                setok(false);
            }
    }
    if(auth?.token) authCheck() ;
},[auth?.token])
  return ok ? (<Outlet/>) :<Spinner/>
}

export default Private