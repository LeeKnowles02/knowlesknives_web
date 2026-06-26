export interface DashboardStats {
  totalKnives: number;
  availableKnives: number;
  soldKnives: number;
  reservedKnives?: number;
  madeToOrderKnives?: number;
  totalServices?: number;
  activeServices: number;
  pendingEnquiries: number;
  totalEnquiries?: number;
}
