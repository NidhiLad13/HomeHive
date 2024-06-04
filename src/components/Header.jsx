import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImg from "../assets/logo.png";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Header() { 
    const [pageState, setPageState] = useState("Sign in");
    const location = useLocation(); 
    const navigate = useNavigate();
    const auth = getAuth();
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setPageState("Profile");
            } else {
                setPageState("Sign in");
            }
        });
    }, [auth]);

    function pathMatchRoute(route) {
        return location.pathname === route;
    }

    return (
        <nav className="bg-slate-400 border-gray-200 dark:bg-gray-900" style={{backgroundColor:"#e6e6e6"}}>
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
                    <img src={logoImg} alt="logo" className="h-9 cursor-pointer" onClick={() => navigate("/")}/>

                <div>
                    <ul className="flex space-x-4">
                        <li>
                            <button className={`text-gray-900 ${pathMatchRoute("/") ? "font-semibold" : "font-normal"}`} onClick={() => navigate("/")}>Home</button>
                        </li>
                        <li>
                            <button className={`text-gray-900 ${pathMatchRoute("/offers") ? "font-semibold" : "font-normal"}`} onClick={() => navigate("/offers")}>Offers</button>
                        </li>
                        <li>
                            <button className={`text-gray-900 ${pathMatchRoute("/signin") ? "font-semibold" : "font-normal"}`} onClick={() => navigate("/signin")}>{pageState}</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
