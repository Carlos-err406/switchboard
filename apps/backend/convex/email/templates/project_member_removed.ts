import { wrap } from "./helpers";

export const SUBJECT = `You've been removed from a project on Switchboard`;

export const BODY = wrap(/* html */ `
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background:#f6f7f9;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 16px;">
              <h1 style="margin:0;font-size:24px;line-height:32px;color:#111827;">
                Removed from project
              </h1>
              <p style="margin:16px 0 0;font-size:15px;line-height:24px;color:#4b5563;">
                You have been removed from the project <strong>{{projectName}}</strong> on {{platformName}}.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 24px;">
              <p style="margin:0;font-size:15px;line-height:24px;color:#4b5563;">
                If you believe this was a mistake, please contact your administrator.
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
`);
