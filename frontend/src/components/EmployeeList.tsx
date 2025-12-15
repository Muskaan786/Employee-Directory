import React from 'react';
import type { Employee } from '../types/employee';
import EmployeeCard from './EmployeeCard';
import './EmployeeList.css';

interface EmployeeListProps {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

/**
 * EmployeeList component handles display of employee cards
 * with proper loading, error, and empty states.
 * 
 * States handled:
 * - Loading: Shows skeleton loaders
 * - Error: Shows error message with retry option
 * - Empty: Shows "no results" message
 * - Success: Shows grid of employee cards
 */
const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  isLoading,
  error,
  searchTerm,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="employee-list-container">
        <div className="employee-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="employee-card skeleton">
              <div className="skeleton-header">
                <div className="skeleton-avatar" />
                <div className="skeleton-text-container">
                  <div className="skeleton-text skeleton-title" />
                  <div className="skeleton-text skeleton-subtitle" />
                </div>
              </div>
              <div className="skeleton-body">
                <div className="skeleton-text" />
                <div className="skeleton-text" />
                <div className="skeleton-text" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="employee-list-container">
        <div className="state-message error-state">
          <svg
            className="state-icon error-icon"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3 className="state-title">Oops! Something went wrong</h3>
          <p className="state-description">{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (employees.length === 0) {
    return (
      <div className="employee-list-container">
        <div className="state-message empty-state">
          <svg
            className="state-icon"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h3 className="state-title">
            {searchTerm ? 'No employees found' : 'No employees yet'}
          </h3>
          <p className="state-description">
            {searchTerm
              ? `No employees match "${searchTerm}". Try a different search term.`
              : 'Start by adding some employees to the directory.'}
          </p>
        </div>
      </div>
    );
  }

  // Success state - show employee cards
  return (
    <div className="employee-list-container">
      <div className="results-summary">
        <p>
          Found <strong>{employees.length}</strong> employee
          {employees.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>
      <div className="employee-grid">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
