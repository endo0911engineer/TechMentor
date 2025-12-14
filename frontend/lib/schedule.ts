import { apiClient } from "./api";

export type Schedule = {
  id: number;
  interviewer_id: number;
  available_from: string;
  available_to: string;
};

export type CreateSchedulePayload = {
  available_from: string;
  available_to: string;   
};

export async function fetchInterviewerSchedules(
  interviewerId: number
): Promise<Schedule[]> {
  return await apiClient(
    `/api/schedules/interviewer/${interviewerId}`
  );
}

export function fetchMySchedules(): Promise<Schedule[]> {
  return apiClient("/api/schedules/me");
}

export async function createSchedule(
  payload: CreateSchedulePayload
): Promise<void> {
  return await apiClient("/api/schedules/me", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}


