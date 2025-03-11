import ThemeToggle from '@/components/shared/theme-toggle';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      <div className='w-100 flex justify-end gap-4'>
        <UserButton />
        <ThemeToggle />
      </div>
      <h1>Home</h1>
    </div>
  );
}
