import { Request, Response } from 'express';
import pool from '../config/database';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { upcoming = 'false' } = req.query;

    let query = 'SELECT * FROM events ORDER BY event_date';

    if (upcoming === 'true') {
      query = `SELECT * FROM events 
               WHERE event_date >= NOW() 
               ORDER BY event_date ASC`;
    }

    const result = await pool.query(query);

    res.json({ events: result.rows });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ event: result.rows[0] });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, event_date, location } = req.body;

    const result = await pool.query(
      `INSERT INTO events (title, description, event_date, location)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description || null, event_date, location || null]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event: result.rows[0],
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, event_date, location } = req.body;

    const result = await pool.query(
      `UPDATE events 
       SET title = $1, description = $2, event_date = $3, location = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [title, description || null, event_date, location || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event updated successfully',
      event: result.rows[0],
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
