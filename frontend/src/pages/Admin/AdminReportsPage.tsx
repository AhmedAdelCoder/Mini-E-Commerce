import { useMemo } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useProducts } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/common/Skeleton';

export function AdminReportsPage() {
  const { data, isLoading, isError, refetch } = useProducts();
  const products = data?.products ?? [];

  const analytics = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
    const avgPrice = totalProducts > 0 ? products.reduce((acc, p) => acc + p.price, 0) / totalProducts : 0;

    // Stock health
    const healthyCount = products.filter((p) => p.stock > 5).length;
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;

    // Price ranges
    const under50 = products.filter((p) => p.price < 50).length;
    const range50to200 = products.filter((p) => p.price >= 50 && p.price <= 200).length;
    const range200to500 = products.filter((p) => p.price > 200 && p.price <= 500).length;
    const over500 = products.filter((p) => p.price > 500).length;

    // Category breakdown
    const categoryMap: Record<string, { count: number; value: number }> = {};
    products.forEach((p) => {
      if (!categoryMap[p.category]) categoryMap[p.category] = { count: 0, value: 0 };
      categoryMap[p.category].count += 1;
      categoryMap[p.category].value += p.price * p.stock;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([name, data]) => ({
      name,
      count: data.count,
      value: data.value,
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
    }));

    // Top value items
    const topValueProducts = [...products]
      .sort((a, b) => b.price * b.stock - a.price * a.stock)
      .slice(0, 5);

    return {
      totalProducts,
      totalStock,
      totalValue,
      avgPrice,
      healthyCount,
      lowStockCount,
      outOfStockCount,
      under50,
      range50to200,
      range200to500,
      over500,
      categoryBreakdown,
      topValueProducts,
    };
  }, [products]);

  const handleExportCSV = () => {
    if (products.length === 0) {
      toast.error('No products data available to export');
      return;
    }

    const headers = ['Product ID', 'Name', 'Category', 'Price ($)', 'Stock', 'Inventory Value ($)', 'Status'];
    const rows = products.map((p) => [
      p._id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price.toFixed(2),
      p.stock,
      (p.price * p.stock).toFixed(2),
      p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NOVA_Store_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('CSV Report downloaded successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Analytics</p>
            <h1 className="font-syne text-3xl font-bold text-foreground">Inventory & Sales Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Live catalogue statistics and exportable metrics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-white/5 transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print Report
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block mb-6 border-b border-black pb-4">
          <h1 className="text-2xl font-bold text-black">NOVA Store — Executive Inventory Report</h1>
          <p className="text-xs text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {isLoading ? (
          <Skeleton className="h-96 w-full rounded-2xl" />
        ) : isError ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-red-400 font-medium mb-3">Failed to load analytics data.</p>
            <button onClick={() => refetch()} className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white">
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Metric KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Inventory Value</span>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(analytics.totalValue)}</p>
                <p className="text-xs text-muted-foreground">{analytics.totalStock} items across catalog</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Average Item Price</span>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(analytics.avgPrice)}</p>
                <p className="text-xs text-muted-foreground">Across {analytics.totalProducts} products</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock Health Score</span>
                <p className="text-2xl font-bold text-emerald-400">
                  {analytics.totalProducts > 0
                    ? `${Math.round((analytics.healthyCount / analytics.totalProducts) * 100)}%`
                    : '0%'}
                </p>
                <p className="text-xs text-muted-foreground">{analytics.healthyCount} fully stocked items</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attention Required</span>
                <p className="text-2xl font-bold text-amber-400">
                  {analytics.lowStockCount + analytics.outOfStockCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  {analytics.lowStockCount} low stock, {analytics.outOfStockCount} out of stock
                </p>
              </div>
            </div>

            {/* Charts & Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Inventory Share */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Category Inventory Valuation
                </h3>

                <div className="space-y-4">
                  {analytics.categoryBreakdown.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-foreground capitalize">{cat.name} ({cat.count})</span>
                        <span className="text-muted-foreground font-medium">
                          {formatCurrency(cat.value)} ({cat.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-background overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-primary transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(5, cat.percentage))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Level Distribution */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Package className="h-4 w-4 text-emerald-400" />
                  Stock Health Breakdown
                </h3>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                    <p className="text-xl font-bold text-emerald-400">{analytics.healthyCount}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">In Stock (&gt; 5)</p>
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <AlertTriangle className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                    <p className="text-xl font-bold text-amber-400">{analytics.lowStockCount}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Low Stock (≤ 5)</p>
                  </div>

                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                    <XCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
                    <p className="text-xl font-bold text-red-400">{analytics.outOfStockCount}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Out of Stock</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Price Range Distribution
                  </h4>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="rounded-lg border border-border bg-background p-2.5">
                      <p className="font-bold text-foreground">{analytics.under50}</p>
                      <p className="text-[10px] text-muted-foreground">&lt; $50</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-2.5">
                      <p className="font-bold text-foreground">{analytics.range50to200}</p>
                      <p className="text-[10px] text-muted-foreground">$50–$200</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-2.5">
                      <p className="font-bold text-foreground">{analytics.range200to500}</p>
                      <p className="text-[10px] text-muted-foreground">$200–$500</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-2.5">
                      <p className="font-bold text-foreground">{analytics.over500}</p>
                      <p className="text-[10px] text-muted-foreground">&gt; $500</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Value Inventory Table */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                Top 5 Highest Inventory Value Products
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 font-semibold">Product</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Unit Price</th>
                      <th className="pb-3 font-semibold">Stock</th>
                      <th className="pb-3 font-semibold text-right">Total Inventory Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {analytics.topValueProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-foreground">{p.name}</td>
                        <td className="py-3 text-xs text-muted-foreground capitalize">{p.category}</td>
                        <td className="py-3 font-medium text-foreground">{formatCurrency(p.price)}</td>
                        <td className="py-3 font-medium text-foreground">{p.stock} units</td>
                        <td className="py-3 font-extrabold text-primary text-right">
                          {formatCurrency(p.price * p.stock)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
