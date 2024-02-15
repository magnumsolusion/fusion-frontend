import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, Modal
} from '@mui/material';

import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';



const Roles = () => {
  const mainCardTitle = "Roles";
  //for add
  
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [unitsname, setUnitsName] = useState('');
  const[idProductCategory, setIdProductCategory] = useState(null);
  const [rowsUnits, setRowsUnits] = useState([]);
  const [successMessageAdd, setSuccessMessageAdd] = useState('');
  const [successMessageAdd2, setSuccessMessageAdd2] = useState('');
  const [successMessageUpdate2, setSuccessMessageUpdate2] = useState('');
  const [successMessageEdit, setSuccessMessageEdit] = useState('');
  const [successMessageDelete, setSuccessMessageDelete] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [ErrorMessageAdd2, setErrorMessageAdd2] = useState(false);
  const [deletingunitsname, setDeletingUnitsName] = useState('');
 const  [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
 const Navigate = useNavigate();
  const modalRef = useRef(null);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
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
      const response = await axios.get(`${apiUrl}/api/getRoles`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add your token if needed
        },
      });
      setRowsUnits(response.data); 
 // Add row numbers to the rows
 const rowsWithRowNumbers = response.data.map((row, index) => ({
  ...row,
  rowNumber: index + 1, 
}));

setRowsUnits(rowsWithRowNumbers);
    
    } catch (error) {
      console.error('Error fetching  data:', error);
    }
  };

  fetchData(); // Call the function to fetch data when the component mounts
}, [token, rowsUnits]); // Add token as a dependency if it's required


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
const handleUpdateProductCategory = async (idProductCategory) => {
  try {
  
    const formData = {
        roles_name: unitsname,
    //   user_updated:uid,
    };

    // Make PATCH request to update vendor data
    const response = await axios.patch(`${apiUrl}/api/updateRoles/${idProductCategory}`,formData ,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
   console.log(response.data);
   setUnitsName('')
   setUpdating(false);
   setSuccessMessageUpdate2('Data Updated successfully')
  } catch (error) {
    console.error('Error fetching data details:', error);
    // Handle errors or show a message to the user
  }
};
const handleUpdateProductCategoryCancel = async () => {
  setUnitsName('')
  setUpdating(false);

};



const handleEditProductCategory = async (id) => {
  try {
    // Make PATCH request to update vendor data
    const response = await axios.get(`${apiUrl}/api/getRolesById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

   console.log(response.data);
   setUnitsName(response.data.roles_name)

   setIdProductCategory(response.data.roles_id)
   setUpdating(true);
   modalRef.current.scrollTo(0, 0);
 
  } catch (error) {
    console.error('Error fetching data details:', error);
    // Handle errors or show a message to the user
  }
};


  const handleDeleteConfirmation = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/api/deleteRoles/${deletingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted vendor from the local state (rows)
      setRowsUnits((prevRows) => prevRows.filter((row) => row.id !== deletingId));
      setDeletingUnitsName(response.data.roles_name);
      setSuccessMessageDelete('Data deleted successfully');
      setConfirmDeleteOpen(false); // Close the confirmation modal after successful deletion
    } catch (error) {
      console.error('Error deleting data:', error);
      setSuccessMessageDelete('Error deleting data');
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

 
 
  const columns = [
    { field: 'rowNumber', headerName: 'No.', width: 50 },
    { field: 'roles_name', headerName: 'Name', width: 250 },

  
  {
    field: 'actions',
    headerName: 'Actions',
    width: 230,
    renderCell: (params) => (
      <>
       <button className='edit-button' type='button' onClick={() => handleEditProductCategory(params.row.roles_id)}>Edit</button>&nbsp;
       <button type='button'
              onClick={() => {
                setDeletingId(params.row.roles_id);
                setConfirmDeleteOpen(true);
              }}
              className="delete-button"
            >
      Delete
    </button>   
  
  
      </>
      
    ),
  
  
    
  },
  
  
  
  ];
 
 
 
 
 
 
 
 
 
 
 
 
 
  return (
    
    <MainCard  title={mainCardTitle} className='boxy'>
      <Typography variant="body2">
        {name}{expire} - {uid}  <br/>
      
         <br/><br/>
  

    

{/* { DELETE CONFIRM MODAL} */}

<Modal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modals' ref={modalRef}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h3>Delete {mainCardTitle} - {deletingunitsname}</h3>
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


    {successMessageAdd2 && (
              <div className="success-blinking-text">{successMessageAdd2}</div>
            )}     
             {successMessageUpdate2 && (
              <div className="success-blinking-text">{successMessageUpdate2}</div>
            )}   
   {ErrorMessageAdd2 && (
              <div className="success-blinking-text">{ErrorMessageAdd2}</div>
            )}   

<div className="wrapper-add-btn"  ref={modalRef}>
             {updating? (
    <>
        <button type='button' onClick={() => handleUpdateProductCategory(idProductCategory)} className='add-button'>
         Update
        </button>&nbsp;
         <button type='button' onClick={handleUpdateProductCategoryCancel} className='cancel-button'>
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
                                        value={unitsname}
                                        name="unitsname"
                                        onChange={(e) => setUnitsName(e.target.value)}
                                        placeholder="Enter the name"
                                  
                                        required
                                      />    
                            
         
                                        <br/><br/>
                                  
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
          rows={rowsUnits}
          EnableColumnRightBorder 
          EnableColumnFilter
          EnableDensitySelector
          slots={{ toolbar: GridToolbar }}
          filterModel={filterModel}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          getRowId={(row) => row.roles_id}
        />
      </Box>
    </Box>                    

 
                                      </form>

      </Typography>
    </MainCard>
  );
};

export default Roles;
