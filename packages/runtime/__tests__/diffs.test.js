import { test, expect, it, describe } from "vitest";
import { arrayDiff, arrayDiffSeq,  objectDiff } from "../src/utils/diff"

describe("should lookup object diffs", () => {
 
  it("should return empty diff when no changes", () => {
    const { added, removed, updated } = objectDiff({one: 1}, {one: 1})    
    expect(added).toEqual([]);
    expect(removed).toEqual([]);
    expect(updated).toEqual([]);
  })
  
  it("should return added keys", () => {
    const { added, removed, updated } = objectDiff({one: 1}, {one: 1, two: 2})    
    expect(added).toEqual(["two"]);
    expect(removed).toEqual([]);
    expect(updated).toEqual([]);
  })
  
  it("should return removed keys", () => {
    const { added, removed, updated } = objectDiff({one: 1, two: 2}, {one: 1})    
    expect(added).toEqual([]);
    expect(removed).toEqual(["two"]);
    expect(updated).toEqual([]);
  })

  it("should return updated keys", () => {
    const { added, removed, updated } = objectDiff({two: 2}, {two: 3})    
    expect(added).toEqual([]);
    expect(removed).toEqual([]);
    expect(updated).toEqual(["two"]);
  })
  
})

describe("should lookup arrays diffs", () => {
  
  it("should return empty diff when no changes", () => {
    const { added, removed } = arrayDiff([1], [1]);
    
    expect(added).toEqual([]);
    expect(removed).toEqual([]);
  }) 

  it("should return added items", () => {
    const { added, removed } = arrayDiff([1], [1, 2]);
    
    expect(added).toEqual([2]);
    expect(removed).toEqual([]);
  
  })
  it("should return removed items", () => {
    const { added, removed } = arrayDiff([1, 2], [1]);
    
    expect(added).toEqual([]);
    expect(removed).toEqual([2]);
  })
})

describe("should lokup arrays diff sequentially", () => {
  it("should return noop changes for equal arrays", () => {
    const result = arrayDiffSeq([1,2,3], [1,2,3]);
    

    expect(result).toEqual([
      {
        op: "noop",
        item: 1,
        originalIndex: 0,
        index: 0,
      },
      {
        op: "noop",
        item: 2,
        originalIndex: 1,
        index: 1,
      },
      {
        op: "noop",
        item: 3,
        originalIndex: 2,
        index: 2,
      }
    ])
    
  })
  it("should find added item", () => {
    const result = arrayDiffSeq([1,2,3], [0,1,2,3]);
    

    expect(result).toEqual([
      {
        op: "add",
        item: 0,
        index: 0,
      },
      {
        op: "noop",
        item: 1,
        originalIndex: 0,
        index: 1,
      },
      {
        op: "noop",
        item: 2,
        originalIndex: 1,
        index: 2,
      },
      {
        op: "noop",
        item: 3,
        originalIndex: 2,
        index: 3,
      }
    ])
    
  })
  it("should find moved item", () => {
    const result = arrayDiffSeq([1,2,3], [2,3,1]);
    

    expect(result).toEqual([
      {
        op: "move",
        item: 2,
        from: 1,
        originalIndex: 1,
        index: 0,
      },
      {
        op: "move",
        item: 3,
        from: 2,
        originalIndex: 2,
        index: 1,
      },
      {
        op: "noop",
        item: 1,
        index: 2,
        originalIndex: 0,
      },
    
    ])
  })

})


