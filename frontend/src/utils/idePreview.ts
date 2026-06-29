export const generatePreviewBlob = (
  html: string,
  css: string = "",
  js: string = "",
) => {
  const fullCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
    </html>
  `;

  return new Blob([fullCode], { type: "text/html" });
};
