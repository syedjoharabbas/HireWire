import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../services/JobService';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<Array<{ id: number; username: string; role: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlePromote = async (id: number) => {
    try {
      await updateUserRole(id, 'Admin');
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    }
  };

  const handleDemote = async (id: number) => {
    try {
      await updateUserRole(id, 'User');
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin - Users</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.id}</td>
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2 space-x-2">
                  {u.role !== 'Admin' ? (
                    <button className="btn btn-primary" onClick={() => handlePromote(u.id)}>Promote</button>
                  ) : (
                    <button className="btn btn-secondary" onClick={() => handleDemote(u.id)}>Demote</button>
                  )}
                  <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
