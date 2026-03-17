import { createComponentFactory, Spectator } from "@ngneat/spectator/vitest";
import { ButtonComponent } from "./button.component";

describe("ButtonComponent", () => {
  let spectator: Spectator<ButtonComponent>;
  const createComponent = createComponentFactory({
    component: ButtonComponent,
    shallow: true, // Prefer shallow rendering for isolated component tests
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        // Use props for signal inputs or standard @Input()
        label: "Submit",
      },
    });
  });

  describe("UI Rendering", () => {
    it("should display the correct label", () => {
      expect(spectator.query(".btn-text")).toHaveText("Submit");
    });
  });

  describe("User Interaction", () => {
    it("should emit clicked event on button click", () => {
      let emitted = false;
      spectator.output("clicked").subscribe(() => (emitted = true));

      spectator.click("button");

      expect(emitted).toBe(true);
    });
  });
});
