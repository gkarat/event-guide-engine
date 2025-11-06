export function validateProjectName(name: string): string | true {
  if (!name || name.trim().length === 0) {
    return "Project name is required";
  }
  if (!/^[a-z0-9-_]+$/i.test(name)) {
    return "Project name can only contain letters, numbers, hyphens, and underscores";
  }
  return true;
}
