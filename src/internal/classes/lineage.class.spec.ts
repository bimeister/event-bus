import { Lineage } from './lineage.class';

describe('lineage.class.ts', () => {
  it('should keep parent-child consistency', (doneCallback: jest.DoneCallback) => {
    const parentLineage: Lineage = new Lineage();
    const targetLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    targetLineage.setParent(parentLineage);
    targetLineage.setChild(childLineage);

    const fromChildToParent: Lineage[] = [childLineage, ...childLineage.getAllParents()];
    const fromChildToParentValidSequence: Lineage[] = [childLineage, targetLineage, parentLineage];
    fromChildToParentValidSequence.forEach((validLineage: Lineage, index: number) => {
      expect(fromChildToParent[index]).toBe(validLineage);
    });

    const fromParentToChild: Lineage[] = [parentLineage, ...parentLineage.getAllChildren()];
    const fromParentToChildValidSequence: Lineage[] = [parentLineage, targetLineage, childLineage];
    fromParentToChildValidSequence.forEach((validLineage: Lineage, index: number) => {
      expect(fromParentToChild[index]).toBe(validLineage);
    });

    doneCallback();
  }, 10_000);

  it('should correctly set parent', (doneCallback: jest.DoneCallback) => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    childLineage.setParent(parentLineage);

    expect(parentLineage).toBe(childLineage.getDirectParent());
    expect(childLineage).toBe(parentLineage.getDirectChild());

    doneCallback();
  }, 10_000);

  it('should correctly set child', (doneCallback: jest.DoneCallback) => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    parentLineage.setChild(childLineage);

    expect(parentLineage).toBe(childLineage.getDirectParent());
    expect(childLineage).toBe(parentLineage.getDirectChild());

    doneCallback();
  }, 10_000);

  it('should keep parent-child consistency on parent set', (doneCallback: jest.DoneCallback) => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    childLineage.setParent(parentLineage);

    expect(parentLineage).toBe(childLineage.getDirectParent());
    expect(childLineage).toBe(parentLineage.getDirectChild());

    doneCallback();
  }, 10_000);

  it('should throw error on try of parent replacement', (doneCallback: jest.DoneCallback) => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    childLineage.setParent(parentLineage);

    const newParentLineage: Lineage = new Lineage();
    expect(() => childLineage.setParent(newParentLineage)).toThrowError();

    doneCallback();
  }, 10_000);

  it('should throw error on try of child replacement', (doneCallback: jest.DoneCallback) => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    parentLineage.setChild(childLineage);

    const newChildLineage: Lineage = new Lineage();
    expect(() => parentLineage.setChild(newChildLineage)).toThrowError();

    doneCallback();
  }, 10_000);

  it('should return empty parents list if there are none', (doneCallback: jest.DoneCallback) => {
    const targetLineage: Lineage = new Lineage();
    const parents: Lineage[] = targetLineage.getAllParents();
    expect(parents).toEqual([]);
    doneCallback();
  }, 10_000);

  it('should return empty children list if there are none', (doneCallback: jest.DoneCallback) => {
    const targetLineage: Lineage = new Lineage();
    const children: Lineage[] = targetLineage.getAllChildren();
    expect(children).toEqual([]);
    doneCallback();
  }, 10_000);
});
