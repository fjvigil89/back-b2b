import Expo from "expo-server-sdk";

export class NotificationService {

  public async sendNotification(tokens: string[], message: string): Promise<void> {
    const expo = new Expo();
    const messages = [];
    for (const pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`El token ${pushToken} de celular no es valido para recibir la notification `);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: "default",
        body: message,
        data: { message },
      });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);

      } catch (error) {
        console.error(error);
      }
    }

    const receiptIds = [];
    for (const ticket of tickets) {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        for (const receipt of receipts) {
          if (receipt.status === "ok") {
            continue;
          } else if (receipt.status === "error") {
            console.error(`Hubo un error al enviar la notificacion: ${receipt.message}`);
            if (receipt.details && receipt.details.error) {
              console.error(`El codigo de erro es: ${receipt.details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

}
