export const stages = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contact made' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal sent' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won', label: 'Won' },
] as const;

export type StageId = (typeof stages)[number]['id'];

export type Lead = {
  id: string;
  title: string;
  company: string;
  /** Owner initials. */
  owner: string;
  value: number;
  stage: StageId;
  overdue?: boolean;
};

export const formatValue = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export const sampleLeads: Lead[] = [
  { id: 'l1', title: 'Willamette Co deal', company: 'Willamette Co', owner: 'AU', value: 1500, stage: 'new' },
  { id: 'l2', title: 'Park Place deal', company: 'Park Place', owner: 'JS', value: 4500, stage: 'new' },
  { id: 'l3', title: 'Dream college deal', company: 'Dream College', owner: 'MK', value: 3700, stage: 'new', overdue: true },
  { id: 'l4', title: 'Pet insurance deal', company: 'Pet Insurance', owner: 'AU', value: 1000, stage: 'new' },
  { id: 'l5', title: 'Tim and Sons logistics', company: 'Tim and Sons', owner: 'RL', value: 2300, stage: 'contacted', overdue: true },
  { id: 'l6', title: 'Fantastic Hotels deal', company: 'Fantastic Hotels Ltd', owner: 'JS', value: 1900, stage: 'contacted' },
  { id: 'l7', title: 'JD Manufacturing deal', company: 'JD Manufacturing', owner: 'MK', value: 1150, stage: 'contacted' },
  { id: 'l8', title: 'Bringit media agency', company: 'Bringit Media', owner: 'AU', value: 1400, stage: 'qualified' },
  { id: 'l9', title: 'We Heart Trees non-profit', company: 'We Heart Trees', owner: 'RL', value: 1700, stage: 'qualified' },
  { id: 'l10', title: 'Rio Housing deal', company: 'Rio Housing', owner: 'JS', value: 2700, stage: 'proposal' },
  { id: 'l11', title: 'Maria M. Retail deal', company: 'Maria M. Retail Ltd', owner: 'MK', value: 2600, stage: 'negotiation' },
  { id: 'l12', title: 'Trip Abroad deal', company: 'Trip Abroad Ltd', owner: 'AU', value: 3750, stage: 'won' },
];
