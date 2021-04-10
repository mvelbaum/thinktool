import Fuse from "fuse.js";

export type Result = {thing: string; content: string};

export class Search {
  private fuse: Fuse<{thing: string; content: string}>;

  constructor(data: {thing: string; content: string}[]) {
    this.fuse = new Fuse<{thing: string; content: string}>(data, {
      keys: ["content"],
      findAllMatches: true,
      ignoreLocation: true,
    });
  }

  // For large queries, the search can be quite slow. When this happens, it
  // blocks the UI. Unfortunately, just making this method async is not enough
  // to fix this issue, since all the work still happens at once in that case.
  // If we wanted to fix this, I think we should look into Web Workers.
  query(text: string, limit: number): Result[] {
    return this.fuse
      .search(text, {limit})
      .map((match) => ({content: match.item.content, thing: match.item.thing}));
  }
}
