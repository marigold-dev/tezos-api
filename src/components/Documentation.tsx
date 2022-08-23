import React from 'react'
import { RedocStandalone, SideNavStyleEnum } from 'redoc'

export function Documentation(props: { redocDocument: object }) {
  return (
    <div style={{ height: 'calc(100vh - 50px)', overflow: 'auto' }}>
      <RedocStandalone
        spec={props.redocDocument}
        options={{
          theme: { colors: { primary: { main: '#dd5522' } } },

          sideNavStyle: SideNavStyleEnum.SummaryOnly,
        }}
      />
    </div>
  )
}
