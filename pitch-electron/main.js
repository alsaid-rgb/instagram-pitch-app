const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

// Keep reference to prevent garbage collection
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 800,
    minHeight: 600,
    title: 'Instagram Pitch Generator',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#f7f5f0',
    show: false, // show after ready-to-show for smooth launch
  });

  mainWindow.loadFile('index.html');

  // Show window once fully loaded (no white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in system browser, not in-app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC: Analyze Instagram screenshots ───────────────────────────────────────
ipcMain.handle('analyze', async (event, { images, clientName, clientHandle, agencyName, notes, lang, apiKey }) => {
  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });
    const isAr = lang === 'ar';

    const system = isAr
      ? 'أنت خبير تسويق رقمي متخصص في تحليل حسابات إنستقرام. أخرج JSON فقط بدون أي نص آخر أو كود ماركداون.'
      : 'You are a digital marketing expert specializing in Instagram account audits. Output ONLY valid JSON with no markdown, no explanation, no code fences.';

    const userPrompt = isAr
      ? `حلل هذه الصور من حساب إنستقرام "${clientName}" (${clientHandle}) وأنتج هذا JSON بالضبط:
{"metrics":{"followers":"عدد","posts":"عدد","following":"عدد","avg_likes":"متوسط"},"strengths":["..."],"weaknesses":[{"issue":"...","severity":"حرج/عالية/فرصة","impact":"..."}],"content_issues":["..."],"opportunities":["..."],"summary":"ملخص تحليلي بجملتين أو ثلاث"}
${notes ? 'ملاحظات إضافية: ' + notes : ''}`
      : `Analyze these Instagram screenshots for "${clientName}" (${clientHandle}) and output exactly this JSON:
{"metrics":{"followers":"...","posts":"...","following":"...","avg_likes":"..."},"strengths":["..."],"weaknesses":[{"issue":"...","severity":"Critical/High/Opportunity","impact":"..."}],"content_issues":["..."],"opportunities":["..."],"summary":"2-3 sentence analytical summary"}
${notes ? 'Additional notes: ' + notes : ''}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system,
      messages: [{
        role: 'user',
        content: [
          ...images.map(img => ({
            type: 'image',
            source: { type: 'base64', media_type: img.type, data: img.data }
          })),
          { type: 'text', text: userPrompt }
        ]
      }]
    });

    const raw = response.content.map(c => c.text || '').join('');
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return { success: true, data: JSON.parse(cleaned) };

  } catch (err) {
    return { success: false, error: err.message };
  }
});
