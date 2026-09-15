import type { LucideIcon } from 'lucide-react';
import {
  Antenna,
  Award,
  Bolt,
  BrainCircuit,
  ShieldCheck,
  SlidersHorizontal,
  Terminal,
} from 'lucide-react';

export type PillarTheme = 'emerald' | 'cyan' | 'sky' | 'amber';

export interface PillarMeta {
  theme: PillarTheme;
  icon: LucideIcon;
  glowClass: string;
  badgeClass: string;
  linkClass: string;
  countClass: string;
}

export const PILLARS: PillarMeta[] = [
  {
    theme: 'emerald',
    icon: ShieldCheck,
    glowClass: 'pillar-glow-emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    linkClass: 'text-emerald-600',
    countClass: 'text-[#006c49]',
  },
  {
    theme: 'cyan',
    icon: SlidersHorizontal,
    glowClass: 'pillar-glow-cyan',
    badgeClass: 'bg-cyan-500/10 text-[#00687a] border-cyan-500/20',
    linkClass: 'text-[#00687a]',
    countClass: 'text-[#00687a]',
  },
  {
    theme: 'sky',
    icon: BrainCircuit,
    glowClass: 'pillar-glow-sky',
    badgeClass: 'bg-cyan-500/10 text-sky-600 border-cyan-500/20',
    linkClass: 'text-sky-600',
    countClass: 'text-[#0284C7]',
  },
  {
    theme: 'amber',
    icon: Award,
    glowClass: 'pillar-glow-amber',
    badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    linkClass: 'text-amber-600',
    countClass: 'text-[#855300]',
  },
];

export interface ServiceMeta {
  id: string;
  span: string;
  icon: LucideIcon;
  iconClass: string;
  tagClass: string;
  hoverClass: string;
  image: string;
}

export const SERVICES: ServiceMeta[] = [
  {
    id: 'software',
    span: 'md:col-span-7',
    icon: Terminal,
    iconClass: 'text-[#00687a]',
    tagClass: 'bg-cyan-500/10 text-[#00687a] border-cyan-500/20',
    hoverClass: 'group-hover:text-[#00687a]',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuByP2h6IuoaN1Z6a2J--u4Ia1OK-bK92nSI4LtBNkyZVkTz3gtCjTA0eiRdHxeLTM931SV7ainMtmRXvUO0yor5lPotVf3wWvGyypMlqIxhkbADyYDsbyWh-pFfdZu_I4iQBsuMQQoxNoYrav4tb54kHowi3TbPBAOG0Jxj0hgKdTzq1jVV3HGyUfcIIdXmh4mz4gpcX_UzpTH8ZU0ZaJ9Nmek7uanMzMbP7CQGJDiMDEUVmjrZnaaunA',
  },
  {
    id: 'cyber-security',
    span: 'md:col-span-5',
    icon: ShieldCheck,
    iconClass: 'text-[#006c49]',
    tagClass: 'bg-emerald-500/10 text-[#006c49] border-emerald-500/20',
    hoverClass: 'group-hover:text-[#006c49]',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuANJ20APUrZaU9sZo0OV4m3yQqbkX6Ek5CUrrGcOTjtBOcC-E_t6fO335UA9x7NbV1H3ZfE3GNyjiQubleoHXet-S_mBI8NesLm1cR_6Bi1O6m0MPCB0v0T7mXqee_6p3scLOUYCmgwvyV0Yi3__A_lt0ej7OhhnyGHOjmPaYbTKZzcbfkczy-XOf4kVuwRsqPB21D-5a4T9hPkKtLN7v7o3mahD6eRql_UGjx7xNh8nRTrpmfqGRygmw',
  },
  {
    id: 'power',
    span: 'md:col-span-5',
    icon: Bolt,
    iconClass: 'text-[#855300]',
    tagClass: 'bg-amber-500/10 text-[#855300] border-amber-500/20',
    hoverClass: 'group-hover:text-[#855300]',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAOFhB5lpGaXLAr-yF_p2it0_dkfwjXlrICmILQhVEfAB4SCEY0S7nwxEweTD7eq78M8lEPX7otNaL7fgxFDrx9YClGIlDm6N8eUVVr6T5sQ5srM5zBcOJxVYtRJedNANGMUT4wQL2OjXhmVkOWFVu3O-TQghA1B6shMT3GYqeIBqupdZgQv6PmGLnJZAb2fmEh2zCjiXOeosYcW65MFtuIOdrMGd8pWH0bm8HsGvK79-Y4un3WqYzWkg',
  },
  {
    id: 'telecom',
    span: 'md:col-span-7',
    icon: Antenna,
    iconClass: 'text-[#00687a]',
    tagClass: 'bg-cyan-500/10 text-[#00687a] border-cyan-500/20',
    hoverClass: 'group-hover:text-[#00687a]',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtroWCIVGGKgJVtVucExoeCvq7FrqztrPoenjK5GBOV7gpoglifRm1Ej2QgbK67EOunVkHMvIAcdJeGtcz_VzR3WodfeVyCU6eSPQRcdhaSeHzsAX2fAG7BqEf8PV1OhtS4xCTirHKmi1JuDvlMnb8eB6FUdJTcAd57lEI-D7gb59hH5hHOmHRxZQ_9haw-GtkNlKm2OdENARwFEpiiKX3SpVhHWLNnKeXwtoduIwYO748USH8klchsw',
  },
];

export interface Partner {
  name: string;
  src: string;
}

export const PARTNERS: Partner[] = [
  { name: 'Jahez', src: 'logos/jahez.svg' },
  { name: 'neoleap', src: 'logos/neoleap.jpg' },
  { name: 'Arab National Bank', src: 'logos/anb.png' },
  { name: 'Dynatrace', src: 'logos/dynatrace.svg' },
  { name: 'Alinma Bank', src: 'logos/alinma.svg' },
  { name: 'Bank Albilad', src: 'logos/albilad.svg' },
  { name: 'MODON', src: 'logos/modon.jpg' },
  { name: 'Atlassian', src: 'logos/atlassian.svg' },
  { name: 'Alibaba.com', src: 'logos/alibaba.svg' },
  { name: 'LambdaTest', src: 'logos/lambdatest.svg' },
  { name: 'stc', src: 'logos/stc.svg' },
  { name: 'Mobily', src: 'logos/mobily.svg' },
  { name: 'Saudi Electricity Company', src: 'logos/sec.svg' },
  { name: 'OpenText', src: 'logos/opentext.svg' },
  { name: 'Tricentis', src: 'logos/tricentis.png' },
  { name: 'Katalon', src: 'logos/katalon.svg' },
  { name: 'Checkmarx', src: 'logos/checkmarx.svg' },
  { name: 'SPL', src: 'logos/spl.svg' },
  { name: 'Social Development Bank', src: 'logos/sdb.png' },
  { name: 'HRSD', src: 'logos/hrsd.svg' },
  { name: 'GACA', src: 'logos/gaca.png' },
  { name: 'Central Bank of Oman', src: 'logos/cbo.png' },
  { name: 'Oman Ministry of Labour', src: 'logos/oman-mol.png' },
];

export const CONTACT = {
  phone: '+966 53 086 7489',
  email: 'info@advaninfo.com',
};
