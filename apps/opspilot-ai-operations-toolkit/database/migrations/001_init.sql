-- ProcessHarbor Pro reference schema.
-- This migration is intended for a production database such as Postgres,
-- Neon, Supabase, or another SQL database behind the API layer.

create table organizations (
  id text primary key,
  name text not null,
  plan text not null check (plan in ('demo', 'pro')),
  created_at timestamptz not null default now()
);

create table workspace_users (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  authenticated boolean not null default false,
  created_at timestamptz not null default now()
);

create table documents (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  created_by text references workspace_users(id),
  updated_by text references workspace_users(id),
  title text not null,
  document_type text not null,
  status text not null,
  priority text not null,
  owner text not null,
  department text not null,
  business text not null,
  score integer not null,
  risk text not null,
  summary text not null,
  body text not null,
  last_revised date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table document_versions (
  id text primary key,
  document_id text not null references documents(id) on delete cascade,
  label text not null,
  author text not null,
  version_date date not null,
  changes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table training_items (
  id text primary key,
  document_id text not null references documents(id) on delete cascade,
  task text not null,
  owner text not null,
  due text not null,
  done boolean not null default false
);

create table knowledge_articles (
  id text primary key,
  document_id text not null references documents(id) on delete cascade,
  question text not null,
  answer text not null,
  tags jsonb not null default '[]'::jsonb
);

create table gap_findings (
  id text primary key,
  document_id text not null references documents(id) on delete cascade,
  severity text not null,
  title text not null,
  evidence text not null,
  fix text not null,
  status text not null
);

create table audit_events (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  actor_id text not null,
  actor_name text not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_events_organization_created_idx on audit_events(organization_id, created_at desc);
create index documents_organization_status_idx on documents(organization_id, status);
