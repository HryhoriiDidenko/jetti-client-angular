import { Ref } from './../models/document';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { IJWTPayload } from '../models/common-types';
import { FormListSettings, UserDefaultsSettings } from './../models/user.settings';
import { SDB } from './middleware/db-sessions';
import { lib } from '../std.lib';

export const router = express.Router();

export function User(req: Request): IJWTPayload {
  return (<any>req).user as IJWTPayload;
}

router.get('/user/settings/:type', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = User(req);
    const sdb = SDB(req);
    // const query = `select JSON_QUERY(settings, '$."${req.params.type}"') data from users where email = @p1`;
    // const result = await sdb.oneOrNone<{ data: FormListSettings }>(query, [user.email]);
    res.json(new FormListSettings());
  } catch (err) { next(err); }
});

router.post('/user/settings/:type', async (req, res, next) => {
  try {
    const user = User(req);
    const sdb = SDB(req);
    const data = req.body || {};
    // const query = `update users set settings = JSON_MODIFY(settings, '$."${req.params.type}"', JSON_QUERY(@p1)) where email = @p2`;
    // await sdb.none(query, [JSON.stringify(data), user.email]);
    res.json(true);
  } catch (err) { next(err); }
});

router.get('/user/settings/defaults', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = User(req);
    const sdb = SDB(req);
    // const query = `select JSON_QUERY(settings, '$."defaults"') data from users where email = @p1`;
    // const result = await sdb.oneOrNone<{ data: UserDefaultsSettings }>(query, [user.email]);
    res.json(new UserDefaultsSettings());
  } catch (err) { next(err); }
});

router.post('/user/settings/defaults', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = User(req);
    const sdb = SDB(req);
    const data = req.body || new UserDefaultsSettings();
    // const query = `update users set settings = JSON_MODIFY(settings, '$."defaults"', JSON_QUERY(@p1)) where email = @p2`;
    // await sdb.none(query, [JSON.stringify(data), user.email]);
    res.json(true);
  } catch (err) { next(err); }
});

router.get('/user/roles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = User(req);
    const sdb = SDB(req);
    const result = ['Admin'];
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/user/permissions/roles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result: { id: Ref, description: string }[] = [];
    const user = User(req) as any;
    if (user.env) {
      const sdb = SDB(req);
      result = await lib.util.getUserRoles(sdb);
    }
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/user/permissions/roles/isAvailable/:role', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = false;
    const user = User(req) as any;
    if (user.env) {
      const sdb = SDB(req);
      result = await lib.util.isRoleAvailable(req.params.role, sdb);
    }
    res.json(result);
  } catch (err) { next(err); }
});