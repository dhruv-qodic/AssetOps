import type { Asset, AssetCategory, AssetStatus } from '@/types/asset';

// 1. Core initial assets for deterministic test compatibility
const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast_001',
    assetId: 'A1001',
    name: 'Dell Laptop',
    model: 'Latitude 5440',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    assignedTo: {
      id: 'emp_001',
      name: 'John Doe',
      email: 'john.doe@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      department: 'Engineering',
      assignedDate: '2023-09-10',
    },
    serialNumber: 'DL-5440-98214',
    purchaseDate: '2023-08-15',
    purchaseCost: 1299,
    warrantyExpiry: '2026-08-15',
    specifications: {
      Processor: 'Intel Core i7-1365U',
      RAM: '16GB DDR5',
      Storage: '512GB NVMe SSD',
      Display: '14" FHD IPS',
    },
    notes: 'Primary workstation laptop for software development.',
    createdAt: '2023-08-15T09:00:00Z',
    updatedAt: '2023-09-10T14:20:00Z',
  },
  {
    id: 'ast_002',
    assetId: 'A1002',
    name: 'iPhone 15',
    model: '128GB Black',
    category: 'Mobile',
    status: 'Available',
    location: 'Headquarters',
    assignedTo: null,
    serialNumber: 'IP-15-773910',
    purchaseDate: '2023-11-20',
    purchaseCost: 899,
    warrantyExpiry: '2025-11-20',
    specifications: {
      Chip: 'A16 Bionic',
      Storage: '128GB',
      Color: 'Black',
      BatteryHealth: '100%',
    },
    notes: 'Available for QA testing and executive allocation.',
    createdAt: '2023-11-20T11:30:00Z',
    updatedAt: '2023-11-20T11:30:00Z',
  },
  {
    id: 'ast_003',
    assetId: 'A1003',
    name: 'Dell Monitor',
    model: '27"',
    category: 'Monitor',
    status: 'Maintenance',
    location: 'New York Office',
    assignedTo: {
      id: 'emp_002',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      department: 'Product Design',
      assignedDate: '2023-06-01',
    },
    serialNumber: 'DM-27-481920',
    purchaseDate: '2023-05-10',
    purchaseCost: 349,
    warrantyExpiry: '2026-05-10',
    specifications: {
      Resolution: '2560 x 1440 QHD',
      RefreshRate: '75Hz',
      Panel: 'IPS with USB-C Hub',
    },
    notes: 'Sent to IT support for backlight flicker diagnosis.',
    createdAt: '2023-05-10T08:00:00Z',
    updatedAt: '2024-02-14T10:15:00Z',
  },
  {
    id: 'ast_004',
    assetId: 'A1004',
    name: 'Wireless Keyboard',
    model: 'MX Keys S',
    category: 'Accessories',
    status: 'Allocated',
    location: 'San Francisco',
    assignedTo: {
      id: 'emp_003',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      department: 'Engineering',
      assignedDate: '2023-09-15',
    },
    serialNumber: 'WK-LOGI-10293',
    purchaseDate: '2023-09-01',
    purchaseCost: 129,
    warrantyExpiry: '2025-09-01',
    specifications: {
      Connectivity: 'Bluetooth / Logi Bolt',
      Backlight: 'Smart Illumination',
      Color: 'Space Gray',
    },
    notes: 'Allocated to senior frontend developer workstation.',
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2023-09-15T16:00:00Z',
  },
  {
    id: 'ast_005',
    assetId: 'A1005',
    name: 'AirPods',
    model: 'Pro (2nd Gen)',
    category: 'Accessories',
    status: 'Available',
    location: 'Headquarters',
    assignedTo: null,
    serialNumber: 'AP-PRO-77382',
    purchaseDate: '2024-01-15',
    purchaseCost: 249,
    warrantyExpiry: '2026-01-15',
    specifications: {
      Chip: 'Apple H2',
      Features: 'Active Noise Cancellation, Transparency',
      Charging: 'USB-C MagSafe Case',
    },
    notes: 'Brand new, sanitized and ready in storage locker A4.',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
  },
  {
    id: 'ast_006',
    assetId: 'A1006',
    name: 'MacBook Pro 16"',
    model: 'M3 Pro 36GB/512GB',
    category: 'Laptop',
    status: 'Allocated',
    location: 'Headquarters',
    assignedTo: {
      id: 'emp_004',
      name: 'Dhruv Faldu',
      email: 'admin@assetops.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      department: 'IT Administration',
      assignedDate: '2024-02-01',
    },
    serialNumber: 'MBP-16-M3P-9921',
    purchaseDate: '2024-01-20',
    purchaseCost: 2499,
    warrantyExpiry: '2027-01-20',
    specifications: {
      Processor: 'Apple M3 Pro (12-core CPU, 18-core GPU)',
      Memory: '36GB Unified',
      Storage: '512GB SSD',
    },
    notes: 'Lead IT administrator primary system.',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'ast_007',
    assetId: 'A1007',
    name: 'iPad Pro 12.9"',
    model: 'M2 Wi-Fi 256GB',
    category: 'Tablet',
    status: 'Available',
    location: 'London Office',
    assignedTo: null,
    serialNumber: 'IPAD-PRO-55412',
    purchaseDate: '2023-10-05',
    purchaseCost: 1099,
    warrantyExpiry: '2025-10-05',
    specifications: {
      Display: '12.9" Liquid Retina XDR',
      Processor: 'Apple M2',
      Storage: '256GB',
    },
    notes: 'Design team pool tablet with Apple Pencil 2.',
    createdAt: '2023-10-05T12:00:00Z',
    updatedAt: '2023-10-05T12:00:00Z',
  },
  {
    id: 'ast_008',
    assetId: 'A1008',
    name: 'LG UltraWide 34"',
    model: '34WN80C-B USB-C',
    category: 'Monitor',
    status: 'Allocated',
    location: 'San Francisco',
    assignedTo: {
      id: 'emp_005',
      name: 'Sarah Jenkins',
      email: 'manager@assetops.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      department: 'Operations',
      assignedDate: '2023-11-12',
    },
    serialNumber: 'LG-34UW-88219',
    purchaseDate: '2023-11-01',
    purchaseCost: 599,
    warrantyExpiry: '2026-11-01',
    specifications: {
      Resolution: '3440 x 1440 WQHD',
      Aspect: '21:9 Curved IPS',
      Connectivity: 'USB Type-C 60W PD',
    },
    notes: 'Operations dashboard monitoring setup.',
    createdAt: '2023-11-01T08:30:00Z',
    updatedAt: '2023-11-12T11:00:00Z',
  },
  {
    id: 'ast_009',
    assetId: 'A1009',
    name: 'Logitech MX Master 3S',
    model: 'Ergonomic Mouse',
    category: 'Accessories',
    status: 'Available',
    location: 'New York Office',
    assignedTo: null,
    serialNumber: 'MX-3S-99120',
    purchaseDate: '2024-02-10',
    purchaseCost: 99,
    warrantyExpiry: '2026-02-10',
    specifications: {
      Sensor: '8K DPI Darkfield',
      Clicks: 'Quiet Click technology',
      Battery: 'USB-C Rechargeable',
    },
    notes: 'Brand new inventory item.',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-10T09:00:00Z',
  },
  {
    id: 'ast_010',
    assetId: 'A1010',
    name: 'ThinkPad X1 Carbon',
    model: 'Gen 11 Core i7',
    category: 'Laptop',
    status: 'Maintenance',
    location: 'London Office',
    assignedTo: {
      id: 'emp_006',
      name: 'Michael Vance',
      email: 'viewer@assetops.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      department: 'QA & Compliance',
      assignedDate: '2023-12-01',
    },
    serialNumber: 'TP-X1-449102',
    purchaseDate: '2023-07-22',
    purchaseCost: 1699,
    warrantyExpiry: '2026-07-22',
    specifications: {
      Processor: 'Intel Core i7-1365U',
      RAM: '32GB LPDDR5',
      Storage: '1TB PCIe Gen4 SSD',
    },
    notes: 'Keyboard replacement in progress by Lenovo Premier Support.',
    createdAt: '2023-07-22T10:00:00Z',
    updatedAt: '2024-02-18T14:30:00Z',
  },
];

// Helper data templates for procedural 10,000 item generation
const CATEGORY_TEMPLATES: Record<AssetCategory, { names: string[]; models: string[]; avgCost: number }> = {
  Laptop: {
    names: ['MacBook Pro 14"', 'MacBook Air 15"', 'Dell XPS 15', 'Lenovo ThinkPad P1', 'HP Spectre x360', 'Asus ROG Zephyrus', 'Surface Laptop 5'],
    models: ['M3 Max 64GB', 'M2 16GB/512GB', 'Core i9-13900H', 'Ryzen 7 7840HS', 'Core i7 32GB', 'Ultra 7 155H'],
    avgCost: 1850,
  },
  Mobile: {
    names: ['iPhone 15 Pro', 'iPhone 14', 'Samsung Galaxy S24', 'Google Pixel 8 Pro', 'Samsung Galaxy Z Fold 5', 'iPhone SE'],
    models: ['256GB Titanium', '128GB Midnight', '512GB Onyx', '128GB Bay', '256GB Cream', '64GB Starlight'],
    avgCost: 899,
  },
  Monitor: {
    names: ['Dell UltraSharp 32"', 'Apple Studio Display', 'LG Ergo 27"', 'ASUS ProArt 27"', 'BenQ DesignVue 32"', 'Samsung Odyssey G9'],
    models: ['4K USB-C Hub', '5K Retina', 'QHD IPS', '4K Color Accurate', 'Thunderbolt 4', 'Dual QHD Curved'],
    avgCost: 750,
  },
  Accessories: {
    names: ['Logitech MX Keys', 'Keychron Q1 Max', 'Apple Magic Trackpad', 'CalDigit TS4 Dock', 'Anker 778 Thunderbolt Dock', 'Sony WH-1000XM5'],
    models: ['Wireless Illuminated', 'Mechanical Gateron', 'Black Multi-Touch', '18-in-1 98W', 'USB-C Docking', 'Noise Canceling'],
    avgCost: 180,
  },
  Tablet: {
    names: ['iPad Pro 11"', 'iPad Air 10.9"', 'Samsung Galaxy Tab S9', 'Microsoft Surface Pro 9'],
    models: ['M2 128GB Cellular', 'M1 256GB Wi-Fi', '12.4" 256GB', 'SQ3 5G 16GB'],
    avgCost: 920,
  },
  Desktop: {
    names: ['Mac Studio', 'Mac mini', 'Dell Precision 3660', 'HP Z2 Tower', 'Custom Workstation PC'],
    models: ['M2 Ultra 64GB', 'M2 Pro 32GB', 'Core i9 64GB RTX 4080', 'Xeon w5-2455X', 'Ryzen Threadripper 64-Core'],
    avgCost: 2800,
  },
  Audio: {
    names: ['Jabra Speak 750', 'Sennheiser TeamConnect', 'Shure MV7 Podcaster', 'Bose QuietComfort Ultra'],
    models: ['Full-Duplex Bluetooth', 'Ceiling Mic Array', 'USB/XLR Dynamic', 'Wireless Noise Canceling'],
    avgCost: 350,
  },
  Networking: {
    names: ['Cisco Catalyst 9300', 'Ubiquiti Dream Machine Pro', 'Aruba AP-535', 'Fortinet FortiGate 60F'],
    models: ['48-Port PoE+ Switch', 'Enterprise Gateway', 'Wi-Fi 6 Access Point', 'Next-Gen Firewall'],
    avgCost: 2100,
  },
  Other: {
    names: ['Epson EcoTank Printer', 'APC Smart-UPS 1500', 'Logitech Rally Bar', 'YubiKey 5C NFC'],
    models: ['Multifunction Wireless', '1500VA LCD 120V', 'All-in-One Video Bar', 'Hardware Security Key'],
    avgCost: 420,
  },
};

const LOCATIONS = ['Headquarters', 'New York Office', 'San Francisco', 'London Office', 'Remote'];
const DEPARTMENTS = ['Engineering', 'Product Design', 'Marketing', 'Operations', 'Finance', 'Human Resources', 'Sales', 'IT Administration', 'QA & Compliance'];

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Sam', 'Chris', 'Pat', 'Dakota', 'Avery', 'Reese', 'Quinn', 'Skyler', 'Cameron'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];

/**
 * Procedurally generates `count` realistic asset seed objects.
 * Guarantees high-performance seed creation while maintaining deterministic compatibility for the initial assets.
 */
export function generateAssetSeedData(count: number = 500): Asset[] {
  const assets: Asset[] = [...INITIAL_ASSETS];
  const categories = Object.keys(CATEGORY_TEMPLATES) as AssetCategory[];

  for (let i = INITIAL_ASSETS.length + 1; i <= count; i++) {
    const category = categories[(i * 7) % categories.length];
    const template = CATEGORY_TEMPLATES[category];

    const nameIndex = (i * 3) % template.names.length;
    const modelIndex = (i * 5) % template.models.length;
    const name = template.names[nameIndex];
    const model = template.models[modelIndex];

    // Status distribution: 48% Allocated, 32% Available, 12% Maintenance, 5% Retired, 3% Lost
    const statusScore = (i * 13) % 100;
    let status: AssetStatus = 'Available';
    if (statusScore < 48) status = 'Allocated';
    else if (statusScore < 80) status = 'Available';
    else if (statusScore < 92) status = 'Maintenance';
    else if (statusScore < 97) status = 'Retired';
    else status = 'Lost';

    const location = LOCATIONS[(i * 11) % LOCATIONS.length];
    const assetIdNum = 1000 + i;
    const assetId = `A${assetIdNum}`;
    const id = `ast_${String(i).padStart(5, '0')}`;
    const serialNumber = `${category.substring(0, 2).toUpperCase()}-${(i * 37) % 900000 + 100000}`;

    // Dates
    const year = 2021 + ((i * 2) % 4);
    const month = String(((i * 3) % 12) + 1).padStart(2, '0');
    const day = String(((i * 5) % 28) + 1).padStart(2, '0');
    const purchaseDate = `${year}-${month}-${day}`;
    const warrantyExpiry = `${year + 3}-${month}-${day}`;
    const createdAt = `${purchaseDate}T09:00:00Z`;

    // Pricing
    const costVariance = ((i * 17) % 30) - 15;
    const purchaseCost = Math.round(template.avgCost * (1 + costVariance / 100));

    // Assigned Employee (if Allocated)
    let assignedTo = null;
    if (status === 'Allocated') {
      const firstName = FIRST_NAMES[(i * 2) % FIRST_NAMES.length];
      const lastName = LAST_NAMES[(i * 4) % LAST_NAMES.length];
      const fullName = `${firstName} ${lastName}`;
      const dept = DEPARTMENTS[(i * 3) % DEPARTMENTS.length];
      const empId = `emp_${String((i % 500) + 1).padStart(3, '0')}`;

      assignedTo = {
        id: empId,
        name: fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        department: dept,
        assignedDate: `${year}-${month}-${day}`,
      };
    }

    assets.push({
      id,
      assetId,
      name,
      model,
      category,
      status,
      location,
      assignedTo,
      serialNumber,
      purchaseDate,
      purchaseCost,
      warrantyExpiry,
      specifications: {
        Batch: `BATCH-${Math.floor(i / 100)}`,
        Revision: `v${(i % 3) + 1}.0`,
      },
      notes: `Asset ${assetId} registered in inventory batch ${Math.floor(i / 100)}.`,
      createdAt,
      updatedAt: createdAt,
    });
  }

  return assets;
}

// Generate the standard 10,000 mock assets dataset
export const MOCK_ASSETS: Asset[] = generateAssetSeedData(500);
