import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <main className="App">
      <Outlet />
    </main>
  );
}

export default AppLayout;
