import React from "react";
// import { ComponentStory, ComponentMeta } from "@storybook/react";
import type { Meta, StoryObj } from '@storybook/react';
import { ImageViewer } from "@file-viewer/file-viewer-image"

import imageFile from '../../__mocks__/imgUri';

const meta = {
  title: 'Viewers/Image',
  component: ImageViewer,
  tags: ['autodocs'],
  
} satisfies Meta<typeof ImageViewer>;

export default meta;

type Story = StoryObj<typeof ImageViewer>;

export const Empty: Story = {
};

export const ImageUri: Story = {
  args: {
    source: {uri: imageFile, type: 'image/png'}
  }
};