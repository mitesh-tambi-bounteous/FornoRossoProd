import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { Footer } from './Footer';

export function AppShell() {
  return (
    <>
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
