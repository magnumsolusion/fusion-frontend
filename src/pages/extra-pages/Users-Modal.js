import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, Modal, Box, Button, FormControlLabel,Grid,InputLabel,OutlinedInput,Stack,Switch 
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import '../../assets/additional-css/styles.css';



const Users = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [email, setEmail] = useState('');

  const Navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterExcludeHiddenColumns: true,
    quickFilterValues: [''],
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  
  

 


  useEffect(() => {
    refreshToken();
  
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${apiUrl}/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      Navigate('/');
    }
  };

//show table project
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/getarea`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add your token if needed
        },
      });
      setRows(response.data); // Update rows with project data

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
{ field: 'rowNumber', headerName: 'No.', width: 80 },
{ field: 'area_name', headerName: 'Area Name', width: 150 },



{
  field: 'actions',
  headerName: 'Actions',
  width: 150,
  renderCell: (params) => (
    <>
       <button
        onClick={() => handleEdit(params.row.id)} // Pass the project ID to the edit function
        className="btn btn-primary mr-2"
      >
        Edit
      </button>
    <button
      onClick={() => handleDelete(params.row.id)} // this delete button
      className="btn btn-danger"
    >
      Delete
    </button>


    </>
    
  ),


  
},



];

  const handleEdit = (id) => {
    // Handle edit action using the id
    console.log('Edit clicked for ID:', id);
  };

  const handleDelete = (id) => {
    // Handle delete action using the id
    console.log('Delete clicked for ID:', id);
  };

  return (
    
    <MainCard title="Users Data">




      <Typography variant="body2">
        {name}{expire}
        <AnimateButton>
        <Button className='btn btn-primary' onClick={handleOpen}>Open modal</Button>
        </AnimateButton>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modals'>
          <Typography id="modal-modal-title" variant="h6" component="h2">
           <h3>Add Data</h3>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          
          <form noValidate >
            
               <br></br>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Area Name</InputLabel>
                  <OutlinedInput
                    id="area_name"
                    type="text"
                    value={email}
                    name="area_name"
            
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Area Name"
                    fullWidth
                    required
                 
                  />
                 
                </Stack>
                <br></br>
                <button  className='submit-button' type="submit" >
                Submit
                  </button>
              </Grid>
             
               
          
  
         
        

     
       
              
            </Grid>
          </form>





          </Typography>
        </Box>
      </Modal>


        <Box sx={{ width: 1 }}>
          <FormControlLabel
            checked={columnVisibilityModel.id !== false}
            onChange={(event) =>
              setColumnVisibilityModel(() => ({ id: event.target.checked }))
            }
            control={<Switch color="primary" size="small" />}
            label="Show ID column"
          />
          <FormControlLabel
            checked={filterModel.quickFilterExcludeHiddenColumns}
            onChange={(event) =>
              setFilterModel((model) => ({
                ...model,
                quickFilterExcludeHiddenColumns: event.target.checked,
              }))
            }
            control={<Switch color="primary" size="small" />}
            label="Exclude hidden columns"
          />
          <Box sx={{ height: 550 }}>
            <DataGrid
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
            />
          </Box>
        </Box>
      </Typography>
    </MainCard>
  );
};

export default Users;
