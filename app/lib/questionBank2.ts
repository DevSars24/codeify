export type DevTask = {
    id: number;
    title: string;
    description: string;
    level: "Basic" | "Medium" | "Hard";
    category: "web" | "app" | "api";
};

export const DEV_QUESTION_BANK: Record<string, DevTask[]> = {
    web: [
        {
            id: 101,
            title: "Counter Component",
            description: "Create a simple React Counter component with Increment, Decrement, and Reset buttons. \n\nRequirements:\n- State should start at 0.\n- Increment adds 1.\n- Decrement subtracts 1 but not below 0.\n- Reset sets it back to 0.",
            level: "Basic",
            category: "web"
        },
        {
            id: 102,
            title: "Toggle Visibility",
            description: "Create a component that toggles the visibility of a text paragraph when a button is clicked.\n\nRequirements:\n- Button text should change between 'Show' and 'Hide'.\n- Default state is hidden.",
            level: "Basic",
            category: "web"
        },
        {
            id: 103,
            title: "Input Mirror",
            description: "Create an input field that mirrors its text in a paragraph below it in real-time.",
            level: "Basic",
            category: "web"
        },
        {
            id: 104,
            title: "Color Switcher",
            description: "Create a component with 3 buttons (Red, Green, Blue). Clicking a button changes the background color of a box.",
            level: "Basic",
            category: "web"
        },
        {
            id: 105,
            title: "Simple Digital Clock",
            description: "Create a clock that displays current time and updates every second.",
            level: "Medium",
            category: "web"
        }
    ],
    app: [
        {
            id: 201,
            title: "Hello React Native",
            description: "Create a screen with a centered 'Hello World' text.",
            level: "Basic",
            category: "app"
        },
        {
            id: 202,
            title: "Profile Card",
            description: "Create a profile card with an Image, Name, and Bio.",
            level: "Basic",
            category: "app"
        },
        {
            id: 203,
            title: "Scrollable List",
            description: "Render a list of 10 items using ScrollView or FlatList.",
            level: "Basic",
            category: "app"
        }
    ],
    api: [
        {
            id: 301,
            title: "Hello API",
            description: "Create a GET endpoint that returns { message: 'Hello World' }.",
            level: "Basic",
            category: "api"
        },
        {
            id: 302,
            title: "Echo Endpoint",
            description: "Create a POST endpoint that returns the body it received.",
            level: "Basic",
            category: "api"
        },
        {
            id: 303,
            title: "User ID Param",
            description: "Create a GET endpoint /users/:id that returns { userId: id }.",
            level: "Basic",
            category: "api"
        }
    ]
};
