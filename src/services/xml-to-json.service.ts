import {bind, /* inject, */ BindingScope, JSONObject} from '@loopback/core';
import {parseStringPromise} from 'xml2js';

@bind({scope: BindingScope.TRANSIENT})
export class XmlToJsonService {
  constructor() {}

  async parseString(text: string): Promise<JSONObject> {
    return parseStringPromise(text, {explicitArray: false});
  }
}
