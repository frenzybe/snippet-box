export interface ExportBackground {
  id: string;
  name: string;
  value: string;
  type: 'gradient' | 'solid';
}

export const EXPORT_GRADIENTS: ExportBackground[] = [
  { 
    id: 'hyper', 
    name: 'Hyper', 
    value: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
    type: 'gradient'
  },
  { 
    id: 'oceanic', 
    name: 'Oceanic', 
    value: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    type: 'gradient'
  },
  { 
    id: 'cotton', 
    name: 'Cotton Candy', 
    value: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
    type: 'gradient'
  },
  { 
    id: 'sunset', 
    name: 'Sunset', 
    value: 'linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)',
    type: 'gradient'
  },
  { 
    id: 'sublime', 
    name: 'Sublime', 
    value: 'linear-gradient(to top, #0ba360 0%, #3cba92 100%)',
    type: 'gradient'
  },
  { 
    id: 'midnight', 
    name: 'Midnight', 
    value: 'linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)',
    type: 'gradient'
  },
  {
    id: 'crimson',
    name: 'Crimson',
    value: 'linear-gradient(to top, #eb3349, #f45c43)',
    type: 'gradient'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    value: 'linear-gradient(to right, #00c6ff, #0072ff)',
    type: 'gradient'
  }
];

export const EXPORT_COLORS: ExportBackground[] = [
  { id: 'slate', name: 'Slate', value: '#0f172a', type: 'solid' },
  { id: 'zinc', name: 'Zinc', value: '#18181b', type: 'solid' },
  { id: 'neutral', name: 'Neutral', value: '#171717', type: 'solid' },
  { id: 'indigo', name: 'Indigo', value: '#312e81', type: 'solid' },
  { id: 'emerald', name: 'Emerald', value: '#064e3b', type: 'solid' },
  { id: 'rose', name: 'Rose', value: '#4c0519', type: 'solid' },
  { id: 'amber', name: 'Amber', value: '#451a03', type: 'solid' },
  { id: 'violet', name: 'Violet', value: '#2e1065', type: 'solid' }
];

export const EXPORT_PADDINGS = [
  { label: 'Small', value: '16px' },
  { label: 'Medium', value: '32px' },
  { label: 'Large', value: '64px' },
  { label: 'XL', value: '96px' }
];
