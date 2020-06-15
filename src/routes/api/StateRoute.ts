import { Router } from 'express';

import StateCtl from '../../modules/StateModule/StateController';

const router = Router();

router.get('/states', StateCtl.getStates);

router.get('/states/:state/cities', StateCtl.getStateCity);

router.get('/states/:state/lgas', StateCtl.getLocalGovt);

router.get('/states/:state/details', StateCtl.getStateDetails);

export default router;
