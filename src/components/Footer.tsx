// src/components/Footer.tsx

import React from "react";
import { Box, Text, Link } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <Box as="footer" mt={8} textAlign="center">
      <Text fontSize="sm" color="gray.500">
        Made with ❤️ in 🇮🇳 by{" "}
        <Link href="https://example.com" color="teal.500" isExternal>
          Example User
        </Link>
        . Check out the code on{" "}
        <Link
          href="https://github.com/your-github-repo"
          color="teal.500"
          isExternal
        >
          Github
        </Link>
        .
      </Text>
    </Box>
  );
};

export default Footer;
