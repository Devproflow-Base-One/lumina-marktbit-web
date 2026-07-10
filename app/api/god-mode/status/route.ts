import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const dataDir = path.join(process.cwd(), '..', '..', '..', 'data')

  let state: any = null
  let learning: any = null

  try {
    const stateFile = path.join(dataDir, 'godmode-state.json')
    if (fs.existsSync(stateFile)) {
      state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'))
    }
  } catch {}

  try {
    const reportFile = path.join(dataDir, 'godmode-learning-report.json')
    if (fs.existsSync(reportFile)) {
      learning = JSON.parse(fs.readFileSync(reportFile, 'utf-8'))
    }
  } catch {}

  const isRunning = state?.stats?.lastRun != null
  const stats = state?.stats || {}
  const singularity = stats.singularity || {}

  return NextResponse.json({
    status: isRunning ? 'running' : 'idle',
    mode: 'singularity',
    version: '3.0.0',
    systemLoop: {
      marketAnalysis: state?.marketData?.lastUpdated ? 'completed' : 'idle',
      campaignCreation: (state?.activeCampaigns?.length || 0) > 0 ? 'active' : 'idle',
      adOptimization: state?.adRotation?.lastOptimization ? 'completed' : 'idle',
      leadNurturing: 'active',
      budgetOptimization: singularity.campaignsPaused > 0 || singularity.campaignsScaled > 0 ? 'active' : 'idle',
      abTestCheck: singularity.abTestsCreated > 0 ? 'active' : 'idle',
      contentRepurpose: singularity.contentRepurposed > 0 ? 'active' : 'idle',
      learningReport: learning ? 'completed' : 'idle'
    },
    channels: {
      telegram: stats.channels?.telegram > 0 ? 'active' : 'standby',
      email: stats.channels?.email > 0 ? 'active' : 'standby',
      whatsapp: stats.channels?.whatsapp > 0 ? 'active' : 'standby',
      social: stats.channels?.social > 0 ? 'active' : 'standby'
    },
    singularity: {
      cycles: stats.cycles || 0,
      lastRun: stats.lastRun || null,
      activeCampaigns: state?.activeCampaigns?.length || 0,
      abTestsCreated: singularity.abTestsCreated || 0,
      abTestsCompleted: singularity.abTestsCompleted || 0,
      campaignsPaused: singularity.campaignsPaused || 0,
      campaignsScaled: singularity.campaignsScaled || 0,
      leadsScored: singularity.leadsScored || 0,
      contentRepurposed: singularity.contentRepurposed || 0,
      totalRevenue: singularity.totalRevenue || 0,
      marketSentiment: state?.marketData?.agentAnalysis?.marketSentiment || 'unknown',
      topOpportunity: state?.marketData?.agentAnalysis?.topOpportunity || 'N/A',
      aiProvider: state?.marketData?.aiProvider || 'none'
    },
    learning: learning?.learning || null,
    budget: learning?.budget || null,
    leads: learning?.leads || null,
    content: learning?.content || null,
    abTestPatterns: learning?.abTestPatterns || []
  })
}
