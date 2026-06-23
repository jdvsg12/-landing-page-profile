export function emailTemplate({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f">
      <tr>
        <td align="center" style="padding:40px 20px">
          <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">
            <tr>
              <td style="padding:32px;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px;border:1px solid rgba(255,255,255,0.06)">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08)">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width:36px;height:36px;background:linear-gradient(135deg,#00d4ff,#7b2ff5);border-radius:10px;text-align:center;vertical-align:middle;font-size:18px;color:#fff;font-weight:700">JV</td>
                          <td style="padding-left:12px;color:#e2e8f0;font-size:16px;font-weight:600">New Contact Message</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 0;color:#94a3b8;font-size:14px;line-height:1.7">
                      You received a new message from your portfolio contact form.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid rgba(255,255,255,0.06)">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:6px 0">
                            <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Name</span>
                            <div style="color:#e2e8f0;font-size:15px;font-weight:500;margin-top:2px">${name}</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0">
                            <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Email</span>
                            <div style="color:#00d4ff;font-size:15px;margin-top:2px">
                              <a href="mailto:${email}" style="color:#00d4ff;text-decoration:none">${email}</a>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0">
                            <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Message</span>
                            <div style="color:#e2e8f0;font-size:14px;line-height:1.7;margin-top:4px">${message}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 0 0;border-top:1px solid rgba(255,255,255,0.06);margin-top:20px;color:#475569;font-size:12px">
                      Sent from your portfolio contact form
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}
