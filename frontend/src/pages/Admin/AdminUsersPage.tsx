import { Users, ShieldCheck, Mail, User as UserIcon, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';

export function AdminUsersPage() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Access Control</p>
          <h1 className="font-syne text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Active session authorization & role management
          </p>
        </div>

        {/* Backend limitation notice */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 flex items-start gap-4 text-amber-300">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-400" />
          <div className="text-xs space-y-1 leading-relaxed">
            <p className="font-bold text-amber-200">Backend API Notice</p>
            <p>
              The backend service does not currently expose a bulk user directory route (`GET /api/v1/users`).
              In accordance with strict backend protection rules, user administration operates on active authenticated session state.
            </p>
          </div>
        </div>

        {/* User profile card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 space-y-6"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 font-bold text-2xl border border-indigo-500/30">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
            </div>
          </div>

          <hr className="border-border" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-semibold text-foreground truncate max-w-[150px]">{user?.email}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-semibold text-indigo-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
