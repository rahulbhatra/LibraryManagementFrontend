import {
  generateSchemaTypes,
  generateReactQueryComponents,
} from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";
export default defineConfig({
  librarymanagement: {
    from: {
      relativePath: "./openapi.json",
      source: "file",
    },
    outputDir: "./",
    to: async (context) => {
      const filenamePrefix = "librarymanagement";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
