import { Router } from 'express';
import Auth from '../../middleware/AuthMiddleware';

import UploadFile from '../../middleware/UploadMiddleware';
import { CanManagePartner } from '../../middleware/PermissionMiddleware';

import PartnerController from '../../modules/PartnerModule/PartnerController';
import RidersCtl from '../../modules/RidersModule/RidersController';

import ValidationHelper from '../../Utils/ValidationHelper';
const { validateRider } = ValidationHelper;

const router = Router();

router.post('/partner', PartnerController.registerPartner);

router.put('/partner/:partner', [Auth, CanManagePartner], PartnerController.updatePartner);

/**
 * Riders routes
 */

router.get('/partner/:partner/riders', [Auth, CanManagePartner], RidersCtl.getRiders);

router.post(
  '/partner/:partner/rider',
  [Auth, CanManagePartner, UploadFile({ validator: validateRider(), maxFiles: 1 })],
  RidersCtl.onBoardRider
);

// router.get('/partner/:partner/rider/:rider', RidersCtl.updatePartnerRider);

// router.put('/partner/:partner/rider/:rider', RidersCtl.getPartnerRidersById);

export default router;
