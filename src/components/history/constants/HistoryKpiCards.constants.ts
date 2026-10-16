export const HISTORY_KPI_CARDS_CONSTANTS = {
  CATEGORIES: {
    ASSET: 'asset',
    EMPLOYEE: 'employee',
    ALLOCATION: 'allocation',
  },
  RATES: {
    SUFFIX: '% of total logs',
    DEFAULT: '0.0% of total logs',
  },
  CARDS: {
    TOTAL: {
      OVERLINE: 'Audit Logs',
      TITLE: 'Total History',
      GROWTH: '+14.2% this month',
      DESCRIPTION: 'All recorded system events & changes',
      BG_COLOR: '#090f25',
    },
    ASSET: {
      OVERLINE: 'Hardware',
      TITLE: 'Asset Actions',
      DESCRIPTION: 'Created, updated & retired',
    },
    EMPLOYEE: {
      OVERLINE: 'Staff & Teams',
      TITLE: 'Employee Actions',
      DESCRIPTION: 'Onboard, transfer & update',
    },
    ALLOCATION: {
      OVERLINE: 'Assignments',
      TITLE: 'Allocation Actions',
      DESCRIPTION: 'Assigned, returned & replaced',
    },
  },
} as const;
