/*
 *  translations/translator.js
 *
 *  David Janes
 *  Consensas
 *  2020-05-02
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

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const translator = _.promise(self => {
    const translations = require("..")

    self.translate = (...rest) => translations.translate(self, ...rest)
})

translator.method = "translations.translator"
translator.description = "Load all the translations"
translator.requires = {
    translations: _.is.Dictionary,
}
translator.accepts = {
}
translator.produces = {
    translate: _.is.Function,
}

/**
 */
exports.translator = translator
