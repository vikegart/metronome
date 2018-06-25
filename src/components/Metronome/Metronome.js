import React, { Component } from 'react';
import styled from 'styled-components';

import click1 from '../../audio/click1.wav';
import click2 from '../../audio/click2.wav';

import ActionButton from '../ActionButton/ActionButton';
import Heading from '../Heading/Heading';
import Slider from '../Slider/Slider';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import './metronome.css';

const MetronomeWrapper = styled.div`
  max-width: 375px;
  margin: 0 auto;
  padding: 30px;
`;

const CountWrapper = styled.div`
  font-family: cursive;
  font-size: 35em;
`

class Metronome extends Component {
  constructor(props) {
    super(props);
    console.log(process.env.NODE_ENV === 'development');

    this.state = {
      playing: false,
      count: 0,
      bpm: 100,
      beatsPerMeasure: 4,
      settingsOpen: false,
      isLowMode: false
    };


    this.click1 = new Audio(click1);
    this.click2 = new Audio(click2);
  }

  componentDidMount() {
    process.env.NODE_ENV === 'development' && this.startStop();
    process.env.NODE_ENV === 'development' &&  this.setState({ playing : true });
  }

  handleBpmChange = event => {
    const bpm = event.target.value;

    if (this.state.playing) {
      clearInterval(this.timer);

      this.timer = setInterval(this.playClick, (60 / bpm) * 1000);

      this.setState({
        count: 0,
        bpm
      });
    } else {
      this.setState({ bpm });
    }
  }

  handleBeatsChange = event => {
    if (this.state.playing) {
      this.setState({
        beatsPerMeasure: event.target.value,
      },
        clearInterval(this.timer),
        this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000));
    } else {
      this.setState({
        beatsPerMeasure: event.target.value
      });
    }
  }

  startStop = () => {
    if (this.state.playing) {
      // Stop the timer
      clearInterval(this.timer);
      this.setState({
        playing: false,
        count: 0
      });
    } else {
      // Start a timer with the current BPM
      this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);

      this.setState({
        count: 0,
        playing: true
      }, this.playClick)
    }
  }

  playClick = () => {
    const { count, beatsPerMeasure } = this.state;

    if (count % beatsPerMeasure === 0) {
      this.click2.play();
    } else {
      this.click1.play();
    }

    this.setState(state => ({
      count: (state.count + 1) % state.beatsPerMeasure
    }));
    if (window.shape !== undefined) {
      !window.LOW_MODE && window.shape.print(count + 1);
    }
  }

  toggleSettings = () => {
    this.setState({ settingsOpen: !this.state.settingsOpen })
  }

  toggleLowVisualMode = () => {
    this.setState({
      isLowMode: !this.state.isLowMode,
    }, () => {
      window.LOW_MODE = !window.LOW_MODE;
      window.LOW_MODE && window.shape.destroy();
      !window.LOW_MODE && window.shape.init();
      })
  }

  render() {
    const { playing, bpm, count, beatsPerMeasure, isLowMode } = this.state;

    return (
      <div>
        <FontAwesomeIcon
          icon='cog'
          className='settings-icon'
          size='3x'
          onClick={this.toggleSettings}
        />
        <MetronomeWrapper>
          <div className={this.state.settingsOpen ? '' : 'hidden'}>
            <Heading
              isPlaying={playing}
              currentBpm={bpm}
              currentBeats={beatsPerMeasure} />

            <Slider
              currentBpm={bpm}
              handleChange={this.handleBpmChange}
              min='60'
              max='240' />
            <Slider
              currentBpm={beatsPerMeasure}
              handleChange={this.handleBeatsChange}
              min='1'
              max='16' />

            <ActionButton
              isPlaying={playing}
              handleOnClick={this.startStop} />

            
            <FontAwesomeIcon
              icon= {isLowMode ? 'low-vision' : 'eye'}
              className='low-icon'
              size='2x'
              onClick={this.toggleLowVisualMode}
            />
            <strong>Enable\Disable Low Mode</strong>

          </div>
          {(window.shape === undefined || window.LOW_MODE) 
              && <CountWrapper>
                  {count === 0 ? beatsPerMeasure : count}
                </CountWrapper>}
        </MetronomeWrapper>
      </div>
    );
  }
}

export default Metronome;
