import { Router } from 'express'
import { select, insert, update, fakeDelete } from '../db/ops.js'
import jwt from 'jsonwebtoken';
import path from 'path';

const router = Router()

router.get('/get', (req, res) => {
  const id = req.params.id || req.query.id;
  const token = req.params.token || req.query.token;

  if (!id) {
    return res.status(400).json({ code: 400, error: '缺失曲目 ID' });
  }

  // 验证 token 是否有效
  const secret = process.env.JWT_SECRET || 'dev-secret';
  if (!token) {
    return res.status(401).json({ code: 401, error: '缺失 Token' });
  }
  try {
    jwt.verify(token, secret);
  } catch (err) {
    return res.status(401).json({ code: 401, error: 'Token 无效或过期' });
  }

  const rows = select('SELECT name, artist, source, platform FROM tracks WHERE id = ? AND deleted = 0 AND public = 1', [id]);
  if (!rows || rows.length === 0) {
    return res.status(404).json({ code: 404, error: '曲目未找到' });
  }
  
  sendTrack(req, res, rows[0].platform, rows[0].source, id)

})

const sendTrack = (req, res, platform, source, id) => {
  if (platform === 'LOCAL') {
    // 返回带有环境变量前缀的本地文件
    const filePrefix = process.env.TRACK_PATH_PREFIX || 'E:\\User\\MediaLibrary\\Musics';
    if (!filePrefix) {
      return res.status(500).json({ code: 500, error: 'LOCAL_FILE_PREFIX 环境变量未设置' });
    }

    const filePath = path.join(filePrefix, source);
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({ code: 404, error: `文件未找到，请反馈这个错误。曲目 ID：${id}` });
      }
    });
  } else {
    // 非LOCAL平台暂不支持
    res.status(400).json({ code: 400, error: '暂不支持该平台的曲目获取' });
  }
}

router.post('/import', async (req, res) => {
  const { name, artist, platform, source } = req.body || {};

  if (!name || !artist || !platform || !source) {
    return res.status(400).json({ code: 400, error: '缺失必要参数：name, artist, platform 或 source' });
  }

  // 校验 token 是否有效
  const token = req.body.token || '';
  let importer = 'anonymous';
  if (!token) {
    return res.status(401).json({ code: 401, error: 'missing token' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const user = jwt.verify(token, secret);
    importer = user.username || 'unknown';
  } catch (err) {
    return res.status(401).json({ code: 401, error: 'Token 无效或过期' });
  }

  // 检查是否已存在相同的曲目
  const existRows = select(
    'SELECT id FROM tracks WHERE name = ? AND platform = ? AND source = ? AND deleted = 0',
    [name, platform, source]
  );
  if (existRows && existRows.length > 0) {
    return res.status(409).json({ code: 409, error: '同名同源曲目已存在。如信息错误，请考虑反馈错误' });
  }

  let publicStatus = 2; // 需审核：内容确认
  const sameNameRows = select(
    'SELECT id, platform FROM tracks WHERE name = ? AND deleted = 0',
    [name]
  );
  if (sameNameRows && sameNameRows.some(row => row.platform === platform)) {
    publicStatus = 4; // 存在同平台曲目
  } else if (sameNameRows && sameNameRows.length > 0) {
    publicStatus = 3; // 存在同名曲目但不同平台
  }

  // 插入曲目信息到数据库
  try {
    const result = insert(
      'INSERT INTO tracks (name, artist, source, platform, importer, public) VALUES (?, ?, ?, ?, ?, ?)',
      [name, artist, source, platform, importer, publicStatus]
    );
    if (result.lastInsertRowid) {
      let msg = '';
      if (publicStatus === 2) {
        msg = '曲目导入成功，等待内容审核';
      } else if (publicStatus === 3) {
        msg = '曲目导入成功，存在同名不同平台曲目，等待内容审核';
      } else if (publicStatus === 4) {
        msg = '曲目导入成功，存在同名同平台曲目，等待源更新审核';
      } else {
        msg = '曲目导入成功';
      }
      res.json({ code: 200, message: msg, trackId: result.lastInsertRowid });
    } else {
      res.status(500).json({ code: 500, error: '曲目导入失败' });
    }
  } catch (err) {
    res.status(500).json({ code: 500, error: '数据库错误', detail: err.message });
  }
});

export default router
