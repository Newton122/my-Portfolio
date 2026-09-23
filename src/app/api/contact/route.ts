import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

type Body = {
  name?: string
  email?: string
  message?: string
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json()
    const name = (body.name || '').trim()
    const email = (body.email || '').trim()
    const message = (body.message || '').trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 422 })
    }

    const to = process.env.TO_EMAIL || process.env.FROM_EMAIL || process.env.SMTP_USER || 'matikitibrighton6@gmail.com'

    const mailText = `New contact message from ${name} <${email}>:\n\n${message}`

    // If SendGrid key is present, use SendGrid API (no extra dependency)
    const sendgridKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.FROM_EMAIL || email

    if (sendgridKey) {
      const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: fromEmail },
          subject: `Portfolio contact from ${name}`,
          content: [{ type: 'text/plain', value: mailText }],
        }),
      })

      if (!sgRes.ok) {
        const body = await sgRes.text()
        console.error('SendGrid error', body)
        throw new Error('SendGrid error')
      }

      return NextResponse.json({ ok: true })
    }

    // Fallback to SMTP via nodemailer
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!host || !user || !pass) {
      return NextResponse.json({ error: 'Email not configured. Set SENDGRID_API_KEY or SMTP_* env vars.' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    })

    // final safety: ensure we have a recipient before sending
    if (!to) {
      return NextResponse.json({ error: 'No recipient configured (TO_EMAIL or FROM_EMAIL missing).' }, { status: 500 })
    }

    await transporter.sendMail({
      from: `${name} <${email}>`,
      to,
      subject: `Portfolio contact from ${name}`,
      text: mailText,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('Contact API error', err)
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
