/* 
* <license header>
*/

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import ReactDOM from 'react-dom'

import Runtime, { init } from '@adobe/exc-app'

import App from './components/App'
import './index.css'

window.React = require('react')
/* Here you can bootstrap your application and configure the integration with the Adobe Experience Cloud Shell */
try {
  require('./exc-runtime')
  init(bootstrapInExcShell)
} catch (e) {
  console.log('application not running in Adobe Experience Cloud Shell')
  bootstrapRaw()
}

function bootstrapRaw () {
  /* **here you can mock the exc runtime and ims objects** */
  const mockRuntime = { on: () => {} }
  const mockIms = {}

  ReactDOM.render(
    <App runtime={mockRuntime} ims={mockIms} />,
    document.getElementById('root')
  )
}

function bootstrapInExcShell () {
  const runtime = Runtime()

  runtime.on('ready', ({ imsOrg, imsToken, imsProfile, locale }) => {
    runtime.done()
    console.log('Ready! received imsProfile:', imsProfile)
    const ims = {
      profile: imsProfile,
      org: imsOrg,
      token: imsToken
    }
    ReactDOM.render(
      <App runtime={runtime} ims={ims} />,
      document.getElementById('root')
    )
  })

  runtime.solution = {
    icon: 'AdobeExperienceCloud',
    title: 'Capstoneinf86701',
    shortTitle: 'JGR'
  }
  runtime.title = 'Capstoneinf86701'
}
