/* Copyright (c) 2021-2022 SnailDOS */

import * as React from 'react';

import { Switch } from '~/renderer/components/Switch';
import { Title, Row, Control, Header, SecondaryText } from '../App/style';
import store from '../../store';
import { onSwitchChange } from '../../utils';
import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react-lite';
import { NormalButton } from '../App';

const Location = observer(() => {
  return (
    <Row>
      <Title>
        ProxyBrowser offers a comprehensive suite of features that have been
        thoughtfully customized to cater to the discerning needs of individuals
        who value privacy and seek a high degree of control over their online
        activities.
      </Title>
    </Row>
  );
});

export const About = () => {
  return (
    <>
      <Header>About Proxy Browser</Header>
      <Title>Your version of Proxy Browser is v1.0.0</Title>
      <Location />
    </>
  );
};
