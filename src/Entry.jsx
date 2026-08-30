import React, { useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  Home, Search, Bell, Users, BarChart3, Settings, Ticket, Plus, LogOut,
  ArrowLeft, X, Store, ShoppingBag, Bold, Italic, Underline, Link2,
  Smile, Languages, MoreHorizontal, Clock, UserRound, Paperclip, Trash2,
  Mail, KeyRound, HelpCircle, SlidersHorizontal, Activity
} from 'lucide-react';

const db = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://gaukhsehjypoqdyepcnq.supabase.co',
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
);

const AGENTS = [
  { name: 'Aarav Sharma', email: 'aarav@example.com', status: 'Active', open: 24, csat: '4.8', response: '18m' },
  { name: 'Maya Patel', email: 'maya@example.com', status: 'Active', open: 17, csat: '4.6', response: '24m' },
  { name: 'Demo Agent', email: 'demo@example.com', status: 'Inactive', open: 9, csat: '4.4', response: '31m' }
];

const TICKETS = [
  { id: 'SP-1001', subject: 'Where is my order?', customer: 'Emma Wilson', email: 'emma@example.com', status: 'Open', agent: 'Aarav Sharma', order: '#10482', amount: '\u20B98,490' },
  { id: 'SP-1002', subject: 'Wrong size received', customer: 'Noah Brown', email: 'noah@example.com', status: 'Pending', agent: 'Maya Patel', order: '#10477', amount: '\u20B94,290' },
  { id: 'SP-1003', subject: 'Refund request', customer: 'Olivia Davis', email: 'olivia@example.com', status: 'Closed', agent: 'Aarav Sharma', order: '#10451', amount: '\u20B912,100' },
  { id: 'SP-1004', subject: 'Can I change my address?', customer: 'Liam Miller', email: 'liam@example.com', status: 'Open', agent: 'Demo Agent', order: '#10442', amount: '\u20B92,999' }
];

const PLANS = [
  { name: 'Starter', price: '\u20B91,599', desc: '2 seats \u00B7 500 tickets / mo' },
  { name: 'Growth', price: '\u20B94,099', desc: '5 seats \u00B7 2,500 tickets / mo' },
  { name: 'Pro', price: '\u20B98,299', desc: '15 seats \u00B7 10,000 tickets / mo' }
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #111827;
  background: #f8fafc;
  -webkit-font-smoothing: antialiased;
}
button, input, textarea { font: inherit; }
button { cursor: pointer; border: none; background: none; }
a { color: inherit; text-decoration: none; }

:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --border: #e5e7eb;
  --text: #111827;
  --muted: #6b7280;
  --primary: #111827;
  --primary-hover: #1f2937;
  --accent: #2563eb;
  --success: #10b981;
  --danger: #ef4444;
  --rail: #0f172a;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #1e293b;
  --border: #334155;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --primary: #f8fafc;
  --primary-hover: #e2e8f0;
  --rail: #020617;
}

.primary {
  background: var(--primary);
  color: var(--surface);
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
  transition: background .15s;
}
.primary:hover { background: var(--primary-hover); }
.primary:disabled { opacity: .5; cursor: not-allowed; }

.secondary {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  border-radius: 8px;
  padding: 9px 14px;
  font-weight: 500;
  font-size: 14px;
}
.secondary:hover { background: var(--bg); }

.full { width: 100%; }

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 16px;
}
.back:hover { color: var(--text); }

.logo {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.03em;
  color: var(--text);
}

.loading {
  height: 100vh;
  display: grid;
  place-items: center;
  color: var(--muted);
  background: var(--bg);
}

/* Auth / Setup / Billing */
.authPage, .setup, .billingPage, .createPage {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: var(--bg);
}
.authCard, .setupCard, .billingCard, .createCard {
  width: min(480px, 100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 36px;
  box-shadow: 0 20px 50px rgba(0,0,0,.06);
}
.authCard h1, .setupCard h1, .billingCard h1, .createCard h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 20px 0 8px;
  color: var(--text);
}
.authCard p, .setupCard p, .billingCard p, .createCard p {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 24px;
}
.authCard input, .setupCard input, .createCard input, .createCard textarea,
.billingCard input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 12px;
  background: var(--surface);
  color: var(--text);
  outline: none;
  transition: border-color .15s;
}
.authCard input:focus, .setupCard input:focus, .createCard input:focus,
.createCard textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(17,24,39,.08);
}
.google {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  background: var(--surface);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--text);
}
.google:hover { background: var(--bg); }
.or {
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  margin: 16px 0;
  position: relative;
}
.notice {
  padding: 12px 14px;
  background: #fef3c7;
  border-radius: 8px;
  color: #92400e;
  font-size: 13px;
  margin-top: 12px;
}
[data-theme="dark"] .notice {
  background: #422006;
  color: #fcd34d;
}
.setupCard label, .createCard label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin: 16px 0 6px;
  color: var(--text);
}
.fixedRole {
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg);
  color: var(--muted);
  font-size: 14px;
}
.storeRow {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}
.storeRow button {
  flex: 1;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  background: var(--surface);
}
.storeRow button.selected {
  border-color: var(--primary);
  box-shadow: inset 0 0 0 1px var(--primary);
}
.trialBanner {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  background: #0f172a;
  color: white;
  padding: 8px 20px;
  border-radius: 0 0 12px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0,0,0,.2);
}
.trialBanner b {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}
.billPlans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 24px 0;
}
.billPlans button {
  padding: 18px 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  text-align: left;
  background: var(--surface);
  color: var(--text);
}
.billPlans button:hover {
  border-color: var(--primary);
}
.billPlans b { display: block; font-size: 15px; margin-bottom: 6px; }
.billPlans strong { display: block; font-size: 22px; margin-bottom: 4px; }
.billPlans span { display: block; font-size: 12px; color: var(--muted); }
.billActions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.billActions .secondary, .billActions .primary { flex: 1; }

/* App shell */
.app {
  display: grid;
  grid-template-columns: 64px 240px 1fr;
  height: 100vh;
  background: var(--bg);
  color: var(--text);
}
.rail {
  background: var(--rail);
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  gap: 6px;
}
.railLogo {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}
.rail button {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #94a3b8;
  transition: all .15s;
}
.rail button:hover, .rail button.on {
  background: #1e293b;
  color: white;
}
.railBottom { margin-top: auto; }

.side {
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.workspace {
  padding: 4px 8px 18px;
}
.workspace b {
  display: block;
  font-size: 15px;
  font-weight: 650;
}
.workspace span {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}
.newTicket {
  background: var(--primary);
  color: var(--surface);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 16px;
}
.newTicket:hover { background: var(--primary-hover); }
.side label {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 12px 8px 6px;
}
.side > button:not(.newTicket),
.sideBottom button {
  padding: 9px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 13.5px;
  text-align: left;
  width: 100%;
}
.side > button:hover,
.sideBottom button:hover {
  background: var(--bg);
  color: var(--text);
}
.side > button.selected {
  background: var(--bg);
  color: var(--text);
  font-weight: 600;
}
.sideBottom { margin-top: auto; padding-top: 12px; }

.app main {
  overflow: auto;
  padding: 28px 32px;
  background: var(--bg);
}
.appHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}
.appHeader .eyebrow {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.appHeader h1 {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-top: 4px;
}
.headerTools {
  display: flex;
  align-items: center;
  gap: 6px;
}
.headerTools > button {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--muted);
}
.headerTools > button:hover {
  background: var(--surface);
  color: var(--text);
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
.metric {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}
.metric span {
  display: block;
  font-size: 13px;
  color: var(--muted);
  font-weight: 500;
}
.metric b {
  display: block;
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0 4px;
  letter-spacing: -0.03em;
}
.metric small {
  font-size: 12px;
  color: var(--muted);
}

.card, .ticketCard {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}
.ticketHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.ticketHead h2 {
  font-size: 16px;
  font-weight: 650;
}

.ticketRow, .customerRow, .result {
  width: 100%;
  display: grid;
  grid-template-columns: 36px 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 14px 8px;
  border-top: 1px solid var(--border);
  text-align: left;
  color: var(--text);
}
.ticketRow:first-of-type, .customerRow:first-of-type { border-top: none; }
.ticketRow:hover, .customerRow:hover, .result:hover {
  background: var(--bg);
}
.ticketRow b, .customerRow b, .result b {
  font-size: 14px;
  font-weight: 600;
}
.ticketRow span, .customerRow small, .result small {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-top: 3px;
}
.status {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
}
.status.Open { background: #dcfce7; color: #166534; }
.status.Pending { background: #fef9c3; color: #854d0e; }
.status.Closed { background: #f1f5f9; color: #475569; }
[data-theme="dark"] .status.Open { background: #14532d; color: #86efac; }
[data-theme="dark"] .status.Pending { background: #713f12; color: #fde047; }
[data-theme="dark"] .status.Closed { background: #1e293b; color: #94a3b8; }

.agentStat, .agentRow {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px 0;
  border-top: 1px solid var(--border);
}
.agentStat:first-of-type, .agentRow:first-of-type { border-top: none; }
.agentStat b, .agentRow b { font-size: 14px; min-width: 140px; }
.agentStat span, .agentRow small {
  font-size: 13px;
  color: var(--muted);
}
.agentRow em {
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
}

.customerRow {
  grid-template-columns: 36px 1fr;
}

/* Profile */
.profile { position: relative; }
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--border);
  display: grid;
  place-items: center;
  position: relative;
  color: var(--muted);
}
.avatar i {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--success);
  border: 2px solid var(--surface);
}
.profileMenu {
  position: absolute;
  right: 0;
  top: 44px;
  width: 240px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 16px 40px rgba(0,0,0,.12);
  z-index: 40;
}
.profileMenu b { display: block; font-size: 14px; }
.profileMenu span {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin: 2px 0 10px;
}
.profileMenu hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 10px 0;
}
.profileMenu label {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.theme {
  display: flex !important;
  gap: 4px;
  margin: 8px 0 12px;
}
.theme button {
  flex: 1;
  padding: 6px;
  font-size: 11px;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--muted);
}
.theme button.on {
  background: var(--primary);
  color: var(--surface);
  border-color: var(--primary);
}
.profileMenu > button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 4px;
  font-size: 13px;
  color: var(--text);
}
.profileMenu .danger { color: var(--danger) !important; }

/* Modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.5);
  display: grid;
  place-items: start center;
  padding-top: 12vh;
  z-index: 50;
}
.searchModal {
  width: min(560px, 92%);
  background: var(--surface);
  border-radius: 14px;
  padding: 24px;
  position: relative;
  box-shadow: 0 25px 60px rgba(0,0,0,.2);
}
.searchModal h2 {
  font-size: 18px;
  margin-bottom: 4px;
}
.searchModal p {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 16px;
}
.searchModal input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  outline: none;
}
.close {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--muted);
}
.close:hover { background: var(--bg); color: var(--text); }
.result {
  grid-template-columns: 32px 1fr;
  border-bottom: 1px solid var(--border);
  padding: 12px 4px;
}

/* Ticket view */
.ticketView {
  height: 100vh;
  background: var(--surface);
  display: flex;
  flex-direction: column;
}
.ticketView > header {
  height: 64px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  flex-shrink: 0;
}
.ticketView header button {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--muted);
}
.ticketView header button:hover { background: var(--bg); }
.ticketView header div { flex: 1; }
.ticketView header b {
  font-size: 15px;
  font-weight: 650;
}
.ticketView header span {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}
.ticketBody {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 300px;
  overflow: hidden;
}
.messages {
  padding: 28px 32px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.customerMsg, .agentMsg {
  max-width: 640px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
}
.customerMsg {
  background: var(--surface);
}
.agentMsg {
  margin-left: auto;
  background: var(--bg);
}
.customerMsg b, .agentMsg b {
  font-size: 13px;
  font-weight: 650;
}
.customerMsg small {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin: 2px 0 8px;
}
.customerMsg p, .agentMsg p {
  font-size: 14px;
  line-height: 1.55;
  margin-top: 6px;
}
.composer {
  border-top: 1px solid var(--border);
  padding: 12px 16px 16px;
  background: var(--surface);
}
.tools {
  display: flex;
  gap: 2px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.tools button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  color: var(--muted);
}
.tools button:hover {
  background: var(--bg);
  color: var(--text);
}
.composer textarea {
  width: 100%;
  min-height: 90px;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  color: var(--text);
  font-size: 14px;
  line-height: 1.5;
}
.composerActions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}
.customerPanel {
  border-left: 1px solid var(--border);
  padding: 24px;
  overflow: auto;
  background: var(--bg);
}
.customerPanel h3 {
  font-size: 15px;
  margin-bottom: 2px;
}
.customerPanel > span {
  display: block;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 16px;
}
.customerPanel h4 {
  font-size: 12px;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
  margin: 18px 0 8px;
}
.customerPanel p {
  font-size: 13px;
  color: var(--text);
  margin-bottom: 4px;
}
.order {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
}

/* Settings */
.settingsPage {
  min-height: 100vh;
  padding: 28px 32px;
  background: var(--bg);
}
.settingsLayout {
  display: grid;
  grid-template-columns: 220px 1fr;
  max-width: 1000px;
  margin: 20px auto 0;
  gap: 28px;
}
.settingsLayout aside,
.settingsCard {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.settingsLayout aside h1 {
  font-size: 16px;
  margin-bottom: 12px;
  padding: 0 4px;
}
.settingsLayout aside button {
  display: flex;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13.5px;
  color: var(--muted);
  text-align: left;
}
.settingsLayout aside button:hover {
  background: var(--bg);
  color: var(--text);
}
.settingsLayout aside button.active {
  background: var(--primary);
  color: var(--surface);
  font-weight: 600;
}
.settingsLayout main h2 {
  font-size: 20px;
  margin-bottom: 16px;
}
.integration {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}
.integration:last-child { border-bottom: none; }
.integration div { flex: 1; }
.integration b { font-size: 14px; }
.integration p {
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
}

/* Create ticket */
.createCard textarea {
  min-height: 160px;
  resize: vertical;
}
.createActions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

/* Landing */
.landing {
  min-height: 100vh;
  background: var(--surface);
  color: var(--text);
}
.landing header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 6%;
  border-bottom: 1px solid var(--border);
}
.landing nav {
  display: flex;
  gap: 28px;
}
.landing nav a {
  color: var(--muted);
  font-size: 14px;
}
.landing nav a:hover { color: var(--text); }
.landing header > div:last-child {
  display: flex;
  align-items: center;
  gap: 12px;
}
.textBtn {
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
}
.textBtn:hover { color: var(--text); }
.hero {
  text-align: center;
  padding: 100px 20px 80px;
}
.hero > span, .marketing > span,
.setupCard > span, .billingCard > span, .createCard > span {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.hero h1 {
  font-size: clamp(42px, 6vw, 64px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin: 18px 0;
}
.hero h1 em {
  font-style: normal;
  color: var(--muted);
}
.hero p {
  color: var(--muted);
  font-size: 18px;
  max-width: 520px;
  margin: 0 auto 32px;
  line-height: 1.6;
}
.hero div {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.large { padding: 13px 20px; font-size: 15px; }
.marketing {
  max-width: 1100px;
  margin: 0 auto;
  padding: 70px 24px;
}
.marketing h2 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 12px 0 28px;
}
.featureGrid, .planGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.planGrid { grid-template-columns: repeat(3, 1fr); }
.feature, .plan {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px;
  background: var(--surface);
}
.feature h3, .plan h3 {
  font-size: 15px;
  margin-bottom: 8px;
}
.feature p, .plan p {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}
.plan b {
  font-size: 26px;
  display: block;
  margin: 10px 0;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 20px;
  color: var(--muted);
  font-size: 14px;
}

@media (max-width: 900px) {
  .app { grid-template-columns: 56px 1fr; }
  .side { display: none; }
  .metrics, .featureGrid, .planGrid, .billPlans {
    grid-template-columns: 1fr;
  }
  .ticketBody { grid-template-columns: 1fr; }
  .customerPanel { display: none; }
  .landing nav { display: none; }
  .hero h1 { font-size: 40px; }
}
`;

function Style() {
  return <style>{css}</style>;
}

function Back({ to = '/' }) {
  return (
    <a className="back" href={to}>
      <ArrowLeft size={16} /> Back
    </a>
  );
}

function Auth({ signup = false }) {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const go = async (e) => {
    e.preventDefault();
    const em = email.trim().toLowerCase();
    setMsg('');

    if (signup) {
      const { data, error } = await db.auth.signUp({
        email: em,
        password: pw,
        options: {
          data: { full_name: name },
          emailRedirectTo: location.origin + '/onboarding'
        }
      });
      if (error) {
        if (error.message.toLowerCase().includes('already') || error.message.toLowerCase().includes('registered')) {
          setMsg('You already have an account with this email. Please sign in or use a different email.');
        } else {
          setMsg(error.message);
        }
      } else if (data.session) {
        nav('/onboarding');
      } else {
        setMsg('Check your email to confirm your account.');
      }
    } else {
      const { error } = await db.auth.signInWithPassword({ email: em, password: pw });
      if (error) {
        setMsg('There is no account associated with this email. Try sign up or use another email.');
      } else {
        nav('/app');
      }
    }
  };

  return (
    <div className="authPage">
      <div>
        <Back />
        <div className="authCard">
          <div className="logo">\u25D2 Sprintiverse</div>
          <h1>{signup ? 'Create your account' : 'Sign in'}</h1>
          <p>{signup ? 'Start your support workspace.' : 'Access your workspace.'}</p>
          <button
            className="google"
            onClick={() =>
              db.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: location.origin + '/app' }
              })
            }
          >
            Continue with Google
          </button>
          <div className="or">or</div>
          <form onSubmit={go}>
            {signup && (
              <input
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              minLength={8}
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <button className="primary full" type="submit">
              {signup ? 'Create account' : 'Sign in'}
            </button>
          </form>
          {msg && <div className="notice">{msg}</div>}
          <p style={{ marginTop: 20, fontSize: 13, textAlign: 'center', color: 'var(--muted)' }}>
            {signup ? 'Already have an account? ' : 'New here? '}
            <a href={signup ? '/signin' : '/signup'} style={{ fontWeight: 600, textDecoration: 'underline' }}>
              {signup ? 'Sign in' : 'Create account'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function Onboard() {
  const nav = useNavigate();
  const [w, setW] = useState('');
  const [n, setN] = useState('');
  const [emails, setEmails] = useState(['']);
  const [store, setStore] = useState('');
  const [msg, setMsg] = useState('');

  const create = async () => {
    setMsg('');
    const { data, error } = await db.rpc('create_workspace_with_owner', {
      workspace_name: w.trim(),
      selected_currency: 'INR'
    });
    if (error) {
      setMsg(error.message);
      return;
    }
    const { data: u } = await db.auth.getUser();
    if (u?.user) {
      await db.from('profiles').upsert({ id: u.user.id, full_name: n.trim() });
    }
    for (const e of emails.filter(Boolean)) {
      await db.from('workspace_invitations').insert({
        workspace_id: data,
        email: e.trim().toLowerCase(),
        role: 'agent',
        invited_by: u.user.id
      });
    }
    if (store) {
      await db.from('integrations').insert({
        workspace_id: data,
        provider: store,
        status: 'pending'
      });
    }
    sessionStorage.setItem('workspace_id', data);
    nav('/billing');
  };

  return (
    <div className="setup">
      <div>
        <Back />
        <div className="setupCard">
          <span>FIRST-TIME SETUP</span>
          <h1>Create your workspace</h1>
          <p>Workspace name cannot be changed later.</p>

          <label>Workspace name</label>
          <input
            value={w}
            onChange={(e) => setW(e.target.value)}
            placeholder="Acme Support"
          />

          <label>Your name</label>
          <input
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="Full name"
          />

          <label>Your role</label>
          <div className="fixedRole">
            <UserRound size={16} /> Owner
          </div>

          <label>
            Invite agents <small style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</small>
          </label>
          {emails.map((e, i) => (
            <input
              key={i}
              type="email"
              value={e}
              onChange={(x) =>
                setEmails(emails.map((v, j) => (j === i ? x.target.value : v)))
              }
              placeholder="agent@company.com"
            />
          ))}
          <button
            className="secondary"
            style={{ marginTop: 4, marginBottom: 8 }}
            onClick={() => setEmails([...emails, ''])}
          >
            + Add another agent
          </button>

          <label>
            Store <small style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</small>
          </label>
          <div className="storeRow">
            <button
              className={store === 'shopify' ? 'selected' : ''}
              onClick={() => setStore(store === 'shopify' ? '' : 'shopify')}
            >
              <ShoppingBag size={18} /> Shopify
            </button>
            <button
              className={store === 'woocommerce' ? 'selected' : ''}
              onClick={() => setStore(store === 'woocommerce' ? '' : 'woocommerce')}
            >
              <Store size={18} /> WooCommerce
            </button>
          </div>

          {msg && <div className="notice">{msg}</div>}

          <button
            className="primary full"
            style={{ marginTop: 24 }}
            disabled={!w.trim() || !n.trim()}
            onClick={create}
          >
            Create workspace
          </button>
        </div>
      </div>
    </div>
  );
}

function Billing() {
  const nav = useNavigate();
  const key = 'sp_trial_' + (sessionStorage.getItem('workspace_id') || 'default');
  const [end, setEnd] = useState(Number(localStorage.getItem(key) || 0));

  useEffect(() => {
    const i = setInterval(() => setEnd(Number(localStorage.getItem(key) || 0)), 1000);
    return () => clearInterval(i);
  }, [key]);

  const remain = Math.max(0, end - Date.now());
  const h = String(Math.floor(remain / 3600000)).padStart(2, '0');
  const m = String(Math.floor((remain / 60000) % 60)).padStart(2, '0');
  const s = String(Math.floor((remain / 1000) % 60)).padStart(2, '0');

  const startTrial = () => {
    const x = Date.now() + 86400000;
    localStorage.setItem(key, String(x));
    setEnd(x);
    nav('/app');
  };

  return (
    <div className="billingPage">
      <div>
        <Back to="/onboarding" />
        <div className="billingCard" style={{ width: 'min(560px, 100%)' }}>
          <span>BILLING</span>
          <h1>Choose your plan</h1>
          <p>Choose a plan or start a 24-hour trial with sample tickets.</p>

          {end > 0 && (
            <div className="trial" style={{
              margin: '20px 0',
              padding: '14px 16px',
              borderRadius: 10,
              background: '#0f172a',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <Clock size={18} />
              <b style={{ fontSize: 20, fontVariantNumeric: 'tabular-nums' }}>{h}:{m}:{s}</b>
              <span style={{ fontSize: 13 }}>trial remaining</span>
            </div>
          )}

          <div className="billPlans">
            {PLANS.map((p) => (
              <button key={p.name}>
                <b>{p.name}</b>
                <strong>{p.price}</strong>
                <span>{p.desc}</span>
              </button>
            ))}
          </div>

          <div className="billActions">
            <button className="secondary" onClick={startTrial}>
              Skip & start 24-hour trial
            </button>
            <button className="primary" onClick={() => nav('/app')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Profile({ session }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('sp-theme') || 'system');
  const [active, setActive] = useState(localStorage.getItem('sp-active') === '1');
  const nav = useNavigate();

  useEffect(() => {
    const apply = () => {
      if (theme === 'system') {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      } else {
        document.documentElement.dataset.theme = theme;
      }
    };
    apply();
    localStorage.setItem('sp-theme', theme);
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => apply();
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  return (
    <div className="profile">
      <button className="avatar" onClick={() => setOpen(!open)}>
        <UserRound size={18} />
        {active && <i />}
      </button>
      {open && (
        <div className="profileMenu">
          <b>{session.user.user_metadata?.full_name || 'User'}</b>
          <span>{session.user.email}</span>
          <hr />
          <label>Theme</label>
          <div className="theme">
            {['system', 'light', 'dark'].map((t) => (
              <button
                key={t}
                className={theme === t ? 'on' : ''}
                onClick={() => setTheme(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              const x = !active;
              setActive(x);
              localStorage.setItem('sp-active', x ? '1' : '0');
            }}
          >
            {active ? '\u25CF Active' : '\u25CB Inactive'}
          </button>
          <button
            className="danger"
            onClick={async () => {
              await db.auth.signOut();
              nav('/');
            }}
          >
            <LogOut size={15} style={{ display: 'inline', marginRight: 6 }} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="metric">
      <span>{title}</span>
      <b>{value}</b>
      <small>Sample workspace data</small>
    </div>
  );
}

function TicketView({ t, back }) {
  return (
    <div className="ticketView">
      <header>
        <button onClick={back}><ArrowLeft size={18} /></button>
        <div>
          <b>{t.subject}</b>
          <span>{t.id} \u00B7 Assigned to {t.agent}</span>
        </div>
        <MoreHorizontal size={18} style={{ color: 'var(--muted)' }} />
      </header>
      <div className="ticketBody">
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="messages">
            <div className="customerMsg">
              <b>{t.customer}</b>
              <small>{t.email}</small>
              <p>Hi, I need help with my order. Could you please check the status for me?</p>
            </div>
            <div className="agentMsg">
              <b>{t.agent}</b>
              <p>Absolutely \u2014 I\u2019ll check that for you right away.</p>
            </div>
          </div>
          <div className="composer">
            <div className="tools">
              <button title="Bold"><Bold size={16} /></button>
              <button title="Italic"><Italic size={16} /></button>
              <button title="Underline"><Underline size={16} /></button>
              <button title="Link"><Link2 size={16} /></button>
              <button title="Attach"><Paperclip size={16} /></button>
              <button title="Emoji"><Smile size={16} /></button>
              <button title="Language"><Languages size={16} /></button>
            </div>
            <textarea placeholder="Write a reply\u2026" />
            <div className="composerActions">
              <button className="secondary">Send</button>
              <button className="primary">Send & close</button>
            </div>
          </div>
        </div>
        <aside className="customerPanel">
          <h3>{t.customer}</h3>
          <span>{t.email}</span>
          <h4>Timeline</h4>
          <p>Ticket created \u00B7 Today</p>
          <p>Last reply \u00B7 Today</p>
          <h4>Last order</h4>
          <div className="order">
            <b>{t.order}</b>
            <span>{t.amount}</span>
          </div>
          <h4>Tickets</h4>
          <p style={{ fontWeight: 600 }}>4 tickets</p>
        </aside>
      </div>
    </div>
  );
}

function SettingsPage({ role }) {
  const nav = useNavigate();
  const owner = role === 'owner';
  const items = owner
    ? [
        ['workspace', 'Workspace'],
        ['profile', 'Profile'],
        ['performance', 'Agents performance'],
        ['invite', 'Invite agents'],
        ['integrations', 'Integrations'],
        ['forwarding', 'Email forwarding'],
        ['billing', 'Billing']
      ]
    : [
        ['macros', 'Macros'],
        ['helpdesk', 'Helpdesk'],
        ['password', 'Password'],
        ['notifications', 'Notifications']
      ];
  const [tab, setTab] = useState(items[0][0]);

  return (
    <div className="settingsPage">
      <button className="back" onClick={() => nav('/app')}>
        <ArrowLeft size={16} /> Back
      </button>
      <div className="settingsLayout">
        <aside>
          <h1>{owner ? 'Owner' : 'Agent'} settings</h1>
          {items.map(([id, label]) => (
            <button
              key={id}
              className={tab === id ? 'active' : ''}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </aside>
        <main>
          <h2>{items.find((x) => x[0] === tab)?.[1]}</h2>

          {tab === 'invite' && owner && (
            <div className="settingsCard">
              <h3 style={{ marginBottom: 12, fontSize: 15 }}>Agents</h3>
              {AGENTS.map((a) => (
                <div className="agentRow" key={a.email}>
                  <span>
                    <b>{a.name}</b>
                    <small>{a.email}</small>
                  </span>
                  <em>{a.status}</em>
                  <button className="secondary" style={{ padding: '6px 10px', fontSize: 12 }}>
                    <Trash2 size={14} style={{ display: 'inline', marginRight: 4 }} /> Remove
                  </button>
                </div>
              ))}
              <button className="primary" style={{ marginTop: 16 }}>
                + Invite agent
              </button>
            </div>
          )}

          {tab === 'integrations' && owner && (
            <div className="settingsCard">
              <div className="integration">
                <ShoppingBag size={22} />
                <div>
                  <b>Shopify</b>
                  <p>Connect your Shopify store for order context</p>
                </div>
                <button className="primary">Connect</button>
              </div>
              <div className="integration">
                <Store size={22} />
                <div>
                  <b>WooCommerce</b>
                  <p>Connect your WooCommerce store</p>
                </div>
                <button className="primary">Connect</button>
              </div>
            </div>
          )}

          {tab === 'performance' && owner && (
            <div className="settingsCard">
              {AGENTS.map((a) => (
                <div className="agentStat" key={a.email}>
                  <b>{a.name}</b>
                  <span>{a.open} open</span>
                  <span>{a.csat} CSAT</span>
                  <span>{a.response} response</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'billing' && owner && (
            <div className="settingsCard">
              <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Current plan management and invoices.</p>
              <div className="billPlans" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                {PLANS.map((p) => (
                  <button key={p.name}>
                    <b>{p.name}</b>
                    <strong>{p.price}</strong>
                    <span>{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!['invite', 'integrations', 'performance', 'billing'].includes(tab) && (
            <div className="settingsCard">
              <p style={{ color: 'var(--muted)' }}>
                {tab === 'profile'
                  ? 'Use the profile menu (top right) for theme, active status and sign out.'
                  : tab === 'workspace'
                  ? 'Workspace name is permanent after creation.'
                  : `Configure ${items.find((x) => x[0] === tab)?.[1]} for your workspace.`}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function CreateTicket() {
  const nav = useNavigate();
  return (
    <div className="createPage">
      <div>
        <Back to="/app" />
        <div className="createCard">
          <span>NEW TICKET</span>
          <h1>Create ticket</h1>

          <label>Subject</label>
          <input placeholder="Subject" />

          <label>Sender email</label>
          <input type="email" placeholder="customer@email.com" />

          <label>Receiver email</label>
          <input type="email" placeholder="support@yourcompany.com" />

          <label>Body</label>
          <textarea placeholder="Write the message\u2026" />

          <div className="tools" style={{ marginTop: 12 }}>
            <button title="Bold"><Bold size={16} /></button>
            <button title="Italic"><Italic size={16} /></button>
            <button title="Underline"><Underline size={16} /></button>
            <button title="Link"><Link2 size={16} /></button>
            <button title="Attach"><Paperclip size={16} /></button>
            <button title="Emoji"><Smile size={16} /></button>
            <button title="Language"><Languages size={16} /></button>
          </div>

          <div className="createActions">
            <button className="secondary" onClick={() => { window.close(); nav('/app'); }}>
              Cancel
            </button>
            <button className="primary" onClick={() => { window.close(); nav('/app'); }}>
              Send
            </button>
            <button className="primary" onClick={() => { window.close(); nav('/app'); }}>
              Send & close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Workspace() {
  const nav = useNavigate();
  const [session, setSession] = useState(null);
  const [role, setRole] = useState('owner');
  const [page, setPage] = useState('home');
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState('');

  const key = 'sp_trial_' + (sessionStorage.getItem('workspace_id') || 'default');
  const [trialEnd, setTrialEnd] = useState(Number(localStorage.getItem(key) || 0));

  useEffect(() => {
    const i = setInterval(() => setTrialEnd(Number(localStorage.getItem(key) || 0)), 1000);
    return () => clearInterval(i);
  }, [key]);

  useEffect(() => {
    db.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        nav('/signin');
        return;
      }
      setSession(data.session);
      const { data: m } = await db
        .from('workspace_members')
        .select('role')
        .eq('user_id', data.session.user.id)
        .limit(1)
        .maybeSingle();
      setRole(m?.role || 'owner');
    });
  }, []);

  const found = useMemo(
    () =>
      TICKETS.filter((t) =>
        (t.id + ' ' + t.subject + ' ' + t.customer + ' ' + t.email)
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [q]
  );

  if (!session) return <div className="loading">Loading workspace\u2026</div>;
  if (sel) return <TicketView t={sel} back={() => setSel(null)} />;

  const name =
    session.user.user_metadata?.full_name ||
    session.user.email?.split('@')[0] ||
    'there';

  const remain = Math.max(0, trialEnd - Date.now());
  const th = String(Math.floor(remain / 3600000)).padStart(2, '0');
  const tm = String(Math.floor((remain / 60000) % 60)).padStart(2, '0');
  const ts = String(Math.floor((remain / 1000) % 60)).padStart(2, '0');

  return (
    <div className="app">
      {trialEnd > Date.now() && (
        <div className="trialBanner">
          <Clock size={15} />
          <b>{th}:{tm}:{ts}</b>
          <span>trial remaining</span>
        </div>
      )}

      <aside className="rail">
        <div className="railLogo">\u25D2</div>
        <button className={page === 'home' ? 'on' : ''} onClick={() => setPage('home')}>
          <Home size={19} />
        </button>
        <button onClick={() => setSearch(true)}>
          <Search size={19} />
        </button>
        <button className={page === 'notifications' ? 'on' : ''} onClick={() => setPage('notifications')}>
          <Bell size={19} />
        </button>
        <button className={page === 'customers' ? 'on' : ''} onClick={() => setPage('customers')}>
          <Users size={19} />
        </button>
        <button className={page === 'stats' ? 'on' : ''} onClick={() => setPage('stats')}>
          <BarChart3 size={19} />
        </button>
        <div className="railBottom">
          <button className={page === 'settings' ? 'on' : ''} onClick={() => setPage('settings')}>
            <Settings size={19} />
          </button>
        </div>
      </aside>

      <aside className="side">
        <div className="workspace">
          <b>Sprintiverse</b>
          <span>{role === 'owner' ? 'Owner' : 'Agent'} workspace</span>
        </div>
        <button
          className="newTicket"
          onClick={() => window.open('/create-ticket', '_blank')}
        >
          <Plus size={16} /> Create ticket
        </button>
        <label>Tickets</label>
        {['Inbox', 'All tickets', 'Unassigned', 'My tickets', 'Snoozed', 'Closed', 'Spam', 'Trash'].map(
          (x) => (
            <button
              key={x}
              className={x === 'Inbox' && page === 'home' ? 'selected' : ''}
              onClick={() => setPage(x === 'Inbox' ? 'home' : 'tickets')}
            >
              <Ticket size={15} /> {x}
            </button>
          )
        )}
        <div className="sideBottom">
          <button onClick={() => setPage('settings')}>
            <Settings size={15} /> Settings
          </button>
        </div>
      </aside>

      <main>
        {page === 'settings' ? (
          <SettingsPage role={role} />
        ) : (
          <>
            <header className="appHeader">
              <div>
                <div className="eyebrow">{role.toUpperCase()} WORKSPACE</div>
                <h1>
                  {page === 'home'
                    ? `Hey ${name}, Welcome back!`
                    : page.charAt(0).toUpperCase() + page.slice(1)}
                </h1>
              </div>
              <div className="headerTools">
                <button onClick={() => setSearch(true)}><Search size={18} /></button>
                <button onClick={() => setPage('notifications')}><Bell size={18} /></button>
                <Profile session={session} />
              </div>
            </header>

            {page === 'home' && (
              <div className="metrics">
                <Metric title="First response time" value="18m" />
                <Metric title="Resolution time" value="4h 12m" />
                <Metric title="Average CSAT" value="4.7 / 5" />
              </div>
            )}

            {page === 'stats' && (
              <div className="card">
                <h2 style={{ fontSize: 16, marginBottom: 8 }}>All agents performance</h2>
                {AGENTS.map((a) => (
                  <div className="agentStat" key={a.email}>
                    <b>{a.name}</b>
                    <span>{a.open} inbox</span>
                    <span>{a.csat} CSAT</span>
                    <span>{a.response} response</span>
                  </div>
                ))}
              </div>
            )}

            {page === 'customers' && (
              <div className="card">
                <h2 style={{ fontSize: 16, marginBottom: 8 }}>Customers with orders</h2>
                {TICKETS.map((t) => (
                  <button
                    key={t.id}
                    className="customerRow"
                    onClick={() => setSel(t)}
                  >
                    <Users size={18} style={{ color: 'var(--muted)' }} />
                    <span>
                      <b>{t.customer}</b>
                      <small>{t.email} \u00B7 Last order {t.order}</small>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {page === 'notifications' && (
              <div className="card">
                <h2 style={{ fontSize: 16, marginBottom: 8 }}>Your replies</h2>
                <div className="empty">
                  <Bell size={28} />
                  <span>No customer replies to your sent messages yet.</span>
                </div>
              </div>
            )}

            {(page === 'home' || page === 'tickets') && (
              <div className="ticketCard">
                <div className="ticketHead">
                  <h2>{page === 'home' ? 'Inbox' : 'Tickets'}</h2>
                  <button
                    className="primary"
                    onClick={() => window.open('/create-ticket', '_blank')}
                  >
                    <Plus size={15} style={{ display: 'inline', marginRight: 4 }} /> Create ticket
                  </button>
                </div>
                {TICKETS.map((t) => (
                  <button
                    key={t.id}
                    className="ticketRow"
                    onClick={() => setSel(t)}
                  >
                    <Ticket size={18} style={{ color: 'var(--muted)' }} />
                    <div>
                      <b>{t.subject}</b>
                      <span>{t.customer} \u00B7 {t.id}</span>
                    </div>
                    <span className={`status ${t.status}`}>{t.status}</span>
                    <small style={{ color: 'var(--muted)' }}>Today</small>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {search && (
        <div className="modal">
          <div className="searchModal">
            <button className="close" onClick={() => setSearch(false)}>
              <X size={18} />
            </button>
            <h2>Search tickets</h2>
            <p>Search by ticket ID or customer name.</p>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="SP-1001 or Emma Wilson"
            />
            {q &&
              found.map((t) => (
                <button
                  key={t.id}
                  className="result"
                  onClick={() => {
                    setSel(t);
                    setSearch(false);
                  }}
                >
                  <Ticket size={16} />
                  <span>
                    <b>{t.subject}</b>
                    <small>
                      {t.id} \u00B7 {t.customer} \u00B7 {t.status}
                    </small>
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Landing() {
  return (
    <div className="landing">
      <header>
        <div className="logo">\u25D2 Sprintiverse</div>
        <nav>
          <a href="#product">Product</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div>
          <a className="textBtn" href="/signin">Sign in</a>
          <a className="primary" href="/signup">Start free</a>
        </div>
      </header>

      <section className="hero">
        <span>SUPPORT OPERATIONS PLATFORM</span>
        <h1>
          Support that stays<br />
          <em>in control.</em>
        </h1>
        <p>
          Tickets, customers, agents and commerce context in one focused workspace.
        </p>
        <div>
          <a className="primary large" href="/signup">
            Start your 24-hour trial
          </a>
          <a className="secondary large" href="#product">
            Explore platform
          </a>
        </div>
      </section>

      <section id="product" className="marketing">
        <span>PRODUCT</span>
        <h2>Everything your team needs to resolve faster.</h2>
        <div className="featureGrid">
          {['Tickets', 'Customers', 'Team', 'Insights'].map((x) => (
            <div className="feature" key={x}>
              <h3>{x}</h3>
              <p>Focused support workflows for modern teams.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="marketing">
        <span>PRICING</span>
        <h2>Simple plans that scale.</h2>
        <div className="planGrid">
          {PLANS.map((p) => (
            <div className="plan" key={p.name}>
              <h3>{p.name}</h3>
              <b>{p.price}</b>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="marketing">
        <span>FAQ</span>
        <h2>Try before you buy.</h2>
        <p style={{ color: 'var(--muted)', maxWidth: 560 }}>
          Start with a full 24-hour trial. No credit card required. Invite your team and connect your store when you\u2019re ready.
        </p>
      </section>
    </div>
  );
}

function App() {
  const p = location.pathname;
  return (
    <>
      <Style />
      {p === '/' ? (
        <Landing />
      ) : p === '/signin' ? (
        <Auth />
      ) : p === '/signup' ? (
        <Auth signup />
      ) : p === '/onboarding' ? (
        <Onboard />
      ) : p === '/billing' ? (
        <Billing />
      ) : p === '/create-ticket' ? (
        <CreateTicket />
      ) : (
        <Workspace />
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
