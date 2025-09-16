import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { defineComponent } from "../src/component";
import { h, hString, hFragment } from "../src/h";
import { mount } from "../src/mount";
import { nextTick } from "../src/scheduler";
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

  it("should emit custom event through dom dispatch event", () => {
    const fn = vi.fn();
    const button = new ButtonUnderTest(
      { text: "increment" },
      { increment: fn }
    );
    button.mount(document.body);

    document.querySelector("button").dispatchEvent(new Event("click"));

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("increment");
  });

  it("should emit custom event through own emit", () => {
    const fn = vi.fn();
    const button = new ButtonUnderTest(
      { text: "increment" },
      { increment: fn }
    );
    button.mount(document.body);
    button.emit("increment", 0);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(0);
  });

  it("should not emit custom event before mounting", () => {
    const fn = vi.fn();
    const button = new ButtonUnderTest(
      { text: "increment" },
      { increment: fn }
    );
    button.emit("increment");

    expect(fn).not.toHaveBeenCalled();
  });

  it("should not emit custom event after unmounting", () => {
    const fn = vi.fn();
    const button = new ButtonUnderTest(
      { text: "increment" },
      { increment: fn }
    );
    button.mount(document.body);
    button.unmount();

    button.emit("increment");

    expect(fn).not.toHaveBeenCalled();
  });
  it("should update state in root component from subcomponents events", () => {
    const Counter = defineComponent({
      state() {
        return { count: 0 };
      },
      render() {
        return hFragment([
          h("div", {}, [`${this.state.count}`]),
          h(ButtonUnderTest, {
            text: "+",
            on: {
              increment: () =>
                this.updateState({ count: this.state.count + 1 }),
            },
          }),
        ]);
      },
    });
    const counter = new Counter();
    counter.mount(document.body);
    expect(document.body.innerHTML).toBe("<div>0</div><button>+</button>");

    document.querySelector("button").dispatchEvent(new Event("click"));
    expect(document.body.innerHTML).toBe("<div>1</div><button>+</button>");
  });

  it("should persist components state after removing one from list", () => {
    const counterApp = new CounterApp();
    counterApp.mount(document.body);

    expect(document.body.innerHTML).toBe(
      `<div class="container"><div><button>1</button><button>remove</button></div><div><button>1</button><button>remove</button></div><div><button>1</button><button>remove</button></div></div>`
    );

    const container = document.querySelector(".container");

    const secondCounter = container.children[1];
    const thirdCounter = container.children[2];

    secondCounter.querySelectorAll("button").item(0).click();
    thirdCounter.querySelectorAll("button").item(0).click();
    thirdCounter.querySelectorAll("button").item(0).click();

    expect(document.body.innerHTML).toBe(
      `<div class="container"><div><button>1</button><button>remove</button></div><div><button>2</button><button>remove</button></div><div><button>3</button><button>remove</button></div></div>`
    );

    secondCounter.querySelectorAll("button").item(1).click();
    expect(document.body.innerHTML).toBe(
      `<div class="container"><div><button>1</button><button>remove</button></div><div><button>3</button><button>remove</button></div></div>`
    );
  });

  describe("Hooks", async () => {
    it("should run passed function on mount", async () => {
      const fn = vi.fn();
      const WithOnMount = defineComponent({
        render() {
          const { text } = this.state;
          return h("button", {}, [text ?? "submit"]);
        },
        onMounted() {
          fn();
        },
      });

      mount(h(WithOnMount, {}), document.body);
      await nextTick();
      expect(fn).toHaveBeenCalled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should run passed function on unmount", async () => {
      const fn = vi.fn();
      const Component = defineComponent({
        render() {
          const { text } = this.state;
          return h("button", {}, [text ?? "submit"]);
        },
        onUnmounted() {
          fn();
        },
      });

      const component = new Component();
      component.mount(document.body);
      await component.unmount();
      await nextTick();
      expect(fn).toHaveBeenCalled();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});

const ButtonUnderTest = defineComponent({
  render() {
    return h(
      "button",
      { on: { click: () => this.emit("increment", this.props.text) } },
      [this.props.text]
    );
  },
});

const Counter = defineComponent({
  state() {
    return { count: 1 };
  },
  render() {
    let { count } = this.state;

    return h("div", {}, [
      h(
        "button",
        { on: { click: () => this.updateState({ count: count + 1 }) } },
        [hString(count)]
      ),
      h("button", { on: { click: () => this.emit("remove") } }, ["remove"]),
    ]);
  },
});

const CounterApp = defineComponent({
  state() {
    return {
      counters: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
  },
  render() {
    let { counters } = this.state;

    return h(
      "div",
      { className: "container" },
      counters.map((counter) =>
        h(Counter, {
          key: counter.id,
          on: {
            remove: () =>
              this.updateState({
                counters: counters.filter(({ id }) => id !== counter.id),
              }),
          },
        })
      )
    );
  },
});
