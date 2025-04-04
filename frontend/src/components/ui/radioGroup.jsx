import React from 'react';
import { Box, useRadio, useRadioGroup, HStack, Stack } from "@chakra-ui/react";

// This is a custom RadioGroup component since it wasn't imported in your code
const RadioGroup = ({ children, onChange, value, colorScheme = "blue", ...rest }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'radioGroup',
    onChange,
    value,
    ...rest
  });

  const group = getRootProps();

  // Clone children to pass radio props
  const clonedChildren = React.Children.map(children, child => {
    // Check if the child is a valid element
    if (!React.isValidElement(child)) {
      return child;
    }

    // Only pass radio props to Radio components
    if (child.type.name === 'Radio') {
      const radioProps = getRadioProps({ value: child.props.value });
      return React.cloneElement(child, {
        radioProps,
        colorScheme
      });
    }

    return child;
  });

  return (
    <Stack {...group}>
      {clonedChildren}
    </Stack>
  );
};

// Custom Radio component
const Radio = ({ children, value, radioProps, colorScheme = "blue" }) => {
  const { getInputProps, getRadioProps } = useRadio(radioProps);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: `${colorScheme}.600`,
          color: "white",
          borderColor: `${colorScheme}.600`,
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={2}
      >
        {children}
      </Box>
    </Box>
  );
};

export { RadioGroup, Radio };