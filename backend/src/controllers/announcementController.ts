import { Request, Response } from 'express';
import pool from '../config/database';

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT a.*, u.full_name as author_name 
       FROM announcements a
       JOIN users u ON a.author_id = u.id
       ORDER BY a.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM announcements');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      announcements: result.rows,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT a.*, u.full_name as author_name 
       FROM announcements a
       JOIN users u ON a.author_id = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({ announcement: result.rows[0] });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, content, image_url } = req.body;
    const authorId = (req as any).user.id;

    const result = await pool.query(
      `INSERT INTO announcements (title, content, image_url, author_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, content, image_url || null, authorId]
    );

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: result.rows[0],
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, image_url } = req.body;

    const result = await pool.query(
      `UPDATE announcements 
       SET title = $1, content = $2, image_url = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [title, content, image_url || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({
      message: 'Announcement updated successfully',
      announcement: result.rows[0],
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM announcements WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
