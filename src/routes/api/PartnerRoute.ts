import { Router } from 'express';
import Auth from '../../middleware/AuthMiddleware';
import PartnerMiddleware from '../../middleware/PartnerMiddleware';

import PartnerController from '../../modules/PartnerModule/PartnerController';

const router = Router();

router.post('/partner', PartnerController.registerPartner);

router.put('/partner/:partner_id', [Auth, PartnerMiddleware], PartnerController.updatePartner);

export default router;
