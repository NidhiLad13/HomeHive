import React from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import {db} from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function SignUp() {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password:"",
  });

  const {name, email, password} = formData;
  const navigate = useNavigate();

  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    })); 
  }

  async function onSubmit(e){
    e.preventDefault()

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(auth.currentUser, {
        displayName: name
      })
      const user = userCredential.user
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp();
     // toast.success("Sign Up was successfully..!!");
      navigate("/")

      await setDoc(doc(db, "users", user.uid), formDataCopy)
    } catch (error) {
     toast.error("something went wrong with registration");
    }
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto' >
      <div className='md:w-[67%] lg:w-[50%] mb-20 md:mb-1'>
        <img src="https://media.istockphoto.com/id/504481783/photo/giving-house-keys.webp?b=1&s=170667a&w=0&k=20&c=lVGYDmC1ebYn0XW6OkLS9D7yet-3odi-tBKzCykbtT4=" alt="key" className='w-full rounded-2xl'/>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
          <input type="name" className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' id='name' value={name} onChange={onChange} placeholder='Full Name' />
              <input type="email" className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' id='email' value={email} onChange={onChange} placeholder='Email Address' />
          <div className='relative mb-6'>
          <input type={showPassword ? "text" : "password"} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' id='password' value={password} onChange={onChange} placeholder='Password' />
          {showPassword ? (
            <FaEyeSlash className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=> setShowPassword((prevState)=>!prevState)} />
          ): (<FaEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=> setShowPassword((prevState)=>!prevState)}/>)}
          </div>
          <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
            <p className='mb-6'>Don't have a account?
              <Link to="/sign-in" className='text-red-500 hover:text-red-800 transition duration-200 ease-in-out ml-1'>Register</Link>
            </p>
            <p>
              <Link to="/forgot-password" className='text-blue-500 hover:text-blue-800 transition duration-200 ease-in-out '>Forgot Password?</Link>
            </p>
          </div>
          <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-900 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' type='submit'>Sign Up</button>
        <div className='flex my-4 items-center before:border-t  before:flex-1 before:border-gray-300 after:border-t  after:flex-1 after:border-gray-300'>
          <p className='text-center font-semibold mx-4'>OR</p>
        </div>
        <OAuth></OAuth>
          </form>
        </div>
        </div>
      </section>
  )
}
