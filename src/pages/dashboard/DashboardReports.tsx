import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ANALYTICS_DATA } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const REPORTS = [
  { title: "Monthly Revenue Report", desc: "Detailed breakdown of revenue by workspace, location, and booking type", date: "May 2026", size: "2.4 MB", format: "PDF" },
  { title: "User Acquisition Report", desc: "New user registrations, conversion rates, and churn analysis", date: "May 2026", size: "1.8 MB", format: "XLSX" },
  { title: "Occupancy & Utilization", desc: "Workspace occupancy rates, peak hours, and underutilized spaces", date: "May 2026", size: "3.1 MB", format: "PDF" },
  { title: "Community Engagement", desc: "Event attendance, group activity, and member interaction metrics", date: "Apr 2026", size: "1.2 MB", format: "PDF" },
  { title: "Financial Summary", desc: "P&L overview, payment processing stats, and subscription metrics", date: "Q1 2026", size: "4.7 MB", format: "XLSX" },
];

export default function DashboardReports() {
  const [isCustomReportOpen, setIsCustomReportOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<typeof REPORTS[0] | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [customReportForm, setCustomReportForm] = useState({ title: "", type: "financial", range: "last30" });

  const handleDownload = async (title: string) => {
    setDownloading(title);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setDownloading(null);
    toast.success(`Successfully downloaded ${title}`);
  };

  const handleGenerateCustomReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReportForm.title.trim()) {
      toast.error("Please enter a report title");
      return;
    }
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Generating custom report...',
        success: () => {
          setIsCustomReportOpen(false);
          setCustomReportForm({ title: "", type: "financial", range: "last30" });
          return 'Custom report generated successfully!';
        },
        error: 'Failed to generate report'
      }
    );
  };

  return (
    <DashboardLayout title="Reports">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Reports & Exports</h2>
        <p className="text-slate-500 text-sm mt-1">Generate and download platform analytics reports</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white font-display mb-4">Revenue by Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ANALYTICS_DATA.revenue} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white font-display mb-4">Bookings by Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ANALYTICS_DATA.bookings} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="value" fill="#06B6D4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white">Available Reports</h3>
          
          <Dialog open={isCustomReportOpen} onOpenChange={setIsCustomReportOpen}>
            <DialogTrigger asChild>
              <button className="btn-secondary text-sm py-2">Custom Report</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleGenerateCustomReport}>
                <DialogHeader>
                  <DialogTitle>Create Custom Report</DialogTitle>
                  <DialogDescription>
                    Configure the parameters for your custom data export.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm">Report Title</Label>
                    <Input id="title" required placeholder="e.g. Q2 Performance" value={customReportForm.title} onChange={(e) => setCustomReportForm({...customReportForm, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm">Report Type</Label>
                    <select id="type" className="input-field" value={customReportForm.type} onChange={(e) => setCustomReportForm({...customReportForm, type: e.target.value})}>
                      <option value="financial">Financial & Revenue</option>
                      <option value="users">User Acquisition & Churn</option>
                      <option value="occupancy">Workspace Occupancy</option>
                      <option value="community">Community Engagement</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="range" className="text-sm">Date Range</Label>
                    <select id="range" className="input-field" value={customReportForm.range} onChange={(e) => setCustomReportForm({...customReportForm, range: e.target.value})}>
                      <option value="last7">Last 7 Days</option>
                      <option value="last30">Last 30 Days</option>
                      <option value="last90">Last 90 Days</option>
                      <option value="ytd">Year to Date</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCustomReportOpen(false)}>Cancel</Button>
                  <Button type="submit">Generate Report</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {REPORTS.map((report) => (
            <div key={report.title} className="flex items-center gap-4 p-5">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{report.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{report.desc}</p>
                <p className="text-xs text-slate-400 mt-1">{report.date} · {report.size} · {report.format}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setPreviewReport(report)} className="btn-secondary text-sm py-2 px-3">Preview</button>
                <button 
                  onClick={() => handleDownload(report.title)} 
                  disabled={downloading === report.title}
                  className="btn-primary text-sm py-2 px-3 flex items-center gap-2 disabled:opacity-70"
                >
                  {downloading === report.title ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  )}
                  {downloading === report.title ? "Downloading..." : "Download"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewReport} onOpenChange={(open) => !open && setPreviewReport(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          {previewReport && (
            <>
              <DialogHeader>
                <DialogTitle>Report Preview: {previewReport.title}</DialogTitle>
                <DialogDescription>
                  Generated for {previewReport.date} · Format: {previewReport.format}
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl my-4 bg-slate-50 dark:bg-slate-800/50 min-h-[300px]">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Preview Document</h3>
                <p className="text-sm text-slate-500 text-center max-w-sm">
                  {previewReport.desc}
                </p>
                <div className="mt-8 flex justify-center items-stretch gap-6 w-full px-8">
                  <div className="p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex flex-col justify-center items-center text-center min-w-[140px]">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Total Pages/Rows</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1.5">{Math.floor(Math.random() * 50) + 10}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex flex-col justify-center items-center text-center min-w-[140px]">
                    <p className="text-xs text-slate-400 uppercase font-semibold">File Size</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1.5">{previewReport.size}</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-between flex-row items-center">
                <Button variant="outline" onClick={() => setPreviewReport(null)}>Close Preview</Button>
                <Button onClick={() => { handleDownload(previewReport.title); setPreviewReport(null); }}>
                  Download {previewReport.format}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
