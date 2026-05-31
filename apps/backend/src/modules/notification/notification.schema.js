import { z } from "zod";

const orderVarsSchema = z.object({
    customerName: z.string().trim().min(1, "Customer name cannot be empty"),
    orderId: z.string()
            .trim()
            .regex(/^[a-fA-F0-9]{24}$/)
})

const dynamicPayloadUnion = z.discriminatedUnion("eventType", [
    z.object({
        eventType: z.literal("order"),
        eventTag: z.enum(["ORDER RECEIVED", "ORDER READY", "ORDER COMPLETED"]), // 🟢 Fixed spelling
        eventVars: orderVarsSchema
    }),
   
    z.object({
        eventType: z.literal("system"),
        eventTag: z.literal("SYSTEM MAINTENANCE"),
        eventVars: z.object({
            maintenanceTime: z.string().trim().min(1, "Maintenance time is required"),
            reason: z.string().trim().optional()
        })
    })
]);
export const createNotificationSchema = z.object({
    body: z.object({
        recipientId: z.string({
            required_error: "Recipient id is required"
        }).trim().regex(/^[a-fA-F0-9]{24}$/),
        senderName: z.string({
            required_error: "Sender name is required"
        }).trim(),
        isRead: z.boolean().default(false),
        enablePushNotification: z.boolean().default(false),
        payload: dynamicPayloadUnion,
        expiresAt: z.date().optional()
    })
})