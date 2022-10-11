import { Lineage } from './lineage.class';

describe('lineage.class.ts', () => {
  it('should keep parent-child consistency', () => {
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
  });

  it('should correctly set parent', () => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    childLineage.setParent(parentLineage);

    expect(parentLineage).toBe(childLineage.getDirectParent());
    expect(childLineage).toBe(parentLineage.getDirectChild());
  });

  it('should correctly set child', () => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    parentLineage.setChild(childLineage);

    expect(parentLineage).toBe(childLineage.getDirectParent());
    expect(childLineage).toBe(parentLineage.getDirectChild());
  });

  it('should keep parent-child consistency on parent set', () => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    childLineage.setParent(parentLineage);

    expect(parentLineage).toBe(childLineage.getDirectParent());
    expect(childLineage).toBe(parentLineage.getDirectChild());
  });

  it('should throw error on try of parent replacement', () => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    childLineage.setParent(parentLineage);

    const newParentLineage: Lineage = new Lineage();
    expect(() => childLineage.setParent(newParentLineage)).toThrowError();
  });

  it('should throw error on try of child replacement', () => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    parentLineage.setChild(childLineage);

    const newChildLineage: Lineage = new Lineage();
    expect(() => parentLineage.setChild(newChildLineage)).toThrowError();
  });

  it('should return empty parents list if there are none', () => {
    const targetLineage: Lineage = new Lineage();
    const parents: Lineage[] = targetLineage.getAllParents();
    expect(parents).toEqual([]);
  });

  it('should return empty children list if there are none', () => {
    const targetLineage: Lineage = new Lineage();
    const children: Lineage[] = targetLineage.getAllChildren();
    expect(children).toEqual([]);
  });
});
