import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImg from "../assets/logo.png";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Header() { 
    const [pageState, setPageState] = useState("Sign in");
    const location = useLocation(); 
    const navigate = useNavigate();
    const auth = getAuth();
    useEffect(()=> {
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setPageState("Profile");
            }
            else{
                setPageState("Sign in" );
            }
        });
    }, [auth]);
    
    function pathMatchRoute(route){
        if(route === location.pathname){
            return true;
        }
    }

    return (
        <div className='bg-slate-200 border-b shadow-sm sticky top-0 z-40'>
            <header className='flex flex-col phone:flex-row justify-between items-center px-3 max-w-6xl mx-auto'>
                <div>
                    <img src={logoImg} alt="logo" className='h-10 cursor-pointer' onClick={()=>navigate("/")}/>
                </div>
                <div>
                    <ul className='flex flex-col phone:flex-row space-y-4 phone:space-y-0 phone:space-x-10'>
                        <li className={`cursor-pointer py-3 text-sm font-semibold ${pathMatchRoute("/") ? "text-black border-b-red-500" : "text-gray-400 border-b-transparent"} border-b-[3px]`} onClick={() => navigate("/")}>Home</li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold ${pathMatchRoute("/offers") ? "text-black border-b-red-500" : "text-gray-400 border-b-transparent"} border-b-[3px]`} onClick={() => navigate("/offers")}>Offers</li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) ? "text-black border-b-red-500" : "text-gray-400 border-b-transparent"} border-b-[3px]`} onClick={() => navigate("/profile")}>{pageState}</li>
                    </ul>
                </div>
            </header>
        </div>
    );
}
