import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Assign Blog",
  EMAIL: "hello@assign.so",
  NUM_POSTS_ON_HOMEPAGE: 6,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Ideas for making progress",
  DESCRIPTION: "Product updates, engineering notes, and practical ideas from the team building Assign.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Product updates, engineering notes, and practical ideas from Assign.",
};

export const CHANGELOG: Metadata = {
  TITLE: "Product changelog",
  DESCRIPTION: "Short, dated notes about meaningful improvements available in Assign.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "github",
    HREF: "https://github.com/assignso"
  }
];
