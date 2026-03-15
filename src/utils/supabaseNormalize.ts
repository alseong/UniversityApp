export const normalizeSupabaseStatus = (status: string): string => {
  switch (status) {
    case "received_offer_and_accepted":
      return "Accepted";
    case "received_offer_and_rejected":
    case "accepted":
    case "early_acceptance":
      return "Offer";
    case "rejected":
      return "Rejected";
    case "waitlisted":
      return "Waitlisted";
    case "deferred":
      return "Deferred";
    case "applied":
    case "pending":
      return "Applied";
    default:
      return status;
  }
};

export const formatStatusLabel = (status: string): string => {
  if (status === "planning_on_applying") return "Planning on applying";
  return status;
};

export const extractAttendingYear = (universityAttendance: string): string => {
  const match = universityAttendance.match(/(?<!\d)(20\d{2})(?!\d)/);
  return match ? match[1] : universityAttendance;
};
