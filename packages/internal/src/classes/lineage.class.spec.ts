import { Lineage } from './lineage.class';

describe('lineage.class.ts', () => {
  it('should keep ancestor-descendant consistency', () => {
    const ancestorLineage: Lineage = new Lineage();
    const targetLineage: Lineage = new Lineage();
    const descendantLineage: Lineage = new Lineage();

    targetLineage.setParent(ancestorLineage);
    targetLineage.setChild(descendantLineage);

    const fromDescendantToAncestor: Lineage[] = [descendantLineage, ...descendantLineage.getAllAncestors()];
    const fromDescendantToAncestorValidSequence: Lineage[] = [descendantLineage, targetLineage, ancestorLineage];
    fromDescendantToAncestorValidSequence.forEach((validLineage: Lineage, index: number) =>
      expect(fromDescendantToAncestor[index]).toBe(validLineage)
    );

    const fromAncestorToDescendant: Lineage[] = [ancestorLineage, ...ancestorLineage.getAllDescendants()];
    const fromAncestorToDescendantValidSequence: Lineage[] = [ancestorLineage, targetLineage, descendantLineage];
    fromAncestorToDescendantValidSequence.forEach((validLineage: Lineage, index: number) => {
      expect(fromAncestorToDescendant[index]).toBe(validLineage);
    });
  });

  it('should correctly set parent', () => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    childLineage.setParent(parentLineage);

    expect(parentLineage).toBe(childLineage.getDirectParent());

    const directChildren: Lineage[] = parentLineage.getDirectChildren();
    expect(childLineage).toBe(directChildren[0]);
    expect(directChildren).toHaveLength(1);
  });

  it('should correctly set child', () => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    parentLineage.setChild(childLineage);

    expect(parentLineage).toBe(childLineage.getDirectParent());

    const directChildren: Lineage[] = parentLineage.getDirectChildren();
    expect(childLineage).toBe(directChildren[0]);
    expect(directChildren).toHaveLength(1);
  });

  it('should keep parent-child consistency on parent set', () => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    childLineage.setParent(parentLineage);

    expect(parentLineage).toBe(childLineage.getDirectParent());
    expect(childLineage).toBe(parentLineage.getDirectChildren()[0]);
    expect(parentLineage.getDirectChildren()).toHaveLength(1);
  });

  it('should throw error on try of parent replacement', () => {
    const parentLineage: Lineage = new Lineage();
    const childLineage: Lineage = new Lineage();

    childLineage.setParent(parentLineage);
    const newParentLineage: Lineage = new Lineage();
    expect(() => childLineage.setParent(newParentLineage)).toThrowError();
  });

  it('should return empty parents list if there are none', () => {
    const targetLineage: Lineage = new Lineage();
    const parents: Lineage[] = targetLineage.getAllAncestors();
    expect(parents).toEqual([]);
  });

  it('should return empty descendants list if there are none', () => {
    const targetLineage: Lineage = new Lineage();
    const descendants: Lineage[] = targetLineage.getAllDescendants();
    expect(descendants).toEqual([]);
  });
});
