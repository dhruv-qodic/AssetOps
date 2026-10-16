/**
 * @description: Constants, titles, and confirmation texts for DeleteEmployeeModal component
 */

export const DELETE_EMPLOYEE_MODAL_TITLES = {
  TITLE: 'Delete Employee',
  DESCRIPTION: 'This action cannot be undone.',
  CONFIRMATION_QUESTION: 'Are you sure you want to delete ',
} as const;

export const DELETE_EMPLOYEE_MODAL_BUTTONS = {
  CANCEL: 'Cancel',
  DELETE: 'Delete',
} as const;

export const DELETE_EMPLOYEE_MODAL_MESSAGES = {
  SUCCESS_PREFIX: 'Employee "',
  SUCCESS_SUFFIX: '" deleted successfully',
} as const;
