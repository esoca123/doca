// this is passed to json-schema-example-loader
export default {
    title: "Addap's API Documentation V2",
    // enhance your CURL examples by base url and request headers...
    curl: {
        // The baseUrl typically ends in a / so that relative hrefs
        // in your schemas can be joined with it in accordance
        // with RFC 3986 relative URI reference resolution rules.
        //
        // By default, the generated app's src/client/introduction.js
        // component displays this baseUrl in your documentation.
        baseUrl: 'https://develop.addaps.com/api/v2',
        requestHeaders: {
            // This is a JSON Schema which treats the HTTP request
            // headers as if they were a JSON object instance.
            required: [
                "Accept",
                "Content-Type"
            ],
            properties: {
                // Include other headers here, such as for auth
                "Accept": {
                    type: "string",
                    enum: [
                        "application/json",
                    ],
                    example: "application/json",
                    description: "Content type of the API request",
                },
                "Content-Type": {
                    type: "string",
                    enum: [
                        "application/json",
                    ],
                    example: "application/json",
                    description: "Content type of the API request",
                }
            }
        }
    }
};
