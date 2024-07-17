# Stylelint Ecosystem Tester

[![Test](https://github.com/ybiquitous/stylelint-ecosystem-tester/actions/workflows/test.yml/badge.svg)](https://github.com/ybiquitous/stylelint-ecosystem-tester/actions/workflows/test.yml)
[![Test Ecosystem](https://github.com/ybiquitous/stylelint-ecosystem-tester/actions/workflows/test-ecosystem.yml/badge.svg)](https://github.com/ybiquitous/stylelint-ecosystem-tester/actions/workflows/test-ecosystem.yml)

A comprehensive test suite for [Stylelint](https://stylelint.io) ecosystem.

To see test results, visit the [Actions page](https://github.com/ybiquitous/stylelint-ecosystem-tester/actions/workflows/test-ecosystem.yml?query=branch%3Amain).

## Criteria

An eligible package should meet the following criteria:

- Its latest version was published within three years
- And, top 20 most popular packages in the following categories:
  - Plugins -- including `stylelint-plugin` keyword
  - Configurations -- including `stylelint-config` keyword
  - Formatters -- including `stylelint-formatter` keyword
- Or, acknowledged as exceptionally important

The `npm view` and `npm search` commands can help us find such a package:

```shell
npm view <your_package>

npm search --searchopts='sortBy=popularity' --searchlimit=20 'keywords:stylelint-plugin' <your_package>
npm search --searchopts='sortBy=popularity' --searchlimit=20 'keywords:stylelint-config' <your_package>
npm search --searchopts='sortBy=popularity' --searchlimit=20 'keywords:stylelint-formatter' <your_package>
```

## Contributing

Read the [contributing guide](CONTRIBUTING.md).
