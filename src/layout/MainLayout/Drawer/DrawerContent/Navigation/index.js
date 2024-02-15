// material-ui
import { Box, Typography } from '@mui/material';
import React, { useState,useEffect} from 'react';
// project import
import NavGroup from './NavGroup';
//import menuItem from 'menu-items';
import axios from 'axios';
import { apiUrl } from '../../../../../config/UrlParam';
//import { Link } from 'react-router-dom';
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import { useNavigate} from 'react-router-dom';
// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const [emailedit, setEmailEdit] = useState([]);
  // const [Uid, setUid] = useState('');
   const [token, setToken] = useState('');
   
 const Navigate = useNavigate();
  const icons = {
    LoginOutlined,
    ProfileOutlined
  };

  
  const refreshToken = async () => {
    try {
      const response = await axios.get(`${apiUrl}/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
     
      await GetMenu(decoded.userID)
      
    } catch (error) {
      console.error('Error  :', error);
    }
  };

  useEffect(() => {
   refreshToken();
    
   
  }, []);

  const GetMenu = async (uid) => {
    try {
      var item = [];
          const response1 = await axios.get(`${apiUrl}/api/getParentMenu/${uid}`);
          if (response1.data && Array.isArray(response1.data)) {
            for (var j = 0; j < response1.data.length; j++){
              var formData = {
                id: response1.data[j].menu_name,
                title: response1.data[j].menu_name,
                type:'group',
                children: []
              };
              const response2 = await axios.get(`${apiUrl}/api/getChildMenu/${response1.data[j].menu_id}/${uid}`);
              var tempMenuId=0;
              for (var i = 0; i < response2.data.length; i++){
                if(tempMenuId != response2.data[i].menu_id){
                  var formDataChild ={
                    id: response2.data[i].menu_name,
                    title: response2.data[i].menu_name,
                    type:'item',
                    url:response2.data[i].menu_route,
                    icon: icons.ProfileOutlined,
                   // element: <Link to="/RolesAction" element={<RolesAction />}>Roles</Link>
                  }
                  formData.children.push(formDataChild);
                  tempMenuId = response2.data[i].menu_id;
                }
               
              }
              item.push(formData);
            }
          
            
            const response3 = await axios.get(`${apiUrl}/getUsers/${uid}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
           
           var roledId = response3.data.roles_id;
           
            const response4 = await axios.get(`${apiUrl}/api/getRolesById/${roledId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            alert('aaa');
            setEmailEdit(item == undefined ? [] : item);
             if(response4.data.roles_name.toLocaleLowerCase() != "SuperAdmin".toLocaleLowerCase()){
              
              await VerifyRoute(item);
             }
            
            
          }else{
            console.error('Unexpected response format for getParentMenu');
          }
          
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };

  const VerifyRoute = async (item) => {
    var isExist = false;
    for(var i=0;i < item.length;i++) {
      for(var x=0;x < item[i].children.length;x++) {
        //if(item[i].children[x].url.replace("/","").toLocaleLowerCase().indexOf(window.location.pathname.replace("/","").toLocaleLowerCase()) > -1){
        if(item[i].children[x].url.replace("/","").toLocaleLowerCase() == window.location.pathname.replace("/","").toLocaleLowerCase()){
         isExist = true;
        } 
      }
    }
    
    if(!isExist) {
      Navigate('/');
    }
  }

  
 // const navGroups = menuItem.items.map((item) => {
    const navGroups = emailedit.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
