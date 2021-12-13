export class Lineage {
  private parentRef: Lineage | undefined;
  private childRef: Lineage | undefined;

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
    if (this.childRef === child) {
      return;
    }

    if (this.childRef !== undefined) {
      throw new Error('[Lineage] child is already set');
    }

    this.childRef = child;

    child.setParent(this);
  }

  public getDirectParent(): Lineage | undefined {
    return this.parentRef;
  }

  public getDirectChild(): Lineage | undefined {
    return this.childRef;
  }

  public getAllParents(): Lineage[] {
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

  public getAllChildren(): Lineage[] {
    const children: Lineage[] = [];

    let incomingChild: Lineage | undefined = this.childRef;
    do {
      if (incomingChild === undefined) {
        break;
      }
      children.push(incomingChild);
      incomingChild = incomingChild.childRef;
    } while (incomingChild !== undefined);

    return children;
  }
}
