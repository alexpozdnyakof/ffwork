import { createApp, h, hFragment, defineComponent } from "@fwork/runtime";
import { HashRouter } from "@fwork/router";
import { RouterOutlet, RouterLink } from "@fwork/router-adapter";

const Home = defineComponent({
  render() {
    return h("div", {}, [h("h1", {}, ["Home"])]);
  },
});

const About = defineComponent({
  render() {
    return h("div", {}, [h("h1", {}, ["About"])]);
  },
});

const User = defineComponent({
  render() {
    return h("div", {}, [h("h1", {}, ["User"])]);
  },
});
const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/users/:id", component: User },
];

const RouterApp = defineComponent({
  onMounted() {
    console.log("im mounted");
  },
  render() {
    return hFragment([
      h("nav", {}, [
        h("ul", {}, [
          h("li", {}, [h(RouterLink, { to: "/" }, ["Home"])]),
          h("li", {}, [h(RouterLink, { to: "/about" }, ["About"])]),
          h("li", {}, [h(RouterLink, { to: "/users/123" }, ["User"])]),
        ]),
      ]),
      h(RouterOutlet),
    ]);
  },
});
const app = createApp(RouterApp, {}, { router: HashRouter(routes) });
app.mount(document.querySelector("#root"));
