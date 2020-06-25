import { Router } from 'express';
import Auth from '../../middleware/AuthMiddleware';

import DeliverySettingsCtrl from '../../modules/DeliverySettingModule/DeliverySettingController';

const router = Router();

router.post('/delivery-settings',[Auth], DeliverySettingsCtrl.createNewDeliverySettings);
router.put('/delivery-settings/:id',[Auth], DeliverySettingsCtrl.updateDeliverySettings);

export default router;
