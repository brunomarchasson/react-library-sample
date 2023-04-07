import React from "react";
// import { ComponentStory, ComponentMeta } from "@storybook/react";
import type { Meta, StoryObj } from '@storybook/react';

import Viewer from "./Viewer";
import imageFile from '../../../__mocks__/imgUri';

const meta = {
  title: 'ReactComponentLibrary/Viewer',
  component: Viewer,
  tags: ['autodocs'],
  render: (args, { loaded }) => <Viewer {...args} {...loaded} />,
} satisfies Meta<typeof Viewer>;;

export default meta;

type Story = StoryObj<typeof Viewer>;

export const Empty: Story = {
};

export const ImageUri: Story = {
  args: {
    file: imageFile
  }
};
export const ImageUrl: Story = {
  args: {
    type:"image/",
    file: "https://picsum.photos/200/300"
  }
};

export const ImageFile: Story = {
  loaders: [
    async () => {
      const file =  await urltoFile(imageFile,'img.png','image/png')
      console.log('file', file)
      return ({
      file,
    })},
  ],
};

function urltoFile(url, filename, mimeType){
  return (fetch(url)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], filename,{type:mimeType});})
  );
}
