export interface GithubHistoryNode {
  committedDate: string;
  messageHeadlineHTML: string;
  messageBodyHTML: string;
  author: {
    user: {
      login: string;
    };
  };
}

export interface GithubHistoryEdge {
  node: GithubHistoryNode;
}
export interface GithubRefTarget {
  history: {
    edges: GithubHistoryEdge[];
  };
}
export interface GithubRepoRefNode {
  name: string;
  target: GithubRefTarget;
}
export interface GithubRepoNodeRef {
  nodes: GithubRepoRefNode[];
}

export interface GithubRepoNode {
  url: string;
  nameWithOwner: string;
  refs: GithubRepoNodeRef;
}

export interface GithubRepo {
  nodes: GithubRepoNode[];
}

export interface GithubViewer {
  viewer: {
    repositories: GithubRepo;
  };
}

export interface GithubResponse {
  data: GithubViewer;
}
