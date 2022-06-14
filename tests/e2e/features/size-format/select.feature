Feature: Size Format

  @format
  Scenario Outline: Select format
    Given I select format <format>
    Then I see it's size within the panel <format>
    And it updates on zoom <format>
  Examples:
    | format |
    | Square |
    | Full size |