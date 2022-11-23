import { ICustomEvent } from '@designable/shared';
import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent';
export declare class SwitchWorkspaceEvent extends AbstractWorkspaceEvent implements ICustomEvent {
    type: string;
}
