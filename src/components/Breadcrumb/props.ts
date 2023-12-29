interface BreadcrumbItem {
  name: string;
  path?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}
