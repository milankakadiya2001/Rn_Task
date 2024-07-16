import strings from '../i18n/strings';
import {showPopupWithOk} from '../utils/helpers';

export const requestApi = async (method, url, data = null) => {
  const config = {
    method: method,
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer DEBUG',
    },
  };

  if (!!data) {
    config.body = JSON.stringify(data);
  }

  return new Promise((resolve, reject) => {
    fetch(url, config)
      .then(response => Promise.all([response, response.json()]))
      .then(async ([response, responseJson]) => {
        if (response?.ok == true) {
          return resolve(responseJson);
        } else {
          showPopupWithOk(
            strings.appTitle,
            responseJson?.message ?? strings.someThingWentToWrong,
          );
          return reject(responseJson);
        }
      })
      .catch(error => {
        showPopupWithOk(strings.appTitle, strings.someThingWentToWrong);
        reject(error);
      });
  });
};
