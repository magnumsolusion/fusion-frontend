import React, { useState} from 'react';
import { apiUrl } from '../../../config/UrlParam'; //
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/additional-css/styles.css'

import { IconButton, InputAdornment} from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// material-ui
import {
  Button,

  FormHelperText,
  Grid,

  InputLabel,
  OutlinedInput,
  Stack,

} from '@mui/material';

// third party

import { Formik } from 'formik';

// project import

import AnimateButton from 'components/@extended/AnimateButton';

// assets


// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const Navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
 
  const handlePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email: email,
        password: password,
      });
    const access_token = response.data.accessToken;
      // Assuming the API response contains a success status
      if (response.status === 200) {
        Navigate('/Vendor');
        sessionStorage.setItem('access_token', access_token);
        console.log(access_token);
      } else {
        setMsg('Login failed. Please check your credentials.');
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        setMsg('Unmatch credentials. Please try again later.');
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        setMsg('Network error. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an error
        console.log('Error', error.message);
        setMsg('An error occurred. Please try again.');
      }
    }
  };

  return (
    <>
      <Formik
      
      >
    

      
          <form noValidate onSubmit={Auth}>
               {msg && <div className="blinking-text"> {msg}</div>}
               <br></br>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={email}
                    name="email"
            
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    fullWidth
                    required
                 
                  />
                 
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                <InputLabel htmlFor="password-login">Password</InputLabel>
          <OutlinedInput
            fullWidth
            id="-password-login"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handlePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </IconButton>
              </InputAdornment>
            }
          />
                 
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
         
              </Grid>
             
                <Grid item xs={12}>
                  <FormHelperText error></FormHelperText>
                </Grid>
     
              <Grid item xs={12}>
                <AnimateButton>
                  <Button  fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
              
            </Grid>
          </form>

      </Formik>
    </>
  );
};

export default AuthLogin;
