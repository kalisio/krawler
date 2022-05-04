import chai from 'chai'
import chailint from 'chai-lint'
import moment from 'moment'
import { utils } from '../lib/index.js'

const { util, expect } = chai

describe('krawler:utils', () => {
  before(() => {
    chailint(chai, util)
  })

  it('transform object', () => {
    // Test data from https://opensky-network.org/api/states/all
    let data = {
      time: 1577970430,
      states: [
        ['ab1644', 'UAL2109 ', 'United States', 1577969618, 1577969619, -84.4841, 30.6434, 10858.5, false, 205.5, 272.73, 0, null, 11361.42, '0721', false, 0],
        ['e8027b', 'LAN712  ', 'Chile', 1577969619, 1577969619, 9.415, 40.2945, 12496.8, false, 258.32, 100.33, -0.65, null, 12633.96, '1277', false, 0]
      ]
    }
    data = utils.transformJsonObject(data, {
      transformPath: 'states',
      toObjects: ['icao', 'callsign', 'origin_country', 'time_position', 'last_contact', 'longitude', 'latitude', 'geo_altitude', 'on_ground', 'velocity', 'heading', 'vertical_rate', 'sensors', 'baro_altitude', 'squawk', 'spi', 'position_source'],
      filter: { velocity: { $gt: 210 } }, // Keep speed above 210 m/s
      mapping: { velocity: 'speed', geo_altitude: 'altitude' },
      unitMapping: {
        speed: { from: 'm/s', to: 'kts' }
      },
      pick: ['latitude', 'longitude', 'altitude', 'callsign', 'icao', 'speed']
    })
    expect(data.states).toExist() // Transform path
    expect(data.states.length).to.equal(1)
    expect(data.states[0].icao).toExist() // Object conversion
    expect(data.states[0].icao).to.equal('e8027b') // Filtering
    expect(data.states[0].origin_country).beUndefined() // Picking
    expect(data.states[0].time_position).beUndefined()
    expect(data.states[0].geo_altitude).beUndefined() // Mapping
    expect(data.states[0].altitude).toExist()
    expect(data.states[0].altitude).to.equal(12496.8)
    expect(data.states[0].velocity).beUndefined()
    expect(data.states[0].speed).toExist()
    expect(data.states[0].speed).to.equal(258.32 / 0.514444)
  })

  it('template query object', () => {
    const now = moment.utc()
    const item = {
      min: 30,
      max: 50,
      time: now,
      id: now.valueOf()
    }
    let query = {
      range: {
        $lte: '<%= max %>',
        $gte: '<%= min %>'
      },
      value: '17',
      date: '2020-01-02T12:00:00.000Z',
      time: '<%= time.format() %>',
      id: '<%= id %>'
    }

    query = utils.templateQueryObject(item, query)
    expect(typeof query.range.$lte).to.equal('number')
    expect(typeof query.range.$gte).to.equal('number')
    expect(query.range.$lte).to.equal(item.max)
    expect(query.range.$gte).to.equal(item.min)
    expect(typeof query.value).to.equal('number')
    expect(typeof query.date).to.equal('object')
    expect(query.date.toISOString()).to.equal('2020-01-02T12:00:00.000Z')
    expect(typeof query.time).to.equal('object')
    expect(moment.utc(query.time).format()).to.equal(item.time.format())
    expect(typeof query.id).to.equal('number')
  })
})
