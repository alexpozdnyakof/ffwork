export function extractPropsAndEvents(v) {
  const { on: events = {}, ...props } = v.props;
  delete props.key;
  return { props, events };
}
