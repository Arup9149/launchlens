/**
 * @deprecated Prefer `emailService` from `./service`.
 * Kept as a thin re-export so existing imports keep working.
 */
export { sendEmail, emailService, isTransientEmailError } from "./service"
export type { EmailServiceSendOptions } from "./service"
