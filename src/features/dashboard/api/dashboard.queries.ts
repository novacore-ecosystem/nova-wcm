"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary, getRecentActivity } from "@/services/dashboard/getDashboardSummary";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  activity: () => [...dashboardKeys.all, "activity"] as const,
};

export function useDashboardSummaryQuery() {
  return useQuery({ queryKey: dashboardKeys.summary(), queryFn: getDashboardSummary });
}

export function useRecentActivityQuery() {
  return useQuery({ queryKey: dashboardKeys.activity(), queryFn: getRecentActivity });
}
