import express, { Request, Response } from "express";
import pool from "../db/db";
import { body, param, validationResult } from "express-validator";
import { comparePassword, hashPasword } from "../Utils/passwordUtils";
import { authenticatToken } from "../middlewares/authMiddleware";
import { IRequest } from "src/types/reques.type";
import { getUserId } from "../Utils/getUserIdUtils";
import { TWatchlist } from "src/types/frontend/frontend-types";
import { getMovieGenres } from "../Utils/getMovieDetails";
import { TmovieGenre } from "src/types/types";
import { validateErrors } from "../Utils/express-validator";
import { editWatchlistValidateRequest } from "src/constants/validate-request";

const router = express.Router();

/** GET REQUEST METHODS */

router.get(
  "/get-watchlist/:watchlist_id",
  authenticatToken,
  param("watchlist_id").notEmpty().withMessage("Watchlist ID is required"),
  async (req: IRequest, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: validationErrors.array(),
        message: "Invalid input",
      });
      return;
    }

    const { email } = req.user;
    const { watchlist_id } = req.params;

    try {
      // We can get the user_id by querying the username in the database
      const user = await getUserId(email, res);
      const { id } = user || {};

      // wm = watchlist_movie
      // const watchlist = await pool.query('SELECT * FROM watchlist WHERE user_id = $1 AND id = $2', [id, watchlist_id]);
      // Selecting all the listed columns joining it with the watchlist table but only if the watchlist id exists and the user_id is the
      // same as the user_id in the token
      const queryRows = await pool.query(
        "SELECT wm.watchlist_id, wm.tmdb_movie_id, wm.added_at, w.user_id, w.created_at, w.watchlist_name, w.description FROM watchlist_movie wm JOIN watchlist w ON wm.watchlist_id = w.id WHERE w.user_id = $1 AND w.id = $2",
        [id, watchlist_id]
      );
      if (queryRows.rows.length === 0) {
        res.status(400).json({
          success: false,
          message: "Watchlist does not exist or unauthorized access",
        });
        return;
      }
      const watchlist: TWatchlist = {
        id: queryRows.rows[0].watchlist_id,
        user_id: queryRows.rows[0].user_id,
        created_at: queryRows.rows[0].created_at,
        watchlist_name: queryRows.rows[0].watchlist_name,
        description: queryRows.rows[0].description,
        movies: queryRows.rows.map((row: any) => {
          // Returns an array of movies
          return {
            tmdb_movie_id: row.tmdb_movie_id,
            added_at: row.added_at,
          };
        }),
      };
      res.status(200).json({
        success: true,
        message: "Watchlist queried succesfully",
        data: watchlist,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
        return;
      }
    }
  }
);

// GET ALL WATCHLISTS

router.get(
  "/get-watchlists",
  authenticatToken,
  async (req: IRequest, res: Response) => {
    const { email } = req.user;

    try {
      // We can get the user_id by querying the username in the database
      const user = await getUserId(email, res);
      const { id } = user || {};

      const watchlists = await pool.query(
        "SELECT * FROM watchlist WHERE user_id = $1",
        [id]
      );
      if (watchlists.rows.length === 0) {
        res.status(400).json({ success: false, message: "No watchlist found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Watchlists queried succesfully",
        data: watchlists.rows,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
        return;
      }
    }
  }
);

/** POST REQUEST METHODS */

// 1. To create a new watchlist we need to save into our database user_id, created_at, and the name of the watchlist.
// TO the above we can get the token from the user, verify the token and get the user_id from the token. Then we can use it to save into the
// watchlist table
// Return the name of the watchlist

// 2. To get a new watchlist, they pass in the token, we decrypt the token and get the user_id, then we query the database for the watchlist
// that belongs to the user_id

// CREATE NEW WATCHLIST
router.post(
  "/create-watchlist",
  authenticatToken,
  body("watchlist_name").notEmpty().withMessage("Watchlist name is required"),
  body("description").notEmpty().withMessage("Description name is required"),
  async (req: IRequest, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: validationErrors.array(),
        message: "Invalid input",
      });
      return;
    }

    const { email } = req.user;
    const { watchlist_name, description } = req.body;

    try {
      // We can get the user_id by querying the username in the database
      const user = await getUserId(email, res);
      const { id } = user || {};

      // If the watchlist already exists, we return a status of 400
      const watchlistExists = await pool.query(
        "SELECT * FROM watchlist WHERE user_id = $1 AND watchlist_name = $2",
        [id, watchlist_name]
      );
      if (watchlistExists.rows.length > 0) {
        res
          .status(400)
          .json({ success: false, message: "Watchlist already exists" });
        return;
      }

      const created_at = new Date();

      const result = await pool.query(
        "INSERT INTO watchlist (user_id, watchlist_name, created_at, description) VALUES ($1, $2, $3, $4) RETURNING id",
        [id, watchlist_name, created_at, description]
      );

      res.status(201).json({
        success: true,
        message: "Watchlist created successfully",
        data: result.rows[0],
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
        return;
      }
    }
  }
);

// ADD MOVIE TO WATCHLIST /add-movie-to-watchlist/:watchlist_id

router.post(
  "/add-movie-to-watchlist/:watchlist_id",
  authenticatToken,
  body("tmdb_movie_id").notEmpty().withMessage("TMDB Movie ID is required"),
  param("watchlist_id").notEmpty().withMessage("Watchlist ID is required"),
  async (req: IRequest, res: Response) => {
    // Firstly we validate the input
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: validationErrors.array(),
        message: "Invalid input",
      });
      return;
    }
    // Then we destructure the email and watchlist_id from the request
    const { email } = req.user; // We are going to use this to get the user id
    const { watchlist_id } = req.params;
    const { tmdb_movie_id } = req.body;

    try {
      // We can get the user_id by querying the username in the database
      const user = await getUserId(email, res);
      const { id } = user || {};

      const watchlist = await pool.query(
        "SELECT * FROM watchlist WHERE user_id = $1 AND id = $2",
        [id, watchlist_id]
      );
      if (watchlist.rows.length === 0) {
        res.status(400).json({
          success: false,
          message: "Watchlist does not exist or unauthorized access",
        });
        return;
      }

      const does_movie_exist = await pool.query(
        "SELECT * FROM watchlist_movie WHERE watchlist_id = $1 AND tmdb_movie_id = $2",
        [watchlist_id, tmdb_movie_id]
      );
      if (does_movie_exist.rows.length > 0) {
        res.status(400).json({
          success: false,
          message: "Movie already exist in the watchlist",
        });
        return;
      }

      /**INSERTING INTO THE WATCHLIST_MOVIE TABLE */

      const added_at = new Date();
      await pool.query(
        "INSERT INTO watchlist_movie (watchlist_id, tmdb_movie_id, added_at) VALUES ($1, $2, $3) ON CONFLICT (watchlist_id, tmdb_movie_id) DO NOTHING",
        [watchlist_id, tmdb_movie_id, added_at]
      );

      /**GETTING THE GENRE FROM TMDB */
      const movieGenres: TmovieGenre[] = await getMovieGenres(tmdb_movie_id);
      for (let genre of movieGenres) {
        const response = await pool.query("SELECT * FROM genre WHERE id = $1", [
          genre.id,
        ]);
        if (response.rows.length === 0) {
          await pool.query(
            "INSERT INTO genre (id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [genre.id, genre.name]
          );
        }

        /**INSERTING INTO THE MOVIE_GENRE TABLE */

        await pool.query(
          "INSERT INTO movie_genre (tmdb_movie_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [tmdb_movie_id, genre.id]
        );
      }

      res.status(200).json({
        success: true,
        message: "Movie added to watchlist succesfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
        return;
      }
    }
  }
);

/** PATCH REQUEST METHODS */

router.patch(
  "/edit/:watchlist_id",
  authenticatToken,
  editWatchlistValidateRequest,
  async (req: IRequest, res: Response) => {
    const { email } = req.user;
    const { watchlist_id } = req.params;
    const { watchlist_name, description } = req.body;

    try {
        if(!watchlist_name && !description) {
            res.status(400).json({
                success: false,
                message: "No data to update"
            })
            return;
        }

      const user = await getUserId(email, res);
      const { id } = user || {};

      const watchlist = await pool.query(
        "SELECT * FROM watchlist WHERE user_id = $1 AND id = $2",
        [id, watchlist_id]
      );
      if (watchlist.rows.length === 0) {
        res
          .status(400)
          .json({
            success: false,
            message: "Watchlist does not exist or unauthorized access",
          });
        return;
      }

      const result = await pool.query(
        "UPDATE watchlist SET watchlist_name = COALESCE($1, watchlist_name), description = COALESCE($2, description) WHERE id = $3 RETURNING *",
        [watchlist_name, description, watchlist_id]
      );

      res
        .status(200)
        .json({
          success: true,
          message: "Watchlist updated succesfully",
          data: result.rows[0],
        });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({
            success: false,
            message: "Server error",
            error: error.message,
          });
        return;
      }
    }
  }
);

/** DELETE REQUEST METHODS */

// DELETE A WATCHLIST /delete-watchlist/:watchlist_id

router.delete(
  "/delete-watchlist/:watchlist_id",
  authenticatToken,
  param("watchlist_id").notEmpty().withMessage("Watchlist ID is required"),
  async (req: IRequest, res: Response) => {
    // Firstly we validate the input
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: validationErrors.array(),
        message: "Invalid input",
      });
      return;
    }
    // Then we destructure the email and watchlist_id from the request
    const { email } = req.user;
    const { watchlist_id } = req.params;

    try {
      // We can get the user_id by querying the username in the database
      const user = await getUserId(email, res);
      const { id } = user || {};

      const watchlist = await pool.query(
        "SELECT * FROM watchlist WHERE user_id = $1 AND id = $2",
        [id, watchlist_id]
      );
      if (watchlist.rows.length === 0) {
        res.status(400).json({
          success: false,
          message: "Watchlist does not exist or unauthorized access",
        });
        return;
      }

      await pool.query("DELETE FROM watchlist WHERE id = $1", [watchlist_id]);

      res
        .status(200)
        .json({ success: true, message: "Watchlist deleted succesfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
        return;
      }
    }
  }
);

// DELETE A MOVIE FROM A WATCHLIST /watchlists/:watchlist_id/movies/:movie_id

router.delete(
  "/:watchlist_id/movies/:tmdb_movie_id",
  authenticatToken,
  param("watchlist_id").notEmpty().withMessage("Watchlist ID is required"),
  param("tmdb_movie_id").notEmpty().withMessage("Movie ID is required"),
  (req: Request, res: Response, next: express.NextFunction) =>
    validateErrors(req, res, next),
  async (req: IRequest, res: Response) => {
    const { watchlist_id, tmdb_movie_id } = req.params;
    console.log(watchlist_id, tmdb_movie_id);
    const { email } = req.user;

    try {
      // We can get the user_id by querying the username in the database
      const user = await getUserId(email, res);
      const { id } = user || {};

      /**CHECKING IF THE WATCHLIST EXIST FOR THIS USER */
      const watchlist = await pool.query(
        "SELECT * FROM watchlist WHERE user_id = $1 AND id = $2",
        [id, watchlist_id]
      );
      if (watchlist.rows.length === 0) {
        res.status(400).json({
          success: false,
          message: "Watchlist does not exist or unauthorized access",
        });
        return;
      }

      /**CHECKING IF THE MOVIE EXIST IN THE WATCHLIST BY CHECKING THE WATCHLIST_MOVIE TABLE */
      const watchlist_movie_result = await pool.query(
        "SELECT * FROM watchlist_movie WHERE tmdb_movie_id = $1 and watchlist_id = $2",
        [tmdb_movie_id, watchlist_id]
      );
      if (watchlist_movie_result.rows.length === 0) {
        res.status(400).json({
          success: false,
          message: "Movie does not exist in this watclist",
        });
        return;
      }

      await pool.query(
        "DELETE FROM watchlist_movie WHERE watchlist_id = $1 AND tmdb_movie_id = $2",
        [watchlist_id, tmdb_movie_id]
      );

      res.status(200).json({
        success: true,
        message: "Movie deleted from watchlist succesfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
        return;
      }
    }
  }
);

export default router;
