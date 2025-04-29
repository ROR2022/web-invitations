import { ReactNode } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  FileCode, 
  Settings, 
  Users, 
  BarChart4 
} from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/packages", label: "Paquetes", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/templates", label: "Plantillas", icon: <FileCode className="h-5 w-5" /> },
    { href: "/admin/features", label: "Características", icon: <Settings className="h-5 w-5" /> },
    { href: "/admin/users", label: "Usuarios", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/reports", label: "Reportes", icon: <BarChart4 className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Panel de Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}