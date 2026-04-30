export function badgeColor(priority: 'HIGH' | 'MEDIUM' | 'LOW') {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-700';
    case 'MEDIUM':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-emerald-100 text-emerald-700';
  }
}