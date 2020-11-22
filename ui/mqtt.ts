import mqtt from "mqtt";

export interface MqttSenderThing {
  send(payload: number): void;
}

export function createMqttChannel(): MqttSenderThing {
  const client = mqtt.connect(localStorage["mqtt"] || "ws://test.mosquitto.org:8080");

  client.on("connect", function () { console.log("Connected to MQTT"); });

  return {
    send(payload: number) {
      const int = Math.round(payload);
      console.log("Sent speed of " + int);
      // client.publish(`rope_trolley/${int}`, int);
      client.publish(`rope_trolley/foo`, JSON.stringify(int));
    }
  }
}
