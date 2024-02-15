import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, InputLabel
} from '@mui/material';

import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';




const Detail = () => {
  const mainCardTitle = "Units";
  //for add

  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [uid, setUid] = useState('');
  const [companyname, setCompanyName] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [tax, setTax] = useState('');

  const [successMessageAdd, setSuccessMessageAdd] = useState('');
  const [successMessageAdd2, setSuccessMessageAdd2] = useState('');
  const [successMessageUpdate2, setSuccessMessageUpdate2] = useState('');
  const [successMessageEdit, setSuccessMessageEdit] = useState('');
  const [successMessageDelete, setSuccessMessageDelete] = useState('');


  const [ErrorMessageAdd2, setErrorMessageAdd2] = useState(false);

 const Navigate = useNavigate();
  const modalRef = useRef(null);

//AUTH TOKEN
  
  useEffect(() => {
    refreshToken();
  
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${apiUrl}/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setUid(decoded.userID);
      setExpire(decoded.exp);
    } catch (error) {
      Navigate('/');
    }
  };

//SHOWING RECORD LIST
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getDetail`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add your token if needed
        },
      });
      setCompanyName(response.data.company_name); 
      setPhoneNumber(response.data.phone_number); 
      setAddress(response.data.address); 
      setTax(response.data.tax); 
     


    
    } catch (error) {
      console.error('Error fetching  data:', error);
    }
  };

  fetchData(); // Call the function to fetch data when the component mounts
}, [token]); // Add token as a dependency if it's required




const handleUpdateProductCategory = async () => {
  try {
  
    const formData = {
      company_name: companyname,
      phone_number: phonenumber,
      address: address,
      tax:tax,
      user_updated:uid,
    };

    // Make PATCH request to update vendor data
    const response = await axios.patch(`${apiUrl}/api/updateDetail`,formData ,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
   console.log(response.data);

   setSuccessMessageUpdate2('Data Updated successfully')
  } catch (error) {
    console.error('Error fetching data details:', error);
    // Handle errors or show a message to the user
  }
};









  //CLEAR MESSAGE AFTER SHOWING
  useEffect(() => {
    // Function to clear success messages after 10 seconds
    const clearSuccessMessages = () => {
      setSuccessMessageDelete('');
      setSuccessMessageEdit('');
      setSuccessMessageAdd('');
      setSuccessMessageAdd2('');
      setSuccessMessageUpdate2('');
      setErrorMessageAdd2('');
    };
    // Show success messages and set timeout to clear them after 10 seconds
    if (successMessageDelete || successMessageEdit || successMessageAdd || successMessageAdd2 || successMessageUpdate2 || ErrorMessageAdd2) {
      const timeout = setTimeout(clearSuccessMessages, 4000); // 10 seconds (10,000 milliseconds)
      
      return () => {
        clearTimeout(timeout); // Clear timeout on component unmount
      };
    }
  }, [successMessageDelete, successMessageEdit , successMessageAdd, successMessageAdd2, successMessageUpdate2, ErrorMessageAdd2]);

 

 
 
 
  return (
    
    <MainCard  title={mainCardTitle} className='boxy'>
      <Typography variant="body2">
        {name}{expire} - {uid}  <br/>
      
         <br/><br/>



    {/* DATA LIST */}


    {successMessageAdd2 && (
              <div className="success-blinking-text">{successMessageAdd2}</div>
            )}     
             {successMessageUpdate2 && (
              <div className="success-blinking-text">{successMessageUpdate2}</div>
            )}   
   {ErrorMessageAdd2 && (
              <div className="success-blinking-text">{ErrorMessageAdd2}</div>
            )}   

<div className="wrapper-add-btn"  ref={modalRef}>
<button type='button' onClick={handleUpdateProductCategory} className='submit-button'>
         Update
        </button>
        <br></br>  <br></br>
          </div>
            
           
                                         <form onSubmit={handleUpdateProductCategory} >
                                         <InputLabel >Company Name</InputLabel>
                                      <input className='select-element'
                                        type="text"
                                        value={companyname}
                                        name="companyname"
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Enter the company name"
                                  
                                        required
                                      />    <br/><br/> 
                                              <InputLabel >Phone Number</InputLabel>
                                      <input className='select-element'
                                        type="text"
                                        value={phonenumber}
                                        name="phonenumber"
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter the company name"
                                  
                                        required
                                      />    <br/><br/>
                                 <InputLabel >Address</InputLabel>
                                      <input className='select-element'
                                        type="text"
                                        value={address}
                                        name="address"
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter the address"
                                  
                                        required
                                      />    <br/><br/>
                                       <InputLabel >Tax (%)</InputLabel>
                                      <input className='select-element'
                                        type="text"
                                        value={tax}
                                        name="tax"
                                 
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setTax(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the address"
                                  
                                        required
                                      />   
         
                                        <br/><br/>
                    

 
                                      </form>

      </Typography>
    </MainCard>
  );
};

export default Detail;
