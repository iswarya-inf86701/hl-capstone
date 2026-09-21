/* 
* <license header>
*/

import React from 'react'
import { Heading, View, Content, Link } from '@adobe/react-spectrum'
export const About = () => (
  <View UNSAFE_className="page-container">
    <Heading level={1}>Useful documentation for your app</Heading>
    <View UNSAFE_className="card" marginTop="size-300" UNSAFE_style={{ maxWidth: '640px' }}>
      <Content>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #e5e5e5' }}>
            <Link>
              <a href='https://github.com/AdobeDocs/project-firefly/blob/master/README.md#project-firefly-developer-guide' target='_blank'>
                Adobe Developer App Builder
              </a>
            </Link>
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #e5e5e5' }}>
            <Link>
              <a href='https://github.com/adobe/aio-sdk#adobeaio-sdk' target='_blank'>
                Adobe I/O SDK
              </a>
            </Link>
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #e5e5e5' }}>
            <Link>
              <a href='https://adobedocs.github.io/adobeio-runtime/' target='_blank'>
                Adobe I/O Runtime
              </a>
            </Link>
          </li>
          <li style={{ padding: '10px 0' }}>
            <Link>
              <a href='https://react-spectrum.adobe.com/react-spectrum/index.html' target='_blank'>
                React Spectrum
              </a>
            </Link>
          </li>
        </ul>
      </Content>
    </View>
  </View>
)
