// The AI Decision Center is driven by the recommendation engine — see
// components/ai/fromApi.js for the mapping. What remains here is presentation
// config and one pure helper.

export const PRIORITY_META = {
  critical: { label: 'Critical', tone: 'danger', dot: '🔴', icon: 'bi-exclamation-octagon' },
  high: { label: 'High', tone: 'warning', dot: '🟠', icon: 'bi-exclamation-triangle' },
  medium: { label: 'Medium', tone: 'gold', dot: '🟡', icon: 'bi-info-circle' },
  low: { label: 'Low', tone: 'olive', dot: '🟢', icon: 'bi-check-circle' },
};

export function greetingFor(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
