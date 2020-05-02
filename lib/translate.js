/*
 *  lib/translate.js
 *
 *  David Janes
 *  Consensas
 *  2017-03-20
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const _ = require("iotdb-helpers")

const _seend = {}

const translate = (self, _string, ...rest) => {
    const method = "translations.translate"

    /*
    if (self.verbose) {
        console.log("-", method, self.locale, _string)
    }
    */

    if (!self.locale) {
        return _string
    } else if (!self.locale.languages) {
        return _string
    } else if (!self.translations) {
        return _string
    }

    let options = {}
    if (rest.length && _.is.Dictionary(rest[rest.length - 1])) {
        options = rest.pop()
    }

    const string = self.locale.languages
        .map(language => self.translations[language])
        .filter(td => td)
        .map(td => td[_string]) 
        .find(t => t);

    if (!string && !_seend[_string] && self.verbose) {
        // const languages = _.without(self.locale.languages, "c")
        const languages = self.locale.languages
        if (languages.length) {
            _seend[_string] = true

            console.log("=== translate me (%s) ===", languages)
            console.log(`msgid "${_string}"`)
            console.log(`msgstr ""`)
            console.log()
            console.log("===")
        }
    }
    
    return (string || options.otherwise || _string)
        .replace(/%(\d+)/g, match => {
            const index = _.coerce.to.Integer(match[1]) - 1
            const value = rest[index];

            return _.is.Undefined(value) ? "" : value;
        })
}

/**
 *  API
 */
exports.translate = translate
