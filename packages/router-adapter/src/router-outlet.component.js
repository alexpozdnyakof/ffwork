import { h, defineComponent } from "@fwork/runtime";

export const RouterOutlet = defineComponent({
  state() {
    return {
      matchedRoute: null,
      subscription: null,
    };
  },
  onMounted() {
    console.log("outlet mounted");
    const subscription = this.appContext.router.subscribe(({ to }) => {
      this.handleRouteChange(to);
    });

    this.updateState({ subscription });
  },

  onUnmounted() {
    const { subscription } = this.state;
    this.appContext.router.unsubscribe(subscription);
  },

  handleRouteChange(matchedRoute) {
    this.updateState({ matchedRoute });
  },

  render() {
    const { matchedRoute } = this.state;

    return h("div", { id: "router-outlet" }, [
      matchedRoute ? h(matchedRoute.component) : null,
    ]);
  },
});
