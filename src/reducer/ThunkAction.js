import store from ".";
import { getRequest } from "../util/ApiHelper";
import { log, logError } from "../util/util";
export const getWeather = (city) => {
  return dispatch => {
    getRequest('/current.json', `&q=${city.name}`)
      .then(response => {
        if (response) {
          dispatch({ type: 'WEATHER', payload: response });
        }
      })
      .catch(error => {
        logError(error, 'error in thunk');
      });
  };
};
export const getForecast = (city) => {
  const {count}=store.getState().AuthReducer;
  return dispatch => {
    getRequest('/forecast.json', `&q=${city.name}&days=${count}`)
      .then(response => {
        if (response) {
          dispatch({ type: 'FORECAST', payload: response?.forecast?.forecastday??[] });
          log(response?.forecast,'forcea');
        }
      })
      .catch(error => {
        logError(error, 'error in thunk');
      });
  };
};
