import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const Announcement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editedAnnouncement, setEditedAnnouncement] = useState({});
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'title', headerName: 'Title', cellClassName: 'name-column--cell' },
    { field: 'content', headerName: 'Content', type: 'string', headerAlign: 'left', align: 'left', flex: 1 },
    { field: 'uploaded_by', headerName: 'Uploaded By', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ row }) => (
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
      ),
    },
  ];

  useEffect(() => {
    fetch('/admin/getAnnouncements', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.data) {
        const announcementsWithIds = data.data.map((announcement, index) => ({
          ...announcement,
          id: index + 1,
        }));
        setAnnouncements(announcementsWithIds);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, []);

  const handleEdit = (announcement_detail) => {
    setSelectedAnnouncement(announcement_detail);
    setEditedAnnouncement(announcement_detail);
    setIsViewOnly(false);
    setIsDetailsModalOpen(true);
  };

  const handleView = (announcement_detail) => {
    setSelectedAnnouncement(announcement_detail);
    setIsViewOnly(true);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (announcement_detail) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${announcement_detail.title}?`);
    if (confirmDelete) {
      fetch(`/admin/deleteAnnouncement/${announcement_detail._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        if (response.status === 200) {
          const updatedAnnouncements = announcements.filter((a) => a._id !== announcement_detail._id);
          setAnnouncements(updatedAnnouncements);
          console.log(`Announcement ${announcement_detail.title} deleted successfully.`);
        } else {
          console.error(`Error deleting announcement ${announcement_detail.title}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  };

  const updateAnnouncement = () => {
    fetch(`/admin/updateAnnouncement/${editedAnnouncement._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ ...editedAnnouncement, announcement_id: editedAnnouncement._id })
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const updatedAnnouncements = announcements.map((a) =>
          a._id === editedAnnouncement._id ? editedAnnouncement : a
        );
        setAnnouncements(updatedAnnouncements);
        setShowNotification(true); 
        setTimeout(() => setShowNotification(false), 3000); 
        setIsDetailsModalOpen(false);
      } else {
        console.error(`Error updating announcement ${editedAnnouncement.title}`);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box m="20px">
      {showNotification && (
        <div className="alert alert-success" role="alert">
          Announcement updated successfully!
        </div>
      )}
      <Header title="Guard" subtitle="All Announcement" />
      <Box m="40px 0 0 0" height="75vh">
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <DataGrid rows={announcements} columns={columns} autoHeight />
        )}
      </Box>

      <Dialog open={isDetailsModalOpen} onClose={handleCloseDetailsModal} fullWidth maxWidth="sm">
        <DialogTitle>Announcement Details</DialogTitle>
        <DialogContent>
  {selectedAnnouncement && (
    <div>
      <TextField
        label="Title"
        name="title"
        fullWidth
        margin="normal"
        value={isViewOnly ? selectedAnnouncement.title : editedAnnouncement.title}
        onChange={handleInputChange}
        disabled={isViewOnly}
      />
      <TextField
        label="Content"
        name="content"
        fullWidth
        margin="normal"
        value={isViewOnly ? selectedAnnouncement.content : editedAnnouncement.content}
        onChange={handleInputChange}
        disabled={isViewOnly}
      />
      <Typography>Uploaded By : {selectedAnnouncement.uploaded_by}</Typography>
    </div>
  )}
</DialogContent>

        <DialogActions>
          {!isViewOnly && (
            <Button onClick={updateAnnouncement} color="primary">
              Save
            </Button>
          )}
          <Button onClick={handleCloseDetailsModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Announcement;
