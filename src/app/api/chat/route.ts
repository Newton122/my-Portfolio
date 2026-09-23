import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = typeof body?.message === 'string' ? body.message : ''
    const history = Array.isArray(body?.history)
      ? body.history
          .filter((m: unknown): m is { role: string; content: string } =>
            typeof (m as { content?: unknown })?.content === 'string' &&
            ['user', 'ai'].includes((m as { role?: string })?.role ?? ''))
          .slice(-12)
      : []

    if (!message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const backendUrl = process.env.PYTHON_CHAT_URL || 'http://127.0.0.1:8000/chat'

    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.detail || 'Chat backend error' },
        { status: res.status || 500 },
      )
    }

    return NextResponse.json({ reply: data?.reply || '', sources: data?.sources ?? [] })
  } catch (error) {
    console.error('Chat proxy error', error)
    return NextResponse.json({ error: 'Failed to reach chat backend' }, { status: 500 })
  }
}
