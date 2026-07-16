"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function PortalShell({
  papel, user, children,
}: {
  papel: string; user: any; children: React.ReactNode;
}) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {menuAberto && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          onClick={() => setMenuAberto(false)}
        />
      )}
      <Sidebar papel={papel} open={menuAberto} onNavigate={() => setMenuAberto(false)} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar user={user} onMenuClick={() => setMenuAberto((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ backgroundColor: "#F7F3EE" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
