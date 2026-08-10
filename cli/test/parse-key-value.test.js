import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseKeyValue } from '../dist/index.js'

test('值含 = 不截断（base64 padding）', () => {
  assert.deepEqual(parseKeyValue('token=YWJjZGVmZw==', {}), { token: 'YWJjZGVmZw==' })
})

test('多个 = 保留到值尾', () => {
  assert.deepEqual(parseKeyValue('a=b=c', {}), { a: 'b=c' })
})

test('空值合法（墓碑注入 -e name=）', () => {
  assert.deepEqual(parseKeyValue('name=', {}), { name: '' })
})

test('无 = 的输入忽略', () => {
  assert.deepEqual(parseKeyValue('garbage', { keep: '1' }), { keep: '1' })
})
