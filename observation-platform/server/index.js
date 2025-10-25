import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;
const DATA_FILE = path.join(__dirname, 'data.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeMe@2025';

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

const activeTokens = new Map();

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    const seed = {
      meta: { updatedAt: new Date().toISOString(), lastEditor: 'system' }
    };
    writeData(seed);
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(payload) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
}

function authenticate(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ message: '未授权访问，请重新登录。' });
  }
  req.admin = activeTokens.get(token);
  next();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/login', (req, res) => {
  const { password, username = 'admin' } = req.body || {};
  if (!password) {
    return res.status(400).json({ message: '密码不能为空' });
  }
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: '密码错误' });
  }
  const token = nanoid();
  activeTokens.set(token, { username, loginAt: new Date().toISOString() });
  res.json({ token, username, expiresIn: 60 * 60 });
});

app.post('/api/logout', authenticate, (req, res) => {
  const token = req.headers['x-admin-token'];
  activeTokens.delete(token);
  res.json({ message: '已退出登录' });
});

app.get('/api/data', (_req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    console.error('读取数据失败', error);
    res.status(500).json({ message: '读取数据失败' });
  }
});

app.post('/api/data', authenticate, (req, res) => {
  try {
    const incoming = req.body || {};
    const current = readData();
    const editorName = req.admin && req.admin.username ? req.admin.username : 'admin';
    const payload = {
      ...incoming,
      meta: {
        updatedAt: new Date().toISOString(),
        lastEditor: editorName
      }
    };
    writeData(payload);
    res.json({
      message: '数据已更新',
      meta: payload.meta,
      previousMeta: current.meta
    });
  } catch (error) {
    console.error('写入数据失败', error);
    res.status(500).json({ message: '写入数据失败' });
  }
});

app.listen(PORT, () => {
  console.log(`Observation platform API running on http://localhost:${PORT}`);
});
