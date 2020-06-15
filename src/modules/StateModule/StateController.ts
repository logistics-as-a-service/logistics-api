import { Request, Response, NextFunction } from 'express';
import State from '../../database/entity/State';
import RespUtil from '../../Utils/RespUtil';
import { HttpStatus } from '../../types/enums/HttpStatus';

const util = new RespUtil();

export default class StateController {
  /**
   * Get All States
   */
  static async getStates(_req: Request, res: Response, _next: NextFunction) {
    try {
      let states: State[] = await State.find({ select: ['id', 'name'] });
      if (!states.length) states = [];

      util.setSuccess(200, 'successful', states);
      return util.send(res);
    } catch ({ message }) {
      return util.setError(HttpStatus.BAD_REQUEST, message).send(res);
    }
  }

  /**
   * Get Cities
   */
  static async getStateCity(req, res: Response, _next: NextFunction) {
    const { state } = req.params;

    try {
      const stateWithCities = await State.findOne(state, { relations: ['cities'] });

      util.setSuccess(200, 'successful!', stateWithCities);
      return util.send(res);
    } catch ({ message }) {
      return util.setError(HttpStatus.BAD_REQUEST, message).send(res);
    }
  }

  /**
   * Get Local govt area
   */
  static async getLocalGovt(req: Request, res: Response, _next: NextFunction) {
    const { state } = req.params;

    try {
      const stateWithLgas = await State.findOne(state, { relations: ['lgas'] });

      util.setSuccess(200, 'successful!', stateWithLgas);
      return util.send(res);
    } catch ({ message }) {
      return util.setError(HttpStatus.BAD_REQUEST, message).send(res);
    }
  }

  /**
   * Get State details
   */

  static async getStateDetails(_req: Request, res: Response, _next: NextFunction) {
    try {
      let states = await State.find({ relations: ['cities', 'lgas'] });
      if (!states.length) states = [];

      util.setSuccess(200, 'successful!', states);
      return util.send(res);
    } catch ({ message }) {
      return util.setError(HttpStatus.BAD_REQUEST, message).send(res);
    }
  }
}
