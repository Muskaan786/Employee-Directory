import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
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
 * 3. Proper state management - loading, error, empty, success states
 * 4. Minimum search length validation (2 characters)
 * 5. Environment-based API configuration
 */
function App() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debounce search term to avoid excessive API calls
  // Only triggers API call 300ms after user stops typing
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Only search if term is empty or at least 2 characters
        if (debouncedSearchTerm && debouncedSearchTerm.length < 2) {
          return;
        }

        setIsLoading(true);
        setError(null);

        // Fetch employees with debounced search term
        const response = await employeeAPI.searchEmployees(
          debouncedSearchTerm || undefined,
          50,
          0
        );

        setEmployees(response.employees);
      } catch (err) {
        if (err instanceof Error) {
          // Don't show error for cancelled requests
          if (err.message === 'Request cancelled') {
            return;
          }
          setError(err.message);
        } else {
          setError('Failed to fetch employees. Please check if the backend is running.');
        }
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();

    // Cleanup function to cancel pending requests
    return () => {
      employeeAPI.cancelPendingRequest();
    };
  }, [debouncedSearchTerm]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <svg
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
