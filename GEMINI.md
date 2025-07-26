## General Code Style & Formatting
- Use English for all code and documentation.
- Always declare the type of each variable and function (parameters and return value).
- Avoid using `any`; create necessary types.
- One export per file.
- Avoid magic numbers; define constants.

## Naming Conventions
- Use PascalCase for classes.
- Use camelCase for variables, functions, and methods.
- Use kebab-case for file and directory names.
- Use UPPERCASE for environment variables.

## Functions & Logic
- Keep functions short and single-purpose (<20 lines).
- Avoid deeply nested blocks by using early returns and extracting logic into utility functions.
- Use higher-order functions (map, filter) to simplify logic.
- Use arrow functions for simple cases (<3 instructions), named functions otherwise.
- Use default parameter values instead of null/undefined checks, if applicable.
- Prefer objects for passing and returning multiple parameters.

## Data Handling
- Avoid excessive use of primitive types; encapsulate data in composite types.
- Avoid placing validation inside functions — prefer classes with internal validation.
- Prefer immutability for data: use `readonly` for immutable properties and `as const` for literals that never change.
