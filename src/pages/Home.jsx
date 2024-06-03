import React, { useState } from 'react'
import Slider from '../components/Slider'
import { collection, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect } from 'react';
import Spinner from '../components/Spinner';

export default function Home() {

  
  return (
    <div>
      <Slider>

      </Slider>
    </div>
  )
}
