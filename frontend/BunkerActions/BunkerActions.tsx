// bunkerActions.ts
// Central place for all "write" actions from the UI.
// For now these just log and return; later you can swap in real API calls.

import type { RationLevelValue } from "@/components/RationLevel/RationLevel";

export async function SetRationLevel(level: RationLevelValue): Promise<RationLevelValue> {
  console.log("SetRationLevel called with:", level);
  // TODO: replace with API call later
  return level;
}

export async function SetScrubberThreshold(percent: number): Promise<number> {
  console.log("SetScrubberThreshold called with:", percent);
  // TODO: replace with API call later
  return percent;
}

export async function SetLightThreshold(percent: number): Promise<number> {
  console.log("SetLightThreshold called with:", percent);
  // TODO: replace with API call later
  return percent;
}

export async function SetScavengeAtNight(enabled: boolean): Promise<boolean> {
  console.log("SetScavengeAtNight called with:", enabled);
  // TODO: replace with API call later
  return enabled;
}

export type NextDayPayload = {
  powerPercent: number;
  rationLevel: RationLevelValue;
  o2Threshold: number;
  scavengeAtNight: boolean;
};

export async function SetNextDay(payload: NextDayPayload): Promise<NextDayPayload> {
  console.log("SetNextDay called with:", payload);
  // TODO: replace with API call later
  return payload;
}