import { describe, expect, it } from "vitest";

import {
  classifyNetworkError,
  getConnectivityTransition,
} from "../../scripts/modules/network.js";

describe("classifyNetworkError", () => {
  it("returns offline classification when browser is offline", () => {
    const classified = classifyNetworkError(new Error("x"), false);

    expect(classified.status).toBe("offline");
  });

  it("classifies timeout/api/network/generic failures", () => {
    expect(classifyNetworkError({ code: "ECONNABORTED" }, true).status).toBe(
      "timeout"
    );
    expect(classifyNetworkError({ response: { status: 500 } }, true).status).toBe(
      "api-error"
    );
    expect(classifyNetworkError({ request: {} }, true).status).toBe(
      "network-error"
    );
    expect(classifyNetworkError({}, true).status).toBe("error");
  });
});

describe("getConnectivityTransition", () => {
  it("detects offline recovery", () => {
    expect(getConnectivityTransition(false, true)).toBe("recovered");
  });

  it("detects transition loss and unchanged states", () => {
    expect(getConnectivityTransition(true, false)).toBe("lost");
    expect(getConnectivityTransition(true, true)).toBe("unchanged");
  });
});
