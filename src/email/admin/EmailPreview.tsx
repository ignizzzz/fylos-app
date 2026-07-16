import { useParams } from 'react-router-dom'
import { Eye, Mail } from 'lucide-react'
import { useCampaign } from '../hooks/data'
import { paths } from '../routes'
import { AdminShell } from '../layout/AdminShell'
import { Async, Card, Divider, C } from '../ui'

/** Read-only look at what a campaign email becomes in a subscriber's inbox. */
export default function EmailPreview() {
  const { id } = useParams()
  const state = useCampaign(id ?? '')

  return (
    <AdminShell
      title="Email preview"
      subtitle="How this newsletter looks in the inbox."
      back={{ to: paths.campaign(id ?? ''), label: 'Campaign' }}
    >
      <Async state={state}>
        {(campaign) => {
          const { fromName, fromEmail, subject, preheader, body } = campaign.content
          const lines = body
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0)

          return (
            <div className="max-w-[620px]">
              {/* Honest note: nothing is actually sent from here. */}
              <div
                className="flex items-center gap-2 mb-3 text-[12.5px]"
                style={{ color: C.ink3 }}
              >
                <Eye size={15} strokeWidth={2.2} />
                <span>This is a preview. No email is sent.</span>
              </div>

              <Card radius="hero">
                {/* Inbox-style sender header */}
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: C.peachSelected }}
                  >
                    <Mail size={18} strokeWidth={2.2} style={{ color: C.coral }} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold truncate" style={{ color: C.ink }}>
                      {fromName}
                    </div>
                    <div className="text-[12.5px] truncate" style={{ color: C.ink3 }}>
                      {fromEmail}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h2
                    className="text-[18px] font-extrabold tracking-[-0.01em] leading-[1.3]"
                    style={{ color: C.ink }}
                  >
                    {subject}
                  </h2>
                  {preheader && (
                    <p className="mt-1 text-[13.5px]" style={{ color: C.ink3 }}>
                      {preheader}
                    </p>
                  )}
                </div>

                <div className="my-5">
                  <Divider />
                </div>

                {/* Body: each non-empty line as its own comfortable paragraph */}
                <div className="flex flex-col gap-3">
                  {lines.map((line, i) => (
                    <p key={i} className="text-[14.5px] leading-[1.7]" style={{ color: C.ink2 }}>
                      {line}
                    </p>
                  ))}
                </div>

                <div className="my-5">
                  <Divider />
                </div>

                {/* Footer line, styled to read like a real unsubscribe row but inert */}
                <p className="text-[12px] leading-[1.5]" style={{ color: C.ink3 }}>
                  You are receiving this because you subscribed.{' '}
                  <span className="underline" style={{ color: C.ink2 }}>
                    Unsubscribe
                  </span>
                  .
                </p>
              </Card>
            </div>
          )
        }}
      </Async>
    </AdminShell>
  )
}
