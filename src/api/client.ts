const getSecurePath = () => window.settings?.secure_path ?? '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getSecurePath()}${path}`, {
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.message ?? `HTTP ${response.status}`);
  if (payload?.code !== undefined && payload.code !== 200 && payload.code !== 0) {
    throw new Error(payload.message ?? 'Request failed');
  }
  return payload;
}

export interface MachineLoadStatus {
  cpu: number;
  mem: { total: number; used: number };
  disk: { total: number; used: number };
  net_in_speed?: number;
  net_out_speed?: number;
  updated_at?: number;
}

export interface Machine {
  id: number;
  name: string;
  notes?: string | null;
  is_active: boolean;
  last_seen_at?: number | null;
  load_status?: MachineLoadStatus | null;
  servers_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface MachineNode {
  id: number;
  name: string;
  type: string;
  host: string;
  port: number;
  show: boolean;
  enabled: boolean;
  sort: number;
}

const unwrap = <T>(payload: any): T => payload?.data as T;

export const machineApi = {
  list: () => request<any>('/server/machine/fetch').then(unwrap<Machine[]>),
  save: (body: Partial<Machine>) => request<any>('/server/machine/save', { method: 'POST', body: JSON.stringify(body) }).then(unwrap),
  remove: (id: number) => request<any>('/server/machine/drop', { method: 'POST', body: JSON.stringify({ id }) }).then(unwrap),
  token: (id: number) => request<any>(`/server/machine/getToken?id=${id}`).then(unwrap<{ token: string }>),
  installCommand: (id: number) => request<any>(`/server/machine/installCommand?id=${id}`).then(unwrap<{ command: string }>),
  resetToken: (id: number) => request<any>('/server/machine/resetToken', { method: 'POST', body: JSON.stringify({ id }) }).then(unwrap<{ token: string }>),
  nodes: (machineId: number) => request<any>(`/server/machine/nodes?machine_id=${machineId}`).then(unwrap<MachineNode[]>),
  history: (machineId: number, limit = 360, rangeHours = 6) => request<any>(`/server/machine/history?machine_id=${machineId}&limit=${limit}&range_hours=${rangeHours}`).then(unwrap),
};

declare global {
  interface Window { settings?: { secure_path?: string } }
}
