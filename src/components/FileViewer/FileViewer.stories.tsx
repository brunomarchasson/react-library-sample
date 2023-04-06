import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Viewer from "./Viewer";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "ReactComponentLibrary/Viewer",
  component: Viewer,
} as ComponentMeta<typeof Viewer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Viewer> = (args) => <Viewer {...args} />;

export const Empty = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Empty.args = {
};

// export const ClickMe = Template.bind({});
// ClickMe.args = {
//   label: "Click me!",
// };