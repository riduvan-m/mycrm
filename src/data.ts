// Sample data for the dashboard. Replace with API calls once the backend is wired up.

export type Stat = { label: string; value: string; change: number };

export const stats: Stat[] = [
  { label: 'Net income', value: '$3,780', change: 10 },
  { label: 'Orders per month', value: '560', change: 19 },
  { label: 'Average contract', value: '$200', change: 70 },
  { label: 'Growth rate', value: '36.8%', change: -20 },
];

// Values in millions of dollars.
export const balance = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  gross: [4, 14, 18, 15, 9, 15, 27],
  net: [12, 6, 5, 9, 15, 22, 22],
};

// Values in millions of dollars.
export const sales = [
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: 19 },
  { label: 'Mar', value: 10 },
  { label: 'Apr', value: 18 },
  { label: 'May', value: 28 },
  { label: 'Jun', value: 18 },
  { label: 'Jul', value: 23 },
  { label: 'Aug', value: 16 },
  { label: 'Sep', value: 10 },
  { label: 'Oct', value: 7 },
  { label: 'Nov', value: 10 },
  { label: 'Dec', value: 16 },
];

export const customersByCountry = [
  { label: 'US', value: 496 },
  { label: 'Mexico', value: 396 },
  { label: 'Canada', value: 289 },
  { label: 'Other', value: 103 },
];

export const topProducts = [
  { name: 'Visa analysis', revenue: 244 },
  { name: 'Enterprise Suite', revenue: 326 },
  { name: 'CRM Platform', revenue: 408 },
  { name: 'B2B Market enterprise', revenue: 408 },
];
