import type { EmployeeListResponse } from '../types/employee';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * API client for employee operations with proper error handling and request cancellation.
 */
class EmployeeAPI {
  private abortController: AbortController | null = null;

  /**
   * Search employees by name or department.
   * Automatically cancels previous pending requests.
   * 
   * @param search - Search term (optional)
   * @param limit - Maximum results to return
   * @param offset - Pagination offset
   * @returns Employee list with pagination metadata
   * @throws Error with user-friendly message
   */
  async searchEmployees(
    search?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<EmployeeListResponse> {
    // Cancel previous request if still pending
    this.cancelPendingRequest();

    // Create new abort controller for this request
    this.abortController = new AbortController();

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      const url = `${API_BASE_URL}/api/employees?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: EmployeeListResponse = await response.json();
      return data;
    } catch (error) {
      // Handle fetch errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Request was cancelled, don't throw error
          throw new Error('Request cancelled');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Cancel any pending API request.
   */
  cancelPendingRequest() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Test API connection.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const employeeAPI = new EmployeeAPI();
