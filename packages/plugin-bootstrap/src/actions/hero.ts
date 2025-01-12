import { elizaLogger } from "@elizaos/core";
import {
    Action,
    ActionExample,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
} from "@elizaos/core";
import axios, { AxiosResponse } from "axios";

interface HelloQueryData {
    hello: string;
}

// Define a generic interface for a GraphQL response
interface GraphQLResponse<T> {
    data: T;
    errors?: any; // Optional, in case GraphQL returns errors
}

export const heroAction: Action = {
    name: "HERO",
    similes: ["GET_HERO_INFO", "FETCH_HERO_INFO"],
    description: "Use when user ask for specific information about hero",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        async function fetchHeroData() {
            const url = "https://api.stratz.com/graphql";
            const headers = {
                "Content-Type": "application/json",
                "x-api-key": process.env.DOTA2_PROTRACKER_API_TOKEN,
            };

            // The GraphQL query you want to execute
            const query = ``;

            try {
                const response: AxiosResponse<GraphQLResponse<HelloQueryData>> =
                    await axios.post(url, { query }, { headers });

                // Access the returned data
                if (response.data?.data) {
                    elizaLogger.info("GraphQL response:", response.data.data);
                } else {
                    elizaLogger.info("No data returned from GraphQL.");
                }
            } catch (error) {
                elizaLogger.info("Error fetching data:", error);
            }
        }
        const result = fetchHeroData();

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "we're planning a solo backpacking trip soon",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "oh sick", action: "CONTINUE" },
            },
            {
                user: "{{user2}}",
                content: { text: "where are you going" },
            },
        ],
    ] as ActionExample[][],
} as Action;
