// ============================================
// DASHBOARD SERVICE
// Aggregated statistics for dashboard
// ============================================

import type { DashboardStats } from '../types/eoffice';
import { getLetterCount } from './letterService';
import { getPendingDispositionsCount } from './dispositionService';
import { getTodayAgendaCount } from './agendaService';
import { getUnreadCount } from './notificationService';
import { getUpcomingEvents } from './eventService';

/**
 * Get comprehensive dashboard statistics
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [
    incomingLetters,
    outgoingLetters,
    pendingDispositions,
    todayAgendas,
    unreadNotifications,
    upcomingEventsList,
  ] = await Promise.all([
    getLetterCount('incoming'),
    getLetterCount('outgoing'),
    getPendingDispositionsCount(userId),
    getTodayAgendaCount(),
    getUnreadCount(userId),
    getUpcomingEvents(5),
  ]);

  return {
    incomingLetters,
    outgoingLetters,
    pendingDispositions,
    todayAgendas,
    unreadNotifications,
    upcomingEvents: upcomingEventsList.length,
  };
}

/**
 * Get quick stats for overview
 */
export async function getQuickStats(userId: string) {
  const stats = await getDashboardStats(userId);

  return {
    totalLetters: stats.incomingLetters + stats.outgoingLetters,
    pendingTasks: stats.pendingDispositions,
    todaySchedule: stats.todayAgendas,
    unreadMessages: stats.unreadNotifications,
  };
}

/**
 * Get statistics by category
 */
export async function getStatsByCategory() {
  const [incoming, outgoing] = await Promise.all([
    getLetterCount('incoming'),
    getLetterCount('outgoing'),
  ]);

  return {
    incoming,
    outgoing,
    total: incoming + outgoing,
  };
}

/**
 * Get weekly activity summary
 */
export async function getWeeklyActivitySummary(userId: string) {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  // This would need to be implemented with actual date filtering
  // For now, return mock data
  return {
    lettersCreated: 0,
    dispositionsCreated: 0,
    agendasCreated: 0,
    eventsCreated: 0,
    period: {
      from: weekAgo.toISOString(),
      to: today.toISOString(),
    },
  };
}

/**
 * Get productivity metrics
 */
export async function getProductivityMetrics(userId: string) {
  const stats = await getDashboardStats(userId);

  return {
    efficiency: {
      pendingDispositions: stats.pendingDispositions,
      todayAgendas: stats.todayAgendas,
      completionRate: 0, // Would need historical data
    },
    workload: {
      totalLetters: stats.incomingLetters + stats.outgoingLetters,
      unreadNotifications: stats.unreadNotifications,
    },
    upcoming: {
      events: stats.upcomingEvents,
      agendas: stats.todayAgendas,
    },
  };
}
