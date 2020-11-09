import * as React from "react";
import * as ReactDom from "react-dom";
import mqtt from "mqtt";
import { createMqttChannel, MOTOR_CHANNEL, MqttSenderThing } from "./mqtt";

interface TrolleyState {
  isDriving: boolean;
  motorSpeed: number;
}

interface TrolleyProps {
  mqttSender?: MqttSenderThing;
}

const DEFAULT_STATE: TrolleyState = {
  motorSpeed: 0,
  isDriving: false,
};

class TrolleyControls extends React.Component<TrolleyProps, TrolleyState> {

  state = DEFAULT_STATE;


  stop = (_event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    this.setState({ motorSpeed: 0, isDriving: false });
    this.props.mqttSender.send(MOTOR_CHANNEL, 0);
  }

  startDriving = () => this.setState({ isDriving: true });

  setSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.isDriving) {
      const val = parseInt(event.target.value, 10);
      this.setState({ motorSpeed: val });
      console.log("SET SPEED: " + val);
      this.props.mqttSender.send(MOTOR_CHANNEL, val);
    }
  }

  render() {
    return <div>
      <h1>What does the UI Need?</h1>
      <p>
        Motor speed: {this.state.motorSpeed}
      </p>
      <h1>Motor</h1>
      <p>
        Reverse / Neutral / Forward
      </p>
      <input type="range"
        min="-100"
        max="100"
        onMouseUp={this.stop}
        onMouseDown={this.startDriving}
        onChange={this.setSpeed}
        value={this.state.motorSpeed} />
      <h1>Servo</h1>
      <p>
        0 - 360
      </p>
      WORK IN PROGRESS
    </div>;
  }
}

const rootElement = document.getElementById("app");

if (rootElement) {
  ReactDom.render(<TrolleyControls mqttSender={createMqttChannel()} />, rootElement);
} else {
  throw new Error("You forgot about the div.");
}
