export * from "./types";

export * from "./fetchGraphQl";

export * from "./urls";

export const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
