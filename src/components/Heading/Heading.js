import React from 'react';
import styled from 'styled-components';

const Title = styled.span`
  font-size: 1.5em;
`;

const Heading = ({isPlaying, currentBpm, currentBeats}) => {
  return (
    <Title>
      {isPlaying ? 'Playing at:' : ''}
      &nbsp;
      {currentBpm}
      &nbsp;
      BPM
      &nbsp;
      {currentBeats}
      &nbsp;
      Beats
    </Title>
  )
};

export default Heading;
