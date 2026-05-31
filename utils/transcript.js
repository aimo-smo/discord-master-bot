async function generateTranscript(channel) {
  const messages = await channel.messages.fetch({ limit: 100 });
  const sorted = [...messages.values()].sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  let html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>Transcript - ${channel.name}</title>
<style>body{font-family:sans-serif;background:#1a1a2e;color:#fff;padding:20px}.msg{margin:10px 0;padding:10px;background:#16213e;border-radius:8px}.author{font-weight:bold;color:#5865f2}.time{color:#888;font-size:12px}</style></head><body>`;
  html += `<h1>📋 Transcript — ${channel.name}</h1><p>تاريخ: ${new Date().toLocaleString('ar-EG')}</p><hr>`;

  for (const msg of sorted) {
    html += `<div class="msg"><span class="author">${msg.author.tag}</span> <span class="time">${msg.createdAt.toLocaleString('ar-EG')}</span><br>${msg.content || '<em>[embed/attachment]</em>'}</div>`;
  }
  html += '</body></html>';
  return html;
}

module.exports = { generateTranscript };
