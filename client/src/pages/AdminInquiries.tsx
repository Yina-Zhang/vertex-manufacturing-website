import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Search, FileText, Mail, Phone, Globe, Building2, Wrench, MessageSquare, Calendar } from 'lucide-react';

type FileMeta = { name: string; url: string };

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  customerType: string;
  country: string;
  processType: string;
  description: string | null;
  filesJson: string | null;
  filesMetaJson: string | null;
  files: string[];
  filesMeta: FileMeta[];
  createdAt: Date;
};

function formatDate(d: Date) {
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function ProcessBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    '3D Printing': 'bg-blue-100 text-blue-800',
    'CNC Machining': 'bg-orange-100 text-orange-800',
    'Tooling & Molding': 'bg-purple-100 text-purple-800',
    'Surface Finishing': 'bg-green-100 text-green-800',
    'Assembly': 'bg-teal-100 text-teal-800',
    'Other': 'bg-gray-100 text-gray-700',
  };
  const cls = colorMap[type] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {type}
    </span>
  );
}

function InquiryDetail({ inquiry, onClose }: { inquiry: Inquiry; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Inquiry #{inquiry.id} — {inquiry.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{inquiry.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-medium text-gray-900">{inquiry.customerType}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href={`mailto:${inquiry.email}`} className="font-medium text-blue-600 hover:underline break-all">
                    {inquiry.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{inquiry.phone || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Country</p>
                  <p className="font-medium text-gray-900">{inquiry.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="font-medium text-gray-900">{formatDate(inquiry.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Details</h3>
            <div className="flex items-start gap-2 text-sm">
              <Wrench className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Process Type</p>
                <ProcessBadge type={inquiry.processType} />
              </div>
            </div>
            {inquiry.description && (
              <div className="flex items-start gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{inquiry.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Files */}
              {(inquiry.filesMeta.length > 0 || inquiry.files.length > 0) && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Uploaded Files ({inquiry.filesMeta.length || inquiry.files.length})
              </h3>
              <div className="space-y-1">
                {inquiry.filesMeta.length > 0
                  ? inquiry.filesMeta.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs bg-white border border-gray-200 rounded px-2 py-0.5 text-blue-600 hover:text-blue-800 hover:border-blue-300 transition-colors"
                      >
                        {f.name}
                      </a>
                    </div>
                  ))
                  : inquiry.files.map((name, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-800">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-mono text-xs bg-white border border-gray-200 rounded px-2 py-0.5">{name}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Quick Reply */}
          <div className="pt-2">
            <a
              href={`mailto:${inquiry.email}?subject=Re: Your Quote Request - ${inquiry.processType}&body=Dear ${inquiry.name},%0A%0AThank you for your inquiry...`}
              className="inline-flex items-center gap-2 bg-[#b8966e] hover:bg-[#a07d5a] text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
            >
              <Mail className="w-4 h-4" />
              Reply to Customer
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminInquiries() {
  const { data, isLoading, error } = trpc.admin.getInquiries.useQuery();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const filtered = (data ?? []).filter(row => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.country.toLowerCase().includes(q) ||
      row.processType.toLowerCase().includes(q) ||
      (row.description ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inquiry Records</h1>
            <p className="text-sm text-gray-500 mt-1">
              All quote requests submitted via the website
            </p>
          </div>
          {data && (
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500">Total inquiries</p>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 text-gray-900"
          />
        </div>

        {/* Content */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading inquiries...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            Failed to load inquiries. Make sure you are logged in as an admin.
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No inquiries yet</p>
            <p className="text-sm mt-1">Quote requests submitted via the contact form will appear here.</p>
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-semibold text-gray-600 w-12">#</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Date</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Customer</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Country</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Process</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Files</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(row => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-amber-50 transition-colors"
                    onClick={() => setSelected(row as Inquiry)}
                  >
                    <TableCell className="text-xs text-gray-400 font-mono">{row.id}</TableCell>
                    <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(row.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.email}</p>
                        <p className="text-xs text-gray-400">{row.customerType}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">{row.country}</TableCell>
                    <TableCell>
                      <ProcessBadge type={row.processType} />
                    </TableCell>
                    <TableCell>
                      {row.files.length > 0 ? (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                          {row.files.length} file{row.files.length > 1 ? 's' : ''}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-xs text-gray-600 truncate">
                        {row.description || <span className="text-gray-400">—</span>}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {selected && (
        <InquiryDetail inquiry={selected} onClose={() => setSelected(null)} />
      )}
    </DashboardLayout>
  );
}
