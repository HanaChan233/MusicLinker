import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { select, insert } from '../db/ops.js'

const router = Router()

// 内存演示用户（未使用，可移除）
const DEMO_USER = { id: 1, username: 'HanaChan233' }

// 登录接口
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username) return res.json({ code: 400, error: '缺失用户名' });

  // 查询用户
  let rows;
  try {
    rows = select('SELECT id, username, password FROM users WHERE username = ? AND deleted = 0', [username]);
  } catch (err) {
    return res.json({ code: 500, error: '数据库错误', detail: err.message });
  }
  const row = rows && rows[0];
  if (!row) return res.json({ code: 401, error: '用户名或密码错误' });
  if (!password || !row.password || password !== row.password) return res.status(401).json({ code: 401, error: '用户名或密码错误' });

  const user = { id: row.id, username: row.username };

  const secret = process.env.JWT_SECRET || 'dev-secret';
  let token;
  try {
    token = jwt.sign(user, secret, {
      expiresIn: '7d',
    });
  } catch (err) {
    return res.status(500).json({ code: 500, error: 'Token 生成失败', detail: err.message });
  }
  res.json({ token, id: user.id, username: user.username });
});

const ruleset = {
  uppercaseLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercaseLetters: 'abcdefghijklmnopqrstuvwxyz',
  specialCharacters: '`~!@#$%^&*()_+-=[]{}\\|;:\'",./<>?',
};

let captchaEnabled = -1;

// 注册接口
router.post('/register', (req, res) => {
  const { username, password, captchaId, captchaCode } = req.body || {};
  if (!username) return res.json({ code: 400, error: '用户名不能为空' });
  if (!password) return res.json({ code: 400, error: '密码不能为空' });

  // 修正：只有 value=1 且 enabled=1 时才启用验证码
  if (captchaEnabled === -1) {
    let captchaOption;
    try {
      captchaOption = select('SELECT value, enabled FROM options WHERE key = ?', ['CAPTCHA_ENABLED']);
    } catch (err) {
      return res.status(500).json({ code: 500, error: '数据库错误', detail: err.message });
    }
    if (!captchaOption || !captchaOption[0] || typeof captchaOption[0].value === 'undefined') {
      // 没有配置项则插入默认值
      try {
        insert('INSERT INTO options (key, value, enabled) VALUES (?, ?, ?)', ['CAPTCHA_ENABLED', '1', 1]);
      } catch (err) {
        return res.status(500).json({ code: 500, error: '数据库错误', detail: err.message });
      }
      captchaEnabled = 1;
    } else if (!['0', '1'].includes(String(captchaOption[0].value)) || (captchaOption[0].enabled != 0 && captchaOption[0].enabled != 1)) {
      // value 或 enabled 字段非法，修正为 0
      try {
        insert('UPDATE options SET value = ?, enabled = ? WHERE key = ?', ['0', 0, 'CAPTCHA_ENABLED']);
      } catch (err) {
        return res.status(500).json({ code: 500, error: '数据库错误', detail: err.message });
      }
      captchaEnabled = 0;
    } else {
      // 只有 value=1 且 enabled=1 时才启用验证码
      captchaEnabled = (captchaOption[0].value == 1 && captchaOption[0].enabled == 1) ? 1 : 0;
    }
  }

  if (captchaEnabled === 1 && (!captchaId || !captchaCode)) return res.json({ code: 400, error: '验证码不能为空' });

  if (captchaEnabled === 1) {
    let captchas;
    try {
      captchas = select('SELECT id, code FROM captchas WHERE id = ?', [captchaId]);
    } catch (err) {
      return res.status(500).json({ code: 500, error: '数据库错误', detail: err.message });
    }
    const captcha = captchas && captchas[0];
    if (!captcha || captcha.code !== captchaCode) return res.json({ code: 400, error: '验证码错误' });
  }

  let rows;
  try {
    rows = select('SELECT id, username, password FROM users WHERE username = ? AND deleted = 0', [username]);
  } catch (err) {
    return res.json({ code: 500, error: '数据库错误', detail: err.message });
  }
  const row = rows && rows[0];
  if (row) return res.json({ code: 409, error: '用户已存在' });

  try {
    const result = insert(
      'INSERT INTO users (username, password, captcha_id) VALUES (?, ?, ?)',
      [username, password, captchaEnabled ? captchaId : 'CAPTCHA_DISABLED']
    );
    if (result.lastInsertRowid) {
      res.json({ code: 200, message: '注册成功', id: result.lastInsertRowid });
    } else {
      res.json({ code: 500, error: '注册失败' });
    }
  } catch (err) {
    res.json({ code: 500, error: '注册异常', detail: err.message });
  }
})

export default router
