import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const pricing = `const P=[['Starter','₹1,599/mo','2 seats · 500 tickets'],['Growth','₹4,099/mo','5 seats · 2,500 tickets'],['Pro','₹8,299/mo','15 seats · 10,000 tickets']];`;

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sprintiverse-runtime-fixes',
      transform(code, id) {
        if (!id.endsWith('/src/Entry.jsx')) return null;
        let fixed = code;
        fixed = fixed.replace("UserRound}from'lucide-react'", "Paperclip,UserRound}from'lucide-react'");
        if (!fixed.includes('const P=')) {
          fixed = fixed.replace("]];\nconst css=", "]];\n" + pricing + "\nconst css=");
        }
        return { code: fixed, map: null };
      },
    },
  ],
});
