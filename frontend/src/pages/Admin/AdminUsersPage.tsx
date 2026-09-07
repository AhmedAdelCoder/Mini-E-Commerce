import { useState } from 'react';
import { Users, ShieldCheck, User as UserIcon, Mail, Search, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { Skeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';
import type { AdminUser } from '@/types';

function RoleBadge({ role }: { role: AdminUser['role'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider',
        role === 'admin'
          ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
          : 'bg-white/5 border-border text-muted-foreground'
      )}
    >
      {role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
      {role}
    </span>
  );
}

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'' | 'customer' | 'admin'>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useUsers(page);

  const users: AdminUser[] = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const adminCount    = users.filter((u) => u.role === 'admin').length;
  const customerCount = users.filter((u) => u.role === 'customer').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Access Control</p>
          <h1 className="font-syne text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? 'Loading…' : `${total} registered users`}
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Users',  value: total,         icon: <Users      className="h-5 w-5" />, color: 'text-primary'     },
            { label: 'Admins',       value: adminCount,    icon: <ShieldCheck className="h-5 w-5" />, color: 'text-indigo-400'  },
            { label: 'Customers',    value: customerCount, icon: <UserIcon    className="h-5 w-5" />, color: 'text-emerald-400' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-muted-foreground">
                {card.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className={cn('text-xl font-bold', card.color)}>{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value as typeof roleFilter); setPage(1); }}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <option value="">All roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} message="Failed to load users." />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Users className="h-10 w-10 mx-auto opacity-30 text-muted-foreground mb-3" />
            <p className="text-base font-bold text-foreground">No users found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-white/3">
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((u, idx) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className={cn(
                        'hover:bg-white/2 transition-colors',
                        u._id === currentUser?.id ? 'bg-primary/5' : ''
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-sm flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate max-w-[130px]">
                              {u.name}
                              {u._id === currentUser?.id && (
                                <span className="ml-1.5 text-[10px] font-normal text-primary">(you)</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden truncate max-w-[130px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                          {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/5 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/5 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
