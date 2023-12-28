'use client'

import React, { useState } from 'react'
import './applyinsurance.css'
import Link from 'next/link'
import { UserAuth } from "../context/AuthContext";
import axios from 'axios'
import {  collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from "../firebase";
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';



function Applyinsurance() {


  const { user } = UserAuth();

   const[firstname,setFirstname]=useState("")
   const[Lastname,setLastname]=useState("")
   const[gender,setGender]=useState("")
   const[nationality,setNationality]=useState("")
   const[martial,setMartial]=useState("")
   const[occupation,setOccupation]=useState("")
   const[email,setEmail]=useState("")
   const[contact,setContact]=useState("")
   const[address1,setAddress1]=useState("")
   const[address2,setAddress2]=useState("")
   const[indstate,setIndstate]=useState("")
   const[pincode,setPincode]=useState("")
   const [pdfurl,setPdfurl]=useState('')
   const [pdf,setPdf]=useState()
   
   const handleSubmit = async (event) => {
    console.log("Inside Handle Submit")
    event.preventDefault();
    try {      
       let imgBase64 = await new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function () {
          resolve(reader.result);
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.readAsDataURL(pdfurl);
        
      });

      await putBroker();
   
      const body = {
        useRef: user.uid,
        jsonData: {
          "firstname": firstname,
          "email": email,
          "lastname": Lastname,
          "gender": gender,
          "contact": contact,
          "address": address1 + " " + address2,
          "pincode": pincode,
          "nationality": nationality,
          "Martial": martial,
          "State": indstate,
          "Occupation": occupation,
          "pdf": imgBase64,
          "visibility": true
        }
      };
      
      const res = await axios.post('https://backend-alisdej34q-uc.a.run.app/adduserdetails', { body });
      toast.success('Your form has successfully submited');
   
    } catch (err) {
      toast.error('Your form has not submited');
      console.log(err, "Error in vendor page");
    }
   };

  async function getBrokerId(){
    let currentBrokerId;
    const uid = user.uid;
    console.log(uid);
    try{
    const clientRef = doc(db,"Client",uid);
    
    const clientSnap = await getDoc(clientRef);  

    if(clientSnap.exists()){
      console.log("Inside IF Block!")
      currentBrokerId = clientSnap.data().brokerId;
      console.log(currentBrokerId);
    }

  }catch(e){
    console.log(e);
  }
    return currentBrokerId;
  }

  async function putBroker(){
    
    let imgBase64 = await new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsDataURL(pdfurl);
      
    });

    let docRef; 
    try{
    const BrokerID = await getBrokerId();

    const q = query(collection(db,'Broker'),where("brokerId","==",BrokerID));

    const querySnapshot = await getDocs(q);
     
    querySnapshot.forEach((docs)=>{
      console.log(docs.id);

      docRef = doc(db,'Broker',docs.id,'clients',user.uid);
    });

    console.log(imgBase64);

    const data = {
      clientfName: firstname + ' ' + Lastname,
      clientDocType: 'Aadhar Card',
      clientEmail: email,
      clientphone: contact,
      clientDoc: 'Aadhar Card.pdf'
    }
    console.log('About to Push');
    await setDoc(docRef,data);
    console.log('Pushed');
    

    }catch(e){
    
      console.log(e);
      
    }
  }
  return (<>
    <Toaster />
    <div className='applyinsurance'>
      <Navbar typeofuser={'client'}/>
        <section>
        <h3>
                Fill Your Details
            </h3>
            <form onSubmit={async (e)=>await handleSubmit(e)}>
    <div className="w-full">
      <h6>Personal Information</h6>
      <div className='flex gap-2'>
      <div className='col'>
      <div className="input-group input-group-icon">
        <input type="text" placeholder="First Name" value={firstname} onChange={(event) => setFirstname(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-user"></i></div>
      </div>
      </div>
      <div className='col'>
      <div className="input-group input-group-icon">
        <input type="text" placeholder="Last Name" value={Lastname} onChange={(event) => setLastname(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-key"></i></div>
      </div>
      </div>
      </div>
      <div className='flex gap-2'>
      <div className='col'>
      <div className="input-group input-group-icon">
        <input type="text" placeholder="Gender" value={gender} onChange={(event) => setGender(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-user"></i></div>
      </div>
      </div>
      <div className='col'>
      <div className="input-group input-group-icon">
        <input type="text" placeholder="Nationality" value={nationality} onChange={(event) => setNationality(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-key"></i></div>
      </div>
      </div>
      </div>
      <div className='flex gap-2'>
      <div className='col'>
      <div className="input-group input-group-icon">
        <input type="text" placeholder="Martial Status" value={martial} onChange={(event) => (setMartial(event.currentTarget.value))}/>
        <div className="input-icon"><i className="fa fa-user"></i></div>
      </div>
      </div>
      <div className='col'>
      <div className="input-group input-group-icon" >
        <input type="text" placeholder="Occupation" value={occupation} onChange={(event) => setOccupation(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-key"></i></div>
      </div>
      </div>
      </div>

      
      <h6>Contact Information</h6>
      <div className="input-group input-group-icon">
        <input type="email" placeholder="Email Adress" value={email} onChange={(event) => setEmail(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-envelope"></i></div>
      </div>
      <div className="input-group input-group-icon">
        <input type="text"  placeholder="Contact No." value={contact} onChange={(event) => setContact(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-envelope"></i></div>
      </div>
      <div className="input-group input-group-icon">
        <input type="text"  placeholder="Address Line 1" value={address1} onChange={(event) => setAddress1(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-envelope"></i></div>
      </div>
      <div className="input-group input-group-icon">
        <input type="text"  placeholder="Address Line 2" value={address2} onChange={(event) => setAddress2(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-envelope"></i></div>
      </div>
      <div className='flex gap-2'>
      <div className='col'>
      <div className="input-group input-group-icon" >
        <input type="text" placeholder="State" value={indstate} onChange={(event) => setIndstate(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-user"></i></div>
      </div>
      </div>
      <div className='col'>
      <div className="input-group input-group-icon">
        <input type="text"  placeholder="Postal Code" value={pincode} onChange={(event) => setPincode(event.currentTarget.value)}/>
        <div className="input-icon"><i className="fa fa-key"></i></div>
      </div>
      </div>
      </div>
      <h6>Upload Documents</h6>
      <div className='fileupload'>
        <input  accept='pdf' type="file" onChange={(e) => {setPdfurl(e.target.files[0]);e.target.files[0].onload = function() {console.log(e.target.files[0]);}}}/>
        <span>*upload Documents in pdf</span>
      </div>
      </div>
      
  <button type='submit' className='btn1'>Submit</button>
  </form>

        </section>  

    </div>
    </>
  )
}

export default Applyinsurance