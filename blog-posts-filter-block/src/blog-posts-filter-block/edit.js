import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import App from './app';

export default function Edit({ attributes, setAttributes }) {
  const { perPage, columns } = attributes;

  return (
    <>
      <InspectorControls>
        <PanelBody title="Settings" initialOpen>
          <RangeControl
            label="Posts per page"
            value={perPage}
            min={1}
            max={24}
            onChange={(v) => setAttributes({ perPage: v })}
          />
          <RangeControl
            label="Columns"
            value={columns}
            min={1}
            max={4}
            onChange={(v) => setAttributes({ columns: v })}
          />
        </PanelBody>
      </InspectorControls>

      <App perPage={perPage} columns={columns} />
    </>
  );
}
