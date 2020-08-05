import { Request, Response } from "express";
import db from "../database/connection";
import { convertTimeHourToMinutes } from "../utils/helpers";

interface Schedule {
  week_day: number;
  from: string;
  to: string;
}

interface Classes {
  id: number;
  subject: string;
  cost: number;
  user_id: number;
  name: string;
  avatar: string;
  whatsapp: string;
  bio: string;
  schedules: string;
}

export default class SubscriptionsController {
  async index(req: Request, res: Response) {
    const subscriptions = await db("subscriptions").count("* as total");

    return res.json(subscriptions[0]);
  }
  async create(req: Request, res: Response) {
    const { user_id } = req.body;

    try {
      await db("subscriptions").insert({
        user_id,
      });

      return res.status(201).send();
    } catch (error) {
      res.status(400).send("Unexpected error during register subscription.");
    }
  }
}
