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
import VirtualizedSelect from 'react-virtualized-select';
import '../../assets/additional-css/react-select.css';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';



const Product = () => {
// for tabs
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [value2, setValue2] = React.useState('3');
  const handleChange2 = (event: React.SyntheticEvent, newValue2: string) => {
    setValue2(newValue2);
  };


  const mainCardTitle = "Product";
  //for add
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');



  const [productname, setProductName] = useState('');
  const [code, setCode] = useState('');
  const [selectedOptionCategory, setSelectedOptionCategory] = useState(null);
  const [categoryOption, setCategoryOption] = useState(null);

  const [selectedOptionVendor, setSelectedOptionVendor] = useState(null);
  const [vendorOption, setVendorOption] = useState(null);
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('1');

  const [unitOption, setUnitOption] = useState(null);
  const [selectedOptionUnit, setSelectedOptionUnit] = useState(null);

  
  const [startstock, setStartStock] = useState('');
  const [endstock, setEndStock] = useState('');
  const [maxstock, setMaxStock] = useState('');
  const [minstock, setMinStock] = useState('');
  const [startprice, setStartPrice] = useState('');

  const [lastbuyprice, setLastBuyPrice] = useState('');
  //for edit
  const [vendornameedit, setVendorNameEdit] = useState('');
  const [enableedit1, setEnableEdit1] = useState('2');
  const [enableedit2, setEnableEdit2] = useState('2');
  const [enableedit3, setEnableEdit3] = useState('2');
  const modalRef = useRef(null);
  const [successMessageAdd, setSuccessMessageAdd] = useState('');
  const [successMessageAdd2, setSuccessMessageAdd2] = useState('');
  const [successMessageUpdate2, setSuccessMessageUpdate2] = useState('');
  const [successMessageEdit, setSuccessMessageEdit] = useState('');
  const [successMessageDelete, setSuccessMessageDelete] = useState('');
  //for other contact
  const [switchValueEdit1, setSwitchValueEdit1] = useState(true);
  const [switchValueEdit2, setSwitchValueEdit2] = useState(true);
  const [switchValueEdit3, setSwitchValueEdit3] = useState(true);
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
  const [showForm, setShowForm] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [serialnumber, setSerialNumber] = useState('');
  const [lastbuydate, setLastBuyDate] = useState(new Date());


  const handleOpenAdd = () => { 
    setOpenAdd(true);
    setValue2('3');
     setProductName('');
      setCode('');
      setType('');
      setSelectedOptionCategory('');
      setSelectedOptionVendor('');
      setDesc('');  
      setEditingId('');
      setSerialNumber('');
      setSwitchValueEdit1(false); 
      setSwitchValueEdit2(false); 
      setSwitchValueEdit3(false); 
      setVendorNameEdit('');
  }
  
  const handleShowForm = () => {
    setShowForm(true);
    setShowButton(true);
  };
  const handleHideForm = () => {
    setShowForm(false);
    setShowButton(false);
    setUpdating(false);
  };


  const handleChangeEdit1 = (event) => {
    setSwitchValueEdit1(event.target.checked);
    
    // Send different values based on the switch state
    if (event.target.checked) {
  
      setEnableEdit1('1');
    } else {
  
      setEnableEdit1('2');
    }
  };
  const handleChangeEdit2 = (event) => {
    setSwitchValueEdit2(event.target.checked);
    // Send different values based on the switch state
    if (event.target.checked) {
  
      setEnableEdit2('1');
    } else {
  
      setEnableEdit2('2');
    }
  };
  const handleChangeEdit3 = (event) => {
    setSwitchValueEdit3(event.target.checked);
    // Send different values based on the switch state
    if (event.target.checked) {
  
      setEnableEdit3('1');
    } else {
  
      setEnableEdit3('2');
    }
  };

   
  // for combobox
  useEffect(() => {
    // Fetch category data
    axios.get(`${apiUrl}/api/getProductCategory`)
      .then((response) => {
        const transformedOptions = response.data.map((item) => ({
          label: item.product_category_name,
          value: item.id,
        }));
        setCategoryOption(transformedOptions);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
      });

    // Fetch vendor data
    axios.get(`${apiUrl}/api/getVendor`)
      .then((response) => {
        const transformedOptions = response.data.map((item) => ({
          label: item.vendor_name,
          value: item.id,
        }));
        setVendorOption(transformedOptions);
      })
      .catch((error) => {
        console.error('Error fetching vendor data:', error);
      });

          // Fetch vendor data
    axios.get(`${apiUrl}/api/getUnits`)
    .then((response) => {
      const transformedOptions = response.data.map((item) => ({
        label: item.units_name,
        value: item.id,
      }));
      setUnitOption(transformedOptions);
    })
    .catch((error) => {
      console.error('Error fetching vendor data:', error);
    });
  }, []); // Empty dependency array to run this effect only once on component mount








//  GET DATA TO MODAL 
const handleOpenEdit = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/api/getProductById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Assuming the response.data contains the details of the vendor
    const { product_name, product_code, type, category_id, vendor_id, descriptions, serial_number } = response.data;

    // Set the state with the fetched data
    setProductName(product_name);
    setSerialNumber(serial_number);
    setCode(product_code);
    setType(type);
    setSelectedOptionCategory(category_id);
    setSelectedOptionVendor(vendor_id);
    setDesc(descriptions);
    setOpenEdit(true);
    setEditingId(id);
    setSwitchValueEdit1(false); 
    setSwitchValueEdit2(false); 
    setSwitchValueEdit3(false); 
    setValue('1')
    setShowForm(false);
    setShowButton(false);
    setUpdating(false);
    setVendorNameEdit(product_name);
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
      const response = await axios.get(`${apiUrl}/api/getProduct`, {
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
        const response = await axios.get(`${apiUrl}/api/getProductStock/${editingId}`, {
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
}, [token, rowsContact,  editingId]);
//for table
const columns = [
  { field: 'rowNumber', headerName: 'No.', width: 50 },
  { field: 'product_name', headerName: 'Name', width: 150 },
  { field: 'product_code', headerName: 'Code', width: 150 },
  { field: 'serial_number', headerName: 'Serial Number', width: 150 },
  
   { field: 'type',
     headerName: 'Type',
     width: 200,
     renderCell: (params) => {
      let typeText = '';
      if(params.row.type === '1') {
          typeText = 'Single';
      } else { 
      if(params.row.type === '2') {
          typeText = 'Bundle';
      }else { 
      if(params.row.type === '3') {
          typeText = 'Services';
 
            }}}
            
      return <span>{typeText}</span>;
      }
    },



  { field: 'product_category_name', headerName: 'Category', width: 200},
  { field: 'vendor_name', headerName: 'Vendor', width: 150},


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
  { field: 'product_name', headerName: 'Product Name', width: 150 },
  { field: 'units_name', headerName: 'Unit', width: 200 },
  { field: 'start_stock', headerName: 'Start Stock', width: 200},
  { field: 'end_stock', headerName: 'End Stock', width: 200},
  { field: 'max_stock', headerName: 'Max Stock', width: 200},
  { field: 'min_stock', headerName: 'Min Stock', width: 200},
  { field: 'start_price', headerName: 'Start Price', width: 200},
  { field: 'last_buy_date', headerName: 'Last Buy Date', width: 200},
  { field: 'last_buy_price', headerName: 'Last Buy Price', width: 200},


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
  
  //for Customer
  const handleSubmitAdd = async (e) => {
    e.preventDefault(); 
    try {
      const formData = {
        product_name: productname,
        product_code: code,
        serial_number: serialnumber,
        type: type,
        category_id: selectedOptionCategory.value,
        vendor_id: selectedOptionVendor.value,
        descriptions: desc,
        user_created:uid,
      };
      // Make POST request to add new vendor data
      const res = await axios.post(`${apiUrl}/api/registerProduct`, formData);

      const NewId = res.data.productId;
      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/api/getProduct`, {
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

      setSuccessMessageAdd('Data submitted successfully');
       setValue2('4');
      Navigate('/Product'); 

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
    if (selectedOptionUnit === '' || startstock === '' ||  maxstock === '' || minstock === '' || startprice === '' || lastbuydate === '') {
      setErrorMessageAdd2('Please fill in all fields');
      return; 
    }
    if (!switchValueEdit1) {
      setEnableEdit1('2'); // Default value when switch is unchecked
    }
    if (!switchValueEdit2) {
      setEnableEdit2('2'); // Default value when switch is unchecked
    }
    if (!switchValueEdit3) {
      setEnableEdit3('2'); // Default value when switch is unchecked
    }

    try {
      const formData = {
        product_id: editingId ? editingId : null,
        unit_id: selectedOptionUnit.value,
        start_stock: startstock,
        end_stock: startstock,
        max_stock: maxstock,
        min_stock: minstock,
        start_price: startprice,
        last_buy_date: lastbuydate,
        last_buy_price: startprice,
        enable:enableedit1,
        allow_buy:enableedit2,
        allow_sell:enableedit3,
      };
      const response = await axios.post(`${apiUrl}/api/registerProductStock`,formData ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     console.log(response.data);
     setSelectedOptionUnit('')
     setStartStock('')
     setEndStock('')
     setMaxStock('')
     setMinStock('')
     setStartPrice('')

     setLastBuyPrice('')
     setSuccessMessageAdd2('Data submitted successfully');
    } catch (error) {
      console.error('Error fetching data details:', error);

    }
  };
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        product_name: productname,
        product_code: code,
        type: type,
        category_id: selectedOptionCategory.value,
        vendor_id: selectedOptionVendor.value,
        descriptions: desc,
        serialnumber: serialnumber,
        user_updated:uid,
      };
      // Make PATCH request to update vendor data
      await axios.patch(`${apiUrl}/api/updateProduct/${editingId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/api/getProduct`, {
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
      Navigate('/Product');
      setOpenEdit(false); // Close the edit modal after successful update
    } catch (error) {
      console.error('Error updating  data:', error);
      setSuccessMessageEdit('Error updating  data');
    }
  };
  const handleEditCustomerContact = async (id) => {
    try {
      // Make PATCH request to update vendor data
      const response = await axios.get(`${apiUrl}/api/getProductStockById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { unit_id, start_stock, end_stock, start_price, last_buy_date, max_stock, min_stock, last_buy_price, enable, allow_buy, allow_sell } = response.data;
     console.log(response.data);
     setShowForm(true);
     setShowButton(true);
     setSelectedOptionUnit(unit_id)
     setStartStock(start_stock)
     setEndStock(end_stock)
     setStartPrice(start_price)
     setLastBuyDate(new Date(last_buy_date))
     setMaxStock(max_stock)
     setMinStock(min_stock)
     setLastBuyPrice(last_buy_price)
     
      
     
    // For enableEdit1 based on enable
     if (enable === '1') {
      setEnableEdit1('1');
      setSwitchValueEdit1(true);
    } else if (enable === '2') {
      setEnableEdit1('2');
      setSwitchValueEdit1(false);
    }
    
    // For enableEdit2 based on allow_buy
    if (allow_buy === '1') {
      setEnableEdit2('1');
      setSwitchValueEdit2(true);
    } else if (allow_buy === '2') {
      setEnableEdit2('2');
      setSwitchValueEdit2(false);
    }

    // For enableEdit3 based on allow_sell
    if (allow_sell === '1') {
      setEnableEdit3('1');
      setSwitchValueEdit3(true);
    } else if (allow_sell === '2') {
      setEnableEdit3('2');
      setSwitchValueEdit3(false);
    }
    
     setUpdating(true)
     setIdCustomerContact(response.data.id)

   

     return response.data;
    } catch (error) {
      console.error('Error fetching data details:', error);
      // Handle errors or show a message to the user
    }
  };

  


  
  const handleUpdateCustomerContactCancel = async () => {
    setSelectedOptionUnit('')
    setStartStock('')
    setEndStock('')
    setMaxStock('')
    setMinStock('')
    setStartPrice('')
 
    setLastBuyPrice('')
    setEnableEdit1('2')
    setEnableEdit2('2')
    setEnableEdit3('2')
    setSwitchValueEdit1(false); 
    setSwitchValueEdit2(false); 
    setSwitchValueEdit3(false); 
    setUpdating(false);
  
  };
  const handleUpdateCustomerContact = async (idCustomerContact) => {
    try {
    
      const formData = {
        product_id:editingId,
        unit_id:selectedOptionUnit.value,
        start_stock: startstock,
        end_stock: endstock,
        max_stock: maxstock,
        min_stock: minstock,
        start_price: startprice,
        last_buy_date: lastbuydate,
        last_buy_price:lastbuyprice,
        enable: enableedit1,
        allow_buy:enableedit2,
        allow_sell:enableedit3,
        user_updated:uid,
      };
  
      // Make PATCH request to update vendor data
      const response = await axios.patch(`${apiUrl}/api/updateProductStock/${idCustomerContact}`,formData ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     console.log(response.data);
     setSelectedOptionUnit('')
     setStartStock('')
     setEndStock('')
     setMaxStock('')
     setMinStock('')
     setStartPrice('')

     setLastBuyPrice('')
     setEnableEdit1(false)
     setEnableEdit2(false)
     setEnableEdit3(false)
     setUpdating(false);
     setSuccessMessageUpdate2('Data Updated successfully')
    } catch (error) {
      console.error('Error fetching data details:', error);
      // Handle errors or show a message to the user
    }
  };
  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`${apiUrl}/api/deleteProduct/${deletingId}`, {
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
      await axios.delete(`${apiUrl}/api/deleteProductStock/${deletingId}`, {
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
      const response = await axios.get(`${apiUrl}/api/getProductById/${id}`, {
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
            <Tab label="Product" value="3" />
            <Tab label="Product Stock" value="4" />
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
                    value={productname}
                    name="name"
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter the Name"
                    fullWidth
                    required
                  />
                  <InputLabel >Code</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={code}
                    name="address"
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter the code"
                    fullWidth
                    required
                  />
         <InputLabel >Serial Number</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={serialnumber}
                    name="serialnumber"
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="Enter the serial number"
                    fullWidth
              
                  />
<InputLabel >Type</InputLabel>
              <select
              className='select-element'
               value={type}
               name="type"
               onChange={(e) => setType(e.target.value)}
               placeholder="Enter the type"
               required
              >
                 <option value="" selected></option>
                  <option value="1">Single</option>
                  <option value="2">Bundle</option>
                  <option value="3">Services</option>
      
                </select>
                  <InputLabel >Category</InputLabel>
                  <VirtualizedSelect 
                      options={categoryOption}
                      onChange={(option) => setSelectedOptionCategory(option)}
                      value={selectedOptionCategory}
                      required
                    />


              <InputLabel >Vendor</InputLabel>
                  <VirtualizedSelect 
                      options={vendorOption}
                      onChange={(option) => setSelectedOptionVendor(option)}
                      value={selectedOptionVendor}
                      required
                    />
               <InputLabel >Description</InputLabel>
               <OutlinedInput
                   
                   type="text"
                   value={desc}
                   name="desc"
                   onChange={(e) => setDesc(e.target.value)}
                   placeholder="Enter the description"
                   fullWidth
                   required
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

{showButton ? (
  <>
    <button className='cancel-button' onClick={handleHideForm}>Cancel</button>

    <div className="wrapper-add-btn">
      {updating ? (
        <>
          <button type='button' onClick={() => handleUpdateCustomerContact(idCustomerContact)} className='add-button'>
            Update
          </button>&nbsp;
          <button type='button' onClick={handleUpdateCustomerContactCancel} className='cancel-button'>
            Cancel Update
          </button>
        </>
      ) : (
        <button onClick={handleSubmitAdd2} className='add-button'>Add Data</button>
      )}
    </div>  
  </>
) : (
  <button className='add-button' onClick={handleShowForm}>Add</button>
)}




          {showForm && (
   <form onSubmit={handleSubmitAdd2 } >


 <div className="container-form">
  <div className="column-form">
  <InputLabel >Unit</InputLabel>   
     <VirtualizedSelect 
                       style={{width:'90%'}}
                      options={unitOption}
                      onChange={(option) => setSelectedOptionUnit(option)}
                      value={selectedOptionUnit}
                      required
                    />  
                                      <InputLabel >Start Stock</InputLabel>                                       
                                      <OutlinedInput
                                        type="text"
                                        value={startstock || 0}
                                        name="startstock"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setStartStock(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the start stock"
                                      
                                 
                                      />
                                    {/* <InputLabel >End Stock</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={endstock}
                                        name="endstock"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setEndStock(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the end stock"
                                      
                                 
                                      /> */}
                                          <InputLabel >Max Stock</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={maxstock || 0}
                                        name="maxstock"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setMaxStock(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the max stock"
                                      
                                 
                                      />
                                </div>
  <div className="column-form">
  <InputLabel >Min Stock</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={minstock || 0}
                                        name="minstock"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setMinStock(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the min stock"
                                      
                                 
                                      />
  <InputLabel >Start Price</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={startprice || 0}
                                        name="startprice"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setStartPrice(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the start price"
                                      
                                 
                                      />

                    <InputLabel >Last Buy Date</InputLabel>
                    <DatePicker 
                  
                      showIcon
                      selected={lastbuydate}
                      onChange={(date) => setLastBuyDate(date)}
                      dateFormat="yyyy-MM-dd"
                    />
                                        {/* <InputLabel >End Price</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={endprice}
                                        name="endprice"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setEndPrice(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the end price"
                                      
                                 
                                      /> */}
                                               {/* <InputLabel >Last Buy Price</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={lastbuyprice}
                                        name="lastbuyprice"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setLastBuyPrice(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the last buy price"
                                      
                                 
                                      /> */}


  </div>
  <div className="column-form">
    
  <InputLabel >Enable ?</InputLabel>
       <FormControlLabel
       control={
       <Switch 
       name={enableedit1}
         checked={switchValueEdit1}
         onChange={handleChangeEdit1}
         inputProps={{ 'aria-label': 'controlled' }}
       />
     }
     label={switchValueEdit1 ? 'Yes' : 'No'}
      />

<InputLabel >Allow Buy ?</InputLabel>
       <FormControlLabel
       control={
       <Switch 
        name={enableedit2}
         checked={switchValueEdit2}
         onChange={handleChangeEdit2}
         inputProps={{ 'aria-label': 'controlled' }}
       />
     }
     label={switchValueEdit2 ? 'Yes' : 'No'}
      />
    <InputLabel >Allow Sell ?</InputLabel>
       <FormControlLabel
       control={
       <Switch 
       name={enableedit3}
         checked={switchValueEdit3}
         onChange={handleChangeEdit3}
         inputProps={{ 'aria-label': 'controlled' }}
       />
     }
     label={switchValueEdit3 ? 'Yes' : 'No'}
      />
    
    </div>
</div>
 <br/><br/>
                                  
                              
                                      </form>
    )}
                                      <Box sx={{ width: 1 }} >
                                    
                                    
                                    <Box sx={{ height: 450  }} >
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
            <Tab label="Product" value="1" />
            <Tab label="Prodcut Stock" value="2" />
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
                    value={productname}
                    name="name"
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter the Name"
                    fullWidth
                    required
                  />
                  <InputLabel >Code</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={code}
                    name="address"
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter the code"
                    fullWidth
                    required
                  />
                   <InputLabel >Serial Number</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={serialnumber}
                    name="serialnumber"
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="Enter the serial number"
                    fullWidth
              
                  />

<InputLabel >Type</InputLabel>
              <select
              className='select-element'
               value={type}
               name="type"
               onChange={(e) => setType(e.target.value)}
               placeholder="Enter the type"
               required
              >
                 <option value="" selected></option>
                  <option value="1">Single</option>
                  <option value="2">Bundle</option>
                  <option value="3">Services</option>
      
                </select>
                  <InputLabel >Category</InputLabel>
                  <VirtualizedSelect 
                      options={categoryOption}
                      onChange={(option) => setSelectedOptionCategory(option)}
                      value={selectedOptionCategory}
                      required
                    />


              <InputLabel >Vendor</InputLabel>
                  <VirtualizedSelect 
                      options={vendorOption}
                      onChange={(option) => setSelectedOptionVendor(option)}
                      value={selectedOptionVendor}
                      required
                    />
               <InputLabel >Description</InputLabel>
               <OutlinedInput
                   
                   type="text"
                   value={desc}
                   name="desc"
                   onChange={(e) => setDesc(e.target.value)}
                   placeholder="Enter the description"
                   fullWidth
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

{showButton ? (
  <>
    <button className='cancel-button' onClick={handleHideForm}>Cancel</button>

    <div className="wrapper-add-btn">
      {updating ? (
        <>
          <button type='button' onClick={() => handleUpdateCustomerContact(idCustomerContact)} className='add-button'>
            Update
          </button>&nbsp;
          <button type='button' onClick={handleUpdateCustomerContactCancel} className='cancel-button'>
            Cancel Update
          </button>
        </>
      ) : (
        <button onClick={handleSubmitAdd2} className='add-button'>Add Data</button>
      )}
    </div>  
  </>
) : (
  <button className='add-button' onClick={handleShowForm}>Add</button>
)}
            
           {showForm && (  
                                         <form onSubmit={handleSubmitAdd2 } >
                                 
 <div className="container-form">
  <div className="column-form">
  <InputLabel >Unit</InputLabel>   
     <VirtualizedSelect 
                       style={{width:'90%'}}
                      options={unitOption}
                      onChange={(option) => setSelectedOptionUnit(option)}
                      value={selectedOptionUnit}
                      required
                    />  
                                      <InputLabel >Start Stock</InputLabel>                                       
                                      <OutlinedInput
                                        type="text"
                                        value={startstock}
                                        name="startstock"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setStartStock(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the start stock"
                                      
                                 
                                      />
                                    <InputLabel >End Stock</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={endstock}
                                        name="endstock"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setEndStock(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the end stock"
                                      
                                 
                                      />
                                          <InputLabel >Max Stock</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={maxstock}
                                        name="maxstock"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setMaxStock(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the max stock"
                                      
                                 
                                      />
                                </div>
  <div className="column-form">
  <InputLabel >Min Stock</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={minstock}
                                        name="minstock"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setMinStock(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the max stock"
                                      
                                 
                                      />
  <InputLabel >Start Price</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={startprice}
                                        name="startprice"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setStartPrice(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the start price"
                                      
                                 
                                      />
                                        <InputLabel >Last Buy Date</InputLabel>      
                                        <DatePicker 
                  
                                        showIcon
                                        selected={lastbuydate}
                                        onChange={(date) => setLastBuyDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                      />
                                               <InputLabel >Last Buy Price</InputLabel>      
                                    <OutlinedInput
                                        type="text"
                                        value={lastbuyprice}
                                        name="lastbuyprice"
                                        onChange={(e) => {
                                          const enteredValue = e.target.value;
                                          const numericRegex = /^[0-9]*$/;
                                          if (numericRegex.test(enteredValue) || enteredValue === '') {
                                            setLastBuyPrice(Number(enteredValue)); 
                                          }
                                        }}
                                        placeholder="Enter the last buy price"
                                      
                                 
                                      />


  </div>
  <div className="column-form">
    
  <InputLabel >Enable ?</InputLabel>
       <FormControlLabel
       control={
       <Switch 
       name={enableedit1}
       value={enableedit1}
         checked={switchValueEdit1}
         onChange={handleChangeEdit1}
         inputProps={{ 'aria-label': 'controlled' }}
       />
     }
     label={switchValueEdit1 ? 'Yes' : 'No'}
      />

<InputLabel >Allow Buy ?</InputLabel>
       <FormControlLabel
       control={
       <Switch 
        name={enableedit2}
        value={enableedit2}
         checked={switchValueEdit2}
         onChange={handleChangeEdit2}
         inputProps={{ 'aria-label': 'controlled' }}
       />
     }
     label={switchValueEdit2 ? 'Yes' : 'No'}
      />
    <InputLabel >Allow Sell ?</InputLabel>
       <FormControlLabel
       control={
       <Switch 
       name={enableedit3}
       value={enableedit3}
         checked={switchValueEdit3}
         onChange={handleChangeEdit3}
         inputProps={{ 'aria-label': 'controlled' }}
       />
     }
     label={switchValueEdit3 ? 'Yes' : 'No'}
      />
    
    </div>
</div>


         
                                        <br/><br/>
                                  
                                       
                                      <br></br>
                                 
                                      </form>
                              )}
                                      <Box sx={{ width: 1 }} >
                                    
                                    
                                    <Box sx={{ height: 450 }} >
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
export default Product;