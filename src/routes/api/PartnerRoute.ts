import { Router } from 'express';
import Auth from '../../middleware/AuthMiddleware';
import { uploadFile } from '../../Utils/FileUploader';

import PartnerController from '../../modules/PartnerModule/PartnerController';
import RidersCtl from '../../modules/RidersModule/RidersController';

import { CanManagePartner } from '../../middleware/PermissionMiddleware';

const router = Router();

router.post('/partner', PartnerController.registerPartner);

router.put('/partner/:partner_id', [Auth, CanManagePartner], PartnerController.updatePartner);

/**
 * Riders routes
 */
router.get('/partner/:partner_id/riders', [Auth, CanManagePartner], RidersCtl.getRiders);

router.post(
  '/partner/:partner_id/rider',
  [Auth, CanManagePartner, uploadFile.single('profile_image')],
  RidersCtl.onBoardRider
);

router.get(
  '/partner/:partner_id/rider/:rider_id',
  [Auth, CanManagePartner],
  RidersCtl.getRidersById
);

// router.put('/partner/:partner_id/rider/:rider_id', [Auth, CanManagePartner], RidersCtl.uploadRider);

export default router;
