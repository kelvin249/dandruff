/**
 * Notification utility for sending alerts when new comments are submitted
 * Supports webhook notifications via Discord or custom endpoints
 */

interface NotificationPayload {
  slug: string;
  author: string;
  content: string;
  postTitle?: string;
}

/**
 * Send notification via webhook/Discord
 */
export async function sendWebhookNotification(
  payload: NotificationPayload
): Promise<boolean> {
  const webhookUrl = process.env.COMMENT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("Webhook URL not configured");
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "new_comment",
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    });

    if (!response.ok) {
      console.error("Webhook notification failed:", response.statusText);
      return false;
    }

    console.log("Webhook notification sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send webhook notification:", error);
    return false;
  }
}
