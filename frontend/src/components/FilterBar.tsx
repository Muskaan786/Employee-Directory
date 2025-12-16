import React from 'react';
import './FilterBar.css';

interface FilterBarProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  departments: string[];
  searchField: string;
  onSearchFieldChange: (field: string) => void;
}

const SEARCH_FIELDS = [
  { value: 'all', label: 'All Fields' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'department', label: 'Department' },
  { value: 'designation', label: 'Designation' }
];

const FilterBar: React.FC<FilterBarProps> = ({
  selectedDepartment,
  onDepartmentChange,
  departments,
  searchField,
  onSearchFieldChange,
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="search-field-filter" className="filter-label">
          Search in:
        </label>
        <select
          id="search-field-filter"
          className="filter-select"
          value={searchField}
          onChange={(e) => onSearchFieldChange(e.target.value)}
        >
          {SEARCH_FIELDS.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="department-filter" className="filter-label">
          Department:
        </label>
        <select
          id="department-filter"
          className="filter-select"
          value={selectedDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <option value="All Departments">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
