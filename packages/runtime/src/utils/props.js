export function extractPropsAndEvents(v) {
  const { on: events = {}, ...props } = v.props;

  return { props, events };
}
