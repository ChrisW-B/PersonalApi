import { PropTypes } from 'prop-types';
import React, { Component } from 'react';
import { SidenavItem, Icon, Link } from '../../styles/Sidenav';

export default class SidenavLink extends Component {
  static propTypes = {
    link: PropTypes.string,
    title: PropTypes.string,
    widget: PropTypes.node,
    icon: PropTypes.node,
    emphasis: PropTypes.bool
  }

  static defaultProps = {
    link: '',
    title: '',
    widget: null,
    icon: null,
    emphasis: false
  }

  render = () => {
    const { link, title, widget = null, icon, emphasis } = this.props;
    return (
      <SidenavItem emphasis={emphasis}>
        <Link href={link} title={title}>
          <Icon>{icon}</Icon>{title}
        </Link>
        {widget}
      </SidenavItem>
    );
  }
}