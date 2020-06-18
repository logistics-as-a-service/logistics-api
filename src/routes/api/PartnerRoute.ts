import { Router } from 'express';
import Auth from '../../middleware/AuthMiddleware';

import MustBePartner from '../../middleware/PartnerMiddleware';
import UploadFile from '../../middleware/UploadMiddleware';

import PartnerController from '../../modules/PartnerModule/PartnerController';
import RidersCtl from '../../modules/RidersModule/RidersController';

import ValidationHelper from '../../Utils/ValidationHelper';
const { validateRider } = ValidationHelper;

const router = Router();

router.post('/partner', PartnerController.registerPartner);

router.put('/partner/:partner_id', [Auth, MustBePartner], PartnerController.updatePartner);

/**
 * Riders routes
 */
// router.get('/partner/:partner/riders', RidersCtl.getPartnerRiders);

router.post(
  '/partner/:partner/rider',
  [Auth, MustBePartner, UploadFile({ validator: validateRider(), maxFiles: 1 })],
  RidersCtl.onBoardPartnerRider
);

// router.get('/partner/:partner/rider/:rider', RidersCtl.updatePartnerRider);

// router.put('/partner/:partner/rider/:rider', RidersCtl.getPartnerRidersById);

export default router;
