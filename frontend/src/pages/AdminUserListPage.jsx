import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmationModal from '../components/ConfirmationModal';
import api from '../api/axiosConfig'; // Import the configured Axios instance
import { useAuth } from '../hooks/useAuth';

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { userInfo: authUser, loading: authLoading } = useAuth();

  const fetchUsers = async () => {
    try {
      // Use the 'api' instance; the token is added automatically by the interceptor.
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred fetching users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser && authUser.isAdmin) {
      fetchUsers();
    } else if (!authLoading) {
      setLoading(false);
      setError("You are not authorized to view this page.");
    }
  }, [authUser, authLoading]);

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Use the 'api' instance; the token is added automatically by the interceptor.
      await api.delete(`/users/${userToDelete}`);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError('Could not delete user.');
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div style={styles.container}>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
      <h1 style={styles.header}>Manage Users</h1>
      {loading ? <p>Loading...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>NAME</th>
                <th style={styles.th}>EMAIL</th>
                <th style={styles.th}>ADMIN</th>
                <th style={styles.th}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.id}</td>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.is_admin ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
                  <td style={styles.td}>
                    <button style={{...styles.iconButton, ...styles.editButton}}><FaEdit /></button>
                    {/* Prevent admin from deleting themselves */}
                    {authUser.id !== user.id && 
                      <button onClick={() => handleDeleteClick(user.id)} style={{...styles.iconButton, ...styles.deleteButton}}><FaTrash /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { fontFamily: 'system-ui, sans-serif' },
  header: { marginBottom: '20px' },
  card: { backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { borderBottom: '1px solid #eee', padding: '12px', textAlign: 'left', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase' },
  td: { borderBottom: '1px solid #eee', padding: '15px 12px' },
  iconButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '5px', marginRight: '10px' },
  editButton: { color: '#007bff' },
  deleteButton: { color: '#dc3545' },
};

export default AdminUserListPage;