'use client';

import { useState } from 'react';
import { MeshLayout, PageContainer, Section } from '@/components/layout/GlobalLayout';
import { GlassCard, DashboardCard } from '@/components/core/GlassCard';
import { Button } from '@/components/core/Button';
import { 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  TrendingUp,
  Play,
  Pause,
  Instagram,
  Youtube,
  Star
} from 'lucide-react';

export default function WorkerDashboardPage() {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);

  const mockTasks = [
    {
      id: '1',
      platform: 'Instagram',
      type: 'Follow',
      reward: 0.15,
      timeLimit: '2 min',
      difficulty: 'Easy',
    },
    {
      id: '2',
      platform: 'YouTube',
      type: 'Subscribe',
      reward: 0.25,
      timeLimit: '3 min',
      difficulty: 'Easy',
    },
    {
      id: '3',
      platform: 'Google',
      type: '5-Star Review',
      reward: 1.50,
      timeLimit: '10 min',
      difficulty: 'Medium',
    },
  ];

  const stats = [
    { label: 'Tasks Completed', value: '247', icon: CheckCircle2, color: 'text-success-400' },
    { label: 'Total Earned', value: '$142.50', icon: DollarSign, color: 'text-primary-400' },
    { label: 'Active Tasks', value: '3', icon: Clock, color: 'text-cyan-400' },
    { label: 'Success Rate', value: '98%', icon: TrendingUp, color: 'text-success-400' },
  ];

  return (
    <MeshLayout>
      <PageContainer>
        {/* Header */}
        <Section spacing="md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                Worker Dashboard
              </h1>
              <p className="text-slate-300">
                Complete micro-tasks and earn rewards
              </p>
            </div>
            <Button variant="primary" size="lg">
              Cash Out
              <DollarSign className="w-5 h-5" />
            </Button>
          </div>
        </Section>

        {/* Stats Grid */}
        <Section spacing="md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={stat.label} variant="dark" hover="glow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                      <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </Section>

        {/* Available Tasks */}
        <Section spacing="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Available Tasks</h2>
            <div className="flex items-center gap-3">
              <select className="glass-input px-4 py-2 rounded-xl text-sm">
                <option>All Platforms</option>
                <option>Instagram</option>
                <option>YouTube</option>
                <option>Google</option>
              </select>
              <select className="glass-input px-4 py-2 rounded-xl text-sm">
                <option>All Difficulties</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4">
            {mockTasks.map((task) => (
              <GlassCard 
                key={task.id} 
                variant="dark" 
                hover="border"
                className="group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    {/* Platform Icon */}
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                      {task.platform === 'Instagram' && <Instagram className="w-7 h-7 text-white" />}
                      {task.platform === 'YouTube' && <Youtube className="w-7 h-7 text-white" />}
                      {task.platform === 'Google' && <Star className="w-7 h-7 text-white" />}
                    </div>

                    {/* Task Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{task.type}</h3>
                        <span className="px-2.5 py-1 bg-primary-500/20 text-primary-400 text-xs font-bold rounded-lg">
                          {task.platform}
                        </span>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                          task.difficulty === 'Easy' 
                            ? 'bg-success-500/20 text-success-400'
                            : 'bg-warning-500/20 text-warning-400'
                        }`}>
                          {task.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{task.timeLimit}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-success-400">${task.reward}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Timer */}
                    {activeTimer === task.id ? (
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-extrabold text-gradient mb-1">
                            1:45
                          </div>
                          <div className="text-xs text-slate-400">Remaining</div>
                        </div>
                        <Button 
                          variant="danger" 
                          size="lg"
                          onClick={() => setActiveTimer(null)}
                        >
                          <Pause className="w-5 h-5" />
                          Stop
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="primary" 
                        size="lg"
                        onClick={() => setActiveTimer(task.id)}
                      >
                        <Play className="w-5 h-5" />
                        Start Task
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </Section>

        {/* Recent Activity */}
        <Section spacing="lg">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <DashboardCard>
            <div className="space-y-4">
              {[
                { task: 'Instagram Follow', amount: '$0.15', time: '2 min ago', status: 'completed' },
                { task: 'YouTube Subscribe', amount: '$0.25', time: '15 min ago', status: 'completed' },
                { task: 'Google Review', amount: '$1.50', time: '1 hour ago', status: 'completed' },
              ].map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{activity.task}</p>
                      <p className="text-sm text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success-600">{activity.amount}</p>
                    <p className="text-xs text-slate-500 capitalize">{activity.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </Section>
      </PageContainer>
    </MeshLayout>
  );
}
