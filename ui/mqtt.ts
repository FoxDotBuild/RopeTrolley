import mqtt from "mqtt";

export interface MqttSenderThing {
  send(topic: string, payload: number): void;
}
export const MOTOR_CHANNEL = "rope_trolley/motor/speed";

export function createMqttChannel(): MqttSenderThing {
  const client = mqtt.connect("ws://mqtt.eclipse.org:80");


  client.on("connect", function () {
    client.subscribe(MOTOR_CHANNEL, function (err) {
      if (!err) {
        client.publish(MOTOR_CHANNEL, "Hello mqtt");
      }
    })
  })

  client.on("message", function (topic, message) {
    switch (topic) {
      case MOTOR_CHANNEL:
        console.log(message);
        break;
      default:
        console.log(`UNKNOWN TOPIC ${topic}: ${message}`);
    }
  });

  return {
    send(topic: string, payload: number) { client.publish(topic, payload) }
  }
}
