import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  FileText,
  LogOut,
  MessageSquare,
  Package,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import ContentTab from "../components/admin/ContentTab";
import ProductsTab from "../components/admin/ProductsTab";
import { clearSessionParameter, getSessionParameter } from "../utils/urlParams";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getSessionParameter("caffeineAdminToken") !== "litun1001") {
      navigate({ to: "/admin" });
    }
  }, [navigate]);

  const handleLogout = () => {
    clearSessionParameter("caffeineAdminToken");
    navigate({ to: "/admin" });
  };

  if (getSessionParameter("caffeineAdminToken") !== "litun1001") return null;

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      <header className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="font-display text-lg font-bold tracking-[0.2em] text-gold"
            >
              ADOX
            </a>
            <span className="font-body text-xs tracking-widest uppercase text-foreground/30">
              Admin Panel
            </span>
          </div>
          <Button
            type="button"
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-foreground/50 hover:text-primary text-xs tracking-widest uppercase flex items-center gap-2"
          >
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
              Dashboard
            </h1>
            <p className="font-body text-sm text-foreground/40">
              Manage your Adox perfume store
            </p>
          </div>

          <div className="gold-divider mb-8 opacity-30" />

          <Tabs defaultValue="products">
            <TabsList className="bg-card border border-border mb-8 h-auto flex-wrap gap-1 p-1">
              <TabsTrigger
                value="products"
                data-ocid="admin.tab"
                className="font-body text-xs tracking-widest uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
              >
                <Package size={13} /> Products
              </TabsTrigger>
              <TabsTrigger
                value="content"
                data-ocid="admin.tab"
                className="font-body text-xs tracking-widest uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
              >
                <FileText size={13} /> Content
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                data-ocid="admin.tab"
                className="font-body text-xs tracking-widest uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
              >
                <MessageSquare size={13} /> Messages
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                data-ocid="admin.tab"
                className="font-body text-xs tracking-widest uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
              >
                <Settings size={13} /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>

            <TabsContent value="content">
              <ContentTab />
            </TabsContent>

            <TabsContent value="messages">
              <div className="text-center py-20">
                <MessageSquare className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground/40 mb-2">
                  Messages
                </h3>
                <p className="font-body text-sm text-foreground/30">
                  Contact messages will appear here
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="max-w-md">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                  Settings
                </h3>
                <div className="p-6 bg-card border border-border space-y-4">
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-foreground/40 mb-3">
                      Authentication
                    </p>
                    <Button
                      type="button"
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="btn-gold-outline text-xs tracking-widest uppercase flex items-center gap-2"
                    >
                      <LogOut size={13} /> Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
