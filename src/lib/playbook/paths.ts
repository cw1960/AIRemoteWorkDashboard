import { playbookConfig } from "@/config/playbook";

/**
 * A Playbook page path for the host serving it: the sub-domain serves the
 * sales page at "/", any other host (deploy previews, local) at "/playbook".
 */
export function playbookPath(host: string | null, path = "/"): string {
  const onSubdomain = host?.split(":")[0] === playbookConfig.host;
  if (onSubdomain) return path;
  return path === "/" ? "/playbook" : `/playbook${path}`;
}
