import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, Modal, Grid,InputLabel,OutlinedInput, Stack
} from '@mui/material';

import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';

import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';
import VirtualizedSelect from 'react-virtualized-select';
import '../../assets/additional-css/react-select.css';



const DirectSelling = () => {
  const mainCardTitle = "Direct Selling";
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
  const [enableeditallowcustomer, setEnableEditAllowCustomer] = useState('');
  const modalRef = useRef(null);
  const [successMessageAdd, setSuccessMessageAdd] = useState('');
  const [successMessageEdit, setSuccessMessageEdit] = useState('');
  const [successMessageDelete, setSuccessMessageDelete] = useState('');

  const [switchValueEdit, setSwitchValueEdit] = useState(true);
  const [switchValueAllowCustomer, setSwitchValueAllowCustomer] = useState(false);
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
  
    Navigate('/DirectSellingAdd')  
  setSwitchValueEdit(enableeditallowcustomer === '2'); 
  }
  const handleCloseAdd = () => setOpenAdd(false);
  const handleCloseEdit = () => setOpenEdit(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingVendorName, setDeletingVendorName] = useState('');
  const [selectedOptionPayment, setSelectedOptionPayment] = useState(null);
  const [paymentOption, setPaymentOption] = useState(null);
  const [selectedOptionVendor, setSelectedOptionVendor] = useState(null);
  const [vendorOption, setVendorOption] = useState(null);
  const [purchaseorderno, setPurchaseOrderNo] = useState(null);
  const [purchasedate, setPurchaseDate] = useState(new Date());
  const [qty, setQty] = useState('');
  const [selectedOptionProductName, setSelectedOptionProductName] = useState(null);
  const [productNameOption, setProductNameOption] = useState(null);



//  GET DATA TO MODAL 
const handleOpenEdit = async (id) => {


    Navigate(`/DirectSellingEdit/${id}`);

  


  
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


  // for combobox
  useEffect(() => {
    // Fetch category data
    axios.get(`${apiUrl}/api/getCustomer`)
      .then((response) => {
        const transformedOptions = response.data.map((item) => ({
          label: `${item.customer_name}`,
          value: item.id,
        }));
        setVendorOption(transformedOptions);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
      });
    }, []);
    
  // for combobox
  useEffect(() => {
    // Fetch category data
    axios.get(`${apiUrl}/api/getTermPay`)
      .then((response) => {
        const transformedOptions = response.data.map((item) => ({
          label: `${item.termpay_name} - ${item.days} Days`,
          value: item.id,
        }));
        setPaymentOption(transformedOptions);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
      });
    }, []);

      // for combobox
  useEffect(() => {
    // Fetch category data
    axios.get(`${apiUrl}/api/getProductStockAll`)
      .then((response) => {
        const transformedOptions = response.data.map((item) => ({
          label: `(${item.product_code}) ${item.product_name} - ${item.start_price}`,
          value: item.id,
        }));
        setProductNameOption(transformedOptions);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
      });
    }, []);


//SHOWING RECORD LIST
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getDirectSelling`, {
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
  { field: 'selling_code', headerName: 'Selling Code', width: 150 },
  { field: 'selling_date', headerName: 'Selling Date', width: 250 },
  { field: 'customer_name', headerName: 'Customer Name', width: 200 },

  { 
    field: 'grand_total', 
    headerName: 'Grand Total', 
    width: 200,
    valueFormatter: (params) => {

      // return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params.value);
      return new Intl.NumberFormat({ style: 'currency' }).format(params.value);
    },
  },


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
  const handleChangeAllowCustomer = (event) => {
    setSwitchValueAllowCustomer(event.target.checked);
    // Send different values based on the switch state
    if (event.target.checked) {
  
      setEnableEditAllowCustomer('1');
    } else {
  
      setEnableEditAllowCustomer('2');
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault(); 
    try {
      const formData = {
        vendor_name: vendorname,
        address: address,
        phone: phone,
        email: email,
        contact: contact,
        notes: notes,
        allow_to_customer:enableeditallowcustomer,
        user_created:uid,
    
      };
  
      // Make POST request to add new vendor data
      await axios.post(`${apiUrl}/api/registerVendor`, formData);
    
      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/api/getVendor`, {
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
      setVendorName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setContact('');
      setNotes('');
      setSuccessMessageAdd('Data submitted successfully');
      setSwitchValueAllowCustomer(false);
      Navigate('/Vendor'); 
    } catch (error) {
      console.error('Error submitting data:', error);
      setSuccessMessageAdd('Data already submitted');
    }
  };
  


  const handleSubmitEdit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = {
        vendor_name: vendornameedit,
        address: addressedit,
        phone: phoneedit,
        email: emailedit,
        contact: contactedit,
        notes: notesedit,
        enable: enableedit,
        allow_to_customer:enableeditallowcustomer,
        user_updated:uid,
      };
  
      // Make PATCH request to update vendor data
      await axios.patch(`${apiUrl}/api/updateVendor/${editingId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/api/getVendor`, {
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
     setEnableEditAllowCustomer('')
      setSuccessMessageEdit('Data updated successfully');
       Navigate('/Vendor');
      setOpenEdit(false); // Close the edit modal after successful update
    } catch (error) {
      console.error('Error updating  data:', error);
      setSuccessMessageEdit('Error updating  data');
    }
  };


  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`${apiUrl}/api/deleteDirectSelling/${deletingId}`, {
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
      const response = await axios.get(`${apiUrl}/api/getVendorById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming the response.data contains the details of the vendor
      setDeletingVendorName(response.data.vendor_name);
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
                <div className="container-form">
                <div className="column-form">
                  <InputLabel >Vendor Name</InputLabel>
                  <VirtualizedSelect 
                      options={vendorOption}
                      onChange={(option) => setSelectedOptionVendor(option)}
                      value={selectedOptionVendor}
                      required
                    />
                  </div>
                  <div className="column-form">
                  <InputLabel >No. Purchase Order</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={purchaseorderno}
                    name="address"
            
                    onChange={(e) => setPurchaseOrderNo(e.target.value)}
                    placeholder="Enter the purchase No."
                    fullWidth
                    required
                 
                  />
                   <InputLabel >Purchase Date</InputLabel>
                    <DatePicker 
                  
                      showIcon
                      selected={purchasedate}
                      onChange={(date) => setPurchaseDate(date)}
                      dateFormat="yyyy-MM-dd"
                    />

                     <InputLabel >Payment</InputLabel>
                     <VirtualizedSelect 
                      options={paymentOption}
                      onChange={(option) => setSelectedOptionPayment(option)}
                      value={selectedOptionPayment}
                      required
                    />
                       </div>  </div>



                       <div className="column-form">

                       <InputLabel >Product</InputLabel>
                     <VirtualizedSelect 
                      options={productNameOption}
                      onChange={(option) => setSelectedOptionProductName(option)}
                      value={selectedOptionProductName}
                      required
                    />
                        <InputLabel >Qty</InputLabel>
                        <OutlinedInput
                   
                    type="text"
                    value={qty}
                    name="qty"
            
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="Enter the qty"
                    fullWidth
                    required
                 
                  />



                        </div>

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
                  <InputLabel >Allow to Customer</InputLabel>
                   <FormControlLabel
                control={
                  <Switch 
                     name="enableeditallowcustomer"
                    checked={switchValueAllowCustomer}
                    onChange={handleChangeAllowCustomer}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={switchValueAllowCustomer  ? 'Yes' : 'No'}
                 />
                </Stack>
                <br></br>
                <div className="wrapper-submit-btn">
                <button  className='submit-button' type="submit" >
                Submit
                  </button></div>
             
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

export default DirectSelling;
