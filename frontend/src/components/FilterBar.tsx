import React from 'react';
import './FilterBar.css';

interface FilterBarProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  departments: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedDepartment,
  onDepartmentChange,
  departments,
}) => {
  return (
    <div className="filter-bar">
      <label htmlFor="department-filter" className="filter-label">
        Filter by Department:
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
  );
};

export default FilterBar;
