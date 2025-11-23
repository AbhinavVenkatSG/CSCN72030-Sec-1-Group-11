// bunkerActions.ts
// Central place for all backend mutations triggered from the UI.

import type { RationLevelValue } from "@/components/RationLevel/RationLevel";

const API_BASE_URL = "http://localhost:5244/api";
const BUNKER_STATUS_API_URL = `${API_BASE_URL}/bunker-status`;
const DEVICE_API_URL = `${API_BASE_URL}/device`;

export type DeviceStatus = {
  type: number;
  currentValue: number;
};

async function postJson<TResponse>(url: string, payload: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed (${response.status})`);
  }

  return (await response.json()) as TResponse;
}

async function getDeviceStatuses(): Promise<DeviceStatus[]> {
  const response = await fetch(DEVICE_API_URL);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed (${response.status})`);
  }

  return (await response.json()) as DeviceStatus[];
}

export type NextDayPayload = {
  powerPercent: number;
  rationLevel: RationLevelValue;
  o2Threshold: number;
  scavengeAtNight: boolean;
  coolDownAtNight: boolean;
};

export async function SetNextDay(
  payload: NextDayPayload
): Promise<DeviceStatus[]> {
  // First apply the user's staged settings to BunkerStatuses.
  await postJson<void>(`${BUNKER_STATUS_API_URL}/next-day`, payload);

  // Then trigger the daily device cycle to return the latest readings.
  return getDeviceStatuses();
}
