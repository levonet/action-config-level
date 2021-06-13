const merge = require('../lib/merge')


describe('test mergeLevels()', () => {
    const log = {info() {}, error() {}}

    test('expect deep object merge by default', () => {
        expect(merge.mergeLevels([
            {a: 1, b: {c: '2'}, arr: [{id: '1'}, {id: '2'}], x: true},
            {a: 2, b: {d: '3'}, arr: [{id: '3'}], y: false}
        ], {}, log)).toStrictEqual({
            a: 2,
            b: {c: '2', d: '3'},
            arr: [{id: '1'}, {id: '2'}, {id: '3'}],
            x: true,
            y: false
        })
    })
    test('expect deep object merge with mergeArray=overwrite', () => {
        expect(merge.mergeLevels([
            {a: 1, b: {c: '2'}, arr: [{id: '1'}, {id: '2'}], x: true},
            {a: 2, b: {d: '3'}, arr: [{id: '3'}], y: false}
        ], {mergeArray: 'overwrite'}, log)).toStrictEqual({
            a: 2,
            b: {c: '2', d: '3'},
            arr: [{id: '3'}],
            x: true,
            y: false
        })
    })
    test('expect flat object merge when mergeObject=overwrite', () => {
        expect(merge.mergeLevels([
            {a: 1, b: {c: '2'}, arr: [{id: '1'}, {id: '2'}], x: true},
            {a: 2, b: {d: '3'}, arr: [{id: '3'}], y: false}
        ], {mergeObject: 'overwrite'}, log)).toStrictEqual({
            a: 2,
            b: {d: '3'},
            arr: [{id: '3'}],
            x: true,
            y: false
        })
    })
    test('expect use last object when mergeObject=off', () => {
        expect(merge.mergeLevels([
            {a: 1, b: {c: '2'}, arr: [{id: '1'}, {id: '2'}], x: true},
            {a: 2, b: {d: '3'}, arr: [{id: '3'}], y: false}
        ], {mergeObject: 'off'}, log)).toStrictEqual({
            a: 2,
            b: {d: '3'},
            arr: [{id: '3'}],
            y: false
        })
    })
    test('expect array concatenating by default', () => {
        expect(merge.mergeLevels([
            [1, 2, 3],
            [4, 5]
        ], {}, log)).toStrictEqual([1, 2, 3, 4, 5])
    })
    test('expect array overwrite when mergeArray=overwrite', () => {
        expect(merge.mergeLevels([
            [1, 2, 3],
            [4, 5]
        ], {mergeArray: 'overwrite'}, log)).toStrictEqual([4, 5])
    })
    test('expect text concatenating by default', () => {
        expect(merge.mergeLevels([
            'test1\n',
            'test2\n'
        ], {}, log)).toEqual('test1\ntest2\n')
    })
    test('expect text overwriting when mergePlain=overwrite', () => {
        expect(merge.mergeLevels([
            'test1\n',
            'test2\n'
        ], {mergePlain: 'overwrite'}, log)).toEqual('test2\n')
    })
})
