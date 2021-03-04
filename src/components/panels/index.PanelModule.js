import BarsPanelModule from './BarsPanelModule/BarsPanelModule';
import ChartADSR from './ChartADSR/ChartADSR';
import EffectsPanel from './EffectsPanel/EffectsPanel';
import VolumePanelModule from './VolumePanelModule/VolumePanelModule';

const panelModules = {
  adsr: ChartADSR,
  effects: EffectsPanel,
  bars: BarsPanelModule,
  volume: VolumePanelModule,
};

export default panelModules;
