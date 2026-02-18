import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => (
  <>
    <nav>
      <Link to='/'>TODO</Link>
      <Link to='/login'>Login</Link>
    </nav>

    <Outlet />

    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
