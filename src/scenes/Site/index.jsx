import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions,TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { Snackbar } from '@mui/material';


const Site = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSite, setSelectedSite] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedSite, setEditedSite] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');



  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'site_name',
      headerName: 'Site Name',
    },
    {
      field: 'owner_name',
      headerName: 'Owner Name',
    },
    {
      field: 'owner_email',
      headerName: 'Owner Email',
      flex: 1,
    },
    {
      field: 'state',
      headerName: 'State',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="space-around">
            <Button variant="contained" color="primary" onClick={() => handleEdit(row)}>
              Edit
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleView(row)}>
              View
            </Button>
            <Button variant="contained" color="error" onClick={() => handleDelete(row)}>
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    // Fetch data from the backend
    fetch('/admin/getSites/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          // Map the backend data to include an 'id' property
          const sitesWithIds = data.data.map((site, index) => ({
            id: index + 1,
            site_name: site.site_name,
            owner_name: site.owner_detail?.name || 'N/A', // Add a default value or check for existence
            owner_email: site.owner_detail?.email || 'N/A', // Add a default value or check for existence
            state: site.address?.state || 'N/A', // Add a default value or check for existence
            ...site
          }));
          setSites(sitesWithIds);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (site) => {
    setEditedSite(site);
    setIsEditModalOpen(true);
  };
  

  const handleView = (site) => {
    // Show details of the selected site
    setSelectedSite(site);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (site) => {
    // Show a confirmation dialog to confirm the delete action
    const confirmDelete = window.confirm(`Are you sure you want to delete ${site.site_name}?`);
    if (confirmDelete) {
      // Send a DELETE request to the backend to delete the site
      fetch(`/admin/deleteSite/${site._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            // If the site is successfully deleted, remove the site from the local state
            const updatedSites = sites.filter((s) => s._id !== site._id);
            setSites(updatedSites);
            console.log(`Site ${site.site_name} deleted successfully.`);
          } else {
            console.error(`Error deleting site ${site.site_name}`);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handleUpdateSite = () => {
    // Send the PATCH request to update the site
    fetch(`/admin/updateSite/${editedSite._id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...editedSite,
        site_id: editedSite._id
    }),
    
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          const updatedSites = sites.map((site) => 
            site._id === editedSite._id ? editedSite : site
          );
          setSnackbarMessage('Site updated successfully!');
          setSnackbarOpen(true);
          setSites(updatedSites);
          setIsEditModalOpen(false);
        } else {
          console.error("Error updating site", data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating site", error);
      });
  };
  

  

  return (
    <Box m="20px">
      <Header title="Guard" subtitle="Managing the Guard Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <DataGrid rows={sites} columns={columns} autoHeight />
        )}
      </Box>

      <Dialog open={isDetailsModalOpen} onClose={handleCloseDetailsModal} fullWidth maxWidth="sm">
        <DialogTitle>Site Details</DialogTitle>
        <DialogContent>
          {selectedSite && (
            <div>
              <Typography>Site Name: {selectedSite.site_name}</Typography>
              <Typography>Owner Name: {selectedSite.owner_name}</Typography>
              <Typography>Owner Email: {selectedSite.owner_email}</Typography>
              <Typography>State: {selectedSite.state}</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>Edit Site</DialogTitle>
  <DialogContent>
    {editedSite && (
      <div>
        <TextField 
          label="Site Name" 
          value={editedSite.site_name}
          onChange={(e) => setEditedSite(prevState => ({ ...prevState, site_name: e.target.value }))}
        />
        {/* Repeat for other fields... */}
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleUpdateSite} color="primary">
      Save
    </Button>
    <Button onClick={() => setIsEditModalOpen(false)} color="secondary">
      Cancel
    </Button>
  </DialogActions>
</Dialog>
<Snackbar
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    open={snackbarOpen}
    onClose={() => setSnackbarOpen(false)}
    message={snackbarMessage}
    autoHideDuration={6000}
/>


    </Box>
  );
};

export default Site;
