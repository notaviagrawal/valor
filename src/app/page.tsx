// Redirect to new design for UI development
// Original code is preserved in src/app-backup/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to new design for testing
  redirect('/new-design');
}
