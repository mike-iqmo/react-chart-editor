import Dropdown from './Dropdown';
import RadioBlocks from '../widgets/RadioBlocks';
import Field from './Field';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {connectToContainer} from 'lib';
import Info from './Info';
import DataSelector from './DataSelector';

export const UnconnectedTextPosition = (props, {localize: _}) => {
  const [posType, setPosType] = useState(typeof props.fullValue === 'string' ? 'simple' : 'custom');
  const radioOptions = [
    {
      label: _('All'),
      value: 'simple',
    },
    {
      label: _('Custom'),
      value: 'custom',
    },
  ];
  const control =
    posType === 'simple' ? (
      <>
        <Info>
          {_('This will position all text values on the plot according to the selected position.')}
        </Info>
        <Dropdown options={props.options} attr="textposition" clearable={false} />
      </>
    ) : (
      <>
        <Info>
          <div>
            {_(
              'This will position text values individually, according to the provided data positions array. '
            )}
          </div>
        </Info>
        <DataSelector attr="textposition" />
        <Info>
          <div>{_('("Top", "Middle", "Bottom") + ("Left", "Center", "Right")')}</div>
        </Info>
      </>
    );
  return (
    <Field {...props}>
      <RadioBlocks
        options={radioOptions}
        activeOption={posType}
        onOptionChange={(value) => {
          setPosType(value);

          if (value === 'simple') {
            props.updatePlot('middle center');
          } else {
            props.updateContainer({
              textpositionsrc: null,
            });
          }
        }}
      />
      {control}
    </Field>
  );
};

UnconnectedTextPosition.propTypes = {
  ...Field.propTypes,
  options: PropTypes.array,
  fullValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

UnconnectedTextPosition.contextTypes = {
  localize: PropTypes.func,
};

UnconnectedTextPosition.displayName = 'UnconnectedTextPosition';

export default connectToContainer(UnconnectedTextPosition, {
  modifyPlotProps: (props, context, plotProps) => {
    const {localize: _} = context;
    let options = [
      {label: _('Top Left'), value: 'top left'},
      {label: _('Top Center'), value: 'top center'},
      {label: _('Top Right'), value: 'top right'},
      {label: _('Middle Left'), value: 'middle left'},
      {label: _('Middle Center'), value: 'middle center'},
      {label: _('Middle Right'), value: 'middle right'},
      {label: _('Bottom Left'), value: 'bottom left'},
      {label: _('Bottom Center'), value: 'bottom center'},
      {label: _('Bottom Right'), value: 'bottom right'},
    ];
    if (['pie', 'bar', 'funnel', 'waterfall'].includes(context.container.type)) {
      options = [
        {label: _('Inside'), value: 'inside'},
        {label: _('Outside'), value: 'outside'},
        {label: _('Auto'), value: 'auto'},
        {label: _('None'), value: 'none'},
      ];
    }
    if (['funnelarea'].includes(context.container.type)) {
      options = [
        {label: _('Inside'), value: 'inside'},
        {label: _('None'), value: 'none'},
      ];
    }
    plotProps.options = options;
    plotProps.clearable = false;
  },
});
