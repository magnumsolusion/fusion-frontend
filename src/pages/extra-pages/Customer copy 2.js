import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, Modal, Box, FormControlLabel,Grid,InputLabel,OutlinedInput, Stack,Switch 
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const Customer = () => {
// for tabs
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
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
  const modalRef = useRef(null);
  const [successMessageAdd, setSuccessMessageAdd] = useState('');
  const [successMessageAdd2, setSuccessMessageAdd2] = useState('');
  const [successMessageEdit, setSuccessMessageEdit] = useState('');
  const [successMessageDelete, setSuccessMessageDelete] = useState('');
  //for other contact
  const [nameother, setNameOther] = useState('');
  const [phoneother, setPhoneOther] = useState('');
  const [emailother, setEmailOther] = useState('');

  const [switchValueEdit, setSwitchValueEdit] = useState(true);
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
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingVendorName, setDeletingVendorName] = useState('');
  const [idCustomerContact, setIdCustomerContact] = useState('');

//  GET DATA TO MODAL 
const handleOpenEdit = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/api/getCustomerById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Assuming the response.data contains the details of the vendor
    const { customer_name, address, phone, email, contact, notes, enable } = response.data;

    // Set the state with the fetched data
    setVendorNameEdit(customer_name);
    setAddressEdit(address);
    setPhoneEdit(phone);
    setEmailEdit(email);
    setContactEdit(contact);
    setNotesEdit(notes);
    setSwitchValueEdit(enable === '1'); // Assuming 'enable' is a string '1' or '2'
    setOpenEdit(true);
    setEditingId(id);
    setEnableEdit(enable); 
    setNameOther('');
    setPhoneOther('');
    setEmailOther('');
    setValue('1')
 
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

  fetchData(); // Call the function to fetch data when the component mounts
}, [token]); // Add token as a dependency if it's required


//SHOWING RECORD LIST CUSTOMER CONTACT
useEffect(() => {
  const fetchData = async () => {
    if (editingId) {
      try {
        const response = await axios.get(`${apiUrl}/api/getCustomerContact/${editingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setRowsContact(response.data); // If it's already an array, update the state
          setIdCustomerContact(response.data.id); // If it's already
        } else if (typeof response.data === 'object' && Object.keys(response.data).length > 0) {
          // If it's a single object, convert it into an array
          setRowsContact([response.data]);
          setIdCustomerContact(response.data.id);
        } else {
          console.error('Invalid data format received:', response.data);
          setRowsContact([]);
          setIdCustomerContact(response.data.id); // Set rowsContact to an empty array when no data is available
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setRowsContact([]); 
        setIdCustomerContact(response.data.id);
      }
    } else {
      // If editingId is null, reset rowsContact to an empty array
      setRowsContact([]);
    }
  };

  fetchData();
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
        user_created:uid,
    
      };
      // Make POST request to add new vendor data
      await axios.post(`${apiUrl}/api/registerCustomer`, formData);
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
      console.log('Data submitted successfully');
  
      // Clear form fields and show success message
      setVendorName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setContact('');
      setNotes('');
      setSuccessMessageAdd('Data submitted successfully');
  
      Navigate('/Customer'); 
    } catch (error) {
      console.error('Error submitting data:', error);
      setSuccessMessageAdd('Data already submitted');
    }
  };
  
  //for Customer Contact
  const handleSubmitAdd2 = async (e) => {
    e.preventDefault(); 
    try {
      const formData = {
        customer_id: editingId ? editingId : null,
        customer_contact_name: nameother,
        phone: phoneother,
        email: emailother,

      };
  
      await axios.post(`${apiUrl}/api/registerCustomerContact`, formData);
      setRows(response.data);
     
      modalRef.current.scrollTo(0, 0);
      console.log('Data submitted successfully');
      setSuccessMessageAdd2('Data submitted successfully');
      setNameOther('');
      setEmailOther('');
      setPhoneOther('');

    } catch (error) {
      console.error('Error submitting data:', error);
      setSuccessMessageAdd2('Data already submitted');
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

    } catch (error) {
      console.error('Error fetching data details:', error);
      // Handle errors or show a message to the user
    }
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
                 
                </Stack>
                <br></br>
                <button  className='submit-button' type="submit" >
                Submit
                  </button>&nbsp;
                  <button onClick={handleCloseModalAdd}  className='close-button' type="button" >
                Close
                  </button>
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
                                    </Stack>
                                    <br></br>
                                    <button  className='submit-button' type="submit" >
                                    Submit
                                      </button>&nbsp;
                                      <button onClick={handleCloseModalEdit}  className='close-button' type="button" >
                                    Close
                                      </button>
                                  </Grid>     
                                </Grid>
                              </form>
                              </Typography>
        
        
        </TabPanel>
        <TabPanel value="2">
         
        {successMessageAdd2 && (
              <div className="success-blinking-text">{successMessageAdd2}</div>
            )}
                                         <form  onSubmit={handleSubmitAdd2} >
                                      <input className='select-element'
                                        type="text"
                                        value={nameother}
                                        name="nameother"
                                        onChange={(e) => setNameOther(e.target.value)}
                                        placeholder="Enter the name"
                                  
                                        required
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
                                      
                                        required
                                      />
                                        &nbsp;
                                      <input className='select-element'
                                        type="emailother"
                                        value={emailother}
                                        name="emailother"
                                        onChange={(e) => setEmailOther(e.target.value)}
                                        placeholder="Enter the  email"
                                      
                                        required
                                      />
                                       <button  onClick={() =>handleUpdateCustomerContact(idCustomerContact)}  className='add-button' >
                                   Update
                                      </button>
                                    <button  className='submit-button' >Submit</button>


                                        <br/><br/>

                                      <div className="styled-table">
                                          <div className="table-row header">
                                            <div className="table-cell" style={{width:'5%'}}>No.</div>
                                            <div className="table-cell">Name</div>
                                            <div className="table-cell">Phone</div>
                                            <div className="table-cell">Email</div>
                                            <div className="table-cell">Action</div>
                                          </div>
                                          {rowsContact && rowsContact.length > 0 ? (
    rowsContact.map((row, index) => (
      <div className="table-row" key={row.id}>
        <div className="table-cell">{index + 1}</div>
        <div className="table-cell">{row.customer_contact_name}</div>
        <div className="table-cell">{row.phone}</div>
        <div className="table-cell">{row.email}</div>
        <button onClick={() => handleEditCustomerContact(row.id)}>EDIT</button>
        {/* Add more cells as needed based on your data */}
      </div>
    ))
  ) : (
    <div>No contacts available.</div>
  )}
                                  
                                        </div>
                                      </form>
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
        <Box className='modals' ref={modalRef}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h3>Delete {mainCardTitle} - {deletingVendorName}</h3>
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
    <Box sx={{ width: 1}} >
  <Box sx={{ height: 550 }}>
    
    <DataGrid
      className='tablefont'
      columns={columns}
    
      rows={rows}
      components={{
        Toolbar: GridToolbar,
      }}
      filterModel={filterModel}
      onFilterModelChange={(newModel) => setFilterModel(newModel)}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) =>
        setColumnVisibilityModel(newModel)
      }
      showCellRightBorder // Show right borders for cells
      showCellBottomBorder // Show bottom borders for cells
    />
  </Box>
</Box>
      </Typography>
    </MainCard>
  );
};
export default Customer;