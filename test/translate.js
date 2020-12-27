/*
 *  test/translations/translate.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-12-05
 *
 *  Copyright (2013-2021) David P. Janes
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
const translations = require("..")

const assert = require("assert")
const path = require("path")

describe("translations/translate", function() {
    let self = null

    before(function(done) {
        _.promise.make({
            translations$cfg: {
                folders: [
                    path.join(__dirname, "data"),
                ],
            },
        }) 
            .then(translations.initialize)
            .then(_.promise.make(sd => {
                self = sd
                done()
            }))
            .catch(done)
    })

    describe("translate", function() {
        it("works - no locale, no translations", function(done) {
            _.promise.make({
            })
                .then(_.promise.make(sd => {
                    const input = "Hello"
                    const expected = "Hello"
                    const got = translations.translate(sd, input)

                    assert.deepEqual(expected, got)
                    done()
                }))
                .catch(done)
        })
        it("works - locale, no translations", function(done) {
            _.promise.make({
                locale: {
                    languages: [ "de", "fr", "c" ],
                }
            })
                .then(_.promise.make(sd => {
                    const input = "Hello"
                    const expected = "Hello"
                    const got = translations.translate(sd, input)

                    assert.deepEqual(expected, got)
                    done()
                }))
                .catch(done)
        })
        it("works - no locale.languages, no translations", function(done) {
            _.promise.make({
                locale: {
                }
            })
                .then(_.promise.make(sd => {
                    const input = "Hello"
                    const expected = "Hello"
                    const got = translations.translate(sd, input)

                    assert.deepEqual(expected, got)
                    done()
                }))
                .catch(done)
        })
        it("works - no locale, translations", function(done) {
            _.promise.make(self)
                .then(_.promise.make(sd => {
                    const input = "Hello"
                    const expected = "Hello"
                    const got = translations.translate(sd, input)

                    assert.deepEqual(expected, got)
                    done()
                }))
                .catch(done)
        })
        it("works - fr, de", function(done) {
            _.promise.make(self)
                .then(_.promise.add("locale", {
                    languages: [ "fr", "de" ],
                }))
                .then(_.promise.make(sd => {
                    const input = "Hello"
                    const expected = "Hallo"
                    const got = translations.translate(sd, input)

                    assert.deepEqual(expected, got)
                    done()
                }))
                .catch(done)
        })
        it("works - de, fr", function(done) {
            _.promise.make(self)
                .then(_.promise.add("locale", {
                    languages: [ "de", "fr" ],
                }))
                .then(_.promise.make(sd => {
                    const input = "Hello"
                    const expected = "Wie Geht's"
                    const got = translations.translate(sd, input)

                    assert.deepEqual(expected, got)
                    done()
                }))
                .catch(done)
        })
        it("works - fr, de - no translation", function(done) {
            _.promise.make(self)
                .then(_.promise.add("verbose", true))
                .then(_.promise.add("locale", {
                    languages: [ "fr", "de" ],
                }))
                .then(_.promise.make(sd => {
                    const input = "No Translation"
                    const expected = "No Translation"
                    const got = translations.translate(sd, input)

                    assert.deepEqual(expected, got)
                    done()
                }))
                .catch(done)
        })
        it("works - fr - no translation", function(done) {
            _.promise.make(self)
                .then(_.promise.add("verbose", true))
                .then(_.promise.add("locale", {
                    languages: [],
                }))
                .then(_.promise.make(sd => {
                    const input = "No Translation 2"
                    const expected = "No Translation 2"
                    const got = translations.translate(sd, input)

                    assert.deepEqual(expected, got)
                    done()
                }))
                .catch(done)
        })
        it("works - interpolation - no translation", function(done) {
            _.promise.make(self)
                .then(_.promise.add("locale", {
                    languages: [],
                }))
                .then(_.promise.make(sd => {
                    const expected = "here c a b "
                    const got = translations.translate(sd, "here %3 %1 %2 %4", "a", "b", "c")

                    assert.deepEqual(expected, got)
                    done()
                }))
                .catch(done)
        })
    })
})
