'use client';

import { useState } from 'react';
import { MeshLayout, PageContainer, Section } from '@/components/layout/GlobalLayout';
import { GlassCard } from '@/components/core/GlassCard';
import { Button } from '@/components/core/Button';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Eye,
  Image as ImageIcon,
  FileText,
  Clock,
  User
} from 'lucide-react';

export default function AdminAuditPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>('1');

  const mockSubmissions = [
    {
      id: '1',
      worker: 'worker_8472',
      task: 'Instagram Follow',
      platform: 'Instagram',
      submittedAt: '2 min ago',
      status: 'pending',
      proofUrl: '/api/placeholder/400/300',
      notes: 'Followed @brandaccount as requested',
    },
    {
      id: '2',
      worker: 'worker_3291',
      task: 'Google Review',
      platform: 'Google',
      submittedAt: '5 min ago',
      status: 'pending',
      proofUrl: '/api/placeholder/400/300',
      notes: 'Posted 5-star review with custom message',
    },
    {
      id: '3',
      worker: 'worker_5647',
      task: 'YouTube Subscribe',
      platform: 'YouTube',
      submittedAt: '12 min ago',
      status: 'pending',
      proofUrl: '/api/placeholder/400/300',
      notes: 'Subscribed and enabled notifications',
    },
  ];

  const stats = [
    { label: 'Pending Review', value: '24', color: 'text-warning-400' },
    { label: 'Approved Today', value: '156', color: 'text-success-400' },
    { label: 'Rejected Today', value: '8', color: 'text-danger-400' },
    { label: 'Avg Review Time', value: '2.3m', color: 'text-primary-400' },
  ];

  const handleApprove = (id: string) => {
    console.log('Approved:', id);
  };

  const handleReject = (id: string) => {
    console.log('Rejected:', id);
  };

  const selectedItem = mockSubmissions.find(s => s.id === selectedSubmission);

  return (
    <MeshLayout>
      <PageContainer size="full">
        {/* Header */}
        <Section spacing="md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                Quality Control Audit
              </h1>
              <p className="text-slate-300">
                Review and verify worker task submissions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select className="glass-input px-4 py-2 rounded-xl text-sm">
                <option>All Platforms</option>
                <option>Instagram</option>
                <option>YouTube</option>
                <option>Google</option>
              </select>
              <select className="glass-input px-4 py-2 rounded-xl text-sm">
                <option>Pending Only</option>
                <option>All Statuses</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
        </Section>

        {/* Stats */}
        <Section spacing="sm">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <GlassCard key={stat.label} variant="dark" padding="md">
                <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
              </GlassCard>
            ))}
          </div>
        </Section>

        {/* Split Screen Layout */}
        <Section spacing="lg">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Submissions List - Left Side */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-xl font-bold text-white mb-4">
                Pending Submissions ({mockSubmissions.length})
              </h2>
              
              {mockSubmissions.map((submission) => (
                <GlassCard
                  key={submission.id}
                  variant="dark"
                  hover="border"
                  padding="md"
                  className={`cursor-pointer transition-all ${
                    selectedSubmission === submission.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-white/10'
                  }`}
                  onClick={() => setSelectedSubmission(submission.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white mb-1">{submission.task}</h3>
                      <p className="text-xs text-slate-400">{submission.platform}</p>
                    </div>
                    <span className="px-2 py-1 bg-warning-500/20 text-warning-400 text-xs font-bold rounded">
                      Pending
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{submission.worker}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{submission.submittedAt}</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Submission Detail - Right Side */}
            <div className="lg:col-span-3">
              {selectedItem ? (
                <GlassCard variant="dark" padding="lg" className="h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      Submission Review
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="danger" 
                        size="md"
                        onClick={() => handleReject(selectedItem.id)}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                      <Button 
                        variant="success" 
                        size="md"
                        onClick={() => handleApprove(selectedItem.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </Button>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/10">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Task Type</p>
                      <p className="font-semibold text-white">{selectedItem.task}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Platform</p>
                      <p className="font-semibold text-white">{selectedItem.platform}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Worker ID</p>
                      <p className="font-semibold text-white">{selectedItem.worker}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Submitted</p>
                      <p className="font-semibold text-white">{selectedItem.submittedAt}</p>
                    </div>
                  </div>

                  {/* Proof of Completion */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <ImageIcon className="w-5 h-5 text-primary-400" />
                      <h3 className="font-bold text-white">Proof of Completion</h3>
                    </div>
                    <div className="aspect-video rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                      <div className="text-center">
                        <Eye className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Screenshot Preview</p>
                      </div>
                    </div>
                  </div>

                  {/* Worker Notes */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-primary-400" />
                      <h3 className="font-bold text-white">Worker Notes</h3>
                    </div>
                    <div className="glass-input p-4 rounded-xl">
                      <p className="text-slate-300">{selectedItem.notes}</p>
                    </div>
                  </div>

                  {/* Quality Checklist */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-warning-400" />
                      <h3 className="font-bold text-white">Quality Checklist</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        'Screenshot shows correct account/profile',
                        'Action was completed as requested',
                        'Timestamp is within task window',
                        'No signs of automation or bots',
                      ].map((item, index) => (
                        <label 
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                        >
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-white/20 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-300">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              ) : (
                <GlassCard variant="dark" padding="lg" className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Select a submission to review</p>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </Section>
      </PageContainer>
    </MeshLayout>
  );
}
