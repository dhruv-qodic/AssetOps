/**
 * @description: Constants, titles, labels, and fallback texts for EmployeeDetailsModal component
 */

export const EMPLOYEE_DETAILS_MODAL_TITLES = {
  TITLE: 'Employee Profile',
  DESCRIPTION_PREFIX: 'Detailed information and assigned assets for ',
  DESCRIPTION_SUFFIX: '.',
  PERSONAL_WORK_DETAILS: 'Personal & Work Details',
  ASSIGNED_EQUIPMENT: 'Assigned Equipment',
  NO_ASSETS_ASSIGNED: 'No organization assets currently assigned to this employee.',
} as const;

export const EMPLOYEE_DETAILS_MODAL_LABELS = {
  EMPLOYEE_ID: 'Employee ID',
  FULL_NAME: 'Full Name',
  EMAIL_ADDRESS: 'Email Address',
  PHONE_NUMBER: 'Phone Number',
  DEPARTMENT: 'Department',
  POSITION_TITLE: 'Position / Title',
  EMPLOYMENT_TYPE: 'Employment Type',
  WORK_LOCATION: 'Work Location',
  STATUS: 'Status',
  CREATED_DATE: 'Created Date',
} as const;

export const EMPLOYEE_DETAILS_MODAL_BUTTONS = {
  EDIT_PROFILE: 'Edit Profile',
  CLOSE: 'Close',
} as const;

export const EMPLOYEE_DETAILS_MODAL_FALLBACKS = {
  NOT_PROVIDED: 'Not provided',
  NOT_AVAILABLE: 'N/A',
  DEFAULT_INITIAL: 'U',
  DEFAULT_LOCATION: 'Headquarters',
} as const;
