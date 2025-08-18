import React, { useState } from 'react';
import { getIconComponent } from '@/utils';
import { Typography, Button, Badge, Avatar } from '@/components';
import { InfinityTable } from '@/components/customComponents/InfinityTable';

// Sample data interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastLogin: string;
  avatar?: string;
  department: string;
  salary: number;
  projects: string[];
}

// Sample data
const generateSampleData = (): User[] => {
  const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const statuses: User['status'][] = ['active', 'inactive', 'pending'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: 50000 + Math.floor(Math.random() * 100000),
    projects: [`Project ${Math.floor(Math.random() * 10) + 1}`, `Project ${Math.floor(Math.random() * 10) + 1}`]
  }));
};

export const InfinitePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<any>(null);

  const allData = generateSampleData();
  
  // Filter data based on filters
  const filteredData = allData.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesRole = roleFilter.length === 0 || roleFilter.includes(user.role);
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Paginate data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Table configuration
  const columns = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      customRender: (value: string, row: User) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.avatar}
            size="sm"
          />
          <div>
            <Typography variant="body2" className="font-medium">
              {value}
            </Typography>
            <Typography variant="caption" className="text-base-content/60">
              {row.email}
            </Typography>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      customRender: (value: string) => (
        <Badge variant="secondary" size="sm">
          {value}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      customRender: (value: User['status']) => (
        <Badge 
          variant={value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'error'}
          size="sm"
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true
    },
    {
      key: 'salary',
      header: 'Salary',
      align: 'right' as const,
      sortable: true,
      customRender: (value: number) => (
        <Typography variant="body2" className="font-mono">
          ${value.toLocaleString()}
        </Typography>
      )
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      sortable: true,
      customRender: (value: string) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString()}
        </Typography>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center' as const,
      customRender: (row: User) => (
        <div className="flex items-center gap-1">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => console.log('Edit', row.id)}
          >
            {getIconComponent('Edit', 14)}
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => console.log('Delete', row.id)}
            className="text-error hover:bg-error/10"
          >
            {getIconComponent('Trash2', 14)}
          </Button>
        </div>
      )
    }
  ];

  const filters = [
    {
      type: 'search' as const,
      key: 'search',
      label: 'Search Users',
      placeholder: 'Search by name or email...',
      value: searchTerm,
      onChange: setSearchTerm
    },
    {
      type: 'select' as const,
      key: 'status',
      label: 'Status',
      placeholder: 'All Statuses',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' }
      ],
      value: statusFilter,
      onChange: setStatusFilter
    },
    {
      type: 'multiSelect' as const,
      key: 'role',
      label: 'Roles',
      placeholder: 'Select roles...',
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'User', label: 'User' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Developer', label: 'Developer' },
        { value: 'Designer', label: 'Designer' }
      ],
      value: roleFilter,
      onChange: setRoleFilter
    },
    {
      type: 'dateRange' as const,
      key: 'joinDate',
      label: 'Join Date Range',
      value: dateRange,
      onChange: setDateRange
    }
  ];

  const bulkActions = [
    {
      label: 'Activate',
      icon: getIconComponent('CheckCircle', 14),
      onClick: (ids: string[]) => {
        console.log('Activate users:', ids);
        setSelectedRows([]);
      },
      variant: 'success'
    },
    {
      label: 'Deactivate',
      icon: getIconComponent('XCircle', 14),
      onClick: (ids: string[]) => {
        console.log('Deactivate users:', ids);
        setSelectedRows([]);
      },
      variant: 'warning'
    },
    {
      label: 'Delete',
      icon: getIconComponent('Trash2', 14),
      onClick: (ids: string[]) => {
        console.log('Delete users:', ids);
        setSelectedRows([]);
      },
      variant: 'error'
    }
  ];

  const expandedContent = (row: User) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Typography variant="h6" className="mb-2">
          Contact Information
        </Typography>
        <div className="space-y-1">
          <Typography variant="body2">
            <span className="font-medium">Email:</span> {row.email}
          </Typography>
          <Typography variant="body2">
            <span className="font-medium">Department:</span> {row.department}
          </Typography>
          <Typography variant="body2">
            <span className="font-medium">Last Login:</span> {new Date(row.lastLogin).toLocaleDateString()}
          </Typography>
        </div>
      </div>
      <div>
        <Typography variant="h6" className="mb-2">
          Projects
        </Typography>
        <div className="flex flex-wrap gap-1">
          {row.projects.map((project, index) => (
            <Badge key={index} variant="primary" size="sm">
              {project}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleRefresh}
        disabled={loading}
      >
        {getIconComponent('RefreshCw', 16, loading ? 'animate-spin' : '')}
        Refresh
      </Button>
      <Button
        size="sm"
        variant="primary"
        onClick={() => console.log('Add user')}
      >
        {getIconComponent('Plus', 16)}
        Add User
      </Button>
    </div>
  );

  return (
    <div className="p-6">
      <InfinityTable
        data={paginatedData}
        columns={columns}
        loading={loading}
        title="User Management"
        subtitle={`${filteredData.length} users found`}
        icon={getIconComponent('Users', 24)}
        filters={filters}
        selectable={true}
        selectedRows={selectedRows}
        onRowSelect={setSelectedRows}
        rowIdKey="id"
        expandable={true}
        expandedContent={expandedContent}
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          totalItems: filteredData.length,
          onPageChange: setCurrentPage,
          showPageSize: true,
          pageSizeOptions: [5, 10, 20, 50],
          onPageSizeChange: setPageSize
        }}
        zebra={true}
        hoverable={true}
        bordered={true}
        headerActions={headerActions}
        bulkActions={bulkActions}
        className="space-y-4"
      />
    </div>
  );
};