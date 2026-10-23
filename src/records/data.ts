// Test data for contacts, companies and deals. Replace with API calls once the backend is wired up.
import type { StageId } from '../leads/data';

export type Company = {
  id: string;
  name: string;
  industry: string;
  city: string;
  employees: number;
  website: string;
};

export type Contact = {
  id: string;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  companyId: string;
  status: 'Customer' | 'Prospect' | 'Churned';
};

export type Deal = {
  id: string;
  title: string;
  companyId: string;
  value: number;
  stage: StageId;
  /** YYYY-MM-DD */
  closeDate: string;
  /** Owner initials. */
  owner: string;
};

export const companies: Company[] = [
  { id: 'c1', name: 'Willamette Co', industry: 'Software', city: 'Portland', employees: 120, website: 'willamette.example' },
  { id: 'c2', name: 'Park Place', industry: 'Real estate', city: 'Chicago', employees: 45, website: 'parkplace.example' },
  { id: 'c3', name: 'Bringit Media', industry: 'Marketing', city: 'Austin', employees: 30, website: 'bringit.example' },
  { id: 'c4', name: 'Fantastic Hotels Ltd', industry: 'Hospitality', city: 'Miami', employees: 850, website: 'fantastichotels.example' },
  { id: 'c5', name: 'JD Manufacturing', industry: 'Manufacturing', city: 'Detroit', employees: 1200, website: 'jdmfg.example' },
  { id: 'c6', name: 'Rio Housing', industry: 'Real estate', city: 'San Diego', employees: 60, website: 'riohousing.example' },
  { id: 'c7', name: 'Maria M. Retail Ltd', industry: 'Retail', city: 'New York', employees: 210, website: 'mariaretail.example' },
  { id: 'c8', name: 'Trip Abroad Ltd', industry: 'Travel', city: 'Seattle', employees: 95, website: 'tripabroad.example' },
];

export const contacts: Contact[] = [
  { id: 'p1', name: 'Olivia Bennett', jobTitle: 'CTO', email: 'olivia@willamette.example', phone: '(503) 555-0142', companyId: 'c1', status: 'Customer' },
  { id: 'p2', name: 'Liam Carter', jobTitle: 'Head of IT', email: 'liam@willamette.example', phone: '(503) 555-0178', companyId: 'c1', status: 'Customer' },
  { id: 'p3', name: 'Sophia Nguyen', jobTitle: 'Managing Director', email: 'sophia@parkplace.example', phone: '(312) 555-0110', companyId: 'c2', status: 'Prospect' },
  { id: 'p4', name: 'Noah Patel', jobTitle: 'Creative Director', email: 'noah@bringit.example', phone: '(512) 555-0133', companyId: 'c3', status: 'Prospect' },
  { id: 'p5', name: 'Emma Rodriguez', jobTitle: 'Operations Manager', email: 'emma@fantastichotels.example', phone: '(305) 555-0187', companyId: 'c4', status: 'Customer' },
  { id: 'p6', name: 'James Kim', jobTitle: 'Procurement Lead', email: 'james@fantastichotels.example', phone: '(305) 555-0121', companyId: 'c4', status: 'Customer' },
  { id: 'p7', name: 'Ava Thompson', jobTitle: 'Plant Manager', email: 'ava@jdmfg.example', phone: '(313) 555-0165', companyId: 'c5', status: 'Prospect' },
  { id: 'p8', name: 'Lucas Silva', jobTitle: 'Founder', email: 'lucas@riohousing.example', phone: '(619) 555-0102', companyId: 'c6', status: 'Prospect' },
  { id: 'p9', name: 'Mia Johnson', jobTitle: 'Store Operations', email: 'mia@mariaretail.example', phone: '(212) 555-0159', companyId: 'c7', status: 'Customer' },
  { id: 'p10', name: 'Ethan Brooks', jobTitle: 'Finance Director', email: 'ethan@mariaretail.example', phone: '(212) 555-0194', companyId: 'c7', status: 'Churned' },
  { id: 'p11', name: 'Isabella Rossi', jobTitle: 'CEO', email: 'isabella@tripabroad.example', phone: '(206) 555-0147', companyId: 'c8', status: 'Customer' },
  { id: 'p12', name: 'Mason Lee', jobTitle: 'Marketing Lead', email: 'mason@bringit.example', phone: '(512) 555-0116', companyId: 'c3', status: 'Churned' },
];

export const deals: Deal[] = [
  { id: 'd1', title: 'Platform licence renewal', companyId: 'c1', value: 12500, stage: 'negotiation', closeDate: '2026-11-14', owner: 'AU' },
  { id: 'd2', title: 'Support add-on', companyId: 'c1', value: 2400, stage: 'won', closeDate: '2026-09-30', owner: 'AU' },
  { id: 'd3', title: 'Office portfolio CRM', companyId: 'c2', value: 4500, stage: 'qualified', closeDate: '2026-12-05', owner: 'JS' },
  { id: 'd4', title: 'Campaign tracking', companyId: 'c3', value: 1400, stage: 'proposal', closeDate: '2026-11-20', owner: 'MK' },
  { id: 'd5', title: 'Guest loyalty programme', companyId: 'c4', value: 18900, stage: 'proposal', closeDate: '2026-12-18', owner: 'JS' },
  { id: 'd6', title: 'Booking integration', companyId: 'c4', value: 6200, stage: 'won', closeDate: '2026-10-08', owner: 'RL' },
  { id: 'd7', title: 'Supplier portal', companyId: 'c5', value: 22000, stage: 'contacted', closeDate: '2027-01-15', owner: 'MK' },
  { id: 'd8', title: 'Tenant management', companyId: 'c6', value: 2700, stage: 'new', closeDate: '2027-01-30', owner: 'RL' },
  { id: 'd9', title: 'Point-of-sale sync', companyId: 'c7', value: 2600, stage: 'negotiation', closeDate: '2026-11-07', owner: 'AU' },
  { id: 'd10', title: 'Group travel package', companyId: 'c8', value: 3750, stage: 'won', closeDate: '2026-10-02', owner: 'JS' },
];
