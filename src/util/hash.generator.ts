import {Injectable} from "@angular/core";

declare const Buffer
import * as CryptoJS from 'crypto-js';


@Injectable()
export class HashGenerator {

  DEFAULT_HASH_ITERATIONS = 4000;

  SALT_SIZE = 192 / 8;

  KEY_SIZE = 768 / 32;

  /**
   * Convenience wrapper around CryptoJS.lib.WordArray.random to grab a new salt value.
   * Treat this value as opaque, as it captures iterations.
   *
   * @param {number} explicitIterations An integer
   * @return {string} Return iterations and salt together as one string ({hex-iterations}.{base64-salt})
   */
  generateSalt(explicitIterations?) {
    var defaultHashIterations = this.DEFAULT_HASH_ITERATIONS;

    if (explicitIterations !== null && explicitIterations !== undefined) {
      // make sure explicitIterations is an integer
      if (parseInt(explicitIterations, 10) === explicitIterations) {
        throw new Error("explicitIterations must be an integer");
      }
      // and that it is smaller than our default hash iterations
      if (explicitIterations < this.DEFAULT_HASH_ITERATIONS) {
        throw new Error("explicitIterations cannot be less than " + this.DEFAULT_HASH_ITERATIONS);
      }
    }

    // get some random bytes
    var bytes = this.random(this.SALT_SIZE);

    // convert iterations to Hexadecimal
    var iterations = (explicitIterations || defaultHashIterations).toString(16);

    // concat the iterations and random bytes together.
    return iterations + "." + this.bin2String(bytes);
  }

  hashPassword(value, salt) {


    var i = salt.indexOf(".");
    var iters = parseInt(salt.substring(0, i), 16);
    var key = CryptoJS.PBKDF2(value, salt, {"keySize": this.KEY_SIZE, "iterations": iters});

    return key.toString(CryptoJS.enc.Base64);
  }

  checkPassword(candidate, hashed, salt) {
    return this.hashPassword(candidate, salt) === hashed;
  }


  random(nBytes) {
    var words = [];

    var r = (function (m_w) {
      var m_w = m_w;
      var m_z = 0x3ade68b1;
      var mask = 0xffffffff;

      return function () {
        m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
        m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
        var result = ((m_z << 0x10) + m_w) & mask;
        result /= 0x100000000;
        result += 0.5;
        return result * (Math.random() > .5 ? 1 : -1);
      }
    });

    for (var i = 0, rcache; i < nBytes; i += 4) {
      var _r = r((rcache || Math.random()) * 0x100000000);

      rcache = _r() * 0x3ade67b7;
      words.push((_r() * 0x100000000) | 0);
    }

    return words;
  }

  bin2String(array) {
    var binary = '';
    var bytes = new Uint8Array(array);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
