// Interactive widgets embeddable in notes via a fenced code block:
//
//   ```widget mac-studio-resale
//   key: value
//   ```
//
// The first word after `widget` names the component in WIDGETS below; the
// block body is parsed as simple `key: value` lines and passed as props.
// See .claude/docs/note-widgets.md.
import MacStudioResaleChart from './MacStudioResaleChart.jsx';

const WIDGETS = {
  'mac-studio-resale': MacStudioResaleChart,
};

function parseProps(body) {
  const props = {};
  for (const line of body.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][\w-]*)\s*:\s*(.*?)\s*$/);
    if (m) props[m[1]] = m[2];
  }
  return props;
}

function codeText(node) {
  return (node.children ?? []).map(c => (c.type === 'text' ? c.value : codeText(c))).join('');
}

// react-markdown `pre` override: renders a widget for ```widget blocks and
// falls through to a normal <pre> for everything else.
export function NotePre({ node, children, ...props }) {
  const code = node?.children?.find(c => c.tagName === 'code');
  const classes = code?.properties?.className ?? [];
  if (!classes.includes('language-widget')) return <pre {...props}>{children}</pre>;

  const name = (code.data?.meta ?? '').trim().split(/\s+/)[0];
  const Widget = WIDGETS[name];
  if (!Widget) {
    // Thrown during prerender, so a typo'd widget name fails the build.
    throw new Error(`Unknown note widget "${name}". Known: ${Object.keys(WIDGETS).join(', ')}`);
  }
  return <Widget {...parseProps(codeText(code))} />;
}
