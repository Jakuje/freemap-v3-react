import { createLogic } from 'redux-logic';

import * as at from 'fm3/actionTypes';
import { startProgress, stopProgress } from 'fm3/actions/mainActions';
import { l10nSetTranslations } from 'fm3/actions/l10nActions';

export default createLogic({
  type: at.L10N_SET_LANGUAGE,
  process({ getState }, dispatch, done) {
    const pid = Math.random();
    dispatch(startProgress(pid));

    const { chosenLanguage } = getState().l10n;
    const language = chosenLanguage || navigator.languages.map(lang => lang.split('-')[0]).find(lang => ['en', 'sk', 'cs'].includes(lang)) || 'en';

    // TODO handle error
    Promise.all([
      import(/* webpackChunkName: "translations" */`fm3/translations/${language}.js`),
      !global.hasNoNativeIntl ? null
        : language === 'sk' ? import(/* webpackChunkName: "locale-data-sk" */'intl/locale-data/jsonp/sk.js')
          : language === 'cs' ? import(/* webpackChunkName: "locale-data-cs" */'intl/locale-data/jsonp/cs.js')
            : import(/* webpackChunkName: "locale-data-en" */'intl/locale-data/jsonp/en.js'),
    ]).then(([translations]) => {
      dispatch(l10nSetTranslations(language, translations.default));
      dispatch(stopProgress(pid));
      done();
    });
  },
});
