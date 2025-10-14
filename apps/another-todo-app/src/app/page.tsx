import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect root to /today
  redirect('/today');
}
