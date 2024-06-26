import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  function onChange(e){
    setEmail(e.target.value);
  }

  async function onSubmit(e){
      e.preventDefault()

      const isRegistered = await checkEmailRegistered(email);
      if (!isRegistered) {
      toast.error("Email address is not registered.");
      return;
  }
      try {
        const auth = getAuth()
        await sendPasswordResetEmail(auth, email);
        toast.success("Email was sent successfully..!")
      } catch (error) {
        toast.error("Could not send reset password");
      }
  }

  async function checkEmailRegistered(email) {
    return await isEmailRegistered(email);
  }
  
  async function isEmailRegistered(email) {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const registeredEmails = querySnapshot.docs.map(doc => doc.data().email);
    return registeredEmails.includes(email);
  }
  
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Forgot Password</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto' >
      <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
        <img src="https://media.istockphoto.com/id/504481783/photo/giving-house-keys.webp?b=1&s=170667a&w=0&k=20&c=lVGYDmC1ebYn0XW6OkLS9D7yet-3odi-tBKzCykbtT4=" alt="key" className='w-full rounded-2xl'/>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
              <input type="email" className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' id='email' value={email} onChange={onChange} placeholder='Email Address' />
          <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
            <p className='mb-6'>Don't have a account?
              <Link to="/sign-up" className='text-red-500 hover:text-red-800 transition duration-200 ease-in-out ml-1'>Register</Link>
            </p>
            <p>
              <Link to="/sign-in" className='text-blue-500 hover:text-blue-800 transition duration-200 ease-in-out '>Sign In Instead</Link>
            </p>
          </div>
          <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-900 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' type='submit'>Send Reset Password</button>
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
