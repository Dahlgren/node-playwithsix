require('should')
var synq = require('../src/synq')

describe('synq', function () {
  describe('convertWindowsFilePath', function () {
    it('should convert backslash to forward slash', function (done) {
      synq.convertWindowsFilePath('path\\with\\subdirectories')
           .should.eql('path/with/subdirectories')
      done()
    })
  })

  describe('hashToPath', function () {
    it('should resolve hash to path', function (done) {
      synq.hashToPath('abcde').should.eql('ab/cde')
      done()
    })
  })
})
