Feature: Size Format

  @format
  Scenario Outline: Select format
    Given I select format
    Then I see it's size within the panel

  Examples:
    | example   |
    | generator |
