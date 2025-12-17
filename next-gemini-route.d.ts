declare module "../../../app/api/gemini/route.jse" {
  // Mirror the shape of the real route handler module so that
  // typeof import("../../../app/api/gemini/route.jse")
  // is compatible with RouteHandlerConfig<"/api/gemini">.
  export function POST(request: Request): Promise<Response>;
}

declare module "../../../app/api/gemini/route.jse.js" {
  export * from "../../../app/api/gemini/route.jse";
}

