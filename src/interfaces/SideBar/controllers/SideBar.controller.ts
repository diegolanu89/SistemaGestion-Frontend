export class SideBarController {
  toggleSection(
    current: Record<string, boolean>,
    label: string
  ): Record<string, boolean> {
    return {
      ...current,
      [label]: !current[label],
    };
  }
}
