import { h, hSlot, defineComponent } from "@fwork/runtime";

export const RouterLink = defineComponent({
  render() {
    const { to } = this.props;

    return h(
      "a",
      {
        href: to,
        on: {
          click: (e) => {
            e.preventDefault();
            this.appContext.router.navigateTo(to);
          },
        },
      },
      [hSlot()]
    );
  },
});
