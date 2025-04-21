import { describe, it, expect, beforeEach } from "vitest";
import { defineComponent } from "../src/component";
import { h } from "../src/h";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("component", () => {
  it("should mount the component to the document", () => {
    const Button = defineComponent({
      render() {
        return h("button", {}, ["submit"]);
      },
    });
    const button = new Button();

    button.mount(document.body);

    expect(document.body.innerHTML).toBe("<button>submit</button>");
  });

  it("should unmount the component from the document", () => {
    const Button = defineComponent({
      render() {
        return h("button", {}, ["submit"]);
      },
    });
    const button = new Button();

    button.mount(document.body);
    expect(document.body.innerHTML).toBe("<button>submit</button>");

    button.unmount();
    expect(document.body.innerHTML).toBe("");
  });

  it("should throw error when the component trying to mount multiple times", () => {
    const Button = defineComponent({
      render() {
        return h("button", {}, ["submit"]);
      },
    });
    const button = new Button();

    button.mount(document.body);
    expect(() => button.mount(document.body)).toThrowError(
      new Error("Component is already mounted")
    );
  });
  it("should throw error when the component trying to unmount when not mounted yet", () => {
    const Button = defineComponent({
      render() {
        return h("button", {}, ["submit"]);
      },
    });
    const button = new Button();

    expect(() => button.unmount()).toThrowError(
      new Error("Trying unmount not mounted component")
    );
  });

  it("should patch dom after state updating", () => {
    const Button = defineComponent({
      state() {
        return { count: 0 };
      },
      render() {
        return h(
          "button",
          {
            on: {
              click: () => {
                this.updateState({ count: this.state.count + 1 });
              },
            },
          },
          [`${this.state.count}`]
        );
      },
    });
    const button = new Button();
    button.mount(document.body);

    expect(document.body.innerHTML).toBe(`<button>0</button>`);
    document.querySelector("button").click();

    expect(document.body.innerHTML).toBe(`<button>1</button>`);
  });

  it("should call the custom method", () => {
    const Button = defineComponent({
      state() {
        return { count: 0 };
      },
      render() {
        return h(
          "button",
          {
            on: {
              click: () => this.increment(),
            },
          },
          [`${this.state.count}`]
        );
      },
      increment() {
        this.updateState({ count: this.state.count + 1 });
      },
    });
    const button = new Button();
    button.mount(document.body);

    expect(document.body.innerHTML).toBe(`<button>0</button>`);
    document.querySelector("button").click();

    expect(document.body.innerHTML).toBe(`<button>1</button>`);
  });

  it("should render the subcomponents", () => {
    const ListItem = defineComponent({
      render() {
        return h("li", {}, [`${this.props.item}`]);
      },
    });

    const List = defineComponent({
      render() {
        return h(
          "ul",
          {},
          this.props.items.map((item) => h(ListItem, { item }))
        );
      },
    });

    const list = new List({ items: [1, 2, 3] });
    list.mount(document.body);

    expect(document.body.innerHTML).toBe(
      "<ul><li>1</li><li>2</li><li>3</li></ul>"
    );
  });
  it("should unmount the component", () => {
    const Button = defineComponent({
      render() {
        return h("button", {}, ["submit"]);
      },
    });

    const button = new Button();
    button.mount(document.body);

    expect(document.body.innerHTML).toBe("<button>submit</button>");

    button.unmount();
    expect(document.body.innerHTML).toBe("");
  });

  it("should update props", () => {
    const Count = defineComponent({
      render() {
        return h("div", {}, [`${this.props.count}`]);
      },
    });

    const count = new Count({ count: 0 });
    count.mount(document.body);

    expect(document.body.innerHTML).toBe("<div>0</div>");

    count.updateProps({ count: 1 });
    expect(document.body.innerHTML).toBe("<div>1</div>");
  });
});
