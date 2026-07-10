'use client'

/**
 * CryptoAssistant — Wrapper for DEVFLOAssistant
 * 
 * Concept: AI is the "voice" of the signal bot.
 * - When signal bot is active: AI gives detailed analysis per-signal
 * - When no signal: AI gives general market commentary
 * - No tier gate — free for all (12 months free strategy)
 * 
 * This wrapper does NOT modify DEVFLOAssistant.tsx.
 * It overrides the API context to crypto and adds crypto quick commands.
 */

import React, { useState, useEffect, useRef } from 'react'
import VoiceWaveform from './VoiceWaveform'
import TypingAnimation from './TypingAnimation'
import {
  Brain,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Power,
  PowerOff,
  MessageSquare,
  Settings,
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CandlestickChart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CryptoMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
  platform: string
  isTyping?: boolean
  confidence?: number
  signalContext?: string
}

interface CryptoAssistantProps {
  latestSignal?: {
    type: string
    coin: string
    price: number
    confidence: number
    timeframe: string
  } | null
}

const CRYPTO_QUICK_COMMANDS = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    label: 'Analyze BTC',
    command: 'Analisa BTC saat ini, trend dan prediksi',
  },
  {
    icon: <Activity className="h-4 w-4" />,
    label: 'Latest Signals',
    command: 'Signal terbaru apa saja hari ini?',
  },
  {
    icon: <CandlestickChart className="h-4 w-4" />,
    label: 'Market Overview',
    command: 'Berikan overview market crypto hari ini',
  },
  {
    icon: <TrendingDown className="h-4 w-4" />,
    label: 'Risk Analysis',
    command: 'Analisa risiko market saat ini, apakah ada yang perlu diwaspadai?',
  },
]

export default function CryptoAssistant({ latestSignal }: CryptoAssistantProps) {
  const [isActive, setIsActive] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<CryptoMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [showQuickCommands, setShowQuickCommands] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const SIGNAL_API = process.env.NEXT_PUBLIC_SIGNAL_API_URL || 'http://localhost:8787/api/v1'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (latestSignal && isActive && messages.length === 0) {
      const introMessage: CryptoMessage = {
        id: 'intro-' + Date.now(),
        type: 'ai',
        content: `Halo! Saya Crypto AI Assistant. Signal terbaru terdeteksi: ${latestSignal.type} ${latestSignal.coin} di $${latestSignal.price.toLocaleString()} dengan confidence ${latestSignal.confidence}%. Tanyakan apa saja tentang signal ini atau market secara umum.`,
        timestamp: new Date().toISOString(),
        platform: 'crypto-dashboard',
        signalContext: `${latestSignal.type} ${latestSignal.coin}`,
      }
      setMessages([introMessage])
    }
  }, [latestSignal, isActive])

  const sendMessage = async (message: string, platform: string = 'crypto-dashboard') => {
    if (!message.trim() || !isActive) return

    const userMessage: CryptoMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      platform,
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const signalContext = latestSignal
        ? `Current signal: ${latestSignal.type} ${latestSignal.coin} at $${latestSignal.price} (${latestSignal.confidence}% confidence, ${latestSignal.timeframe}). `
        : 'No active signal right now. '

      const response = await fetch(`${SIGNAL_API}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          platform,
          project_type: 'CRYPTO_SIGNAL',
          context: signalContext,
          signal_data: latestSignal,
        }),
      })

      if (response.ok) {
        const result = await response.json()

        const aiMessage: CryptoMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: result.response || result.analysis || 'Analysis complete.',
          timestamp: result.timestamp || new Date().toISOString(),
          platform: result.platform || 'crypto-dashboard',
          isTyping: true,
          confidence: result.confidence || null,
          signalContext: latestSignal ? `${latestSignal.type} ${latestSignal.coin}` : undefined,
        }

        setMessages(prev => [...prev, aiMessage])

        if (isSpeaking) {
          speakText(result.response || result.analysis)
        }
      } else {
        throw new Error('Failed to get AI response')
      }
    } catch (error) {
      const fallbackMessage: CryptoMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: latestSignal
          ? `Signal aktif: ${latestSignal.type} ${latestSignal.coin} di $${latestSignal.price.toLocaleString()}. Confidence: ${latestSignal.confidence}%. AI analysis engine sedang offline, tapi signal tetap berjalan. Coba lagi nanti untuk analisa detail.`
          : 'Market commentary: AI analysis engine sedang offline. Signal bot tetap berjalan normal. Coba lagi nanti untuk analisa detail.',
        timestamp: new Date().toISOString(),
        platform: 'crypto-dashboard',
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startListening = () => {
    if (!isActive || (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window))) {
      toast({
        title: 'Voice Recognition Not Available',
        description: "Your browser doesn't support voice recognition",
        variant: 'destructive',
      })
      return
    }
    setIsListening(true)
  }

  const handleVoiceTranscript = (transcript: string) => {
    sendMessage(transcript, 'voice')
    setIsListening(false)
  }

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'id-ID'
    utterance.rate = 0.9
    utterance.pitch = 0.8
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputMessage)
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        {showQuickCommands && (
          <div className="bg-card/95 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-2 mb-2 shadow-2xl">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground px-2 py-1 font-medium">Quick Commands</div>
              {CRYPTO_QUICK_COMMANDS.map((cmd, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    sendMessage(cmd.command)
                    setShowQuickCommands(false)
                  }}
                  className="w-full justify-start text-muted-foreground hover:text-yellow-500 hover:bg-accent"
                >
                  <span className="mr-2 text-yellow-500">{cmd.icon}</span>
                  <span className="text-sm">{cmd.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <Button
            onClick={() => setIsMinimized(false)}
            className="relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black border-2 border-yellow-400/50"
          >
            <Brain className="h-6 w-6" />
            {isActive && <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping"></div>}
          </Button>

          <Button
            onClick={() => setShowQuickCommands(!showQuickCommands)}
            variant="ghost"
            size="sm"
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded-full bg-card/80 text-muted-foreground hover:text-yellow-500"
          >
            <CandlestickChart className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px]">
      <Card className="h-full bg-gradient-to-br from-slate-900 via-yellow-950/30 to-slate-900 border-yellow-500/30 shadow-2xl">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-yellow-500" />
              <CardTitle className="text-lg text-white">Crypto AI</CardTitle>
              {isActive && <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>}
              {latestSignal && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs">
                  {latestSignal.type} {latestSignal.coin}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSpeaking(!isSpeaking)}
                className="text-gray-400 hover:text-white"
                disabled={!isActive}
              >
                {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-400 hover:text-white"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-white"
              >
                −
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsActive(!isActive)}
                className={isActive ? 'text-red-400 hover:text-red-300' : 'text-yellow-500 hover:text-yellow-400'}
              >
                {isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Signal Context Bar */}
          {latestSignal && (
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="text-muted-foreground">Active signal:</span>
              <span className={latestSignal.type === 'BUY' ? 'text-green-500' : 'text-red-500'}>
                {latestSignal.type} {latestSignal.coin} @ ${latestSignal.price.toLocaleString()}
              </span>
              <span className="text-yellow-500">{latestSignal.confidence}% conf</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex flex-col h-full p-0">
          {/* Quick Commands */}
          {!showSettings && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {CRYPTO_QUICK_COMMANDS.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(cmd.command)}
                  disabled={!isActive || isLoading}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
                >
                  {cmd.icon}
                  {cmd.label}
                </button>
              ))}
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-slate-700">
              <h4 className="text-white font-medium mb-3">Crypto AI Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mode:</span>
                  <span className="text-yellow-500">{latestSignal ? 'Signal Analysis' : 'Market Commentary'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">API:</span>
                  <span className="text-gray-300">{SIGNAL_API.replace('http://', '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Context:</span>
                  <span className="text-yellow-500">CRYPTO_SIGNAL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={isActive ? 'text-green-500' : 'text-red-500'}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                  <p className="text-sm">Crypto AI Assistant siap membantu.</p>
                  <p className="text-xs mt-2">Tanyakan tentang signal, market, atau analisa crypto.</p>
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {CRYPTO_QUICK_COMMANDS.map((cmd, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(cmd.command)}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20"
                      >
                        {cmd.icon}
                        {cmd.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-slate-800/50 text-gray-300 border border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.type === 'user' ? <MessageSquare className="h-3 w-3" /> : <Brain className="h-3 w-3 text-yellow-500" />}
                      <span className="text-xs opacity-70">{message.type === 'user' ? 'You' : 'Crypto AI'}</span>
                      {message.confidence && (
                        <span className="text-xs text-yellow-500/70">{message.confidence}%</span>
                      )}
                      <span className="text-xs opacity-50">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                    {message.type === 'ai' && message.isTyping ? (
                      <TypingAnimation
                        text={message.content}
                        speed={20}
                        onComplete={() => {
                          setMessages(prev =>
                            prev.map(msg =>
                              msg.id === message.id ? { ...msg, isTyping: false } : msg
                            )
                          )
                        }}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/50 text-gray-300 border border-slate-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="h-3 w-3 text-yellow-500 animate-pulse" />
                      <span className="text-sm">Crypto AI menganalisa...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700">
            {isListening && (
              <div className="mb-3">
                <VoiceWaveform
                  isRecording={isListening}
                  onRecordingChange={setIsListening}
                  onTranscript={handleVoiceTranscript}
                />
              </div>
            )}

            {!isActive && (
              <Alert className="mb-3 bg-red-500/20 border-red-500/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Crypto AI sedang nonaktif. Klik tombol power untuk mengaktifkan.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tanya tentang signal, market, atau analisa crypto..."
                disabled={!isActive || isLoading}
                className="flex-1 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400"
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={isListening ? () => setIsListening(false) : startListening}
                disabled={!isActive || isLoading}
                className={isListening ? 'bg-red-600/20 text-red-400' : 'bg-yellow-500/20 text-yellow-500'}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              <Button
                onClick={() => sendMessage(inputMessage)}
                disabled={!isActive || isLoading || !inputMessage.trim()}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
