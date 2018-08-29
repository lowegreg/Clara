import Auth from './auth/reducer';
import App from './app/reducer';
import Cards from './card/reducer';
import DynamicChartComponent from './dynamicEchart/reducer';
import LanguageSwitcher from './languageSwitcher/reducer';
import DevReducers from '../customApp/redux/reducers';

export default {
  Auth,
  App,
  LanguageSwitcher,
  Cards,
  DynamicChartComponent,
  ...DevReducers
};
