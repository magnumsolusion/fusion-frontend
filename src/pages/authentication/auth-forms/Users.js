import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { apiUrl } from '../../../config/UrlParam';
import MainCard from 'components/MainCard';

const Users = () => {
  const [name, setName] = useState('');
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
      Navigate('/login');
    }
  };

 
    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(
      async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
          try {
            const response = await axiosJWT.get(`${apiUrl}/token`);
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
          } catch (error) {
            // Handle token refresh error, e.g., log it or show an error message
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getArea`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rowsWithRowNumbers = response.data.map((row, index) => ({
          ...row,
          id: index + 1,
        }));

        setRows(rowsWithRowNumbers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, Navigate]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'area_name', headerName: 'Area Name', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <button
            onClick={() => handleEdit(params.row.id)}
            className="btn btn-primary mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(params.row.id)}
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
        {name}
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
              checkboxSelection
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
