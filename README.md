# Sprintiverse V2

Sprintiverse is a customer-support workspace for growing B2B teams.

## Current build

Phase 0: public marketing/landing experience.

Phase 1: authentication, workspace onboarding, team invitations, trial experience, billing selection, sample data, and owner inbox foundation.

## Architecture

- React 19 + Vite
- Supabase Auth + PostgreSQL + Row Level Security
- Vercel deployment target
- Cloudflare/domain layer
- Razorpay billing integration target

## Development rule

This repository is rebuilt from scratch. Do not import the previous Sprintiverse implementation. Preserve validated product/business requirements, but implement the technical system cleanly and incrementally.

## Phase 1 verification checklist

- [ ] Email signup + verification
- [ ] Google OAuth
- [ ] Workspace creation
- [ ] Owner/agent authorization
- [ ] Agent invitations
- [ ] 24-hour trial
- [ ] Sample ticket data
- [ ] Plan selection
- [ ] Razorpay checkout/subscription
- [ ] Production deployment
