import { wrap } from './helpers'

export const SUBJECT = `Invitation to Switchboard`

export const BODY = wrap(/* html */ `
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:Inter,Arial,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background:#f6f7f9;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 16px;">
                <h1 style="margin:0;font-size:24px;line-height:32px;color:#111827;">
                  You’ve been invited to {{platformName}}
                </h1>
                <p style="margin:16px 0 0;font-size:15px;line-height:24px;color:#4b5563;">
                  {{invitedBy}} invited <strong>{{email}}</strong> to join the platform.
                </p>
              </td>
            </tr>
        <tr>
          <td style="padding:8px 32px 24px;">
            <p style="margin:0 0 24px;font-size:15px;line-height:24px;color:#4b5563;">
              Accept the invitation to create your account and start managing projects, environments, and feature flags.
            </p>

            <a href="{{url}}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 18px;border-radius:10px;">
              Accept invitation
            </a>

            <p style="margin:24px 0 0;font-size:13px;line-height:20px;color:#6b7280;">
              This invitation expires in {{expiresIn}}.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;line-height:18px;color:#6b7280;">
              If the button doesn’t work, copy and paste this link into your browser:
            </p>
            <p style="margin:8px 0 0;font-size:12px;line-height:18px;color:#374151;word-break:break-all;">
              <a href="{{url}}" style="color:#374151;">{{url}}</a>
            </p>
            <p style="margin:16px 0 0;font-size:12px;line-height:18px;color:#9ca3af;">
              If you weren’t expecting this invitation, you can safely ignore this email.
            </p>
          </td>
        </tr>
      </table>

      <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">
        {{platformName}} at {{orgName}}
      </p>
    </td>
  </tr>
</table>
`)
