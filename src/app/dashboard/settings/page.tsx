'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import { Plus } from 'lucide-react';
import AddUserModal from '@/components/Modals/AddUserModal';
import ChangePasswordModal from '@/components/Modals/ChangePasswordModal';
import MainLayout from '@/components/Layouts/MainLayout';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'staff';
  name: string;
}

const SettingsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'staff') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update role');
      
      toast.success('Role updated successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update role');
    }
  };

  const openChangePasswordModal = (user: User) => {
    setSelectedUser(user);
    setIsChangePasswordModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-full p-4 md:p-6 2xl:p-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage system users and roles</p>
        </div>

        {/* User Management Section */}
        <div className="rounded-sm">
          <div className="px-6 ">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-black dark:text-white">
                User Management
              </h3>
              <ButtonDefault
                label="Add User"
                onClick={() => setIsAddModalOpen(true)}
                customClasses="rounded-lg py-2 px-4 bg-green-light text-white dark:bg-green"
              >
                <Plus className="w-5 h-5" />
              </ButtonDefault>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray text-left dark:bg-gray-dark">
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Username
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Name
                      </th>
                      <th className="py-4 px-4 font-medium text-center text-black dark:text-white">
                        Role
                      </th>
                      <th className="py-4 px-4 font-medium text-center text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr 
                        key={user.id}
                        className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
                      >
                        <td className="py-4 px-4 dark:border-strokedark">
                          {user.username}
                        </td>
                        <td className="py-4 px-4 dark:border-strokedark">
                          {user.name}
                        </td>
                        <td className="py-4 px-4 dark:border-strokedark text-center">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'staff')}
                            className="rounded-lg py-2 px-3 text-black focus:outline-none dark:bg-gray-800 dark:text-white dark:focus:border-primary"
                          >
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 flex justify-center">
                          <ButtonDefault
                            label="Change Password"
                            onClick={() => openChangePasswordModal(user)}
                            customClasses="rounded-lg py-2 px-4 bg-blue dark:bg-blue-dark text-white"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <AddUserModal
          onClose={() => {
            setIsAddModalOpen(false);
            fetchUsers();
          }}
        />
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && selectedUser && (
        <ChangePasswordModal
          user={selectedUser}
          onClose={() => {
            setIsChangePasswordModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </MainLayout>
  );
};

export default SettingsPage; 