export class Lineage {
  private parentRef: Lineage | undefined;
  private readonly directChildrenRefs: Set<Lineage> = new Set<Lineage>();

  public setParent(parent: NonNullable<Lineage>): void {
    if (this.parentRef === parent) {
      return;
    }

    if (this.parentRef !== undefined) {
      throw new Error('[Lineage] parent is already set');
    }
    this.parentRef = parent;

    parent.setChild(this);
  }

  public setChild(child: NonNullable<Lineage>): void {
    if (this.directChildrenRefs.has(child)) {
      return;
    }

    this.directChildrenRefs.add(child);
    child.setParent(this);
  }

  public getDirectParent(): Lineage | undefined {
    return this.parentRef;
  }

  public getDirectChildren(): Lineage[] {
    return Array.from(this.directChildrenRefs);
  }

  public getAllAncestors(): Lineage[] {
    const parents: Lineage[] = [];

    let incomingParent: Lineage | undefined = this.parentRef;
    do {
      if (incomingParent === undefined) {
        break;
      }
      parents.push(incomingParent);
      incomingParent = incomingParent.parentRef;
    } while (incomingParent !== undefined);

    return parents;
  }

  public getAllDescendants(): Lineage[] {
    const allChildren: Set<Lineage> = new Set<Lineage>();

    let currentLevelChildrenSet: Set<Lineage> = this.directChildrenRefs;
    while (currentLevelChildrenSet.size !== 0) {
      const currentLevelChildren: Lineage[] = Array.from(currentLevelChildrenSet);

      currentLevelChildren.forEach((child: Lineage) => {
        allChildren.add(child);
      });

      const currentLevelGrandChildren: Lineage[] = currentLevelChildren
        .map((child: Lineage) => child.getDirectChildren())
        .flat(1);

      currentLevelChildrenSet = new Set<Lineage>(currentLevelGrandChildren);
    }

    return Array.from(allChildren);
  }
}
