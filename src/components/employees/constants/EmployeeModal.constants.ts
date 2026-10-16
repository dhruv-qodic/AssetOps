/**
 * Constants, titles, labels, placeholders, and messages for EmployeeModal component
 */

export const EMPLOYEE_MODAL_TITLES = {
  ADD_TITLE: 'Add New Employee',
  ADD_DESCRIPTION: 'Fill in the information below to register a new employee.',
  EDIT_TITLE: 'Edit Employee',
  EDIT_DESCRIPTION_PREFIX: 'Update information and details for ',
  EDIT_DESCRIPTION_SUFFIX: '.',
} as const;

export const EMPLOYEE_MODAL_LABELS = {
  EMPLOYEE_ID: 'Employee ID',
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  EMAIL_ADDRESS: 'Email Address',
  PHONE_NUMBER: 'Phone Number',
  EMPLOYMENT_TYPE: 'Employment Type',
  DEPARTMENT: 'Department',
  STATUS: 'Status',
  POSITION: 'Position',
  LOCATION: 'Location',
} as const;

export const EMPLOYEE_MODAL_PLACEHOLDERS = {
  EMPLOYEE_ID: 'e.g. E156',
  FIRST_NAME: 'John',
  LAST_NAME: 'Doe',
  EMAIL: 'john@company.com',
  PHONE: '+1 (555) 000-1234',
  POSITION: 'Specialist',
  SELECT_TYPE: 'Select type',
  SELECT_DEPARTMENT: 'Select department',
  SELECT_STATUS: 'Select status',
  SELECT_LOCATION: 'Select location',
} as const;

export const EMPLOYEE_MODAL_BUTTONS = {
  CANCEL: 'Cancel',
  ADD_EMPLOYEE: 'Add Employee',
  SAVE_CHANGES: 'Save Changes',
} as const;

export const EMPLOYEE_MODAL_MESSAGES = {
  ADD_SUCCESS_PREFIX: 'Employee "',
  ADD_SUCCESS_SUFFIX: '" added successfully',
  EDIT_SUCCESS_PREFIX: 'Employee "',
  EDIT_SUCCESS_SUFFIX: '" updated successfully',
} as const;

export const EMPLOYEE_MODAL_DEFAULTS = {
  DEPARTMENT: 'IT',
  POSITION: 'Specialist',
  STATUS: 'active' as const,
  TYPE: 'full-time' as const,
  LOCATION: 'Headquarters',
} as const;

// Backwards-compatible aliases for any legacy consumers
export const ADD_EMPLOYEE_MODAL_TITLES = {
  TITLE: EMPLOYEE_MODAL_TITLES.ADD_TITLE,
  DESCRIPTION: EMPLOYEE_MODAL_TITLES.ADD_DESCRIPTION,
} as const;
export const ADD_EMPLOYEE_MODAL_LABELS = EMPLOYEE_MODAL_LABELS;
export const ADD_EMPLOYEE_MODAL_PLACEHOLDERS = EMPLOYEE_MODAL_PLACEHOLDERS;
export const ADD_EMPLOYEE_MODAL_BUTTONS = {
  CANCEL: EMPLOYEE_MODAL_BUTTONS.CANCEL,
  ADD_EMPLOYEE: EMPLOYEE_MODAL_BUTTONS.ADD_EMPLOYEE,
} as const;
export const ADD_EMPLOYEE_MODAL_MESSAGES = {
  SUCCESS_PREFIX: EMPLOYEE_MODAL_MESSAGES.ADD_SUCCESS_PREFIX,
  SUCCESS_SUFFIX: EMPLOYEE_MODAL_MESSAGES.ADD_SUCCESS_SUFFIX,
} as const;
export const ADD_EMPLOYEE_MODAL_DEFAULTS = EMPLOYEE_MODAL_DEFAULTS;

export const EDIT_EMPLOYEE_MODAL_TITLES = {
  TITLE: EMPLOYEE_MODAL_TITLES.EDIT_TITLE,
  DESCRIPTION_PREFIX: EMPLOYEE_MODAL_TITLES.EDIT_DESCRIPTION_PREFIX,
  DESCRIPTION_SUFFIX: EMPLOYEE_MODAL_TITLES.EDIT_DESCRIPTION_SUFFIX,
} as const;
export const EDIT_EMPLOYEE_MODAL_BUTTONS = {
  CANCEL: EMPLOYEE_MODAL_BUTTONS.CANCEL,
  SAVE_CHANGES: EMPLOYEE_MODAL_BUTTONS.SAVE_CHANGES,
} as const;
export const EDIT_EMPLOYEE_MODAL_MESSAGES = {
  SUCCESS_PREFIX: EMPLOYEE_MODAL_MESSAGES.EDIT_SUCCESS_PREFIX,
  SUCCESS_SUFFIX: EMPLOYEE_MODAL_MESSAGES.EDIT_SUCCESS_SUFFIX,
} as const;
