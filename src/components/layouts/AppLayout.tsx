
import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BarChart2, CreditCard, Home, LogOut, PiggyBank, Settings, Upload, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { title: "Dashboard", path: "/", icon: Home },
    { title: "Transações", path: "/transactions", icon: CreditCard },
    { title: "Upload de Faturas", path: "/upload", icon: Upload },
    { title: "Relatórios", path: "/reports", icon: BarChart2 },
    { title: "Configurações", path: "/settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar menuItems={menuItems} currentPath={location.pathname} />
        <main className="flex-1 p-4 md:p-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <SidebarTrigger className="lg:hidden mr-2" />
                <h1 className="text-2xl font-bold">Controle Financeiro</h1>
              </div>
              
              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal text-xs truncate">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

interface AppSidebarProps {
  menuItems: Array<{ title: string; path: string; icon: React.ComponentType<any> }>;
  currentPath: string;
}

const AppSidebar = ({ menuItems, currentPath }: AppSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4">
          <PiggyBank className="h-6 w-6 text-finance-info" />
          <span className="text-lg font-semibold">FinançasPro</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.path === currentPath}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-3 text-xs text-muted-foreground border-t border-sidebar-border">
          FinançasPro v1.0 © 2025
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppLayout;
