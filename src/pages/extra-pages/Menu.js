import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, Modal, Grid,InputLabel,OutlinedInput, Stack,
  Box
} from '@mui/material';

import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';

//import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
 
 import VirtualizedSelect from 'react-virtualized-select';
 import '../../assets/additional-css/react-select.css';

const Menu = () => {
  const mainCardTitle = "Menu";
  //for add
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
 // const [parent, setParent] = useState('');
  const [route, setRoute] = useState('');
   
  const modalRef = useRef(null);
  const [successMessageAdd, setSuccessMessageAdd] = useState('');
  const [successMessageEdit, setSuccessMessageEdit] = useState('');
  const [successMessageDelete, setSuccessMessageDelete] = useState('');
  
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const Navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenAdd = () => 
  {
  
    setOpenAdd(true);
    setRoute('');
    setName('');
    
    setSelectedOptionParent(null);
    
    GetMenu();
    
  }
  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  //const [deletingId, setDeletingId] = useState(null);
  const [deletingUsersName, setDeletingUsersName] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  
  
  const [selectedOptionParent, setSelectedOptionParent] = useState(null);
  const [parentOption, setParentOption] = useState(null);

  const GetMenu = async () => {
    axios.get(`${apiUrl}/api/getMenu`)
    .then((response) => {
    var list=[];
     for(var i=0;i < response.data.length;i++) {
      if(response.data[i].parent_menu_id == 0)
      {
        list.push({
          label: response.data[i].menu_name,
          value: response.data[i].menu_id,
        });
      }
     }
      // const transformedOptions = response.data.map((item) => ({
      //   label: item.menu_name,
      //   value: item.menu_id,
      // }));
      setParentOption(list);
    })
    .catch((error) => {
      console.error('Error fetching division data:', error);
    });
  };

//  GET DATA TO MODAL 
const handleOpenEdit = async (id) => {
     
    try {
    const response = await axios.get(`${apiUrl}/api/getMenuById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
 
    // Assuming the response.data contains the details of the vendor
    console.log(response.data);
    const {menu_name, menu_route,parent_menu_id } = response.data;
    GetMenu();
    // Set the state with the fetched data
    setName(menu_name);
    setRoute(menu_route);
    setSelectedOptionParent(parent_menu_id);
    
    setOpenEdit(true);
    setEditingId(id);
     
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    // Handle errors or show a message to the user
  }



  
};

 

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
      const response = await axios.get(`${apiUrl}/api/getMenu`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add your token if needed
        },
      });
      setRows(response.data); 

      // Add row numbers to the rows
      const rowsWithRowNumbers = response.data.map((row, index) => ({
        ...row,
        rowNumber: index + 1, 
        
      }));
      setRows(rowsWithRowNumbers);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  fetchData(); // Call the function to fetch data when the component mounts
}, [token]); // Add token as a dependency if it's required



//for table
const columns = [
  { field: 'rowNumber', headerName: 'No.', width: 50 },
  { field: 'menu_id', headerName: 'ID', width: 150 },
  { field: 'menu_name', headerName: 'Name', width: 150 },
  { field: 'menu_route', headerName: 'Route', width: 200 },
  { field: 'parent_menu_id', headerName: 'Parent ID', width: 200 },
   
{
  field: 'actions',
  headerName: 'Actions',
  width: 230,
  renderCell: (params) => (
    <>
       <button
        onClick={() => handleOpenEdit(params.row.menu_id)} // Pass the project ID to the edit function
        className="edit-button"
      >
        Edit
      </button>&nbsp;
      <button
              onClick={() => {
                 setDeletingId(params.row.id);
                 setConfirmDeleteOpen(true);
                 fetchUsersName(params.row.id);
              }}
              className="delete-button"
            >
      Delete
    </button>


    </>
    
  ),


  
},



];

// ACTION GROUP FUNCTION

const handleCloseModalAdd = () => {
  handleCloseAdd(); 
};


const handleCloseModalEdit = () => {
  handleCloseEdit(); 
};





//   const handleChangeEdit = (event) => {
//     setSwitchValueEdit(event.target.checked);
//     // Send different values based on the switch state
//     if (event.target.checked) {
  
//       setEnableEdit('1');
//     } else {
  
//       setEnableEdit('2');
//     }
//   };
//   const handleChangeAllowCustomer = (event) => {
//     setSwitchValueAllowCustomer(event.target.checked);
//     // Send different values based on the switch state
//     if (event.target.checked) {
  
//       setEnableEditAllowCustomer('1');
//     } else {
  
//       setEnableEditAllowCustomer('2');
//     }
//   };

  const handleSubmitAdd = async (e) => {
    e.preventDefault(); 
    
    console.log(selectedOptionParent);
    try {
      const formData = {
        menu_name: name,
        menu_route: route,
        parent_menu_id: selectedOptionParent == null?0 : selectedOptionParent.value,
        is_deleted: 0
      };
  
      // Make POST request to add new vendor data
      await axios.post(`${apiUrl}/api/registerMenu`, formData);
    
      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/api/getMenu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
      });
      const rowsWithRowNumbers = response.data.map((row, index) => ({
        ...row,
        rowNumber: index + 1, 
        
      }));
      // Update the rows state with the updated data
      setRows(response.data);
      setRows(rowsWithRowNumbers);
      modalRef.current.scrollTo(0, 0);
      console.log('Data submitted successfully');
   
      setName('');
      setRoute('');
      setSelectedOptionParent(null);
       
      setSuccessMessageAdd('Data submitted successfully');
     
      setOpenAdd(true);
      GetMenu();
    
   // setSwitchValueEdit(enableeditallowcustomer === '2'); 
     // GetDivision();
     // GetRoles();
    
      Navigate('/Menu'); 
    } catch (error) {
      console.error('Error submitting data:', error);
      setSuccessMessageAdd('Data already submitted');
    }
  };
  


  const handleSubmitEdit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = {
        menu_name: name,
        menu_route: route,
        parent_menu_id: selectedOptionParent == null?0 : selectedOptionParent.value,
        is_deleted : 0
      };
  
      // Make PATCH request to update vendor data
      await axios.patch(`${apiUrl}/api/updateMenu/${editingId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/api/getMenu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const rowsWithRowNumbers = response.data.map((row, index) => ({
        ...row,
        rowNumber: index + 1, 
        
      }));
      // Update the rows state with the updated data
      setRows(response.data);
      setRows(rowsWithRowNumbers);
      modalRef.current.scrollTo(0, 0);
      console.log('Data updated successfully');
      //    setEnableEditAllowCustomer('')
      setSuccessMessageEdit('Data updated successfully');
       Navigate('/Menu');
      setOpenEdit(false); // Close the edit modal after successful update
    } catch (error) {
      console.error('Error updating  data:', error);
      setSuccessMessageEdit('Error updating  data');
    }
  };


  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`${apiUrl}/api/deleteMenu/${deletingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted vendor from the local state (rows)
      setRows((prevRows) => prevRows.filter((row) => row.id !== deletingId));

      setSuccessMessageDelete('Data deleted successfully');
      setConfirmDeleteOpen(false); // Close the confirmation modal after successful deletion
    } catch (error) {
      console.error('Error deleting data:', error);
      setSuccessMessageDelete('Error deleting data');
    }
  };
  

  //GET DATA NAME TO DELETE MODAL
  const fetchUsersName = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/getMenuById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming the response.data contains the details of the vendor
      setDeletingUsersName(response.data.menu_name);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
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
    };

    // Show success messages and set timeout to clear them after 10 seconds
    if (successMessageDelete || successMessageEdit || successMessageAdd) {
      const timeout = setTimeout(clearSuccessMessages, 7000); // 10 seconds (10,000 milliseconds)
      
      return () => {
        clearTimeout(timeout); // Clear timeout on component unmount
      };
    }
  }, [successMessageDelete, successMessageEdit , successMessageAdd]);
  return (
    
    <MainCard title={mainCardTitle} className='boxy'>
      <Typography variant="body2">
        {name}{expire} - {uid}  <br/>
      
         <br/><br/>
        <button className='add-button' onClick={handleOpenAdd}>Add</button>
        <br/> <br/>

        {successMessageDelete && (
              <div className="success-blinking-text">{successMessageDelete}<br/></div>
            )}
               {successMessageEdit && (
              <div className="success-blinking-text">{successMessageEdit}<br/></div>
            )}

     {/* MODAL ADD */}
        <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >  
        <Box className='modals' ref={modalRef}>
          <div className='wrapper-close-btn'>
          <button onClick={handleCloseModalAdd}  className='cancel-button' type="button" >
                X
                  </button>
            </div>
        {successMessageAdd && (
              <div className="success-blinking-text">{successMessageAdd}</div>
            )}
          <Typography id="modal-modal-title" variant="h6" component="h2">
           <h3>Add {mainCardTitle}</h3>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
       
          <form onSubmit={handleSubmitAdd} >
            
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel >Name</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={name}
                    name="name"
            
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter the Name"
                    fullWidth
                    required
                 
                  />
                   
               <InputLabel >Route</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={route}
                    name="route"
            
                    onChange={(e) => setRoute(e.target.value)}
                    placeholder="Enter the route"
                    fullWidth
                    //required
                 
                  />
               
                
                <InputLabel >Parent</InputLabel>
                <VirtualizedSelect 
                      style={{width:'100%'}}
                      options={parentOption}
                      onChange={(option) => setSelectedOptionParent(option)}
                      value={selectedOptionParent}
                      //required
                    />  
                </Stack>
                <br></br>
                <div className="wrapper-submit-btn">
                <button  className='submit-button' type="submit" >
                Submit
                  </button>
                  </div>
               
              </Grid>     
            </Grid>
          
          </form>
            
          </Typography>
        </Box> 
      </Modal>

     {/* MODAL EDIT */}

      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modals' ref={modalRef}>
        <div className='wrapper-close-btn'>
        <button onClick={handleCloseModalEdit}  className='cancel-button' type="button" >
                X
                  </button>
            </div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
           <h3>Edit {mainCardTitle}</h3>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
     
          <form onSubmit={handleSubmitEdit} >
            
            
          <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                <InputLabel >Name</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={name}
                    name="name"
            
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter the Name"
                    fullWidth
                    required
                 
                  />
                   
               <InputLabel >Route</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={route}
                    name="route"
            
                    onChange={(e) => setRoute(e.target.value)}
                    placeholder="Enter the route"
                    fullWidth
                   // required
                 
                  />
               
                
                <InputLabel >Parent</InputLabel>
                <VirtualizedSelect 
                      style={{width:'100%'}}
                      options={parentOption}
                      onChange={(option) => setSelectedOptionParent(option)}
                      value={selectedOptionParent}
                     // required
                    />  
                </Stack>
                <br></br>
                <div className="wrapper-submit-btn">
                <button  className='submit-button' type="submit" >
                Submit
                  </button>
                  </div>
               
              </Grid>     
            </Grid>
          </form>
          </Typography>
        </Box>
      </Modal>

    

{/* { DELETE CONFIRM MODAL} */}

<Modal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modals' ref={modalRef}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h3>Delete {mainCardTitle} - {deletingUsersName}</h3>
          </Typography>
          <Typography id="modal-modal-description">
            <p>Are you sure you want to delete this data?</p>
            <button onClick={handleDeleteConfirmation} className='submit-button'>
              Yes
            </button>
            &nbsp;
            <button
              onClick={() => setConfirmDeleteOpen(false)}
              className='close-button'
            >
              No
            </button>
          </Typography>
        </Box>
      </Modal>




    {/* DATA LIST */}


    <Box sx={{ width: 1 }} >
      <FormControlLabel className='fonty'
        checked={columnVisibilityModel.id !== false}
        onChange={(event) =>
          setColumnVisibilityModel(() => ({ id: event.target.checked }))
        }
        control={<Switch color="primary" size="large" />}
        label="Show ID column"
      />
      <FormControlLabel className='fonty'
        checked={filterModel.quickFilterExcludeHiddenColumns}
        onChange={(event) =>
          setFilterModel((model) => ({
            ...model,
            quickFilterExcludeHiddenColumns: event.target.checked,
          }))
        }
        control={<Switch  color="primary" size="small" />}
        label="Exclude hidden columns"
      />
      <Box sx={{ height: 550 }} >
        <DataGrid className='tablefont'
          columns={columns}
          rows={rows}

          EnableDensitySelector
          slots={{ toolbar: GridToolbar }}
          filterModel={filterModel}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          getRowId={(row) => row.menu_id}
        />
      </Box>
    </Box>                    

      </Typography>
    </MainCard>
  );
};

export default Menu;
