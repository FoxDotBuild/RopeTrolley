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
    this.props.mqttSender.send(0);
  }

  startDriving = () => this.setState({ isDriving: true });

  setSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.isDriving) {
      const val = parseInt(event.target.value, 10);
      this.setState({ motorSpeed: val });
      this.props.mqttSender.send(val);
    }
  }

  render() {
    return <div>
      <h1 className="title">Fox.Build Rope Trolley</h1>
      <div className="grid-container">
        <div className="video">
          <img src="http://placehold.jp/320x240.png" alt="video feed placeholder" />
        </div>
        <div className="motor">
          <h2>Motor</h2>
          <p>
            Motor speed: {this.state.motorSpeed}
          </p>
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
        </div>
        <div className="servo">
          <h2>Servo</h2>
          <p>
            0 - 360
          </p>
          WORK IN PROGRESS
         </div>
      </div>
    </div>;
  }
}

const rootElement = document.getElementById("app");

if (rootElement) {
  ReactDom.render(<TrolleyControls mqttSender={createMqttChannel()} />, rootElement);
} else {
  throw new Error("You forgot about the div.");
}
