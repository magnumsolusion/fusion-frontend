import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography
} from '@mui/material';

import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
//import FormControlLabel from '@mui/material/FormControlLabel';
//import Switch from '@mui/material/Switch';
import VirtualizedSelect from 'react-virtualized-select';
import MenuBinding from './MenuBind2.js';

const RolesAction = () => {
  const mainCardTitle = "Roles";
  //for add
  
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [unitsname, setUnitsName] = useState('');
  //const[idProductCategory, setIdProductCategory] = useState(null);
  const [rowsUnits, setRowsUnits] = useState([]);
  const [successMessageAdd, setSuccessMessageAdd] = useState('');
 // const [successMessageAdd2, setSuccessMessageAdd2] = useState('');
 // const [successMessageUpdate2, setSuccessMessageUpdate2] = useState('');
 // const [successMessageEdit, setSuccessMessageEdit] = useState('');
 // const [successMessageDelete, setSuccessMessageDelete] = useState('');
 // const [updating, setUpdating] = useState(false);
 // const [deletingId, setDeletingId] = useState(null);
  const [ErrorMessageAdd2, setErrorMessageAdd2] = useState(false);
 // const [deletingunitsname, setDeletingUnitsName] = useState('');
 //const  [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
 const Navigate = useNavigate();
  //const modalRef = useRef(null);
   
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  //const [optionAction, setOptionAction] = useState(null);
  const [selectedOptionRoles, setSelectedOptionRoles] = useState(null);
  const [RolesOption, setRolesOption] = useState(null);

  const [selectedAction, setSelectedAction] = useState(false);
   

   
  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
 
//AUTH TOKEN
  
  useEffect(() => {
    refreshToken();
    GetRoles();
    if(selectedOptionRoles != null || selectedOptionRoles != ''){
        
        GetMenu(0);
    }
     
  },[MenuBinding()]);

//   useEffect(() => {
//     setRowCountState((prevRowCountState) =>
//       pageInfo?.totalRowCount !== undefined
//         ? pageInfo?.totalRowCount
//         : prevRowCountState,
//     );
//   }, [pageInfo?.totalRowCount, setRowCountState]);

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

  const GetRoles = async () => {
    axios.get(`${apiUrl}/api/getRoles`)
    .then((response) => {
    var transformedOptions =[];
    for(var i=0;i<response.data.length;i++) {
        if(response.data[i].roles_name.toLocaleLowerCase() != "SuperAdmin".toLocaleLowerCase() ){
            transformedOptions.push({
                label: response.data[i].roles_name,
                value: response.data[i].roles_id,
            });
        }
    }
    //   const transformedOptions = response.data.map((item) => ({
    //     label: item.roles_name,
    //     value: item.roles_id,
    //   }));
      setRolesOption(transformedOptions);
    })
    .catch((error) => {
      console.error('Error fetching division data:', error);
    });
  };

 const GetMenu = async (id) => {
    const fetchData = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/getMenuByRoleId/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Add your token if needed
            },
          });

          var respData = [];

          for(var i=0;i < response.data.length;i++){
            if(response.data[i].parent_menu_id === 0){
                respData.push(response.data[i]);
            }
            for(var x=0;x < response.data.length;x++){
                if(response.data[x].parent_menu_id == response.data[i].menu_id){
                    respData.push(response.data[x]);
                }
            }
          }

          setRowsUnits(respData); 
        //  setRowCountState(response.data.length);
     // Add row numbers to the rows
     const rowsWithRowNumbers = respData.map((row, index) => ({
      ...row,
      rowNumber: index + 1, 
    }));
    
    setRowsUnits(rowsWithRowNumbers);
        
        } catch (error) {
          console.error('Error fetching  data:', error);
        }
      };
    
      fetchData();
  };
//SHOWING RECORD LIST
//useEffect(() => {
  // Call the function to fetch data when the component mounts
//}, [token, rowsUnits]); // Add token as a dependency if it's required


const handleSubmitAdd2 = async (e) => {
  e.preventDefault(); 
  if (!unitsname) {
    setErrorMessageAdd2('Please fill in all fields');
    return; 
  }

  try {
    const formData = {

      roles_name: unitsname,
      //user_created:uid,

    };
    const response = await axios.post(`${apiUrl}/api/registerRoles`,formData ,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
   console.log(response.data);
   setUnitsName('')
   setIdProductCategory(response.data.division_name)
   setSuccessMessageAdd2('Data submitted successfully');
  } catch (error) {
    console.error('Error fetching data details:', error);

  }
};
 
const handleRolesAction = async (id,menuId, action) => {
    console.log(menuId);
    console.log(action);
    var isSelected=false;
    if(selectedAction){
        
        setSelectedAction(false);
        isSelected = false;
    }else{
        setSelectedAction(true);
        isSelected = true;
    }
    if(selectedOptionRoles === null || selectedOptionRoles.length === ''){
        alert("role belum dipilih");
        return;
    }
   
    updateRolesAction(id,isSelected,menuId,action);
     
};

const updateRolesAction = async (id,selectedAction,menuId,action) =>{
    const formData={
        id: id,
        menu_id:menuId,
        role_id: selectedOptionRoles,
     };

     if(action=="view"){
        formData.view = action == 'view' ? (selectedAction ? 1 : 0) : 0
     }
     if(action=="update"){
        formData.update = action == 'update' ? (selectedAction ? 1 : 0) : 0
     }

     if(action=="delete"){
        formData.delete = action == 'delete' ? (selectedAction ? 1 : 0) : 0
     }

     if(action=="create"){
        formData.create = action == 'create' ? (selectedAction ? 1 : 0) : 0
     }

    if(id == null){
        id=0;
        delete formData.id;
    }
    
    // Make PATCH request to update vendor data
    const response = await axios.patch(`${apiUrl}/api/updateMenuByRoleId/${id}`,formData ,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if(response!=null){
        console.log(response.data);
        GetMenu(selectedOptionRoles);
         
    }
}

const ChangeRoles = async (option) => {
    setSelectedOptionRoles(option == null ? null : option.value);
    //alert(option.value);
    GetMenu(option == null ? null : option.value);
     
};
  //CLEAR MESSAGE AFTER SHOWING
  useEffect(() => {
    // Function to clear success messages after 10 seconds
    const clearSuccessMessages = () => {
     // setSuccessMessageDelete('');
      //setSuccessMessageEdit('');
      setSuccessMessageAdd('');
      //setSuccessMessageAdd2('');
      //setSuccessMessageUpdate2('');
      setErrorMessageAdd2('');
    };
    // Show success messages and set timeout to clear them after 10 seconds
    if (successMessageAdd  || ErrorMessageAdd2) {
      const timeout = setTimeout(clearSuccessMessages, 4000); // 10 seconds (10,000 milliseconds)
      
      return () => {
        clearTimeout(timeout); // Clear timeout on component unmount
      };
    }
  }, [successMessageAdd, ErrorMessageAdd2]);

 
 
  const columns = [
    { field: 'rowNumber', headerName: 'No.', width: 50 },
   

    {
        field: 'actions0',
        headerName: 'Menu',
        width: 250,
        renderCell: (params) => {
            if(params.row.parent_menu_id == 0){
                return <label  htmlFor="first-name"><b>{params.row.menu_name}</b></label>
            }
            return <label  htmlFor="first-name">&nbsp;&nbsp;&nbsp;{params.row.menu_name}</label>
        }
      
      },
  {
    field: 'actions1',
    headerName: 'View',
    width: 100,
    renderCell: (params) => (
    <>
      <input type="checkbox" className='edit-button' disabled={params.row.parent_menu_id == '' ? true : false} checked={params.row.view == 1?true:false} onChange={() => handleRolesAction(params.row.id,params.row.menu_id,"view")}></input>
    </>
    ),
  
  },
  {
    field: 'actions2',
    headerName: 'Add',
    width: 100,
    renderCell: (params) => (
    <>
      <input type="checkbox"  className='edit-button' disabled={params.row.parent_menu_id == '' ? true : false} checked={params.row.create == 1? true:false} onChange={() => handleRolesAction(params.row.id,params.row.menu_id,"create")}></input>
    </>
    ),
  
  },
  {
    field: 'actions3',
    headerName: 'Update',
    width: 100,
    renderCell: (params) => (
    <>
      <input type="checkbox" className='edit-button' disabled={params.row.parent_menu_id == '' ? true : false} checked={params.row.update == 1 ? true:false} onChange={() => handleRolesAction(params.row.id,params.row.menu_id,"update")}></input>
    </>
    ),
  
  
    
  },
  {
    field: 'actions4',
    headerName: 'Delete',
    width: 100,
    renderCell: (params) => (
      <>
       <input type="checkbox"  className='edit-button' disabled={params.row.parent_menu_id == '' ? true : false} checked={params.row.delete == 1?true:false} onChange={() => handleRolesAction(params.row.id,params.row.menu_id,"delete")}></input>
    </>
    ),
  
  
    
  },
  
  ];
 
 
 return (
    
    <MainCard  title={mainCardTitle} className='boxy'>
      <Typography variant="body2">
        {name}{expire} - {uid}  <br/>
      
         <br/><br/>
  
 
         
     <div className='form-group'>
     <div className="col-lg-2">
     Roles:
        </div>
        <div className="col-lg-2">
           
            <VirtualizedSelect 
                    //style={{width:'20%'}}
                      options={RolesOption}
                      onChange={(option) => ChangeRoles(option)}
                      value={selectedOptionRoles}
                      className='form-control'
                      //required
                    />  
         </div>
           
     </div>
    
        
 
            
           
                                         <form onSubmit={handleSubmitAdd2 } >
                                  
                                  
                                       
      <Box sx={{ height: 550 }} >
        <DataGrid className='tablefont'
          columns={columns}
          rows={rowsUnits}
          EnableColumnRightBorder 
         // EnableColumnFilter
          EnableDensitySelector
         // paginationMode="server"
         // rowCount={rowCountState}
          //onPaginationModelChange={setPaginationModel}
         // pageSizeOptions={[5]}
          //loading={isLoading}
         // slots={{ toolbar: GridToolbar }}
          //filterModel={filterModel}
         // onFilterModelChange={(newModel) => setFilterModel(newModel)}
          //slotProps={{ toolbar: { showQuickFilter: true } }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          getRowId={(row) => row.menu_id}
        />
      </Box>
    
                                      </form>

      </Typography>
    </MainCard>
  );
};

export default RolesAction;
