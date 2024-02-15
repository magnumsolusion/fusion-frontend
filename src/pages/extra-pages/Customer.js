import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, Modal,  Grid,InputLabel,OutlinedInput, Stack
} from '@mui/material';
import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const Customer = () => {
// for tabs
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [value2, setValue2] = React.useState('3');
  const handleChange2 = (event: React.SyntheticEvent, newValue2: string) => {
    setValue2(newValue2);
  };


  const mainCardTitle = "Data Customer";
  //for add
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [vendorname, setVendorName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  //for edit
  const [vendornameedit, setVendorNameEdit] = useState('');
  const [addressedit, setAddressEdit] = useState('');
  const [emailedit, setEmailEdit] = useState('');
  const [phoneedit, setPhoneEdit] = useState('');
  const [contactedit, setContactEdit] = useState('');
  const [notesedit, setNotesEdit] = useState('');
  const [enableedit, setEnableEdit] = useState('');
  const [enableeditallowvendor, setEnableEditAllowVendor] = useState('');
  const modalRef = useRef(null);
  const [successMessageAdd, setSuccessMessageAdd] = useState('');
  const [successMessageAdd2, setSuccessMessageAdd2] = useState('');
  const [successMessageUpdate2, setSuccessMessageUpdate2] = useState('');
  const [successMessageEdit, setSuccessMessageEdit] = useState('');
  const [successMessageDelete, setSuccessMessageDelete] = useState('');
  //for other contact
  const [nameother, setNameOther] = useState('');
  const [phoneother, setPhoneOther] = useState('');
  const [emailother, setEmailOther] = useState('');
  const [switchValueEdit, setSwitchValueEdit] = useState(true);
  const [switchValueAllowVendor, setSwitchValueAllowVendor] = useState(false);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const Navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [rowsContact, setRowsContact] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenAdd = () => { 
    setOpenAdd(true);
    setValue2('3');
     setVendorName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setContact('');
      setNotes('');
      setEditingId('');
      setNameOther(''); 
      setPhoneOther('');
      setEmailOther('');
  }
  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteOpenContact, setConfirmDeleteOpenContact] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingVendorName, setDeletingVendorName] = useState('');
  const[idCustomerContact, setIdCustomerContact] = useState(null);
  const [ErrorMessageAdd2, setErrorMessageAdd2] = useState(false);
  const [updating, setUpdating] = useState(false);
  

//  GET DATA TO MODAL 
const handleOpenEdit = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/api/getCustomerById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Assuming the response.data contains the details of the vendor
    const { customer_name, address, phone, email, contact, notes, enable, allow_to_vendor } = response.data;

    // Set the state with the fetched data
    setVendorNameEdit(customer_name);
    setAddressEdit(address);
    setPhoneEdit(phone);
    setEmailEdit(email);
    setContactEdit(contact);
    setNotesEdit(notes);
    setSwitchValueEdit(enable === '1'); // Assuming 'enable' is a string '1' or '2'
    if(allow_to_vendor === '1') {

      setSwitchValueAllowVendor(true); 

    } else if(allow_to_vendor === '2') {

      setSwitchValueAllowVendor(false); 

    }
    setOpenEdit(true);
    setEditingId(id);
    setEnableEdit(enable); 
    setNameOther('');
    setPhoneOther('');
    setEmailOther('');
    setValue('1')
    setUpdating(false);
  } catch (error) {
    console.error('Error fetching data details:', error);
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

//SHOWING RECORD LIST CUSTOMER
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getCustomer`, {
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

  fetchData(); 
}, [token]); 

//SHOWING RECORD LIST CUSTOMER CONTACT
useEffect(() => {
  const fetchDataContact = async () => {
    if (editingId) {
      try {
        const response = await axios.get(`${apiUrl}/api/getCustomerContact/${editingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setRowsContact(response.data); // If it's already an array, update the state
          const rowsWithRowNumbers = response.data.map((row, index) => ({
            ...row,
            rowNumber: index + 1, 
            
          }));
          setRowsContact(rowsWithRowNumbers);
         
        } else if (typeof response.data === 'object' && Object.keys(response.data).length > 0) {
          // If it's a single object, convert it into an array
          setRowsContact([response.data]);
         
        } else {
          console.error('Invalid data format received:', response.data);
          setRowsContact([]);
        
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setRowsContact([]); 
      
      }
    } else {
      // If editingId is null, reset rowsContact to an empty array
      setRowsContact([]);
    }
  };

  fetchDataContact();
}, [token, rowsContact, editingId]);
//for table
const columns = [
  { field: 'rowNumber', headerName: 'No.', width: 50 },
  { field: 'customer_name', headerName: 'Name', width: 150 },
  { field: 'address', headerName: 'Address', width: 250 },
  { field: 'phone', headerName: 'Phone', width: 200 },
  { field: 'email', headerName: 'Email', width: 200},
  { field: 'contact', headerName: 'Contact', width: 150},

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
                fetchVendorName(params.row.id);
              }}
              className="delete-button"
            >
      Delete
    </button>
    </>
  ),

},

];

//for table contact 
const columns2 = [
  { field: 'rowNumber', headerName: 'No.', width: 50 },
  { field: 'customer_contact_name', headerName: 'Name', width: 150 },
  { field: 'phone', headerName: 'Phone', width: 200 },
  { field: 'email', headerName: 'Email', width: 200},


{
  field: 'actions',
  headerName: 'Actions',
  width: 230,
  renderCell: (params) => (
    <>
       <button
        onClick={() => handleEditCustomerContact(params.row.id)} // Pass the project ID to the edit function
        className="edit-button"
      >
        Edit
      </button>&nbsp;
      <button
              onClick={() => {
                setDeletingId(params.row.id);
                setConfirmDeleteOpenContact(true);
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
  const handleChangeEdit = (event) => {
    setSwitchValueEdit(event.target.checked);
    // Send different values based on the switch state
    if (event.target.checked) {
  
      setEnableEdit('1');
    } else {
  
      setEnableEdit('2');
    }
  };
  const handleChangeAllowVendor = (event) => {
    setSwitchValueAllowVendor(event.target.checked);
    // Send different values based on the switch state
    if (event.target.checked) {
  
      setEnableEditAllowVendor('1');
    } else {
  
      setEnableEditAllowVendor('2');
    }
  };
  //for Customer
  const handleSubmitAdd = async (e) => {
    e.preventDefault(); 
    try {
      const formData = {
        customer_name: vendorname,
        address: address,
        phone: phone,
        email: email,
        contact: contact,
        notes: notes,
        allow_to_vendor:enableeditallowvendor,
        user_created:uid,
      };
      // Make POST request to add new vendor data
      const res = await axios.post(`${apiUrl}/api/registerCustomer`, formData);

      const NewId = res.data.customerId;
      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/api/getCustomer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const rowsWithRowNumbers = response.data.map((row, index) => ({
        ...row,
        rowNumber: index + 1, 
      }));
      setRows(response.data);
      setRows(rowsWithRowNumbers);
    
      modalRef.current.scrollTo(0, 0);
      setEditingId(NewId);
      // Clear form fields and show success message
      // setVendorName('');
      // setAddress('');
      // setPhone('');
      // setEmail('');
      // setContact('');
      // setNotes('');
      setSuccessMessageAdd('Data submitted successfully');
       setValue2('4');
      Navigate('/Customer'); 

    } catch (error) {
      console.error('Error submitting data:', error);
      setSuccessMessageAdd('Data already submitted');
    }
  };
  //for Customer Contact
  const handleSubmitAdd2 = async (e) => {
    e.preventDefault(); 

    if (!editingId) {
      setErrorMessageAdd2('Please fill in all Customer Detail fields');
      return; 
    }
    if (!nameother || !phoneother || !emailother) {
      setErrorMessageAdd2('Please fill in all fields');
      return; 
    }



    try {
      const formData = {
        customer_id: editingId ? editingId : null,
        customer_contact_name: nameother,
        phone: phoneother,
        email: emailother,
      };
      const response = await axios.post(`${apiUrl}/api/registerCustomerContact`,formData ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     console.log(response.data);
     setNameOther('')
     setEmailOther('')
     setPhoneOther('')
     setSuccessMessageAdd2('Data submitted successfully');
    } catch (error) {
      console.error('Error fetching data details:', error);

    }
  };
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        customer_name: vendornameedit,
        address: addressedit,
        phone: phoneedit,
        email: emailedit,
        contact: contactedit,
        notes: notesedit,
        enable: enableedit,
        allow_to_vendor:enableeditallowvendor,
        user_updated:uid,
      };
      // Make PATCH request to update vendor data
      await axios.patch(`${apiUrl}/api/updateCustomer/${editingId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/api/getCustomer`, {
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
      setSuccessMessageEdit('Data updated successfully');
      Navigate('/Customer');
      setOpenEdit(false); // Close the edit modal after successful update
    } catch (error) {
      console.error('Error updating  data:', error);
      setSuccessMessageEdit('Error updating  data');
    }
  };
  const handleEditCustomerContact = async (id) => {
    try {
      // Make PATCH request to update vendor data
      const response = await axios.get(`${apiUrl}/api/getCustomerContactById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     console.log(response.data);
     setNameOther(response.data.customer_contact_name)
     setEmailOther(response.data.email)
     setPhoneOther(response.data.phone)
     setIdCustomerContact(response.data.id)
     setUpdating(true);
     modalRef.current.scrollTo(0, 0);
    } catch (error) {
      console.error('Error fetching data details:', error);
      // Handle errors or show a message to the user
    }
  };
  const handleUpdateCustomerContactCancel = async () => {
    setNameOther('')
    setEmailOther('')
    setPhoneOther('')
    setUpdating(false);
 
  };
  const handleUpdateCustomerContact = async (idCustomerContact) => {
    try {
    
      const formData = {
        customer_contact_name: nameother,
        phone: phoneother,
        email: emailother,
        user_updated:uid,
      };
  
      // Make PATCH request to update vendor data
      const response = await axios.patch(`${apiUrl}/api/updateCustomerContact/${idCustomerContact}`,formData ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     console.log(response.data);
     setNameOther('')
     setEmailOther('')
     setPhoneOther('')
     setUpdating(false);
     setSuccessMessageUpdate2('Data Updated successfully')
    } catch (error) {
      console.error('Error fetching data details:', error);
      // Handle errors or show a message to the user
    }
  };
  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`${apiUrl}/api/deleteCustomer/${deletingId}`, {
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
  const handleDeleteConfirmationContact = async () => {
    try {
      await axios.delete(`${apiUrl}/api/deleteCustomerContact/${deletingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove the deleted vendor from the local state (rows)
      setRows((prevRows) => prevRows.filter((row) => row.id !== deletingId));

      setSuccessMessageDelete('Data deleted successfully');
      setConfirmDeleteOpenContact(false); // Close the confirmation modal after successful deletion
    } catch (error) {
      console.error('Error deleting data:', error);
      setSuccessMessageDelete('Error deleting data');
    }
  };
  //GET DATA NAME TO DELETE MODAL
  const fetchVendorName = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/getCustomerById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming the response.data contains the details of the vendor
      setDeletingVendorName(response.data.customer_name);
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
    <MainCard title={mainCardTitle} className='boxy'>
      <Typography variant="body2">
        {name}{expire} - {uid}  <br/>
      
         <br/><br/>
        <button className='add-button' type='button' onClick={handleOpenAdd}>Add</button>
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
                  </div><br/><br/>
        {successMessageAdd && (
              <div className="success-blinking-text">{successMessageAdd}</div>
            )}
          <Typography id="modal-modal-title" variant="h6" component="h2">
           <h3>Add {mainCardTitle}</h3>
           <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange2} aria-label="lab API tabs example">
            <Tab label="Customer Detail" value="3" />
            <Tab label="Other Contact" value="4" />
          </TabList>
        </Box>
        <TabPanel value="3">


        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <form onSubmit={handleSubmitAdd} >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel >Name</InputLabel>
                  <OutlinedInput
                    type="text"
                    value={vendorname}
                    name="name"
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="Enter the Name"
                    fullWidth
                    required
                  />
                  <InputLabel >Address</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={address}
                    name="address"
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter the address"
                    fullWidth
                    required
                  />
                  <InputLabel >Phone</InputLabel>
                  <OutlinedInput
                    type="text"
                    value={phone}
                    name="phone"
                    onChange={(e) => {
                      const enteredValue = e.target.value;
                      const numericRegex = /^[0-9]*$/;
                      if (numericRegex.test(enteredValue) || enteredValue === '') {
                        setPhone(Number(enteredValue)); 
                      }
                    }}
                    placeholder="Enter the phone"
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
                 <InputLabel >Contact</InputLabel>
                  <OutlinedInput
                    type="text"
                    value={contact}
                    name="contact"
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter Arthe contact"
                    fullWidth
                    required
                  />
                <InputLabel >Notes</InputLabel>
                  <OutlinedInput
                    type="text"
                    value={notes}
                    name="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter the notes"
                    fullWidth
                    required
                  />
                     <InputLabel >Allow to Vendor</InputLabel>
                   <FormControlLabel
                control={
                  <Switch 
                
                    checked={switchValueAllowVendor}
                    onChange={handleChangeAllowVendor}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={switchValueAllowVendor ? 'Yes' : 'No'}
                 />
                </Stack>
                <br></br>
                <div className="wrapper-submit-btn">
                <button  className='submit-button' type="submit" >
                Next
                  </button>
                  </div>
        
              </Grid>     
            </Grid>
          </form>
          </Typography>


        </TabPanel>
        <TabPanel value="4" ref={modalRef}>


   

        {successMessageAdd2 && (
              <div className="success-blinking-text">{successMessageAdd2}</div>
            )}     
             {successMessageUpdate2 && (
              <div className="success-blinking-text">{successMessageUpdate2}</div>
            )}   
   {ErrorMessageAdd2 && (
              <div className="success-blinking-text">{ErrorMessageAdd2}</div>
            )}   

<div className="wrapper-add-btn">
             {updating? (
    <>
        <button type='button' onClick={() => handleUpdateCustomerContact(idCustomerContact)} className='add-button'>
         Update
        </button>&nbsp;
         <button type='button' onClick={handleUpdateCustomerContactCancel} className='cancel-button'>
         Cancel
       </button>
       </>
      ) : (
     <>
        <button onClick={handleSubmitAdd2} className='add-button'>Add</button>
        </>
      )}
          </div>  
            
           
                                         <form onSubmit={handleSubmitAdd2 } >
                                      <input className='select-element'
                                        type="text"
                                        value={nameother}
                                        name="nameother"
                                        onChange={(e) => setNameOther(e.target.value)}
                                        placeholder="Enter the name"
                                  
                                  
                                      />    
                                    &nbsp;
                                      <input className='select-element'
                                        type="text"
                                        value={phoneother}
                                        name="phoneother"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setPhoneOther(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the phone"
                                      
                                 
                                      />
                                        &nbsp;
                                      <input className='select-element'
                                        type="emailother"
                                        value={emailother}
                                        name="emailother"
                                        onChange={(e) => setEmailOther(e.target.value)}
                                        placeholder="Enter the  email"
                                    
                                      />
         
                                        <br/><br/>
                                  
                           
                                      </form>
                                      <Box sx={{ width: 1 }} >
                                    
                                    
                                    <Box sx={{ height: 300 }} >
                                      <DataGrid className='tablefont'
                                        columns={columns2}
                                        rows={rowsContact}
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
                                      <br/>
                         <div className="wrapper-submit-btn">
                         {!editingId ? null : (
  <button onClick={handleCloseModalAdd} className='submit-button' type="button">
    Submit
  </button>
)}
</div>
          </TabPanel>




   </TabContext>

   </Box>
          </Typography>
        
        </Box>
      </Modal>
     {/* MODAL EDIT */}
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        scrollTo={false}
      >
        <Box className='modals' ref={modalRef}>
          <div className='wrapper-close-btn'>
        <button onClick={handleCloseModalEdit}  className='cancel-button' type="button" >
              x
         </button>
         </div><br/><br/>


          <Typography id="modal-modal-title" variant="h6" component="h2">
           <h3>Edit {mainCardTitle} - {vendornameedit}</h3>
           <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Customer Detail" value="1" />
            <Tab label="Other Contact" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                              <form onSubmit={handleSubmitEdit} >
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    <Stack spacing={1}>
                                      <InputLabel >Name</InputLabel>
                                      <OutlinedInput
                                        type="text"
                                        value={vendornameedit}
                                        name="name"
                                        onChange={(e) => setVendorNameEdit(e.target.value)}
                                        placeholder="Enter the Name"
                                        fullWidth
                                        required
                                      />
                                      <InputLabel >Address</InputLabel>
                                      <OutlinedInput
                                        type="text"
                                        value={addressedit}
                                        name="address"
                                        onChange={(e) => setAddressEdit(e.target.value)}
                                        placeholder="Enter the address"
                                        fullWidth
                                        required
                                      />
                                      <InputLabel >Phone</InputLabel>
                                      <OutlinedInput
                                        type="text"
                                        value={phoneedit}
                                        name="phone"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setPhoneEdit(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the phone"
                                        fullWidth
                                        required
                                      />
                                  <InputLabel >Email</InputLabel>
                                      <OutlinedInput
                                        type="email"
                                        value={emailedit}
                                        name="email"
                                        onChange={(e) => setEmailEdit(e.target.value)}
                                        placeholder="Enter the email"
                                        fullWidth
                                        required
                                      />
                                    <InputLabel >Contact</InputLabel>
                                      <OutlinedInput
                                        type="text"
                                        value={contactedit}
                                        name="contact"
                                        onChange={(e) => setContactEdit(e.target.value)}
                                        placeholder="Enter Arthe contact"
                                        fullWidth
                                        required
                                      />
                                    <InputLabel >Notes</InputLabel>
                                      <OutlinedInput
                                        type="text"
                                        value={notesedit}
                                        name="notes"
                                        onChange={(e) => setNotesEdit(e.target.value)}
                                        placeholder="Enter the notes"
                                        fullWidth
                                        required
                                      />
                                        <InputLabel >Enable ?</InputLabel>
                                      <FormControlLabel
                                    control={
                                      <Switch 
                                        checked={switchValueEdit}
                                        onChange={handleChangeEdit}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                      />
                                    }
                                    label={switchValueEdit ? 'Yes' : 'No'}
                                    />
                                    <InputLabel >Allow to Vendor</InputLabel>
                   <FormControlLabel
                control={
                  <Switch 
                    name='enableeditallowvendor'
                    checked={switchValueAllowVendor}
                    onChange={handleChangeAllowVendor}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={switchValueAllowVendor ? 'Yes' : 'No'}
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
        </TabPanel>
         <TabPanel value="2" ref={modalRef}>

        {successMessageAdd2 && (
              <div className="success-blinking-text">{successMessageAdd2}</div>
            )}     
             {successMessageUpdate2 && (
              <div className="success-blinking-text">{successMessageUpdate2}</div>
            )}   
   {ErrorMessageAdd2 && (
              <div className="success-blinking-text">{ErrorMessageAdd2}</div>
            )}   

<div className="wrapper-add-btn">
             {updating? (
    <>
        <button type='button' onClick={() => handleUpdateCustomerContact(idCustomerContact)} className='add-button'>
         Update
        </button>&nbsp;
         <button type='button' onClick={handleUpdateCustomerContactCancel} className='cancel-button'>
         Cancel
       </button>
       </>
      ) : (
     <>
        <button onClick={handleSubmitAdd2} className='add-button'>Add</button>
        </>
      )}
          </div>
            
           
                                         <form onSubmit={handleSubmitAdd2 } >
                                      <input className='select-element'
                                        type="text"
                                        value={nameother}
                                        name="nameother"
                                        onChange={(e) => setNameOther(e.target.value)}
                                        placeholder="Enter the name"
                                  
                                  
                                      />    
                                    &nbsp;
                                      <input className='select-element'
                                        type="text"
                                        value={phoneother}
                                        name="phoneother"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setPhoneOther(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the phone"
                                      
                                   
                                      />
                                        &nbsp;
                                      <input className='select-element'
                                        type="emailother"
                                        value={emailother}
                                        name="emailother"
                                        onChange={(e) => setEmailOther(e.target.value)}
                                        placeholder="Enter the  email"
                                    
                                      />
         
                                        <br/><br/>
                                  
                                        
                                      <br></br>
                                 
                                      </form>
                                      <Box sx={{ width: 1 }} >
                                    
                                    
                                    <Box sx={{ height: 300 }} >
                                      <DataGrid className='tablefont'
                                        columns={columns2}
                                        rows={rowsContact}
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
                                   
                                  
          </TabPanel>
      </TabContext>
    </Box>
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
        <Box className='modals-delete' ref={modalRef}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h3>Delete {mainCardTitle} - {deletingVendorName}</h3>
          </Typography>
          <Typography id="modal-modal-description">
            <p>Are you sure you want to delete this data?</p>
            <div className='wrapper-submit-btn'>
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
            </div>
          </Typography>
        </Box>
      </Modal>
      {/* { DELETE CONFIRM MODAL} */}
<Modal
        open={confirmDeleteOpenContact}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modals' ref={modalRef}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h3>Delete {mainCardTitle}</h3>
          </Typography>
          <Typography id="modal-modal-description">
            <p>Are you sure you want to delete this data?</p>
            <button onClick={handleDeleteConfirmationContact} className='submit-button'>
              Yes
            </button>
            &nbsp;
            <button
              onClick={() => setConfirmDeleteOpenContact(false)}
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
export default Customer;