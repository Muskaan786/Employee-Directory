import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import EmployeeList from './components/EmployeeList';
import { employeeAPI } from './services/api';
import { useDebounce } from './hooks/useDebounce';
import type { Employee } from './types/employee';
import './App.css';

/**
 * Main App component for Employee Directory Search System.
 * 
 * Features implemented:
 * 1. Debounced search (300ms delay) - prevents excessive API calls
 * 2. Request cancellation - cancels previous pending requests
 * 3. Department filtering for precise results
 * 4. Proper state management - loading, error, empty, success states
 * 5. Minimum search length validation (2 characters)
 * 6. Environment-based API configuration
 */
function App() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debounce search term to avoid excessive API calls
  // Only triggers API call 300ms after user stops typing
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all employees
        const response = await employeeAPI.searchEmployees(undefined, 50, 0);
        setAllEmployees(response.employees);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'Request cancelled') {
            return;
          }
          setError(err.message);
        } else {
          setError('Failed to fetch employees. Please check if the backend is running.');
        }
        setAllEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();

    return () => {
      employeeAPI.cancelPendingRequest();
    };
  }, []);

  // Filter employees by department
  useEffect(() => {
    if (selectedDepartment === 'All Departments') {
      setEmployees(allEmployees);
    } else {
      const filtered = allEmployees.filter(
        (emp) => emp.department === selectedDepartment
      );
      setEmployees(filtered);
    }
  }, [allEmployees, selectedDepartment]);

  // Get unique departmensearch and department
  useEffect(() => {
    let filtered = allEmployees;

    // Apply search filter
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((emp) => {
        if (searchField === 'all') {
          return (
            emp.name.toLowerCase().includes(searchLower) ||
            emp.email.toLowerCase().includes(searchLower) ||
            emp.department.toLowerCase().includes(searchLower) ||
            emp.designation.toLowerCase().includes(searchLower)
          );
        } else if (searchField === 'name') {
          return emp.name.toLowerCase().includes(searchLower);
        } else if (searchField === 'email') {
          return emp.email.toLowerCase().includes(searchLower);
        } else if (searchField === 'department') {
          return emp.department.toLowerCase().includes(searchLower);
        } else if (searchField === 'designation') {
          return emp.designation.toLowerCase().includes(searchLower);
        }
        return true;
      });
    }

    // Apply department filter
    if (selectedDepartment !== 'All Departments') {
      filtered = filtered.filter((emp) => emp.department === selectedDepartment);
    }

    setEmployees(filtered);
  }, [allEmployees, debouncedSearchTerm, searchField
              className="logo-icon"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h1 className="app-title">Employee Directory</h1>
          </div>
          <p className="app-subtitle">
            Search and discover employees across the organization
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            disabled={isLoading}
          />

          <FilterBar
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            departments={uniqueDepartments}
            searchField={searchField}
            onSearchFieldChange={setSearchField}
          />

          <EmployeeList
            employees={employees}
            isLoading={isLoading}
            error={error}
            searchTerm={debouncedSearchTerm}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built with React + Vite + TypeScript | Backend: FastAPI + MySQL
        </p>
      </footer>
    </div>
  );
}

export default App;
