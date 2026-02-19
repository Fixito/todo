import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <main>
      <h1>Todo</h1>
    </main>
  );
}
