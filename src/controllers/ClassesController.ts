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

export default class ClassesController {
  async index(req: Request, res: Response) {
    const filters = req.query;

    const week_day = filters.week_day as string;
    const time = filters.time as string;
    const subject = filters.subject as string;

    try {
      if (!week_day || !time || !subject) {
        return res.status(400).send("Missing parameters to filter");
      }

      const timeInMinutes = convertTimeHourToMinutes(time);

      const classes: Classes[] = await db("classes")
        .whereExists(function () {
          this.select("classes_schedules.*")
            .from("classes_schedules")
            .whereRaw("`classes_schedules`.`class_id` = `classes`.`id`")
            .whereRaw("`classes_schedules`.`week_day` = ??", [Number(week_day)])
            .whereRaw("`classes_schedules`.`from` <= ??", [timeInMinutes])
            .whereRaw("`classes_schedules`.`to` > ??", [timeInMinutes]);
        })
        .where("subject", "=", subject)
        .join("users", "classes.user_id", "=", "users.id")
        .join(
          "classes_schedules",
          "classes_schedules.class_id",
          "=",
          "classes.id"
        )
        .select([
          "classes.*",
          "users.*",
          db.raw(
            `group_concat('{ "week_day": ' || classes_schedules.week_day || ', "from": ' || classes_schedules.'from' || ', "to": ' || classes_schedules.'to' || ' }') as 'schedules'`
          ),
        ]);

      let classesWithSchedules = classes.map((classItem) => {
        return {
          ...classItem,
          schedules: JSON.parse(`[${classItem.schedules}]`),
        };
      });

      return res.json(classesWithSchedules);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Unexpected error on getting classes.");
    }
  }
  async create(req: Request, res: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedules } = req.body;

    const trx = await db.transaction();

    try {
      const insertedUsersIds = await trx.table("users").insert({
        name,
        avatar,
        whatsapp,
        bio,
      });

      const user_id = insertedUsersIds[0];
      const insertedClassesIds = await trx.table("classes").insert({
        subject,
        cost,
        user_id,
      });

      const class_id = insertedClassesIds[0];
      const classes_schedules = schedules.map((scheduleItem: Schedule) => ({
        week_day: scheduleItem.week_day,
        from: convertTimeHourToMinutes(scheduleItem.from),
        to: convertTimeHourToMinutes(scheduleItem.to),
        class_id,
      }));

      await trx.table("classes_schedules").insert(classes_schedules);

      await trx.commit();

      return res.status(201).send();
    } catch (error) {
      console.log(error);
      await trx.rollback();
      return res.status(400).send("Unexpected error on creating classes.");
    }
  }
}
