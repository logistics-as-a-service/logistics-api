import { EventEmitter2 } from 'eventemitter2';

const eventEmitter = new EventEmitter2();

export enum EventType {
  SendSystemEmail = 'SystemEmail',
  SendWelcomeEmail = 'SendWelcomeEmail',
  SendPasswordUpdate = 'SendPasswordUpdate',
  SendResetPassword = 'SendResetPassword',
}

interface IEvent {
  payload: any;
  type: EventType;
}

export const LogisticsEmitter = {
  emit(event: IEvent) {
    eventEmitter.emit(`logistics:${event.type}`, event.payload);
  },
  addListener(eventType: EventType, listener: (payload: any) => void | Promise<void>) {
    eventEmitter.addListener(`logistics:${eventType}`, listener);
  },
};
