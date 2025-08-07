// import { asyncHandler } from "express-async-handler";
// import { Request, Response } from 'express';
// import pool from '../models';


// export const getSoftwarebyId = asyncHandler(async (req: Request, res: Response){
//     const { id } = req.params;
//     const result = await pool.query('SELECT id, category_id, name, description, file_path, FROM software WHERE id = $1', [id]);
//     if (result.rows.length > 0) {
//         res.json(result.rows[0]);
//     } else {
//         res.status(404).json({ error: 'ПО не найдено' });
//     }
// });

