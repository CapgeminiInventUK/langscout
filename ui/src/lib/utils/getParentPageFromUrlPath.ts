export function getParentPageFromUrlPath(path: string): string {
  const lastSlashIndex = path.lastIndexOf('/');
  return path.substring(0, lastSlashIndex)
}
