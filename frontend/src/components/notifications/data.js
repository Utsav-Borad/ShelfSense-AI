// Notification Center placeholder data. Nothing here comes from an API.

export const TYPE_META = {
  'low-stock': { label: 'Low stock', icon: 'bi-arrow-down-circle', tone: 'warning' },
  'near-expiry': { label: 'Near expiry', icon: 'bi-clock-history', tone: 'danger' },
  'dead-stock': { label: 'Dead stock', icon: 'bi-box2-heart', tone: 'muted' },
  'supplier-delay': { label: 'Supplier delay', icon: 'bi-truck', tone: 'warning' },
  'revenue-milestone': { label: 'Revenue milestone', icon: 'bi-graph-up-arrow', tone: 'success' },
  'ai-recommendation': { label: 'AI recommendation', icon: 'bi-stars', tone: 'gold' },
  'report-ready': { label: 'Report ready', icon: 'bi-file-earmark-text', tone: 'primary' },
  'system-update': { label: 'System update', icon: 'bi-arrow-repeat', tone: 'olive' },
};

export const PRIORITY_META = {
  critical: { label: 'Critical', tone: 'danger' },
  important: { label: 'Important', tone: 'warning' },
  general: { label: 'General', tone: 'olive' },
};

// Tabs. `completed` is not a priority — it is where archived items go, which
// is what makes the Archive action mean something.
export const TABS = [
  { id: 'critical', label: 'Critical' },
  { id: 'important', label: 'Important' },
  { id: 'general', label: 'General' },
  { id: 'completed', label: 'Completed' },
];

export const DATE_FILTERS = [
  { id: 'all', label: 'Any time' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'earlier', label: 'Earlier' },
];

export const NOTIFICATIONS = [
  {
    id: 'n1', type: 'low-stock', priority: 'critical', group: 'today', time: '09:14', read: false, archived: false,
    title: 'Toned Milk 1L fell below minimum stock',
    detail: '42 units remaining against a minimum of 60. At current velocity this runs out in 3 days.',
    meta: '42 units left', action: 'Reorder before Thursday',
    context: 'Weekend demand grew 31% while the delivery schedule stayed on Monday. The buffer no longer covers the gap.',
    impact: 'A stockout on this line costs an estimated ₹18,500 over a fortnight, plus the attached basket.',
  },
  {
    id: 'n2', type: 'low-stock', priority: 'critical', group: 'today', time: '09:14', read: false, archived: false,
    title: '3 products reached low stock',
    detail: 'Amul Butter 500g, Instant Coffee 100g and Peanut Butter 340g are all below their minimums.',
    meta: '3 products', action: 'Review reorder list',
    context: 'All three share a 3-day supplier lead time, so they need to be ordered together to land before the weekend.',
    impact: 'Ordering all three in one purchase order avoids three separate delivery charges.',
  },
  {
    id: 'n3', type: 'near-expiry', priority: 'critical', group: 'today', time: '08:52', read: false, archived: false,
    title: '2 products expire within 3 days',
    detail: 'Fresh Cream 250ml (34 units) and Toned Milk 1L (12 units) reach their dates this week.',
    meta: '₹3,850 exposed', action: 'Apply clearance pricing',
    context: 'Sell-through needs to rise 2.1x to clear before the date. Historical elasticity clears this at 12%.',
    impact: 'Acting now protects around ₹3,400 against a full write-off of ₹5,900.',
  },
  {
    id: 'n4', type: 'revenue-milestone', priority: 'general', group: 'today', time: '08:30', read: false, archived: false,
    title: 'Revenue crossed ₹1,00,000 this month',
    detail: 'You reached the milestone eight days earlier than last month.',
    meta: '₹1,02,400', action: 'View the analytics',
    context: 'Dairy and bakery carried the growth, both benefiting from uninterrupted availability.',
    impact: 'At this pace the month closes around ₹1,38,000, roughly 18% above last month.',
  },
  {
    id: 'n5', type: 'ai-recommendation', priority: 'important', group: 'today', time: '08:12', read: false, archived: false,
    title: '4 new AI recommendations are available',
    detail: 'One critical, two medium and one low priority, worth an estimated ₹28,450 combined.',
    meta: '4 recommendations', action: 'Open the decision center',
    context: 'The models re-ran after this morning’s synchronization and found four actionable decisions.',
    impact: 'Following all four is estimated at ₹28,450 of protected or recovered value.',
  },
  {
    id: 'n6', type: 'supplier-delay', priority: 'important', group: 'today', time: '07:48', read: true, archived: false,
    title: 'Krishna Beverages delivered 2 days late',
    detail: 'PUR-1044 arrived on the 5th against a promised date of the 3rd.',
    meta: '2 days late', action: 'Review supplier',
    context: 'This is their fifth late delivery this month. Their reliability score has fallen to 73.',
    impact: 'The delay contributed to two stockout days on beverages.',
  },
  {
    id: 'n7', type: 'supplier-delay', priority: 'general', group: 'today', time: '07:20', read: true, archived: false,
    title: 'Sharma Distributors delivered all orders on time',
    detail: 'Four deliveries this week, all on time and in full.',
    meta: '98% on-time', action: 'View supplier profile',
    context: 'Their on-time rate has held above 95% for eleven consecutive weeks.',
    impact: 'Consistency here is what keeps dairy availability stable.',
  },
  {
    id: 'n8', type: 'report-ready', priority: 'general', group: 'today', time: '06:00', read: true, archived: false,
    title: 'Daily business report is ready',
    detail: 'Sent to owner@shelfsense.ai · 4 pages · PDF',
    meta: '412 KB', action: 'Open the report',
    context: 'Generated automatically after the overnight synchronization completed.',
    impact: 'Covers revenue, stock position and the open recommendations.',
  },
  {
    id: 'n9', type: 'dead-stock', priority: 'important', group: 'yesterday', time: '16:32', read: false, archived: false,
    title: '7 products classified as dead stock',
    detail: 'No recorded sale in 63 days while comparable lines kept moving.',
    meta: '₹42,800 held', action: 'Decide clearance or return',
    context: 'These are not seasonal — similar products in the same categories sold normally over the window.',
    impact: 'Clearance at typical rates returns an estimated ₹29,000 of working capital.',
  },
  {
    id: 'n10', type: 'near-expiry', priority: 'important', group: 'yesterday', time: '14:05', read: true, archived: false,
    title: '12 items enter the 30-day expiry window',
    detail: 'Total exposure of ₹6,150 across dairy and beverages.',
    meta: '12 items', action: 'View expiry schedule',
    context: 'The 30-day flag gives roughly three weeks of selling time, which is when a shallow discount still works.',
    impact: 'Acting within nine days recovers an estimated 68% of the exposed value.',
  },
  {
    id: 'n11', type: 'system-update', priority: 'general', group: 'yesterday', time: '09:12', read: true, archived: false,
    title: 'Synchronization completed successfully',
    detail: 'SYN-1042 · 412 of 412 rows accepted across three reports.',
    meta: '412 rows', action: 'View sync history',
    context: 'All three CSV reports passed validation on the first attempt.',
    impact: 'Analytics and AI recommendations were refreshed against the new position.',
  },
  {
    id: 'n12', type: 'ai-recommendation', priority: 'general', group: 'yesterday', time: '09:12', read: true, archived: false,
    title: 'Discount recommendation accepted',
    detail: 'Fresh Cream 250ml marked down 12% for six days.',
    meta: '₹3,400 recovered', action: 'View outcome',
    context: 'You accepted this recommendation yesterday morning. 31 of 34 units cleared.',
    impact: 'Recovered ₹3,400 against a projected write-off of ₹5,900.',
  },
  {
    id: 'n13', type: 'report-ready', priority: 'general', group: 'earlier', time: '3 days ago', read: true, archived: true,
    title: 'Weekly business summary generated',
    detail: 'Business Performance Summary · 4 pages · PDF',
    meta: '386 KB', action: 'Open the report',
    context: 'Generated on schedule at the close of the week.',
    impact: 'Covers the full week across revenue, stock and supplier performance.',
  },
  {
    id: 'n14', type: 'low-stock', priority: 'important', group: 'earlier', time: '4 days ago', read: true, archived: true,
    title: 'Bakery minimum stock raised',
    detail: 'Weekend stockouts fell from 4 to 1 after the change.',
    meta: 'Resolved', action: 'View inventory',
    context: 'You raised the minimum after three consecutive weekends of bakery stockouts.',
    impact: 'Weekend availability improved from 78% to 96%.',
  },
  {
    id: 'n15', type: 'dead-stock', priority: 'general', group: 'earlier', time: '1 week ago', read: true, archived: true,
    title: '6 dormant household lines cleared',
    detail: '₹11,900 of working capital recovered through clearance.',
    meta: '₹11,900 freed', action: 'View decision history',
    context: 'Cleared following an AI recommendation you accepted last week.',
    impact: 'Capital returned to circulation and the lines were not restocked.',
  },
  {
    id: 'n16', type: 'system-update', priority: 'general', group: 'earlier', time: '1 week ago', read: true, archived: true,
    title: 'Forecast model refreshed',
    detail: 'Confidence rose to 94% after three weeks of daily synchronization.',
    meta: '94% confidence', action: 'View forecast',
    context: 'Prediction accuracy improves with data density. Daily syncing gave the model enough recent signal.',
    impact: 'Reorder recommendations can now be trusted directly rather than treated as a prompt to check.',
  },
];

// The morning brief. Each line points at the notification that evidences it.
export const BRIEF_LINES = [
  { id: 'bl1', target: 'n2', text: '3 products reached low stock.' },
  { id: 'bl2', target: 'n3', text: '2 products are nearing expiry.' },
  { id: 'bl3', target: 'n4', text: 'Revenue crossed ₹1,00,000.' },
  { id: 'bl4', target: 'n7', text: 'Sharma Distributors delivered all orders on time.' },
  { id: 'bl5', target: 'n5', text: '4 new AI recommendations are available.' },
];

export const GROUP_LABELS = { today: 'Today', yesterday: 'Yesterday', earlier: 'Earlier' };

export function greetingFor(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
