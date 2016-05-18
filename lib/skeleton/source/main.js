'use strict';

import ReactDom from 'react-dom'
import React    from 'react'
import App      from './userInterface/App.jsx'

ReactDom.render( React.createElement( App, {} ), document.getElementById( 'root' ) );
