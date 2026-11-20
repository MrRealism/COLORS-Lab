/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadCodeJs() {
  const codePath = path.resolve(__dirname, "../public/js/code.js");
  const code = fs.readFileSync(codePath, "utf8");

  const mockXhrInstances = [];
  class MockXMLHttpRequest {
    constructor() {
      this.readyState = 0;
      this.status = 0;
      this.responseText = "";
      this.headers = {};
      this.method = null;
      this.url = null;
      this.async = true;
      this.sentBody = null;
      this.onreadystatechange = null;
      mockXhrInstances.push(this);
    }

    open(method, url, async = true) {
      this.method = method;
      this.url = url;
      this.async = async;
    }

    setRequestHeader(key, value) {
      this.headers[key] = value;
    }

    send(body) {
      this.sentBody = body;
    }

    simulateResponse(status, responseObj) {
      this.readyState = 4;
      this.status = status;
      this.responseText = JSON.stringify(responseObj);
      if (typeof this.onreadystatechange === "function") {
        this.onreadystatechange.call(this);
      }
    }
  }

  document.body.innerHTML = `
    <input id="loginName" value="" />
    <input id="loginPassword" value="" />
    <span id="loginResult"></span>
    <input id="colorText" value="" />
    <span id="colorAddResult"></span>
    <input id="searchText" value="" />
    <span id="colorSearchResult"></span>
    <p></p>
  `;

  window.XMLHttpRequest = MockXMLHttpRequest;

  const context = vm.createContext({
    window,
    document,
    console,
    Date,
    parseInt,
    JSON,
    XMLHttpRequest: MockXMLHttpRequest
  });

  vm.runInContext(code, context);

  return {
    context,
    mockXhrInstances
  };
}

describe("code.js front-end unit tests", () => {
  test("saveCookie and readCookie restore userId, firstName, and lastName", () => {
    const { context } = loadCodeJs();

    vm.runInContext(
      `
      userId = 42;
      firstName = "Ada";
      lastName = "Lovelace";
      saveCookie();
      userId = 0;
      firstName = "";
      lastName = "";
      readCookie();
      `,
      context
    );

    expect(vm.runInContext("userId", context)).toBe(42);
    expect(vm.runInContext("firstName", context)).toBe("Ada");
    expect(vm.runInContext("lastName", context)).toBe("Lovelace");
  });

  test("addColor sends POST payload to AddColor.php and updates DOM on 200", () => {
    const { context, mockXhrInstances } = loadCodeJs();

    document.getElementById("colorText").value = "Cerulean";
    vm.runInContext("userId = 7; addColor();", context);

    expect(mockXhrInstances.length).toBe(1);
    const xhr = mockXhrInstances[0];
    expect(xhr.method).toBe("POST");
    expect(xhr.url).toContain("AddColor.php");
    expect(JSON.parse(xhr.sentBody)).toEqual({
      color: "Cerulean",
      userId: 7
    });

    xhr.simulateResponse(200, { error: "" });
    expect(document.getElementById("colorAddResult").innerHTML).toBe(
      "Color has been added"
    );
  });

  test("searchColor formats returned color list into <p>", () => {
    const { context, mockXhrInstances } = loadCodeJs();

    document.getElementById("searchText").value = "Blue";
    vm.runInContext("userId = 7; searchColor();", context);

    expect(mockXhrInstances.length).toBe(1);
    const xhr = mockXhrInstances[0];
    expect(xhr.method).toBe("POST");
    expect(xhr.url).toContain("SearchColors.php");
    expect(JSON.parse(xhr.sentBody)).toEqual({
      search: "Blue",
      userId: 7
    });

    xhr.simulateResponse(200, {
      results: ["Sky Blue", "Midnight Blue"],
      error: ""
    });

    expect(document.getElementById("colorSearchResult").innerHTML).toBe(
      "Color(s) has been retrieved"
    );
    expect(document.getElementsByTagName("p")[0].innerHTML).toBe(
      "Sky Blue<br>\nMidnight Blue"
    );
  });
});
