-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/felvigswnqeubftcwbhz/sql/new)

-- Liked songs table
create table if not exists public.liked_songs (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id text not null,
  song_data jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, song_id)
);

alter table public.liked_songs enable row level security;

drop policy if exists "Users can view their own liked songs" on public.liked_songs;
create policy "Users can view their own liked songs"
  on public.liked_songs for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own liked songs" on public.liked_songs;
create policy "Users can insert their own liked songs"
  on public.liked_songs for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own liked songs" on public.liked_songs;
create policy "Users can delete their own liked songs"
  on public.liked_songs for delete
  using (auth.uid() = user_id);

-- Playlists table
create table if not exists public.playlists (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.playlists enable row level security;

drop policy if exists "Users can view their own playlists" on public.playlists;
create policy "Users can view their own playlists"
  on public.playlists for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own playlists" on public.playlists;
create policy "Users can insert their own playlists"
  on public.playlists for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own playlists" on public.playlists;
create policy "Users can delete their own playlists"
  on public.playlists for delete
  using (auth.uid() = user_id);

-- Playlist songs table
create table if not exists public.playlist_songs (
  id bigint primary key generated always as identity,
  playlist_id bigint not null references public.playlists(id) on delete cascade,
  song_id text not null,
  song_data jsonb not null,
  position integer not null default 0,
  added_at timestamptz not null default now(),
  unique (playlist_id, song_id)
);

alter table public.playlist_songs enable row level security;

drop policy if exists "Users can view their playlist songs" on public.playlist_songs;
create policy "Users can view their playlist songs"
  on public.playlist_songs for select
  using (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
      and playlists.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert songs to their playlists" on public.playlist_songs;
create policy "Users can insert songs to their playlists"
  on public.playlist_songs for insert
  with check (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
      and playlists.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete songs from their playlists" on public.playlist_songs;
create policy "Users can delete songs from their playlists"
  on public.playlist_songs for delete
  using (
    exists (
      select 1 from public.playlists
      where playlists.id = playlist_songs.playlist_id
      and playlists.user_id = auth.uid()
    )
  );
