import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, Modal, Grid,InputLabel,OutlinedInput, Stack,IconButton,
    InputAdornment, Box
} from '@mui/material';

import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';

//import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
 //import { strengthColor, strengthIndicator } from 'utils/password-strength';
 import VirtualizedSelect from 'react-virtualized-select';
 import '../../assets/additional-css/react-select.css';
 import MenuBinding from './MenuBind2.js';

const User = () => {
  const mainCardTitle = "Users";
  //for add
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
 // const [vendorname, setVendorName] = useState('');
  //const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  //const [phone, setPhone] = useState('');
  //const [contact, setContact] = useState('');
  //const [notes, setNotes] = useState('');

  //for edit
  //const [vendornameedit, setVendorNameEdit] = useState('');
 // const [addressedit, setAddressEdit] = useState('');
 // const [emailedit, setEmailEdit] = useState('');
 // const [phoneedit, setPhoneEdit] = useState('');
 // const [contactedit, setContactEdit] = useState('');
 // const [notesedit, setNotesEdit] = useState('');
  //const [enableedit, setEnableEdit] = useState('');
 // const [enableeditallowcustomer, setEnableEditAllowCustomer] = useState('');
  const modalRef = useRef(null);
  const [successMessageAdd, setSuccessMessageAdd] = useState('');
  const [successMessageEdit, setSuccessMessageEdit] = useState('');
  const [successMessageDelete, setSuccessMessageDelete] = useState('');
 // const [divisionid, setDvisionid] = useState('');

 // const [switchValueEdit, setSwitchValueEdit] = useState(true);
  //const [switchValueAllowCustomer, setSwitchValueAllowCustomer] = useState(false);
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
    setEmail('');
    setName('');
    setSelectedOptionDivision(null);
    setSelectedOptionRoles(null);
    
   // setSwitchValueEdit(enableeditallowcustomer === '2'); 
    GetDivision();
    GetRoles();
  }
  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  //const [deletingId, setDeletingId] = useState(null);
  const [deletingUsersName, setDeletingUsersName] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
    
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
    
  };
  const changePassword = (value) => {
    //const temp = strengthIndicator(value);
    //setLevel(strengthColor(temp));
    setPassword(value);
  };

  const changeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //const [level, setLevel] = useState();
  const [selectedOptionDivision, setSelectedOptionDivision] = useState(null);
  const [DivisionOption, setDivisionOption] = useState(null);

  const [selectedOptionRoles, setSelectedOptionRoles] = useState(null);
  const [RolesOption, setRolesOption] = useState(null);

  const GetDivision = async () => {
    axios.get(`${apiUrl}/api/getDivision`)
    .then((response) => {
      const transformedOptions = response.data.map((item) => ({
        label: item.division_name,
        value: item.division_id,
      }));
      setDivisionOption(transformedOptions);
    })
    .catch((error) => {
      console.error('Error fetching division data:', error);
    });
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

//  GET DATA TO MODAL 
const handleOpenEdit = async (id) => {



  try {
    const response = await axios.get(`${apiUrl}/getUsers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    GetDivision();
    GetRoles();
    // Assuming the response.data contains the details of the vendor
    console.log(response.data);
    const { email, name, division_id,roles_id } = response.data;

    // Set the state with the fetched data
    setEmail(email);
    setName(name);
    //setPassword(password);
    setSelectedOptionDivision(division_id);
    //setSwitchValueEdit(enable === '1');
    setSelectedOptionRoles(roles_id);
     

    setOpenEdit(true);
    setEditingId(id);
    //setEnableEdit(enable); 
 
 
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    // Handle errors or show a message to the user
  }



  
};

 

//AUTH TOKEN
  
  useEffect(() => {
    refreshToken();
    
  }, [MenuBinding()]);

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
      const response = await axios.get(`${apiUrl}/users`, {
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
 
}, [token,setRows]); // Add token as a dependency if it's required



//for table
const columns = [
  { field: 'rowNumber', headerName: 'No.', width: 50 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'passwords', headerName: 'Password', width: 200, renderCell: (params) => (
    <>
        
       *****
        <input type='hidden' id='hdnPassword' value={params.row.password}></input>
    </>
    
  )},
   
{
  field: 'actions',
  headerName: 'Actions',
  width: 230,
  renderCell: (params) => (
    <>
       <button
        onClick={() => handleOpenEdit(params.row.id)} // Pass the project ID to the edit function
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
    try {
      const formData = {
        name: name,
        email: email,
        division_id: selectedOptionDivision.value,
        roles_id: selectedOptionRoles.value,
        password : password,
        confirmpassword : confirmpassword
      };
  
      // Make POST request to add new vendor data
      await axios.post(`${apiUrl}/register`, formData);
    
      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/users`, {
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
  
      // Clear form fields and show success message
      //setVendorName('');
      //setAddress('');
      //setPhone('');
      //setEmail('');
      //setContact('');
      //setNotes('');

      setEmail('');
      setName('');
      setSelectedOptionDivision(null);
      setSelectedOptionRoles(null);
      setPassword('');
      setConfirmPassword('');
      setSuccessMessageAdd('Data submitted successfully');
     
      setOpenAdd(true);
     
    
   // setSwitchValueEdit(enableeditallowcustomer === '2'); 
     // GetDivision();
     // GetRoles();
    
      Navigate('/Users'); 
    } catch (error) {
      console.error('Error submitting data:', error);
      setSuccessMessageAdd('Data already submitted');
    }
  };
  


  const handleSubmitEdit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = {
        name: name,
        email: email,
        division_id: selectedOptionDivision.value,
        roles_id: selectedOptionRoles.value,
       // password : password,
      // confirmpassword : confirmpassword
      };
  
      // Make PATCH request to update vendor data
      await axios.patch(`${apiUrl}/updateUsers/${editingId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/users`, {
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
       Navigate('/Users');
      setOpenEdit(false); // Close the edit modal after successful update
    } catch (error) {
      console.error('Error updating  data:', error);
      setSuccessMessageEdit('Error updating  data');
    }
  };


  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`${apiUrl}/deleteUsers/${deletingId}`, {
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
      const response = await axios.get(`${apiUrl}/getUsers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming the response.data contains the details of the vendor
      setDeletingUsersName(response.data.name);
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
                   
               <InputLabel >Email</InputLabel>
                  <OutlinedInput
                   
                    type="email"
                    value={email}
                    name="email"
            
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the email"
                    fullWidth
                    required
                 
                  />
                 <InputLabel >Password</InputLabel>
                 <OutlinedInput
                    fullWidth
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    name="password"
                    onChange={(e) => {
                        changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                    inputProps={{}}
                  />
                <InputLabel >Confirm Password</InputLabel>
                 <OutlinedInput
                    fullWidth
                    id="password-signup-2"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmpassword}
                    name="password"
                    onChange={(e) => {
                        changeConfirmPassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                    inputProps={{}}
                  />
                <InputLabel >Division</InputLabel>
                    <VirtualizedSelect 
                      style={{width:'100%'}}
                      options={DivisionOption}
                      onChange={(option) => setSelectedOptionDivision(option)}
                      value={selectedOptionDivision}
                      required
                    />
                    <InputLabel >Role</InputLabel>
                    <VirtualizedSelect 
                      style={{width:'100%'}}
                      options={RolesOption}
                      onChange={(option) => setSelectedOptionRoles(option)}
                      value={selectedOptionRoles}
                      required
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
                   
               <InputLabel >Email</InputLabel>
                  <OutlinedInput
                   
                    type="email"
                    value={email}
                    name="email"
            
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the email"
                    fullWidth
                    required
                 
                  />
                  
                <InputLabel >Division</InputLabel>
                    <VirtualizedSelect 
                      style={{width:'100%'}}
                      options={DivisionOption}
                      onChange={(option) => setSelectedOptionDivision(option)}
                      value={selectedOptionDivision}
                      required
                    />
                    <InputLabel >Role</InputLabel>
                    <VirtualizedSelect 
                      style={{width:'100%'}}
                      options={RolesOption}
                      onChange={(option) => setSelectedOptionRoles(option)}
                      value={selectedOptionRoles}
                      required
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
        />
      </Box>
    </Box>                    

      </Typography>
    </MainCard>
  );
};

export default User;
