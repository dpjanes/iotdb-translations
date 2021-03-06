/*
 *  test/initialize.js
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

describe("translations/initialize", function() {
    describe("initialize", function() {
        it("works", function(done) {
            _.promise.make({
                translations$cfg: {
                    folders: [
                        path.join(__dirname, "data"),
                        path.join(__dirname, "data"),
                    ],
                },
            }) 
                .then(translations.initialize)
                .then(_.promise.make(sd => {
                    assert.ok(sd.translations)
                    done()
                }))
                .catch(done)
        })
        it("works with no folders", function(done) {
            _.promise.make({
                translations$cfg: {
                },
            }) 
                .then(translations.initialize)
                .then(_.promise.make(sd => {
                    assert.ok(sd.translations)
                    done()
                }))
                .catch(done)
        })
        it("no translations$cfg - expected fail", function(done) {
            _.promise.make({
            }) 
                .then(translations.initialize)
                .then(_.promise.make(sd => {
                    done(new Error("don't expect to get here"))
                }))
                .catch(sd => done())
        })
    })
})
