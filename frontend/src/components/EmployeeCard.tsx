import React from 'react';
import type { Employee } from '../types/employee';
import './EmployeeCard.css';

interface EmployeeCardProps {
  employee: Employee;
}

/**
 * EmployeeCard component displays individual employee information.
 * 
 * Features:
 * - Clean, card-based design
 * - Responsive layout
 * - Formatted date display
 * - Department badge with color coding
 */
const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="employee-card">
      <div className="employee-card-header">
        <div className="employee-avatar">
          {getInitials(employee.name)}
        </div>
        <div className="employee-main-info">
          <h3 className="employee-name">{employee.name}</h3>
          <p className="employee-designation">{employee.designation}</p>
        </div>
      </div>
      
      <div className="employee-card-body">
        <div className="employee-info-row">
          <svg
            className="info-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span className="employee-email">{employee.email}</span>
        </div>
        
        <div className="employee-info-row">
          <svg
            className="info-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="employee-department-badge">
            {employee.department}
          </span>
        </div>
        
        <div className="employee-info-row">
          <svg
            className="info-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="employee-join-date">
            Joined {formatDate(employee.date_of_joining)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
