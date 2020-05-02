/*
 *  lib/load.js
 *
 *  David Janes
 *  Consensas
 *  2017-11-15
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
const fs = require("iotdb-fs")

const path = require("path")
const assert = require("assert")

const gettextParser = require("gettext-parser")

const logger = require("../logger")(__filename)

const cache = {}

/**
 *  Requires: self.translations, self.locale, self.document
 *  Produces: self.translations
 *
 *  Load all the translations
 */
const load = _.promise(self => {
    _.promise.validate(self, load)

    let translations = cache[self.path]
    if (!translations) {
        logger.debug({
            language: self.language,
            path: self.path,
        }, "loading translations")

        const tpo = gettextParser.po.parse(self.document)

        cache[self.path] = translations = {}

        _.mapObject(tpo.translations[''], (vd, key) => {
            const v = _.d.first(vd, "msgstr")
            if (v) {
                translations[key] = v
            }
        })
    }

    self.translations = _.d.clone(self.translations)
    self.translations[self.language] = Object.assign(
        {}, 
        self.translations[self.language] || {}, 
        translations
    )
})

load.method = "translations.load"
load.requires = {
    path: _.is.String,
    translations: _.is.Dictionary,
    document: _.is.String,
    language: _.is.String,
}
load.produces = {
    translations: _.is.Dictionary,
}

/**
 */
const load_path = _.promise((self, done) => {
    _.promise(self)
        .validate(load_path)

        .then(fs.read.utf8)
        .add("language", sd => sd.document_name.replace(/[.]po$/, ""))
        .then(exports.load)

        .end(done, self, "translations")
})

load_path.method = "translations.load.path"
load_path.requires = {
    path: _.is.String,
    translations: _.is.Dictionary,
}
load_path.produces = {
    translations: _.is.Dictionary,
}

/**
 */
const load_folder = _.promise((self, done) => {
    const method = "translations.load.folder"

    assert.ok(self.translations, "expected self.translations")
    assert.ok(self.path, "expected self.path")

    _.promise(self)
        .validate(load_folder)

        .add({
            fs$otherwise_paths: [],
            fs$filter_name: name => name.endsWith(".po"),
        })
        .then(fs.list)
        .each({
            method: exports.load.path,
            inputs: "paths:path",
            roll_self: true,
        })

        .end(done, self, "translations")
})

load_folder.method = "translations.load.folder"
load_folder.requires = {
    path: _.is.String,
    translations: _.is.Dictionary,
}
load_folder.produces = {
    translations: _.is.Dictionary,
}


/**
 */
exports.load = load
exports.load.path = load_path
exports.load.folder = load_folder
