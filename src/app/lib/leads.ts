import { Redis } from '@upstash/redis';

export type TrackLead = {
  id: string;
  trackStage: string;
  trackTitle: string;
  name: string;
  email: string;
  phone: string;
  format: string;
  submittedAt: string;
};

const LEADS_KEY = 'cybergoat:track_leads';
const MAX_LEADS_STORED = 500;

const redis = Redis.fromEnv();

export async function saveLead(lead: TrackLead): Promise<void> {
  await redis.lpush(LEADS_KEY, JSON.stringify(lead));
  // Keep the list from growing unbounded - trim to the most recent N.
  await redis.ltrim(LEADS_KEY, 0, MAX_LEADS_STORED - 1);
}

export async function getLeads(): Promise<TrackLead[]> {
  const raw = await redis.lrange<string | TrackLead>(LEADS_KEY, 0, -1);
  return raw.map((entry) => (typeof entry === 'string' ? JSON.parse(entry) : entry));
}
