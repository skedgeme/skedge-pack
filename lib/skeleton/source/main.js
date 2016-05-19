'use strict';

import ReactDom from 'react-dom';
import React    from 'react';

import { install } from 'offline-plugin/runtime';

import App from './userInterface/App.jsx';

install();

ReactDom.render( React.createElement( App, {} ), document.getElementById( 'root' ) );
