import React, { useEffect, useRef, useState } from 'react'
import Spinner from "../components/Spinner";
import { toast} from "react-toastify"
import Map from '../components/Map';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import {v4 as uuidv4} from "uuid";
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

export default function EditListing() {

    // const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offers: true,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {},
    });

    const params = useParams()

    const { type, name, bedrooms,bathrooms, parking, furnished, address, description, offers, regularPrice, discountedPrice, latitude, longitude, images } = formData;

    useEffect(()=>{
        setLoading(true);
        async function fetchListing(){
            const docRef = doc(db, "listings", params.listingId)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setListing(docSnap.data());
                setFormData({...docSnap.data()})
                setLoading(false)
            }else{
                navigate("/")
                toast.error("Listing does not exist");
            }
        }
        fetchListing();
    }, [navigate, params.listingId])

    useEffect(()=>{
        if(listing && listing.userRef !== auth.currentUser.uid){
            toast.error("You can't update this listing")
            navigate("/")
        }
    }, [auth.currentUser.uid, listing])

    function onChange(e){
        let boolean = null;
        if(e.target.value === "true"){
            boolean = true;
        }
    
        if(e.target.value === "false"){
            boolean = false;
        }
    
        //use for files
        if(e.target.files){
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        }

        //use for text/boolean/numbers
        if(!e.target.files){
            setFormData((prevState)=> ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }

        const { id, value } = e.target;
        if (id === 'latitude' || id === 'longitude') {
            setFormData(prevState => ({
                ...prevState,
                [id]: value
            }));
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if(+discountedPrice >= +regularPrice){
            setLoading(false)
            toast.error("Discounted price need to be less than regular price");
            return;
        }
        if(images.length > 6){
            setLoading(false);
            toast.error("Maximum 6 images are allowed");
            return;
        }
        // let geolocation = {};
        // let location;
        // if (geolocationEnabled) {
        //     const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);
        //     const data = await response.json();
        //     console.log(data);
        //     if (data && data.results && data.results.length > 0) {
        //         const { lat, lng } = data.results[0].geometry.location;
        //         setFormData((prevState) => ({
        //             ...prevState,
        //             latitude: lat,
        //             longitude: lng,
        //         }));
        //     }
        // }

        async function storeImage(image){
            return new Promise((resolve, reject)=>{
                const storage = getStorage()
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed', 
                (snapshot) => {
                  // Observe state change events such as progress, pause, and resume
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
                  }
                }, 
                (error) => {
                  // Handle unsuccessful uploads
                  reject(error)
                }, 
                () => {
                  // Handle successful uploads on complete
                  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                  });
                }
              );
              
            });
        }

        const imgUrls = await Promise.all(
            [...images].map((image)=>storeImage(image))).catch((error)=>{
                setLoading(false)
                toast.error("Image not Uploaded..!!")
                return;
            });

        const formDataCopy = {
            ...formData,
            imgUrls,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        };
        delete formDataCopy.images;
        !formDataCopy.offers && delete formData.discountedPrice;
        const docRef = doc(db, "listings", params.listingId)
        await updateDoc(docRef, formDataCopy);
        setLoading(false)
        toast.success("Listing Updated..!!");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }

    if(loading){
        return <Spinner/>;
    }
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'>Update a Listing</h1>
        <form onSubmit={onSubmit}>
            <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>
            <div className='flex '>
                <button type='button' id='type' value="sale" onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    Sell
                </button>
                <button type='button' id='type' value="rent" onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    Rent
                </button>
            </div>
            <p className='text-lg mt-6 font-semibold'>Name</p>
            <input type="text" id='name' value={name} onChange={onChange} placeholder='Enter your name' maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
            <div className='flex space-x-6 mb-6'>
                <div>
                    <p className='w-full text-lg font-semibold'>Beds</p>
                    <input type="number" id='bedrooms' value={bedrooms} onChange={onChange} min={1} max={30} required className='px-4 py-2 text-xl text-gray-700 bg-white border-gray-700 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'/>
                </div>
                <div>
                    <p className='w-full text-lg font-semibold'>Baths</p>
                    <input type="number" id='bathrooms' value={bathrooms} onChange={onChange} min={1} max={30} required className='px-4 py-2 text-xl text-gray-700 bg-white border-gray-700 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'/>
                </div>
            </div>
            <p className='text-lg mt-6 font-semibold'>Parking Spot</p>
            <div className='flex '>
                <button type='button' id='parking' value="true" onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${ !parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    Yes
                </button>
                <button type='button' id='parking' value="false" onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${ parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    No
                </button>
            </div>
            <p className='text-lg mt-6 font-semibold'>Furnished</p>
            <div className='flex '>
                <button type='button' id='furnished' value="true" onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${ !furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    Yes
                </button>
                <button type='button' id='furnished' value="false" onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${ furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    No
                </button>
            </div>
            <p className='text-lg mt-6 font-semibold'>Address</p>
            <textarea type="text" id='address' value={address} onChange={onChange} placeholder='Address' required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
                <div className="flex space-x-6 justify-start mb-6">
                    <div className="">
                        <p className="text-lg font-semibold">Latitude</p>
                        <input type="number" id="latitude" value={latitude} onChange={onChange} required min="-90" max="90" className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"/>
                    </div>
                    <div className="">
                        <p className="text-lg font-semibold">Longitude</p>
                        <input type="number" id="longitude" value={longitude} onChange={onChange} required min="-180" max="180" className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"/>
                    </div>
                </div>
            <p className='text-lg font-semibold mt-6'>Description</p>
            <textarea type="text" id='description' value={description} onChange={onChange} placeholder='Description' required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
            <p className='text-lg font-semibold'>Offer</p>
            <div className='flex mb-6 '>
                <button type='button' id='offers' value="true" onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${ !offers ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    Yes
                </button>
                <button type='button' id='offers' value="false" onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${ offers ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    No
                </button>
            </div>
            <div className='flex items-center mb-6'>
                <div className=''>
                    <p className='text-lg font-semibold'>Regular Price</p>
                    <div className='flex w-full justify-center item-center space-x-6'>
                        <input type="number" id='regularPrice' value={regularPrice} onChange={onChange} min={50} max={40000000} required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'/>
                        {type === "rent" && (
                        <div className=''>
                            <p className='text-md w-full whitespace-nowrap mt-2'>$ / Month</p>
                        </div>
                    )}
                    </div>
                </div>
            </div>            
            {offers && (
                            <div className='flex items-center mb-6'>
                            <div className=''>
                                <p className='text-lg font-semibold'>Discounted Price</p>
                                <div className='flex w-full justify-center item-center space-x-6'>
                                    <input type="number" id='discountedPrice' value={discountedPrice} onChange={onChange} min={50} max={40000000} required={offers} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'/>
                                    {type === "rent" && (
                                    <div className=''>
                                        <p className='text-md w-full whitespace-nowrap mt-2'>$ / Month</p>
                                    </div>
                                )}
                                </div>
                            </div>
                        </div>
            )}
            <div className='mb-6 '>
                <p className='text-lg font-semibold'>Images</p>
                <p className='text-gray-600 '>The first image will be the cover (max 6)</p>
                <input type="file" id='images' onChange={onChange} accept='.jpg,.png,.jpeg' multiple required className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600'/>
            </div>
            <button type='submit' className='mb-6 w-full px-7 py-3 bg-blue-700 text-white font-sm uppercase rounded shadow-md hover:bg-blue-900 hover:shadow-lg focus:bg-blue-80 focus:shadow-lg active:bg-blue-900 active:shadow-lg transition duration-150 ease-in-out'>Update Listing</button>
        </form>
    </main>
  );
}
