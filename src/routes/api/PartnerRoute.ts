import { Router } from 'express';
import Auth from '../../middleware/AuthMiddleware';
import MustBePartner from '../../middleware/PartnerMiddleware';

import PartnerController from '../../modules/PartnerModule/PartnerController';

const router = Router();

router.post('/partner', PartnerController.registerPartner);

router.put('/partner/:partner_id', [Auth, MustBePartner], PartnerController.updatePartner);

export default router;
