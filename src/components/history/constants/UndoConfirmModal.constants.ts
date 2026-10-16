export const UNDO_CONFIRM_MODAL_CONSTANTS = {
  TITLE: 'Undo History Action',
  DESCRIPTION: 'Are you sure you want to revert the following action?',
  WARNING_TEXT:
    'Reverting this action will return the application data to its previous state. You can subsequently Redo this action if needed.',
  CANCEL_BUTTON: 'Cancel',
  CONFIRM_BUTTON: 'Confirm Undo',
  BY_PREFIX: 'By ',
  ENTITY_TYPE_ASSET: 'Asset',
} as const;
