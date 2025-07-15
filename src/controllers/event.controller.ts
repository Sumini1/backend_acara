import { Response } from "express";
import { iPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import EventModel, { IEvent } from "../models/event.model";
import { FilterQuery } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body, user: req.user?.id };
      const result = await EventModel.create(payload);
      response.success(res, result, "Success create a event");
    } catch (error) {
      response.error(res, error, "Failed create event");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as iPaginationQuery;
      const query: FilterQuery<IEvent> = {};
      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }
      const result = await EventModel.find(query)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ createdAt: -1 })
        .exec();
      const count = await EventModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: page,
          total: count,
          totalPages: Math.ceil(count / Number(limit)),
        },
        "Success find all events"
      );
    } catch (error) {
      response.error(res, error, "Failed  find all event");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
        const {id} = req.params;
        const result = await EventModel.findById(id);
        response.success(res, result, "Success find one event");
    } catch (error) {
      response.error(res, error, "Failed find one event");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
        const { id } = req.params;
        const result = await EventModel.findByIdAndUpdate(id,   req.body, {
            new: true
        });
        response.success(res, result, "Success update an event");
    } catch (error) {
      response.error(res, error, "Failed update an event");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
        const { id } = req.params;
        const result = await EventModel.findByIdAndDelete(id, {
            new: true
        });
        response.success(res, result, "Success remove an event");
    } catch (error) {
      response.error(res, error, "Failed remove an event");
    }
  },
  async findOneBySlug(req: IReqUser, res: Response) {
    try {
        const { slug } = req.params;
        const result = await EventModel.findOne({slug});
        response.success(res, result, "Success find one by slug event");
    } catch (error) {
      response.error(res, error, "Failed find one by slug event");
    }
  },
};
