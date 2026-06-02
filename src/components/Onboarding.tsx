/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Github, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Check, 
  Sparkles,
  ArrowLeft,
  Terminal,
  CodeXml,
  Compass
} from 'lucide-react';
import { OnboardingStep, UserProfile } from '../types';
import { ALL_TOPICS } from '../data';

interface OnboardingProps {
  onComplete: (userProfile: UserProfile) => void;
  onSkip: () => void;
}

export default function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');

  // Handle topics multi-selection (max 3)
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      if (selectedTopics.length < 3) {
        setSelectedTopics([...selectedTopics, topic]);
      }
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setStep('choose_handle');
    }
  };

  const handleConfirmHandle = () => {
    if (handle.trim()) {
      setStep('pick_topics');
    }
  };

  const handleConfirmTopics = () => {
    setStep('connect_github');
  };

  const handleGithubConnect = () => {
    setGithubConnected(true);
    setGithubUsername(handle || 'github-builder');
    // small deliberate pause simulation for high fidelity
    setTimeout(() => {
      setStep('success');
    }, 1200);
  };

  const handleFinalize = () => {
    const finalProfile: UserProfile = {
      email: email || 'builder@zid.app',
      handle: handle || 'anonymous_builder',
      avatarUrl: githubConnected 
        ? `https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200` 
        : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      githubConnected,
      githubUsername: githubConnected ? (githubUsername || handle) : '',
      level: 1,
      exp: 0,
      maxExp: 100,
      selectedTopics: selectedTopics.length > 0 ? selectedTopics : ['Web Dev', 'Open Source'],
      badges: githubConnected ? ['Level 1 Pioneer', 'GitHub Contributor'] : ['Level 1 Pioneer'],
      joinedDate: 'May 2026',
      stats: {
        contributions: githubConnected ? 32 : 0,
        streak: 1,
        articlesRead: 0,
        reposSynced: githubConnected ? 2 : 0
      }
    };
    onComplete(finalProfile);
  };

  return (
    <div id="onboarding-root" className="grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-slate-50">
      
      {/* Left Column: Premium Brand Intro */}
      <div className="lg:col-span-5 relative flex flex-col justify-between p-8 md:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden border-r border-slate-900">
        {/* Background ambient lighting effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-950/40 rounded-full blur-3xl"></div>
        
        {/* Header Branding */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-display font-extrabold text-white text-lg tracking-wider">Z</span>
          </div>
          <div>
            <span className="font-display font-bold text-white tracking-widest text-lg">ZID</span>
            <span className="text-[10px] block text-indigo-400 font-mono tracking-tight text-left">EST. 2026</span>
          </div>
        </div>

        {/* Dynamic Center Stage text */}
        <div className="relative z-10 my-auto py-12">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 max-w-sm"
          >
            <div className="inline-flex items-center space-x-2 bg-indigo-950/80 border border-indigo-500/20 rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-indigo-300 font-mono">STUDENT BUILDERS GUILD</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white leading-tight tracking-tight text-left">
              Where student builders <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">learn, build</span>, and grow together.
            </h1>
            
            <p className="text-slate-400 text-sm leading-relaxed text-left font-sans">
              ZID translates your classroom proof-of-work into industry credit. Authorship, open-source repositories, and technical telemetry, structured in a minimalist hub.
            </p>
          </motion.div>
        </div>

        {/* Footer info/stats */}
        <div className="relative z-10 flex items-center justify-between text-slate-500 text-xs font-mono border-t border-slate-800/60 pt-6">
          <span>SECURE PROTOCOL V2.40</span>
          <span>● WEB APP_DESKTOP_V1</span>
        </div>
      </div>

      {/* Right Column: Interaction form panel */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center bg-white p-6 md:p-12 lg:p-24 relative">
        <div className="absolute top-8 right-8">
          <button 
            id="btn-skip-onboarding"
            onClick={onSkip} 
            className="text-xs text-slate-400 hover:text-slate-600 font-mono transition-colors focus:outline-none cursor-pointer"
          >
            Skip to Dashboard →
          </button>
        </div>

        <div className="w-full max-w-md my-auto">
          {/* Main Onboarding State Machine */}
          
          {step === 'welcome' && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 text-center"
            >
              <div className="flex flex-col items-center">
                <span className="text-6xl md:text-8xl font-display font-black text-indigo-600 tracking-tighter select-none">
                  ZID
                </span>
                <p className="text-slate-500 mt-3 max-w-xs text-center text-sm md:text-base font-sans leading-relaxed">
                  The curated network and knowledge exchange for technical student leaders.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  id="btn-get-started"
                  onClick={() => setStep('create_account')}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 transition duration-150 transform hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  id="btn-direct-login"
                  onClick={onSkip}
                  className="w-full py-3.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 font-medium rounded-xl transition duration-150 cursor-pointer text-sm"
                >
                  I already have an account
                </button>
              </div>
            </motion.div>
          )}

          {step === 'create_account' && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setStep('welcome')}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 transition duration-150 focus:outline-none mb-2"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back</span>
              </button>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight text-left">
                  Create your account
                </h2>
                <p className="text-sm text-slate-500 text-left">
                  Join thousands of student builders verifying their skills today.
                </p>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-700 text-xs font-mono tracking-wider font-semibold uppercase text-left">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      id="input-onboarding-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition duration-150 text-sm placeholder-slate-400 text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-700 text-xs font-mono tracking-wider font-semibold uppercase text-left">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="input-onboarding-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition duration-150 text-sm placeholder-slate-400 text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-signup"
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition duration-150 cursor-pointer text-sm"
                >
                  Continue with Email
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-mono">or</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <button
                id="btn-oauth-github"
                onClick={() => {
                  setGithubConnected(true);
                  setGithubUsername('github-builder');
                  setStep('choose_handle');
                }}
                className="w-full flex items-center justify-center space-x-2 py-3.5 bg-slate-900 hover:bg-slate-955 text-white font-medium rounded-xl transition duration-150 cursor-pointer text-sm"
              >
                <Github className="h-4 w-4 text-white" />
                <span>Continue with GitHub</span>
              </button>

              <p className="text-[11px] text-slate-400 leading-relaxed text-center mt-4">
                By joining, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
              </p>
            </motion.div>
          )}

          {step === 'choose_handle' && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setStep('create_account')}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 transition duration-150 focus:outline-none mb-2"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back</span>
              </button>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight text-left">
                  Pick your handle
                </h2>
                <p className="text-sm text-slate-500 text-left">
                  Your public identity on ZID. Your proof of work lives at <strong className="text-indigo-600 font-mono">zid.app/@handle</strong>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-mono">
                      @
                    </span>
                    <input
                      id="input-handle"
                      type="text"
                      required
                      placeholder="username"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl font-mono transition duration-150 text-sm placeholder-slate-400 text-slate-900 outline-none"
                    />
                  </div>
                  
                  {handle.length > 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-1.5 pt-1 px-1"
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span>
                      <span className="text-[11px] text-emerald-600 font-semibold font-mono uppercase tracking-wider">
                        ● AVAILABLE
                      </span>
                    </motion.div>
                  )}
                </div>

                <button
                  id="btn-confirm-handle"
                  onClick={handleConfirmHandle}
                  disabled={handle.length < 3}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:bg-indigo-600 text-white font-medium rounded-xl transition duration-150 cursor-pointer text-sm flex items-center justify-center space-x-2"
                >
                  <span>Confirm Handle</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'pick_topics' && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setStep('choose_handle')}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 transition duration-150 focus:outline-none mb-2"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back</span>
              </button>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight text-left">
                  What do you build?
                </h2>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="text-left">Pick up to 3. This shapes your Knowledge Hub.</span>
                  <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded text-xs">
                    {selectedTopics.length}/3
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {ALL_TOPICS.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      id={`pill-interest-${topic.replace(/\s+/g, '-').toLowerCase()}`}
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#4f46e5] text-white border-[#4f46e5] shadow-xs' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>

              <button
                id="btn-confirm-interests"
                onClick={handleConfirmTopics}
                disabled={selectedTopics.length === 0}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:bg-indigo-600 text-white font-medium rounded-xl transition duration-155 cursor-pointer text-sm flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {step === 'connect_github' && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setStep('pick_topics')}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 transition duration-150 focus:outline-none mb-2"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back</span>
              </button>

              <div className="text-center space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
                  <Github className="h-8 w-8 text-slate-800" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                    Connect GitHub
                  </h2>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Required to track open-source contributions and authorize your proof-of-work dashboard.
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-150">
                <div className="flex items-start space-x-3 text-left">
                  <span className="h-5 w-5 bg-indigo-50 border border-indigo-250 rounded-md flex items-center justify-center mt-0.5 text-indigo-650 font-bold shrink-0">
                    <Check className="h-3 w-3 inline" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850 font-mono">TRACK DISPATCHED REPOS</h4>
                    <p className="text-[11px] text-slate-500">Track and index metadata about commits and branch contributions.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-left">
                  <span className="h-5 w-5 bg-indigo-50 border border-indigo-250 rounded-md flex items-center justify-center mt-0.5 text-indigo-650 font-bold shrink-0">
                    <Check className="h-3 w-3 inline" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850 font-mono">VERIFY WORK ORIGIN</h4>
                    <p className="text-[11px] text-slate-500">Enable peer-review checks to authenticate original authorship curves.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-left">
                  <span className="h-5 w-5 bg-indigo-50 border border-indigo-250 rounded-md flex items-center justify-center mt-0.5 text-indigo-650 font-bold shrink-0">
                    <Check className="h-3 w-3 inline" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850 font-mono">DISPLAY TELEMETRY DATA</h4>
                    <p className="text-[11px] text-slate-500">Include automated commit-frequency blocks, language ratios, and milestones.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  id="btn-perform-github-sync"
                  onClick={handleGithubConnect}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl transition duration-150 cursor-pointer text-sm"
                >
                  <Github className="h-4 w-4 text-white" />
                  <span>Connect and Authorize Profile</span>
                </button>
                <button
                  id="btn-skip-github-connection"
                  onClick={() => setStep('success')}
                  className="w-full py-2.5 bg-transparent text-slate-400 hover:text-slate-655 text-xs font-semibold rounded-lg transition duration-150 cursor-pointer underline"
                >
                  Skip for now • I'll do this later
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-100 rounded-full scale-125 blur animate-pulse"></div>
                  <div className="relative h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-650/40">
                    <Sparkles className="h-8 w-8" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-5xl font-display font-extrabold text-indigo-600 tracking-tight">
                    ZID
                  </h1>
                  <h2 className="text-xl font-bold text-slate-900 font-mono">YOU'RE IN</h2>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Start with today's research. Your knowledge, your contributions, from here.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col gap-2 divide-y divide-slate-150 max-w-sm mx-auto text-left">
                <div className="flex justify-between items-center pb-2 text-xs font-mono text-slate-500">
                  <span>MEMBER SPEC</span>
                  <span className="text-slate-800 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[10px] rounded font-bold uppercase">● APPROVED</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3">
                  <div className="text-left text-slate-400">HANDLE ID</div>
                  <div className="text-right text-slate-850 font-bold">@{handle || 'builder'}</div>
                  
                  <div className="text-left text-slate-400">INTERESTS</div>
                  <div className="text-right text-slate-850 font-bold max-w-full text-ellipsis overflow-hidden">
                    {selectedTopics.slice(0, 2).join(', ')}
                  </div>
                  
                  <div className="text-left text-slate-400">INIT LEVEL</div>
                  <div className="text-right text-slate-850 font-bold">LVL 1 PIONEER</div>
                </div>
              </div>

              <button
                id="btn-navigate-success-dashboard"
                onClick={handleFinalize}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition duration-150 flex items-center justify-center space-x-2"
              >
                <span>Open Knowledge Hub</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
