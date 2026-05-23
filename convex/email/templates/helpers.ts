export const wrap = (body: string) => /* html */ `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:Inter,Arial,sans-serif;color:#111827;">
        ${body}
    </body>
</html>
`
