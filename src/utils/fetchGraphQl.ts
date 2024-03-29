import { GraphqlFetchResult, getApiUrl } from "./";

export const fetchGraphQl = async (query: string, variables: any): Promise<GraphqlFetchResult> => {
    const response = await fetch(
        getApiUrl(),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"Accept": ""Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ query, variables })
        }
    );
    const data = await response.json();
    return data;
}
