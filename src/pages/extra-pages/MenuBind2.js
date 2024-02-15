//import users from '../../menu-items/users';
//import {useState} from 'react';
//import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
//import { Link } from 'react-router-dom';
 //import { useNavigate} from 'react-router-dom';
//import { Navigate } from "../../../node_modules/react-router-dom/dist/index";

import axios from 'axios';
import { apiUrl } from '../../config/UrlParam';
import jwt_decode from 'jwt-decode';
 
 
 
const MenuBinding = () => {
  //const Navigate = useNavigate();
  
 var uid="";
 var token="";
 //const [uid, setUid] = useState('');
 let isCreate = false;
 let isUpdate = false;
 let isDelete = false;
  
 const VerifyRoute = async () => {
      
     var isExist = false;
     var roledId='';
     var response = await axios.get(`${apiUrl}/token`);
     token = response.data.accessToken;
     const decoded = jwt_decode(response.data.accessToken);
     uid =  decoded.userID;
     
     response = await axios.get(`${apiUrl}/getUsers/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      roledId = response.data.roles_id;
     
      response = await axios.get(`${apiUrl}/api/getRolesActionByRoleId/${response.data.roles_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //console.log(response.data);
      for(var i=0;i < response.data.length;i++) {
        if(response.data[i].menu_route.replace("/","").toLocaleLowerCase().indexOf(window.location.pathname.replace("/","").toLocaleLowerCase()) > -1){
                isCreate = response.data[i].create;
                isDelete = response.data[i].delete;
                isUpdate = response.data[i].update;
                isExist = true;
         }
      }
   
      var response2 = await axios.get(`${apiUrl}/api/getRolesById/${roledId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response2.data.roles_name.toLocaleLowerCase() == "SuperAdmin".toLocaleLowerCase()){
        isExist = false;
      }
      //alert(isUpdate);
     if(isExist){
        if(document.readyState == 'complete'){
         if(isCreate == 0 || isCreate == null){
            const boxes = document.querySelectorAll('.add-button');
             boxes.forEach(box => {
                  box.remove();
                });
          }
 
          if(isUpdate == 0 || isUpdate == null){
           
            const boxes = document.querySelectorAll('.edit-button');
             boxes.forEach(box => {
                  box.remove();
                });
           } 
           
           if(isDelete == 0 || isDelete == null){
            const boxes = document.querySelectorAll('.delete-button');
             boxes.forEach(box => {
                  box.remove();
                });
           } 
         
        }
    //    if(isCreate == 0 || isCreate == null){
    //     for(var o=0;o < document.getElementsByClassName('add-button').length;o++){
    //        //  document.getElementsByClassName('add-button')[o].style.display = "none";  
    //      }
    //    } 
    //    sessionStorage.removeItem('update');
    //    sessionStorage.removeItem('delete');
        
      
       
     }
    //  else{
    //     document.getElementsByClassName('add-button')[0].style.display = "inline"; 
    //     sessionStorage.setItem("update","inline");
    //     sessionStorage.setItem("delete","inline");
    //  }
     
   }
   
   VerifyRoute();
    
  };   
  
  export default MenuBinding
  