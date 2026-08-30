import React, { useState, useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import {
  Home, Search, Bell, Users, BarChart3, Settings, Ticket, Plus, LogOut,
  ArrowLeft, X, Store, ShoppingBag, Bold, Italic, Underline, Link2,
  Smile, Languages, MoreHorizontal, Clock, UserRound, Paperclip, Trash2,
  ChevronRight, Check
} from 'lucide-react'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://gaukhsehjypoqdyepcnq.supabase.co',
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
)

const SAMPLE_AGENTS = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav@example.com', status: 'Active', open: 24, csat: '4.8', response: '18m' },
  { id: 2, name: 'Maya Patel', email: 'maya@example.com', status: 'Active', open: 17, csat: '4.6', response: '24m' },
  { id: 3, name: 'Demo Agent', email: 'demo@example.com', status: 'Inactive', open: 9, csat: '4.4', response: '31m' }
]

const SAMPLE_TICKETS = [
  { id: 'SP-1001', subject: 'Where is my order?', customer: 'Emma Wilson', email: 'emma@example.com', status: 'Open', agent: 'Aarav Sharma', order: '#10482', amount: '\u20B98,490', created: 'Today' },
  { id: 'SP-1002', subject: 'Wrong size received', customer: 'Noah Brown', email: 'noah@example.com', status: 'Pending', agent: 'Maya Patel', order: '#10477', amount: '\u20B94,290', created: 'Today' },
  { id: 'SP-1003', subject: 'Refund request', customer: 'Olivia Davis', email: 'olivia@example.com', status: 'Closed', agent: 'Aarav Sharma', order: '#10451', amount: '\u20B912,100', created: 'Yesterday' },
  { id: 'SP-1004', subject: 'Can I change my address?', customer: 'Liam Miller', email: 'liam@example.com', status: 'Open', agent: 'Demo Agent', order: '#10442', amount: '\u20B92,999', created: 'Today' }
]

const PLANS = [
  { name: 'Starter', price: '\u20B91,599', desc: '2 seats \u00B7 500 tickets/mo' },
  { name: 'Growth', price: '\u20B94,099', desc: '5 seats \u00B7 2,500 tickets/mo' },
  { name: 'Pro', price: '\u20B98,299', desc: '15 seats \u00B7 10,000 tickets/mo' }
]

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

:root {
  --bg: #f4f5f7;
  --surface: #ffffff;
  --border: #e5e7eb;
  --text: #111827;
  --muted: #6b7280;
  --primary: #111827;
  --primary-hover: #1f2937;
  --accent: #2563eb;
  --success: #059669;
  --danger: #dc2626;
  --rail: #0f172a;
  --radius: 10px;
}

[data-theme="dark"] {
  --bg: #0b1120;
  --surface: #1e293b;
  --border: #334155;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --primary: #f8fafc;
  --primary-hover: #e2e8f0;
  --rail: #020617;
}

button { font: inherit; cursor: pointer; border: none; background: none; }
input, textarea { font: inherit; }
a { color: inherit; text-decoration: none; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.15s;
}
.btn-primary {
  background: var(--primary);
  color: var(--surface);
}
.btn-primary:hover { background: var(--primary-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
}
.btn-secondary:hover { background: var(--bg); }
.btn-ghost {
  color: var(--muted);
}
.btn-ghost:hover { color: var(--text); background: var(--bg); }
.btn-full { width: 100%; }

.input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  outline: none;
  transition: border-color 0.15s;
}
.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(17,24,39,0.08);
}

.label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text);
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.badge-open { background: #d1fae5; color: #065f46; }
.badge-pending { background: #fef3c7; color: #92400e; }
.badge-closed { background: #f1f5f9; color: #475569; }
[data-theme="dark"] .badge-open { background: #064e3b; color: #6ee7b7; }
[data-theme="dark"] .badge-pending { background: #78350f; color: #fcd34d; }
[data-theme="dark"] .badge-closed { background: #1e293b; color: #94a3b8; }

/* Auth pages */
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--bg);
}
.auth-card {
  width: min(420px, 100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 36px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
}
.auth-card h1 {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 16px 0 6px;
}
.auth-card p {
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 24px;
}
.logo {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.03em;
}
.google-btn {
  width: 100%;
  padding: 11px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.google-btn:hover { background: var(--bg); }
.divider {
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  margin: 16px 0;
  position: relative;
}
.notice {
  margin-top: 14px;
  padding: 12px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  font-size: 13px;
}
[data-theme="dark"] .notice {
  background: #422006;
  color: #fcd34d;
}

/* App shell */
.app {
  display: grid;
  grid-template-columns: 60px 220px 1fr;
  height: 100vh;
  background: var(--bg);
}
.rail {
  background: var(--rail);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  gap: 4px;
}
.rail-logo {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 12px;
}
.rail button {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #94a3b8;
}
.rail button:hover, .rail button.active {
  background: #1e293b;
  color: white;
}
.rail-bottom { margin-top: auto; }

.side {
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.side-header {
  padding: 4px 8px 16px;
}
.side-header b { display: block; font-size: 14px; }
.side-header span { font-size: 12px; color: var(--muted); }
.side-nav-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  padding: 12px 8px 6px;
}
.side button, .side a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 13.5px;
  color: var(--muted);
  width: 100%;
  text-align: left;
}
.side button:hover, .side a:hover {
  background: var(--bg);
  color: var(--text);
}
.side button.active {
  background: var(--bg);
  color: var(--text);
  font-weight: 600;
}
.new-ticket {
  background: var(--primary) !important;
  color: var(--surface) !important;
  font-weight: 600;
  margin-bottom: 12px;
}
.new-ticket:hover { background: var(--primary-hover) !important; }

.main {
  overflow: auto;
  padding: 28px 32px;
}
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}
.main-header .eyebrow {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.main-header h1 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-top: 4px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.header-actions button {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--muted);
}
.header-actions button:hover {
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
.metric span { font-size: 13px; color: var(--muted); font-weight: 500; }
.metric b {
  display: block;
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0 4px;
  letter-spacing: -0.03em;
}
.metric small { font-size: 12px; color: var(--muted); }

.ticket-list {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.ticket-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.ticket-list-header h2 { font-size: 15px; font-weight: 650; }
.ticket-row {
  display: grid;
  grid-template-columns: 36px 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  width: 100%;
  text-align: left;
  color: var(--text);
}
.ticket-row:last-child { border-bottom: none; }
.ticket-row:hover { background: var(--bg); }
.ticket-row b { font-size: 14px; font-weight: 600; }
.ticket-row span { display: block; font-size: 12px; color: var(--muted); margin-top: 2px; }

/* Profile */
.profile { position: relative; }
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--border);
  display: grid;
  place-items: center;
  position: relative;
  color: var(--muted);
}
.avatar .dot {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--success);
  border: 2px solid var(--surface);
}
.profile-menu {
  position: absolute;
  right: 0;
  top: 42px;
  width: 230px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.12);
  z-index: 50;
}
.profile-menu b { display: block; font-size: 13px; }
.profile-menu .email { font-size: 12px; color: var(--muted); margin: 2px 0 10px; }
.profile-menu hr { border: none; border-top: 1px solid var(--border); margin: 10px 0; }
.theme-row {
  display: flex;
  gap: 4px;
  margin: 8px 0 12px;
}
.theme-row button {
  flex: 1;
  padding: 6px;
  font-size: 11px;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--muted);
}
.theme-row button.active {
  background: var(--primary);
  color: var(--surface);
  border-color: var(--primary);
}
.profile-menu > button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 4px;
  font-size: 13px;
}
.profile-menu .danger { color: var(--danger); }

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.5);
  display: grid;
  place-items: start center;
  padding-top: 12vh;
  z-index: 100;
}
.modal {
  width: min(520px, 92%);
  background: var(--surface);
  border-radius: 14px;
  padding: 24px;
  position: relative;
  box-shadow: 0 25px 50px rgba(0,0,0,0.2);
}
.modal h2 { font-size: 17px; margin-bottom: 4px; }
.modal p { font-size: 13px; color: var(--muted); margin-bottom: 16px; }
.modal-close {
  position: absolute;
  right: 14px;
  top: 14px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--muted);
}
.modal-close:hover { background: var(--bg); color: var(--text); }
.search-result {
  display: flex;
  gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px solid var(--border);
  width: 100%;
  text-align: left;
}
.search-result:hover { background: var(--bg); }

/* Ticket detail */
.ticket-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--surface);
}
.ticket-view-header {
  height: 60px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 20px;
  flex-shrink: 0;
}
.ticket-view-header button {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--muted);
}
.ticket-view-header button:hover { background: var(--bg); }
.ticket-view-header b { font-size: 15px; }
.ticket-view-header span { display: block; font-size: 12px; color: var(--muted); }
.ticket-body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 280px;
  overflow: hidden;
}
.messages {
  padding: 24px 28px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bubble {
  max-width: 580px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
}
.bubble.customer { background: var(--surface); }
.bubble.agent {
  margin-left: auto;
  background: var(--bg);
}
.bubble b { font-size: 13px; }
.bubble small { display: block; font-size: 12px; color: var(--muted); margin: 2px 0 6px; }
.bubble p { font-size: 14px; line-height: 1.5; }
.composer {
  border-top: 1px solid var(--border);
  padding: 12px 16px 16px;
}
.composer-tools {
  display: flex;
  gap: 2px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.composer-tools button {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  color: var(--muted);
}
.composer-tools button:hover { background: var(--bg); color: var(--text); }
.composer textarea {
  width: 100%;
  min-height: 80px;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  color: var(--text);
  font-size: 14px;
}
.composer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}
.customer-panel {
  border-left: 1px solid var(--border);
  padding: 20px;
  overflow: auto;
  background: var(--bg);
}
.customer-panel h3 { font-size: 15px; margin-bottom: 2px; }
.customer-panel > span { font-size: 13px; color: var(--muted); display: block; margin-bottom: 16px; }
.customer-panel h4 {
  font-size: 11px;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
  margin: 16px 0 8px;
}
.customer-panel p { font-size: 13px; margin-bottom: 4px; }
.order-box {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
}

/* Settings */
.settings {
  max-width: 960px;
  margin: 0 auto;
}
.settings-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  margin-top: 20px;
}
.settings-nav {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
}
.settings-nav h3 {
  font-size: 14px;
  margin-bottom: 10px;
  padding: 0 6px;
}
.settings-nav button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 13.5px;
  color: var(--muted);
}
.settings-nav button:hover { background: var(--bg); color: var(--text); }
.settings-nav button.active {
  background: var(--primary);
  color: var(--surface);
  font-weight: 600;
}
.settings-content h2 {
  font-size: 18px;
  margin-bottom: 16px;
}
.agent-row, .integration-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.agent-row:last-child, .integration-row:last-child { border-bottom: none; }
.agent-row b, .integration-row b { font-size: 14px; }
.agent-row small, .integration-row p { font-size: 12px; color: var(--muted); }
.agent-row em {
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
}

/* Trial banner */
.trial-banner {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  background: #0f172a;
  color: white;
  padding: 7px 18px;
  border-radius: 0 0 10px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.trial-banner b {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

/* Landing */
.landing {
  min-height: 100vh;
  background: var(--surface);
}
.landing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 6%;
  border-bottom: 1px solid var(--border);
}
.landing-nav {
  display: flex;
  gap: 28px;
}
.landing-nav a { color: var(--muted); font-size: 14px; }
.landing-nav a:hover { color: var(--text); }
.hero {
  text-align: center;
  padding: 90px 20px 70px;
}
.hero .eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}
.hero h1 {
  font-size: clamp(40px, 6vw, 60px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin: 16px 0;
}
.hero h1 span { color: var(--muted); }
.hero p {
  color: var(--muted);
  font-size: 17px;
  max-width: 480px;
  margin: 0 auto 28px;
  line-height: 1.55;
}
.hero-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.section {
  max-width: 1080px;
  margin: 0 auto;
  padding: 60px 24px;
}
.section .eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}
.section h2 {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 10px 0 24px;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.feature {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px;
}
.feature h3 { font-size: 15px; margin-bottom: 6px; }
.feature p { font-size: 13px; color: var(--muted); line-height: 1.5; }
.plan-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.plan {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}
.plan h3 { font-size: 15px; margin-bottom: 8px; }
.plan b { font-size: 26px; display: block; margin-bottom: 6px; }
.plan p { font-size: 13px; color: var(--muted); }

/* Onboarding / Billing */
.setup-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--bg);
}
.setup-card {
  width: min(460px, 100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 36px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
}
.setup-card .eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}
.setup-card h1 {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 12px 0 6px;
}
.setup-card > p {
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 24px;
}
.role-box {
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg);
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 16px;
}
.store-row {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}
.store-row button {
  flex: 1;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
}
.store-row button.selected {
  border-color: var(--primary);
  box-shadow: inset 0 0 0 1px var(--primary);
}
.plans-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
}
.plans-row button {
  padding: 16px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  text-align: left;
}
.plans-row button:hover { border-color: var(--primary); }
.plans-row b { display: block; font-size: 14px; margin-bottom: 4px; }
.plans-row strong { display: block; font-size: 20px; margin-bottom: 2px; }
.plans-row span { font-size: 11px; color: var(--muted); }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 20px;
  color: var(--muted);
  font-size: 14px;
}

@media (max-width: 900px) {
  .app { grid-template-columns: 56px 1fr; }
  .side { display: none; }
  .metrics, .feature-grid, .plan-grid, .plans-row { grid-template-columns: 1fr; }
  .ticket-body { grid-template-columns: 1fr; }
  .customer-panel { display: none; }
  .landing-nav { display: none; }
}
`

function Style() {
  return <style>{styles}</style>
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sp-theme') || 'system')
  useEffect(() => {
    const apply = () => {
      if (theme === 'system') {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      } else {
        document.documentElement.dataset.theme = theme
      }
    }
    apply()
    localStorage.setItem('sp-theme', theme)
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => apply()
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])
  return [theme, setTheme]
}

function ProfileMenu({ session, onSignOut }) {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useTheme()
  const [active, setActive] = useState(() => localStorage.getItem('sp-active') === '1')

  return (
    <div className="profile">
      <button className="avatar" onClick={() => setOpen(!open)}>
        <UserRound size={16} />
        {active && <i className="dot" />}
      </button>
      {open && (
        <div className="profile-menu">
          <b>{session?.user?.user_metadata?.full_name || 'User'}</b>
          <div className="email">{session?.user?.email}</div>
          <hr />
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Theme</div>
          <div className="theme-row">
            {['system', 'light', 'dark'].map(t => (
              <button key={t} className={theme === t ? 'active' : ''} onClick={() => setTheme(t)}>{t}</button>
            ))}
          </div>
          <button onClick={() => {
            const next = !active
            setActive(next)
            localStorage.setItem('sp-active', next ? '1' : '0')
          }}>
            {active ? '\u25CF Active' : '\u25CB Inactive'}
          </button>
          <button className="danger" onClick={onSignOut}>
            <LogOut size={14} style={{ display: 'inline', marginRight: 6 }} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="logo">\u25D2 Sprintiverse</div>
        <nav className="landing-nav">
          <a href="#product">Product</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/signin" className="btn btn-ghost">Sign in</Link>
          <Link to="/signup" className="btn btn-primary">Start free</Link>
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow">SUPPORT OPERATIONS PLATFORM</div>
        <h1>Support that stays<br /><span>in control.</span></h1>
        <p>Tickets, customers, agents and commerce context in one focused workspace.</p>
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-primary" style={{ padding: '13px 20px' }}>Start your 24-hour trial</Link>
          <a href="#product" className="btn btn-secondary" style={{ padding: '13px 20px' }}>Explore platform</a>
        </div>
      </section>

      <section id="product" className="section">
        <div className="eyebrow">PRODUCT</div>
        <h2>Everything your team needs to resolve faster.</h2>
        <div className="feature-grid">
          {['Tickets', 'Customers', 'Team', 'Insights'].map(x => (
            <div className="feature" key={x}>
              <h3>{x}</h3>
              <p>Focused support workflows for modern teams.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="section">
        <div className="eyebrow">PRICING</div>
        <h2>Simple plans that scale.</h2>
        <div className="plan-grid">
          {PLANS.map(p => (
            <div className="plan" key={p.name}>
              <h3>{p.name}</h3>
              <b>{p.price}</b>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="section">
        <div className="eyebrow">FAQ</div>
        <h2>Try before you buy.</h2>
        <p style={{ color: 'var(--muted)', maxWidth: 520 }}>
          Start with a full 24-hour trial. No credit card required. Invite your team and connect your store when you\u2019re ready.
        </p>
      </section>
    </div>
  )
}

function Auth({ isSignup }) {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    const em = email.trim().toLowerCase()

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email: em,
        password,
        options: { data: { full_name: name }, emailRedirectTo: location.origin + '/onboarding' }
      })
      setLoading(false)
      if (error) {
        if (/already|registered/i.test(error.message)) {
          setMsg('You already have an account with this email. Please sign in or use a different email.')
        } else {
          setMsg(error.message)
        }
      } else if (data.session) {
        nav('/onboarding')
      } else {
        setMsg('Check your email to confirm your account.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: em, password })
      setLoading(false)
      if (error) {
        setMsg('There is no account associated with this email. Try sign up or use another email.')
      } else {
        nav('/app')
      }
    }
  }

  return (
    <div className="auth-page">
      <div>
        <Link to="/" className="btn btn-ghost" style={{ marginBottom: 16 }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="auth-card">
          <div className="logo">\u25D2 Sprintiverse</div>
          <h1>{isSignup ? 'Create your account' : 'Sign in'}</h1>
          <p>{isSignup ? 'Start your support workspace.' : 'Access your workspace.'}</p>

          <button
            className="google-btn"
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/app' } })}
          >
            Continue with Google
          </button>
          <div className="divider">or</div>

          <form onSubmit={submit}>
            {isSignup && (
              <div style={{ marginBottom: 12 }}>
                <label className="label">Your name</label>
                <input className="input" required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
              <label className="label">Email</label>
              <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Password</label>
              <input className="input" type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Please wait\u2026' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          {msg && <div className="notice">{msg}</div>}

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
            {isSignup ? 'Already have an account? ' : 'New here? '}
            <Link to={isSignup ? '/signin' : '/signup'} style={{ fontWeight: 600, textDecoration: 'underline' }}>
              {isSignup ? 'Sign in' : 'Create account'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Onboarding() {
  const nav = useNavigate()
  const [workspace, setWorkspace] = useState('')
  const [name, setName] = useState('')
  const [emails, setEmails] = useState([''])
  const [store, setStore] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const create = async () => {
    setMsg('')
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('create_workspace_with_owner', {
        workspace_name: workspace.trim(),
        selected_currency: 'INR'
      })
      if (error) throw error

      const { data: u } = await supabase.auth.getUser()
      if (u?.user) {
        await supabase.from('profiles').upsert({ id: u.user.id, full_name: name.trim() })
      }

      for (const e of emails.filter(Boolean)) {
        await supabase.from('workspace_invitations').insert({
          workspace_id: data,
          email: e.trim().toLowerCase(),
          role: 'agent',
          invited_by: u.user.id
        })
      }

      if (store) {
        await supabase.from('integrations').insert({
          workspace_id: data,
          provider: store,
          status: 'pending'
        })
      }

      sessionStorage.setItem('workspace_id', data)
      nav('/billing')
    } catch (err) {
      setMsg(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="setup-page">
      <div>
        <Link to="/" className="btn btn-ghost" style={{ marginBottom: 16 }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="setup-card">
          <div className="eyebrow">FIRST-TIME SETUP</div>
          <h1>Create your workspace</h1>
          <p>Workspace name cannot be changed later.</p>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Workspace name</label>
            <input className="input" value={workspace} onChange={e => setWorkspace(e.target.value)} placeholder="Acme Support" />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Your name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
          </div>

          <label className="label">Your role</label>
          <div className="role-box">
            <UserRound size={16} /> Owner
          </div>

          <label className="label">Invite agents <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span></label>
          {emails.map((e, i) => (
            <input
              key={i}
              className="input"
              type="email"
              value={e}
              onChange={x => setEmails(emails.map((v, j) => j === i ? x.target.value : v))}
              placeholder="agent@company.com"
              style={{ marginBottom: 8 }}
            />
          ))}
          <button className="btn btn-secondary" style={{ marginBottom: 16 }} onClick={() => setEmails([...emails, ''])}>
            + Add another agent
          </button>

          <label className="label">Store <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span></label>
          <div className="store-row">
            <button className={store === 'shopify' ? 'selected' : ''} onClick={() => setStore(store === 'shopify' ? '' : 'shopify')}>
              <ShoppingBag size={18} /> Shopify
            </button>
            <button className={store === 'woocommerce' ? 'selected' : ''} onClick={() => setStore(store === 'woocommerce' ? '' : 'woocommerce')}>
              <Store size={18} /> WooCommerce
            </button>
          </div>

          {msg && <div className="notice">{msg}</div>}

          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 24 }}
            disabled={!workspace.trim() || !name.trim() || loading}
            onClick={create}
          >
            {loading ? 'Creating\u2026' : 'Create workspace'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Billing() {
  const nav = useNavigate()
  const key = 'sp_trial_' + (sessionStorage.getItem('workspace_id') || 'default')
  const [end, setEnd] = useState(() => Number(localStorage.getItem(key) || 0))

  useEffect(() => {
    const i = setInterval(() => setEnd(Number(localStorage.getItem(key) || 0)), 1000)
    return () => clearInterval(i)
  }, [key])

  const remain = Math.max(0, end - Date.now())
  const h = String(Math.floor(remain / 3600000)).padStart(2, '0')
  const m = String(Math.floor((remain / 60000) % 60)).padStart(2, '0')
  const s = String(Math.floor((remain / 1000) % 60)).padStart(2, '0')

  const startTrial = () => {
    const x = Date.now() + 86400000
    localStorage.setItem(key, String(x))
    setEnd(x)
    nav('/app')
  }

  return (
    <div className="setup-page">
      <div>
        <Link to="/onboarding" className="btn btn-ghost" style={{ marginBottom: 16 }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="setup-card" style={{ width: 'min(520px, 100%)' }}>
          <div className="eyebrow">BILLING</div>
          <h1>Choose your plan</h1>
          <p>Choose a plan or start a 24-hour trial with sample tickets.</p>

          {end > 0 && (
            <div style={{
              margin: '16px 0',
              padding: '12px 14px',
              borderRadius: 10,
              background: '#0f172a',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <Clock size={16} />
              <b style={{ fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{h}:{m}:{s}</b>
              <span style={{ fontSize: 13 }}>trial remaining</span>
            </div>
          )}

          <div className="plans-row">
            {PLANS.map(p => (
              <button key={p.name}>
                <b>{p.name}</b>
                <strong>{p.price}</strong>
                <span>{p.desc}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-full" onClick={startTrial}>
              Skip & start 24-hour trial
            </button>
            <button className="btn btn-primary btn-full" onClick={() => nav('/app')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TicketDetail({ ticket, onBack }) {
  return (
    <div className="ticket-view">
      <header className="ticket-view-header">
        <button onClick={onBack}><ArrowLeft size={18} /></button>
        <div style={{ flex: 1 }}>
          <b>{ticket.subject}</b>
          <span>{ticket.id} \u00B7 Assigned to {ticket.agent}</span>
        </div>
        <MoreHorizontal size={18} style={{ color: 'var(--muted)' }} />
      </header>

      <div className="ticket-body">
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="messages">
            <div className="bubble customer">
              <b>{ticket.customer}</b>
              <small>{ticket.email}</small>
              <p>Hi, I need help with my order. Could you please check the status for me?</p>
            </div>
            <div className="bubble agent">
              <b>{ticket.agent}</b>
              <p>Absolutely \u2014 I\u2019ll check that for you right away.</p>
            </div>
          </div>

          <div className="composer">
            <div className="composer-tools">
              <button title="Bold"><Bold size={15} /></button>
              <button title="Italic"><Italic size={15} /></button>
              <button title="Underline"><Underline size={15} /></button>
              <button title="Link"><Link2 size={15} /></button>
              <button title="Attach"><Paperclip size={15} /></button>
              <button title="Emoji"><Smile size={15} /></button>
              <button title="Language"><Languages size={15} /></button>
            </div>
            <textarea placeholder="Write a reply\u2026" />
            <div className="composer-actions">
              <button className="btn btn-secondary">Send</button>
              <button className="btn btn-primary">Send & close</button>
            </div>
          </div>
        </div>

        <aside className="customer-panel">
          <h3>{ticket.customer}</h3>
          <span>{ticket.email}</span>
          <h4>Timeline</h4>
          <p>Ticket created \u00B7 {ticket.created}</p>
          <p>Last reply \u00B7 Today</p>
          <h4>Last order</h4>
          <div className="order-box">
            <b>{ticket.order}</b>
            <span>{ticket.amount}</span>
          </div>
          <h4>Tickets</h4>
          <p style={{ fontWeight: 600 }}>4 tickets</p>
        </aside>
      </div>
    </div>
  )
}

function SettingsPage({ role, onBack }) {
  const owner = role === 'owner'
  const items = owner
    ? ['Workspace', 'Profile', 'Agents performance', 'Invite agents', 'Integrations', 'Email forwarding', 'Billing']
    : ['Macros', 'Helpdesk', 'Password', 'Notifications']
  const [tab, setTab] = useState(items[0])

  return (
    <div className="settings">
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: 8 }}>
        <ArrowLeft size={16} /> Back
      </button>
      <div className="settings-layout">
        <aside className="settings-nav">
          <h3>{owner ? 'Owner' : 'Agent'} settings</h3>
          {items.map(item => (
            <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </aside>

        <div className="settings-content">
          <h2>{tab}</h2>

          {tab === 'Invite agents' && owner && (
            <div className="card">
              {SAMPLE_AGENTS.map(a => (
                <div className="agent-row" key={a.id}>
                  <div>
                    <b>{a.name}</b>
                    <small>{a.email}</small>
                  </div>
                  <em>{a.status}</em>
                  <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}>
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: 16 }}>+ Invite agent</button>
            </div>
          )}

          {tab === 'Integrations' && owner && (
            <div className="card">
              <div className="integration-row">
                <ShoppingBag size={20} />
                <div style={{ flex: 1 }}>
                  <b>Shopify</b>
                  <p>Connect your Shopify store for order context</p>
                </div>
                <button className="btn btn-primary">Connect</button>
              </div>
              <div className="integration-row">
                <Store size={20} />
                <div style={{ flex: 1 }}>
                  <b>WooCommerce</b>
                  <p>Connect your WooCommerce store</p>
                </div>
                <button className="btn btn-primary">Connect</button>
              </div>
            </div>
          )}

          {tab === 'Agents performance' && owner && (
            <div className="card">
              {SAMPLE_AGENTS.map(a => (
                <div className="agent-row" key={a.id}>
                  <b style={{ minWidth: 130 }}>{a.name}</b>
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>{a.open} open</span>
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>{a.csat} CSAT</span>
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>{a.response}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'Billing' && owner && (
            <div className="card">
              <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Manage your current plan and invoices.</p>
              <div className="plans-row">
                {PLANS.map(p => (
                  <button key={p.name}>
                    <b>{p.name}</b>
                    <strong>{p.price}</strong>
                    <span>{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!['Invite agents', 'Integrations', 'Agents performance', 'Billing'].includes(tab) && (
            <div className="card">
              <p style={{ color: 'var(--muted)' }}>
                {tab === 'Profile'
                  ? 'Use the profile menu (top right) for theme, active status and sign out.'
                  : tab === 'Workspace'
                  ? 'Workspace name is permanent after creation.'
                  : `Configure ${tab} for your workspace.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CreateTicket() {
  const nav = useNavigate()
  return (
    <div className="setup-page">
      <div>
        <button className="btn btn-ghost" onClick={() => { window.close(); nav('/app') }} style={{ marginBottom: 16 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="setup-card">
          <div className="eyebrow">NEW TICKET</div>
          <h1>Create ticket</h1>

          <div style={{ marginBottom: 12 }}>
            <label className="label">Subject</label>
            <input className="input" placeholder="Subject" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Sender email</label>
            <input className="input" type="email" placeholder="customer@email.com" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Receiver email</label>
            <input className="input" type="email" placeholder="support@yourcompany.com" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Body</label>
            <textarea className="input" rows={6} placeholder="Write the message\u2026" style={{ resize: 'vertical' }} />
          </div>

          <div className="composer-tools" style={{ marginBottom: 16 }}>
            <button title="Bold"><Bold size={15} /></button>
            <button title="Italic"><Italic size={15} /></button>
            <button title="Underline"><Underline size={15} /></button>
            <button title="Link"><Link2 size={15} /></button>
            <button title="Attach"><Paperclip size={15} /></button>
            <button title="Emoji"><Smile size={15} /></button>
            <button title="Language"><Languages size={15} /></button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => { window.close(); nav('/app') }}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { window.close(); nav('/app') }}>Send</button>
            <button className="btn btn-primary" onClick={() => { window.close(); nav('/app') }}>Send & close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Workspace() {
  const nav = useNavigate()
  const [session, setSession] = useState(null)
  const [role, setRole] = useState('owner')
  const [page, setPage] = useState('home')
  const [selected, setSelected] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const key = 'sp_trial_' + (sessionStorage.getItem('workspace_id') || 'default')
  const [trialEnd, setTrialEnd] = useState(() => Number(localStorage.getItem(key) || 0))

  useEffect(() => {
    const i = setInterval(() => setTrialEnd(Number(localStorage.getItem(key) || 0)), 1000)
    return () => clearInterval(i)
  }, [key])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        nav('/signin')
        return
      }
      setSession(data.session)
      const { data: m } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('user_id', data.session.user.id)
        .limit(1)
        .maybeSingle()
      if (m?.role) setRole(m.role)
    })
  }, [])

  const filtered = useMemo(() =>
    SAMPLE_TICKETS.filter(t =>
      (t.id + ' ' + t.subject + ' ' + t.customer + ' ' + t.email).toLowerCase().includes(query.toLowerCase())
    ), [query])

  if (!session) {
    return <div style={{ height: '100vh', display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>Loading workspace\u2026</div>
  }

  if (selected) {
    return <TicketDetail ticket={selected} onBack={() => setSelected(null)} />
  }

  const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'there'
  const remain = Math.max(0, trialEnd - Date.now())
  const th = String(Math.floor(remain / 3600000)).padStart(2, '0')
  const tm = String(Math.floor((remain / 60000) % 60)).padStart(2, '0')
  const ts = String(Math.floor((remain / 1000) % 60)).padStart(2, '0')

  const signOut = async () => {
    await supabase.auth.signOut()
    nav('/')
  }

  return (
    <div className="app">
      {trialEnd > Date.now() && (
        <div className="trial-banner">
          <Clock size={14} />
          <b>{th}:{tm}:{ts}</b>
          <span>trial remaining</span>
        </div>
      )}

      <aside className="rail">
        <div className="rail-logo">\u25D2</div>
        <button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}><Home size={18} /></button>
        <button onClick={() => setSearchOpen(true)}><Search size={18} /></button>
        <button className={page === 'notifications' ? 'active' : ''} onClick={() => setPage('notifications')}><Bell size={18} /></button>
        <button className={page === 'customers' ? 'active' : ''} onClick={() => setPage('customers')}><Users size={18} /></button>
        <button className={page === 'stats' ? 'active' : ''} onClick={() => setPage('stats')}><BarChart3 size={18} /></button>
        <div className="rail-bottom">
          <button className={page === 'settings' ? 'active' : ''} onClick={() => setPage('settings')}><Settings size={18} /></button>
        </div>
      </aside>

      <aside className="side">
        <div className="side-header">
          <b>Sprintiverse</b>
          <span>{role === 'owner' ? 'Owner' : 'Agent'} workspace</span>
        </div>
        <button className="new-ticket" onClick={() => window.open('/create-ticket', '_blank')}>
          <Plus size={15} /> Create ticket
        </button>
        <div className="side-nav-label">Tickets</div>
        {['Inbox', 'All tickets', 'Unassigned', 'My tickets', 'Snoozed', 'Closed', 'Spam', 'Trash'].map(x => (
          <button
            key={x}
            className={x === 'Inbox' && page === 'home' ? 'active' : ''}
            onClick={() => setPage(x === 'Inbox' ? 'home' : 'tickets')}
          >
            <Ticket size={15} /> {x}
          </button>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 12 }}>
          <button onClick={() => setPage('settings')}>
            <Settings size={15} /> Settings
          </button>
        </div>
      </aside>

      <main className="main">
        {page === 'settings' ? (
          <SettingsPage role={role} onBack={() => setPage('home')} />
        ) : (
          <>
            <header className="main-header">
              <div>
                <div className="eyebrow">{role.toUpperCase()} WORKSPACE</div>
                <h1>
                  {page === 'home'
                    ? `Hey ${name}, Welcome back!`
                    : page.charAt(0).toUpperCase() + page.slice(1)}
                </h1>
              </div>
              <div className="header-actions">
                <button onClick={() => setSearchOpen(true)}><Search size={17} /></button>
                <button onClick={() => setPage('notifications')}><Bell size={17} /></button>
                <ProfileMenu session={session} onSignOut={signOut} />
              </div>
            </header>

            {page === 'home' && (
              <div className="metrics">
                <div className="metric">
                  <span>First response time</span>
                  <b>18m</b>
                  <small>Sample workspace data</small>
                </div>
                <div className="metric">
                  <span>Resolution time</span>
                  <b>4h 12m</b>
                  <small>Sample workspace data</small>
                </div>
                <div className="metric">
                  <span>Average CSAT</span>
                  <b>4.7 / 5</b>
                  <small>Sample workspace data</small>
                </div>
              </div>
            )}

            {page === 'stats' && (
              <div className="card">
                <h2 style={{ fontSize: 15, marginBottom: 12 }}>All agents performance</h2>
                {SAMPLE_AGENTS.map(a => (
                  <div className="agent-row" key={a.id}>
                    <b style={{ minWidth: 130 }}>{a.name}</b>
                    <span style={{ color: 'var(--muted)', fontSize: 13 }}>{a.open} inbox</span>
                    <span style={{ color: 'var(--muted)', fontSize: 13 }}>{a.csat} CSAT</span>
                    <span style={{ color: 'var(--muted)', fontSize: 13 }}>{a.response} response</span>
                  </div>
                ))}
              </div>
            )}

            {page === 'customers' && (
              <div className="card">
                <h2 style={{ fontSize: 15, marginBottom: 12 }}>Customers with orders</h2>
                {SAMPLE_TICKETS.map(t => (
                  <button
                    key={t.id}
                    className="ticket-row"
                    style={{ gridTemplateColumns: '36px 1fr' }}
                    onClick={() => setSelected(t)}
                  >
                    <Users size={18} style={{ color: 'var(--muted)' }} />
                    <div>
                      <b>{t.customer}</b>
                      <span>{t.email} \u00B7 Last order {t.order}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {page === 'notifications' && (
              <div className="card">
                <h2 style={{ fontSize: 15, marginBottom: 12 }}>Your replies</h2>
                <div className="empty-state">
                  <Bell size={28} />
                  <span>No customer replies to your sent messages yet.</span>
                </div>
              </div>
            )}

            {(page === 'home' || page === 'tickets') && (
              <div className="ticket-list">
                <div className="ticket-list-header">
                  <h2>{page === 'home' ? 'Inbox' : 'Tickets'}</h2>
                  <button className="btn btn-primary" onClick={() => window.open('/create-ticket', '_blank')}>
                    <Plus size={14} /> Create ticket
                  </button>
                </div>
                {SAMPLE_TICKETS.map(t => (
                  <button key={t.id} className="ticket-row" onClick={() => setSelected(t)}>
                    <Ticket size={17} style={{ color: 'var(--muted)' }} />
                    <div>
                      <b>{t.subject}</b>
                      <span>{t.customer} \u00B7 {t.id}</span>
                    </div>
                    <span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{t.created}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {searchOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <button className="modal-close" onClick={() => setSearchOpen(false)}>
              <X size={18} />
            </button>
            <h2>Search tickets</h2>
            <p>Search by ticket ID or customer name.</p>
            <input
              className="input"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="SP-1001 or Emma Wilson"
            />
            {query && filtered.map(t => (
              <button
                key={t.id}
                className="search-result"
                onClick={() => { setSelected(t); setSearchOpen(false) }}
              >
                <Ticket size={16} />
                <div>
                  <b style={{ fontSize: 14 }}>{t.subject}</b>
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>
                    {t.id} \u00B7 {t.customer} \u00B7 {t.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <>
      <Style />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Auth isSignup={false} />} />
          <Route path="/signup" element={<Auth isSignup={true} />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/app" element={<Workspace />} />
          <Route path="*" element={<Workspace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
