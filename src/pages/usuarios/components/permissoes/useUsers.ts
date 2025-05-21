
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchUsers, UserWithProfile } from "@/services/userService";

export const useUsers = () => {
  const [filteredUsers, setFilteredUsers] = useState<UserWithProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const handleUserSearch = (term: string, activeFilters?: Record<string, string[]>) => {
    let results = users;
    
    // Apply search term filter
    if (term) {
      const searchLower = term.toLowerCase();
      results = results.filter(usuario => 
        usuario.nome.toLowerCase().includes(searchLower) ||
        usuario.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply perfil filters
    if (activeFilters && activeFilters.perfil && activeFilters.perfil.length > 0) {
      results = results.filter(usuario => 
        activeFilters.perfil.includes(usuario.perfil)
      );
    }
    
    setFilteredUsers(results);
  };

  const handleUserChange = (value: string) => {
    setSelectedUser(value);
  };

  // Initialize filteredUsers with all users when data is loaded
  useState(() => {
    if (users.length > 0) {
      setFilteredUsers(users);
    }
  });

  // Extract unique profiles for filter options
  const allProfiles = [...new Set(users.map(user => user.perfil))];

  return {
    users,
    filteredUsers: filteredUsers.length > 0 ? filteredUsers : users,
    selectedUser,
    handleUserChange,
    handleUserSearch,
    isLoading,
    error,
    allProfiles
  };
};
