import { RedocStandalone, SideNavStyleEnum } from 'redoc'

export function Documentation(props: { redocDocument: object }) {
  return (
    <div style={{ height: 'calc(100vh - 50px)', overflow: 'auto' }}>
      <RedocStandalone
        spec={props.redocDocument}
        onLoaded={(error) => {
          if (error) {
            console.error(error)
          }
        }}
        options={{
          theme: { colors: { primary: { main: '#dd5522' } } },
          nativeScrollbars: true,
          sideNavStyle: SideNavStyleEnum.SummaryOnly,
        }}
      />
    </div>
  )
}
