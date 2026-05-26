import { api } from "@convex/_generated/api.js";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { FC } from "react";
import { EmptyProjects } from "./empty-projects";
import { ProjectCard } from "./project-card";

export const ProjectsGrid: FC = () => {
  const search = useSearch({ from: "__root__" });
  const { data } = useQuery({
    ...convexQuery(api.projects.queries.getProjectsQuery, { ...search }),
  });

  if (data?.length === 0) return <EmptyProjects />;

  return (
    <div className="gap-3 w-full auto-grid [--min-col-size:250px]">
      {data?.map((project) => (
        <ProjectCard project={project} key={project._id} />
      ))}
    </div>
  );
};
