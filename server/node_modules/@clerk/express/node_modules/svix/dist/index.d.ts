import { Authentication } from "./api/authentication";
import { Application } from "./api/application";
import { BackgroundTask } from "./api/backgroundTask";
import { Endpoint } from "./api/endpoint";
import { EventType } from "./api/eventType";
import { Ingest } from "./api/ingest";
import { Integration } from "./api/integration";
import { Management } from "./api/management";
import { Message } from "./api/message";
import { MessageAttempt } from "./api/messageAttempt";
import { OperationalWebhook } from "./api/operationalWebhook";
import { OperationalWebhookEndpoint } from "./api/operationalWebhookEndpoint";
import { Statistics } from "./api/statistics";
export { PostOptions, ApiException } from "./util";
export { HTTPValidationError, HttpErrorOut, ValidationError } from "./HttpErrors";
export * from "./webhook";
export * from "./models/index";
export { ApplicationListOptions } from "./api/application";
export { BackgroundTaskListOptions } from "./api/backgroundTask";
export { EndpointListOptions, EndpointGetStatsOptions } from "./api/endpoint";
export { EventTypeListOptions } from "./api/eventType";
export { IntegrationListOptions } from "./api/integration";
export { MessageListOptions, messageInRaw } from "./api/message";
export { MessageAttemptListByEndpointOptions } from "./api/messageAttempt";
export { OperationalWebhookEndpointListOptions } from "./api/operationalWebhookEndpoint";
export interface SvixOptions {
    debug?: boolean;
    serverUrl?: string;
    requestTimeout?: number;
}
export declare class Svix {
    private readonly requestCtx;
    constructor(token: string, options?: SvixOptions);
    get authentication(): Authentication;
    get application(): Application;
    get endpoint(): Endpoint;
    get eventType(): EventType;
    get ingest(): Ingest;
    get integration(): Integration;
    get management(): Management;
    get message(): Message;
    get messageAttempt(): MessageAttempt;
    get backgroundTask(): BackgroundTask;
    get statistics(): Statistics;
    get operationalWebhook(): OperationalWebhook;
    get operationalWebhookEndpoint(): OperationalWebhookEndpoint;
}
